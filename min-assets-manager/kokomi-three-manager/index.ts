import { Component } from "./component";

class AssetManager extends Component {
  config: AssetManagerConfig;
  resourceList: ResoureList;
  items: any;
  toLoad: number;
  loaded: number = 0;
  loaders: Partial<Loaders> = [];

  constructor({ base, list }) {
    super(base);

    this.resourceList = list;

    this.items = {};
    this.toLoad = list.length;

    this.setLoaders();
    this.startLoading();
  }

  // 设置加载器
  setLoaders() {
    this.loaders.svgLoader = new SVGLoader();
  }

  startLoading() {
    for (const resource of this.resourceList) {
      if (resource.type === "gltfModel") {
        this.loaders.svgLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      }
    }
  }

  // 加载完单个素材
  resourceLoaded(resource: ResourceItem, file: any) {
    this.items[resource.name] = file;
    this.loaded += 1;
    if (this.isLoaded) {
      this.emit("ready");
    }
  }
  // 加载进度
  get loadProgress() {
    return this.loaded / this.toLoad;
  }
  // 是否加载完毕
  get isLoaded() {
    return this.loaded === this.toLoad;
  }
}
