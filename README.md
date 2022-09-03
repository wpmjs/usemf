# mfalize

1. 可以引入module federation的模块, 并且可以覆盖shared

## 使用场景
1. 如果需要在非webpack5环境使用自己或第三方提供的module federation库, 则可以使用mfalize
2. 如果项目还无法立刻升webpack5, 或者有比较多的umd库无法立刻升级module federation

## 使用示例
示例的app2对应https://github.com/webpack/webpack.js.org/tree/master/examples/module-federation
``` js
import mfalize from "mfalize"
    
mfalize.import({
  url: "http://localhost:3002/remoteEntry.js",
  name: "app2",
  shared: {
    shareScope: "default", // 默认值, 可不传
    // 比如你的非webpack5项目要使用自己或第三方提供的module federation组件, 
    // 可以通过提供shared.react来让app2不使用备用react模块, 以达到react单例
    react: {
      version: "17.0.2",
      async get () {
        // !!! 重要 不要将assets.weimob.com 这个域名用于生产环境, 此域名随时会限制可用域名
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