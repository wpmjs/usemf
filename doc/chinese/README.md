# usemf

1. 可以引入module federation的模块, 并且可以覆盖shared

## 使用场景
1. 如果需要在非webpack5环境使用自己或第三方提供的module federation库, 则可以使用usemf
2. 如果项目还无法立刻升webpack5, 或者有比较多的umd库, 需要逐渐升级

## 在线尝试
https://stackblitz.com/github/wpmjs/wpmjs/tree/main/examples/umd-and-module-federation?file=app1%2Fsrc%2FApp.js

## 使用示例
``` js
import React from "react";

import "systemjs/dist/s"
import "systemjs/dist/extras/amd"
import "systemjs/dist/extras/global"

const shared = {
  shareScope: "default",    // 默认值 非必填
  react: {
    version: "17.0.2",
    async get () {
      // const res = await window.System.import("https://unpkg.com/react@17.0.2/umd/react.development.js")
      return function () {
        return React
      }
    }
  },
  "react-dom": {
    version: "17.0.2",
    async get () {
      return function () {
        return {
          test: "react-dom"
        }
      }
    }
  }
}

import mfjs from "mfalize"
const app2_version1 = mfjs.import({
  url: "http://localhost:3002/remoteEntry.js",
  // name: "app2",  // 如果设置了mfplugin library type为 "amd" | "system" 等模块, 则name非必填
  shared:  {
    shareScope: "scope2",
    react: shared.react
  }
})("./App")

const app2_version2 = mfjs.import({
  url: "http://localhost:3003/remoteEntry.js",
  name: "app2",  // 如果设置了mfplugin library type为 "amd" | "system" 等模块, 则name非必填
  shared
})("./App")

const App2 = React.lazy(() => app2_version1)
const App2_2 = React.lazy(() => app2_version2)
```