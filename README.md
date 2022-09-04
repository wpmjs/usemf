# usemf

1. 可以引入module federation的模块, 并且可以覆盖shared

## 使用场景
1. 如果需要在非webpack5环境使用自己或第三方提供的module federation库, 则可以使用usemf
2. 如果项目还无法立刻升webpack5, 或者有比较多的umd库无法立刻升级module federation

## 在线尝试
https://stackblitz.com/github/wpmjs/wpmjs/tree/main/examples/hot-refresh?file=app2%2Fsrc%2FApp2.jsx

## 使用示例
示例的app2对应https://github.com/webpack/webpack.js.org/tree/master/examples/module-federation
``` js
import mfalize from "usemf"
import * as ReactDOM from "react-dom"
import "systemjs/dist/s"
import "systemjs/dist/extras/amd"
import "systemjs/dist/extras/global"
    
usemf.import({
  url: "http://localhost:3002/remoteEntry.js",
  name: "app2", // 如果mfplugin设置({ library: {type: "amd" || "system"} })则可以不指定name
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
          return ReactDOM || {
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