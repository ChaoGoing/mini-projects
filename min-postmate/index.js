class ChildAPI {
  constructor(info) {
    this.model = info.model;
    this.parent = info.parent;
    this.child = info.child;
    this.parentOrigin = info.parentOrigin;

    this.child.addEventListener("message", (e) => {});
  }
}
