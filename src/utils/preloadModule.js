import { scriptCache } from "./cache";

/**
 * 第一次准载模块, 初始化依赖
 * @param {*} name 
 * @param {*} module 
 * @param {*} shared 
 * @returns 
 */
export default function preloadModule(name, shared = {}) {
  const {
    shareScope = "default",
    ...pkgs
  } = shared
  async function initShare() {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__(shareScope);
    const container = window[name]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    Object.keys(pkgs).forEach(name => {
      const {
        version,
        get
      } = pkgs[name]
      __webpack_share_scopes__.default[name] = __webpack_share_scopes__.default[name] || {}
      const pkgInfo = __webpack_share_scopes__.default[name]
      pkgInfo[version] = {
        eager: false,
        from: "",
        __fromMFJS: true,
        get,
        loaded: 1,
      }
    })
    await container.init(__webpack_share_scopes__.default);
  }
  const waitInitShare = initShare()
  /**
   * 加载模块
   */
  return async function loadModule(module) {
    await waitInitShare
    const factory = await window[name].get(module);
    const Module = factory();
    return Module;
  }
}