import preget from "pre-get"
import { scriptCache } from './utils/cache';
import getPromise from './utils/getPromise';
import preloadModule from './utils/preloadModule';
import loadScript from './utils/loadScript';

// mfjs.import(url, name, shared , customLoadScript)[module]
// shared: {
//   shareScope,
//   wpmjs: {
//     version,
//     url,
//   }
// }

export default {
  loadScript,
  import({url, name, shared, customLoadScript} = {}) {
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
        await loadScript(url, customLoadScript)
        resolve(preloadModule(name, shared))
      } catch (e) {
        reject(e)
      }
      return promise
    }
    return preget(getLoadModule())
  }
}