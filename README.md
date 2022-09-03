# mfjs

1. 可以引入module federation的模块, 并且可以覆盖shared
2. 如果你需要在非webpack5环境使用自己或第三方提供的module federation库, 则可以使用mfjs

## 使用示例
示例的app2对应https://github.com/webpack/webpack.js.org/tree/master/examples/module-federation
``` js
import mfjs from "mfjs"
    
mfjs.import({
  url: "http://localhost:3002/remoteEntry.js",
  name: "app2",
  shared: {
    shareScope: "default", // 默认值, 可不传
    // 比如你的非webpack5项目要使用自己或第三方提供的module federation组件, 
    // 可以通过提供shared.react来让app2不使用备用react模块, 以达到react单例
    react: {
      version: "17.0.2",
      async get () {
        const res = await window.System.import("https://assets.weimob.com/react@17/umd/react.development.js")
        return function () {
          return res
        }
      }
    },
    "react-dom": {
      version: "17.0.2",
      async get () {
        return function () {
          return window.ReactDOM || {
            default: {
              test: 333,
            },
            __esModule: true
          }
        }
      }
    }
  }
})("./App")
```