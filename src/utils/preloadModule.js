const {shareScopes, registerRemotes, findRemote, registerShared} = require("module-federation-runtime")
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

  registerShared(pkgs)

  /**
   * 加载模块
   */
  async function loadModule(module) {
    const factory = await container.get(module);
    const Module = factory();
    return Module;
  }
  return loadModule
}