let container = null;
let g_initialAnchorsInDom = false;
var g_options = null;

export const defaultOptions = {};

let originals = utils.deepExtend({}, defaultOptions); //deep copy

export function getOptions() {
  return g_options || defaultOptions;
}

export function setOptions(options) {
  g_options = utils.deepExtend({}, defaultOptions, options);
  originals = Object.assign({}, g_options);
}
