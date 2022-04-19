const path = require("path");
const EventEmitter = require("events").EventEmitter;
const resolve = require("resolve");

class Config {
  constructor() {}

  getUserConfig() {}
}

function pathToObj() {

}

function resolvePresets(opts) {
  const presets = [
    ...(opts["presets"] || []),
    ...(opts.userConfigPresets || []),
  ];
  return presets.map((path) =>
    resolve.sync(path, {
      basedir: opts.cwd,
      extensions: [".js", ".ts"],
    })
  ).map(path => ({
    id: path,
    type: 'presets',
    path,
    cwd: opts.cwd,
    apply() {
        // 待补充
    }
  }));
}

function resolvePlugins(opts) {
  const plugins = [
    ...(opts["plugins"] || []),
    ...(opts.userConfigPlugins || []),
  ];
  return plugins.map((path) =>
    resolve.sync(path, {
      basedir: opts.cwd,
      extensions: [".js", ".ts"],
    })
  );
}

class Service extends EventEmitter {
  constructor(opts) {
    super();
    this.cwd = opts.cwd || process.cwd();
    this.pkg = opts.pkg || require(path.join(this.cwd, "package.json"));
    this.env = opts.env || process.env.NODE_ENV;

    // this.babelRegister = new BabelRegister();
    this.loadEnv();

    // 解析.umirc
    this.configInstance = new Config({
      cwd: this.cwd,
      service: this,
      localConfig: this.env === "development",
    });

    this.userConfig = this.configInstance.getUserConfig();

    const baseOpts = (this.baseOpts = {
      pkg: this.pkg,
      env: this.env,
      cwd: this.cwd,
    });

    this.initialPresets = resolvePresets({
      ...baseOpts,
      // presets: opts.presets || [require.resolve("../preset-build-in")],
      presets: opts.presets || [],
      userConfigPresets: this.userConfig.presets || [],
    });

    // 初始化 Plugins 和 Presets 一样
    this.initialPlugins = resolvePlugins({
      ...baseOpts,
      plugins: opts.plugins || [],
      userConfigPlugins: this.userConfig.plugins || [],
    });
  }

  loadEnv(envPath = join(this.cwd, ".env")) {
    if (existsSync(envPath)) {
      const parsed = JSON.parse(readFileSync(envPath, "utf-8")) || {};

      // 遍历这个文件中的每行，放在 process.env 中。
      Object.keys(parsed).forEach((key) => {
        // eslint-disable-next-line no-prototype-builtins
        if (!process.env.hasOwnProperty(key)) {
          process.env[key] = parsed[key];
        }
      });
    }
  }
}

exports.default = Service;
