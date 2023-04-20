const getPromise = require('./utils/getPromise');
const { getShare } = require('./utils/getShare');
const { default: loadScript } = require('./utils/loadScript');
const preloadModule = require('./utils/preloadModule');
const {shareScopes, registerRemotes, findRemote} = require("module-federation-runtime")
// mfjs.import(url, name, shared , customLoadScript)[module]
// shared: {
//   shareScope,
//   wpmjs: {
//     version,
//     url,
//   }
// }
module.exports = window.usemf = window.usemf ||  {
  containerCached: {
    // url: promise<container>
  },
  getShareScopes() {
    return shareScopes
  },
  getShare,
  async getContainer({url, name, customGetContainer} = {}) {
    const {containerCached} = this
    if (containerCached[url]) return containerCached[url]
    if (!customGetContainer) {
      customGetContainer = ({url}) => loadScript(url)
    }
    await registerRemotes({
      [name]: {
        url
      }
    }, () => customGetContainer({url, name, customGetContainer}))
    const container = findRemote(name)
    containerCached[url] = container
    return container
  },
  import({url, name, shared, customGetContainer} = {}) {
    const getLoadModule = async () => {
      const {
        promise,
        resolve,
        reject
      } = getPromise()
      try {
        const container = await this.getContainer({url, name, shared, customGetContainer})
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