import { scriptCache } from './utils/cache';
import getPromise from './utils/getPromise';
import preloadModule from './utils/preloadModule';
// mfjs.import(url, name, shared , customLoadScript)[module]
// shared: {
//   shareScope,
//   wpmjs: {
//     version,
//     url,
//   }
// }

export default {
  import({url, name, shared} = {}) {
    const getLoadModule = async function () {
      const {
        promise,
        resolve,
        reject
      } = getPromise()
      scriptCache[name] = {
        promise,
        value: null,
        exposes: {}
      }
      try {
        const res = await window.System.import(url)
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
    const loadModule = getLoadModule()
    return async (...params) => (await loadModule)(...params)
  }
}