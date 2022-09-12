const getPromise = require('./utils/getPromise');
const { default: loadScript } = require('./utils/loadScript');
const preloadModule = require('./utils/preloadModule');
// mfjs.import(url, name, shared , customLoadScript)[module]
// shared: {
//   shareScope,
//   wpmjs: {
//     version,
//     url,
//   }
// }
module.exports = window.usemf = window.usemf ||  {
  getShareScopes() {
    return __webpack_share_scopes__
  },
  import({url, name, shared} = {}) {
    const getLoadModule = async function () {
      const {
        promise,
        resolve,
        reject
      } = getPromise()
      try {
        const res = await loadScript(url)
        const container = [res, window[name]].filter(container => {
          return typeof container?.init === "function" && typeof container?.get === "function"
        })[0]
        if (!container) {
          throw new Error("not container", name, url)
        }
        resolve(preloadModule(container, shared))
      } catch (e) {
        reject(e)
      }
      return promise
    }
    const continerInitPromise = getLoadModule()
    async function loadModule (...params) {
      return (await continerInitPromise)(...params)
    }
    loadModule.continerInitPromise = continerInitPromise
    return loadModule
  }
}