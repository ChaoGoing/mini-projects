const path = require("path");
const { copyFile, mkdirSyncGuard } = require("./file");
const fs = require("fs");

function copyTmpl(from, to, data = {}) {
  if (path.extname(from) !== ".tmpl") {
    return copyFile(from, to);
  }
  const parentPath = path.dirname(to);
  mkdirSyncGuard(parentPath);
  fs.writeFileSync(to, readTmpl(parentPath, data), { encoding: "utf-8" });
}

function readTmpl(from, data = {}) {
  const text = fs.readFileSync(from, { encoding: "utf-8" });
  return template(text, data);
}

function mergeObj2JSON(object, to) {
  const json = JSON.parse(fs.readFileSync(to, { encoding: "utf-8" }));
  Object.assign(json, obj);
  fs.writeFileSync(to, JSON.stringify(json, null, "   "), {
    encoding: "utf-8",
  });
}

function mergeJSON2JSON(from, to) {
  const json = JSON.parse(fs.readFileSync(from, { encoding: "utf-8" }));
  mergeObj2JSON(json, to);
}

function mergeTmpl2JSON(from, to, data) {
  const json = JSON.parse(readTmpl(from, data));
  mergeObj2JSON(json, to);
}

module.exports = {
  mergeTmpl2JSON,
};
