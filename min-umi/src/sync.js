var resolve = require('resolve'); // or, require('resolve')
resolve('./main', { basedir: __dirname, extensions: ['.js'] }, function (err, res) {
    if (err) console.log("err", err);
    else console.log(res);
});