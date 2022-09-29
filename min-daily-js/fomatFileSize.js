function formatBytes(a, b) {
  if (0 == a) return "0 B";
  var c = 1024,
    d = b || 2,
    e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    f = Math.floor(Math.log(a) / Math.log(c)); // =>  log(c) a
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}

console.log(formatBytes(1234000000000000, 3));
