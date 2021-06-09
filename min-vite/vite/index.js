const fs = require('fs')
const Koa = require('koa')
const path = require('path')
const chalk = require('chalk')
const static = require('koa-static')
const { parse } = require('es-module-lexer')
const MagicString = require('magic-string')
const { Readable } = require('stream')

/**
 * koa洋葱模型
 * 流程_+
 * 1.第一次执行时，
 * 
 * 
 */

const resolvePlugin = [

	({ app, root }) => {
		app.use(async (ctx, next) => {
			console.log('nothing load1')
			await next()
		})
	},

	
	// 重写js中的全局模块路径，
	// 全局模块中的js也会被再处理一次，可以优化
  ({ app, root }) => {
    function rewriteImports(source) {
			let imports = parse(source)[0];
      // console.log('parse', parse(source))
			let ms = new MagicString(source);
			if (imports.length > 0) {
				for (let i = 0; i < imports.length; i++) {
					let { s, e } = imports[i];
					let id = source.slice(s, e); // 应用的标识 vue  ./App.vue
					// 不是./ 或者 /
					if (/^[^\/\.]/.test(id)) {
						id = `/@modules/${id}`;
						ms.overwrite(s, e, id)
					}
				}
			}
			return ms.toString();
		}
		//读取body方法
    async function readBody(stream) {
			if (stream instanceof Readable) {
				return new Promise((resolve) => {
					let res = ''
					stream.on('data', function (chunk) {
						res += chunk
					});
					stream.on('end', function () {
						resolve(res)
					})
				})
			} else {
				return stream;
			}
		}
    app.use(async (ctx, next) => {
			await next()
			console.log('seconde step')
      if(ctx.body && ctx.response.is('js')) {
        let r = await readBody(ctx.body) // ctx.body 是 ReadStream对象， readBody将ctx.body转为string
        const result = rewriteImports(r)
        ctx.body = result
      }
    })
  },


	// 处理带有@modules的请求路径为 模块的真正路径
	({app, root}) => {
		const reg = /^\/@modules\//
		app.use(async (ctx, next) => {
			const _path = ctx.path
			if (!reg.test(_path)) {
				return next();
			}
			// 裸模块名称
			const moduleName = _path.replace("/@modules/", "");
			// 去node_modules目录中找
			const prefix = path.join(__dirname, "../node_modules", moduleName);
			console.log(prefix)
			const module = require(prefix + "/package.json").module;
			const filePath = path.join(prefix, module);
			const ret = await fs.readFileSync(filePath, "utf8");
			ctx.type = "application/javascript";
			ctx.body = ret;
		})
	},

  // 3. 解析.vue文件
	({ app, root }) => {
		app.use(async (ctx, next) => {
			if (!ctx.path.endsWith('.vue')) {
				return next();
			}
			const filePath = path.join(root, ctx.path);
			console.log("path", __dirname, ctx.path, process.cwd())
			const content = await fs.readFileSync(filePath, 'utf8');
			// 引入.vue文件解析模板
			const { compileTemplate, parse } = require(path.resolve(root, 'node_modules', '@vue/compiler-sfc/dist/compiler-sfc.cjs'))
			let { descriptor } = parse(content)
			if(!ctx.query.type) {
				let code = ''
				if (descriptor.script) {
					let content = descriptor.script.content;
					code += content.replace(/((?:^|\n|;)\s*)export default/, '$1const __script=');
				}
				if (descriptor.template) {
					const requestPath = ctx.path + `?type=template`;
					code += `\nimport { render as __render } from "${requestPath}"`;
					code += `\n__script.render = __render`
				}
				code += `\nexport default __script`
				ctx.type = 'js';
				ctx.body = code
			}
			if(ctx.query.type === 'template') {
				ctx.type = 'js';
				let content = descriptor.template.content
				console.log(content)
				const { code } = compileTemplate({ source: content }); // 将app.vue中的模板 转换成render函数
				ctx.body = code;
			}
		})
	},

	// 为什么必须放到最后？
	// 因为读取文件是流数据，不是立刻执行完成的，需要通过await 捕获完成状态
  ({ app, root }) => {
		app.use(static(root))
		.use(static(path.resolve(root, 'public')))
	},

]
function createServer() {
  let app = new Koa()
  const context = {
    app, 
    root: process.cwd() // 返回当前的目录
  }
  resolvePlugin.forEach(plugin => {
    plugin(context)
  });
  return app
}

createServer().listen(4005, () => {
  console.log(`
    App running at:
    - Local:   ${chalk.cyan('http://localhost:4005')} (copied to clipboard)
  `)
})