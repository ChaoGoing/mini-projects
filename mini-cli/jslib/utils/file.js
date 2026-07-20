const copydir = require("copy-dir");
const fs = require("fs");
const path = require("path");

function copyDir(options) {
  copydir.sync(from, to, options);
}

function copyFile(from, to) {
  const buffer = fs.readFileSync(from);
  const parentPath = path.dirname(to);
  mkdirSyncGuard(parentPath);
  fs.writeFileSync(to, buffer);
}

// 创建多级目录
function mkdirSyncGuard(target) {
  try {
    fs.mkdirSync(target, { recursive: true });
  } catch (e) {
    mkdirp(target);
    function mkdirp(dir) {
      if (fs.existsSync(dir)) {
        return true;
      }
      const dirname = path.dirname(dir);
      mkdirp(dirname);
      fs.mkdirSync(dir);
    }
  }
}

module.exports = {
  copyDir,
  copyFile,
  mkdirSyncGuard,
};
