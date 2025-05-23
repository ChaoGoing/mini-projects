/**
 * 爬取文档
 */

import path from "path";
import url from "url";
import superagent from "superagent";
import iconv from "iconv-lite";
import cheerio from "cheerio";
import logger from "electron-log";

type ScrapePageResp = Pick<IMessage.MessageMeta, "title" | "desc" | "link">;

/**
 * 爬取html的信息
 *
 * @export
 * @param {string} url
 * @returns
 */
export default async function scrapePage(url: string) {
  if (!url || typeof url !== "string") {
    return null;
  }
  try {
    const res = await getPageInfo(url);
    return res;
  } catch (err) {
    return null;
  }
}

const PC_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36";

async function superagentInstance(url: string) {
  const timeoutOptions = {
    // 设置等待来自服务器的第一个字节的最大时间, 但并不限制整个下载可以花费多长时间。响应超时应比服务器响应所需的时间要长数秒，因为它还包括进行DNS查找，TCP / IP和TLS连接的时间。
    response: 8000,
    // 整个请求（包括所有重定向）设置完成的最后期限.。如果在这段时间内没有完全下载响应，请求将被中止。
    deadline: 30000,
  };

  const parser = (
    resp: superagent.Response,
    callback: (err: Error | null, body: any) => void
  ) => {
    const contentType: string = resp["headers"]["content-type"];
    if (!contentType.startsWith("text/html")) {
      return callback(null, null);
    }
    const buffer = [];
    resp.on("data", (chunk) => {
      buffer.push(chunk);
    });
    resp.on("end", () => {
      try {
        const bodyBuffer = Buffer.concat(buffer);
        let charset = getCharsetFromContentType(contentType);
        let body = iconv.decode(bodyBuffer, charset);
        // 再次检查编码是否正确
        // 如http://www.chinanews.com/sh/2019/04-08/8802605.shtml
        // https://www.dygod.net/
        if (charset === "utf8") {
          charset = getCharsetFromBody(body);
          if (charset !== "utf8") {
            body = iconv.decode(bodyBuffer, charset);
          }
        }
        callback(null, body);
      } catch (err) {
        callback(err, null);
      }
    });
    resp.on("error", (err) => {
      callback(err, null);
    });
  };

  const res = await superagent
    .get(url)
    .set(
      "Accept-Language",
      "zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7,zh-TW;q=0.6,fr;q=0.5"
    )
    .set("User-Agent", PC_UA)
    .buffer(true)
    .parse(parser)
    .timeout(timeoutOptions);
  return res;
}

async function getPageInfo(url: string): Promise<ScrapePageResp> {
  const res = await superagentInstance(url);
  const $ = cheerio.load(res.body);
  const refreshValue = "Refresh";
  const refreshTags = [
    $(`meta[http-equiv=${refreshValue.toLowerCase()}]`),
    $(`meta[http-equiv=${refreshValue}]`),
    $(`meta[http-equiv=${refreshValue.toUpperCase()}]`),
  ];
  for (const refreshTag of refreshTags) {
    if (!!refreshTag.length) {
      const refreshAddr = getRefreshAddr(refreshTag);
      if (refreshAddr) {
        return await getPageInfo(refreshAddr);
      }
    }
  }
  const title = getTitle($);
  const desc = getDescription($);
  const img = getImage($, res);
  const returnVal: ScrapePageResp = { title, desc, link: img };
  logger.log("getPageInfo", returnVal);
  return returnVal;
}

function getTitle($: cheerio.Root) {
  let title =
    $('meta[property="og:title"]').attr("content") || $("title").first().text();
  if (title) {
    title = title.trim();
  }
  return title;
}

function getDescription($: cheerio.Root) {
  const descName = "Description";
  let desc =
    $('meta[property="og:description"]').attr("content") ||
    $(`meta[name=${descName.toLowerCase()}]`).first().attr("content") ||
    $(`meta[name=${descName}]`).first().attr("content") ||
    $(`meta[name=${descName.toUpperCase()}]`).first().attr("content");
  if (desc) {
    desc = desc.trim();
  }
  return desc;
}

function getImage($: cheerio.Root, res: superagent.Response) {
  let img = $('meta[property="og:image"]').attr("content");
  if (!img) {
    function getValidImg() {
      $("img").each(function () {
        const src = $(this).attr("src");
        if (!!src && !src.toLowerCase().endsWith(".svg")) {
          img = src;
          return false;
        }
      });
    }
    getValidImg();
  }
  if (img && typeof img === "string") {
    img = img.trimLeft();
    if (img.startsWith("http")) {
      return img;
    }

    // 如果链接消息中存在base64格式的logo时，不将其添加到消息的meta字段中，因为base64
    // 格式的内容太大了，会导致后端无法解析收到的消息
    if (img.startsWith("data:image")) {
      return "";
    }
    // 添加协议
    const { protocol, host, url: reqUrl } = (res as any).request;
    if (img.startsWith("//")) {
      // 同协议
      return protocol + img;
    }
    if (img.startsWith("/")) {
      // 同域名
      return `${protocol}//${host + img}`;
    }
    // 同目录
    const { pathname } = url.parse(reqUrl);
    const imgPathname = path.join(pathname, "..", img);
    return `${protocol}//${host + imgPathname}`;
  }
}

function getRefreshAddr(ele: cheerio.Cheerio) {
  const refreshVal = ele.attr("content");
  if (!refreshVal) {
    return null;
  }
  const arr = refreshVal.split(";");
  let returnVal = arr[arr.length - 1];
  if (!returnVal) {
    return null;
  }
  returnVal = returnVal.slice(4, returnVal.length);
  return returnVal;
}

/**
 * 获取req.headers中的charset, 默认utf8
 *
 * @param {string} contentType
 * @returns
 */
function getCharsetFromContentType(contentType: string) {
  const CHARTSET_RE =
    /(?:charset|encoding)\s{0,10}=\s{0,10}['"]? {0,10}([\w\-]{1,100})/i;
  const matchs = CHARTSET_RE.exec(contentType);
  let cs = null;
  if (matchs) {
    cs = matchs[1].toLowerCase();
    if (cs === "utf-8") {
      cs = "utf8";
    }
  }
  return cs || "utf8";
}

/**
 * 获取body中的charset, 默认utf8
 *
 * @param {string} contentType
 * @returns
 */
function getCharsetFromBody(body: string) {
  let cs = null;
  const arr = body.toLowerCase().match(/<meta([^>]*?)>/g);
  if (arr) {
    arr.forEach(function (val) {
      const match = val.match(/charset\s*=\s*(.+)\"/);
      if (match && match[1]) {
        if (match[1].substr(0, 1) == '"') match[1] = match[1].substr(1);
        cs = match[1].trim();
        if (cs === "utf-8") {
          cs = "utf8";
        }
      }
    });
  }
  return cs || "utf8";
}
