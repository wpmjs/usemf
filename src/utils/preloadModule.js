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
    Object.keys(pkgs).forEach(name => {
      const pkg = pkgs[name]
      __webpack_share_scopes__[shareScope][name] = __webpack_share_scopes__[shareScope][name] || {}
      const pkgInfo = __webpack_share_scopes__[shareScope][name]
      pkgInfo[pkg.version] = pkgInfo[pkg.version] || {
        eager: pkg.eager || false,
        from: pkg.from || "",
        get() {
          pkgInfo[pkg.version].loaded = 1
          return pkg.get()
        },
        loaded: false,
      }
    })
    console.log('init', container, shareScope)
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__(shareScope);
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__[shareScope]);
  }
  const waitInitShare = initShare()
  /**
   * 加载模块
   */
  async function loadModule(module) {
    await waitInitShare
    const factory = await container.get(module);
    const Module = factory();
    return Module;
  }
  loadModule.containerInitPromise = waitInitShare
  return loadModule
}