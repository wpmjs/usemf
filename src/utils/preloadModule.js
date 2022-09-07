/**
 * 第一次准载模块, 初始化依赖
 * @param {*} name 
 * @param {*} module 
 * @param {*} shared 
 * @returns 
 */
module.exports = function preloadModule(container, shared = {}) {
  const {
    shareScope = "default",
    ...pkgs
  } = shared
  async function initShare() {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__(shareScope);
    // Initialize the container, it may provide shared modules
    Object.keys(pkgs).forEach(name => {
      const {
        version,
        get
      } = pkgs[name]
      __webpack_share_scopes__[shareScope][name] = __webpack_share_scopes__[shareScope][name] || {}
      const pkgInfo = __webpack_share_scopes__[shareScope][name]
      pkgInfo[version] = pkgInfo[version] || {
        eager: false,
        from: "",
        __fromMFJS: true,
        get,
        loaded: 1,
      }
    })
    await container.init(__webpack_share_scopes__[shareScope]);
  }
  const waitInitShare = initShare()
  /**
   * 加载模块
   */
  return async function loadModule(module) {
    await waitInitShare
    const factory = await container.get(module);
    const Module = factory();
    return Module;
  }
}