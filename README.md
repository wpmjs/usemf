# usemf

[中文文档](doc/chinese)

1. Modules of module federation can be introduced, and shared can be overwritten

## Usage scenario
1. If you need to use the module Federation library provided by yourself or a third party in a non webpack5 environment, you can use usemf
2. If the project cannot upgrade webpack5 immediately, or there are many UMD libraries, it needs to be upgraded gradually

## Try online
https://stackblitz.com/github/wpmjs/wpmjs/tree/main/examples/umd-and-module-federation?file=app1%2Fsrc%2FApp.js

## Simplest usage:
"Shared" is not required, and the "MF" module will automatically use the standby module
``` js
import "systemjs/dist/s"
import "systemjs/dist/extras/amd"
import "systemjs/dist/extras/global"
import usemf from "usemf"

const app2_version1 = usemf.import({
  url: "http://localhost:3002/remoteEntry.js",
  // name: "app2",  // If modules such as mfplugin library type "amd" | "system" are set, name is not required
})("./App")
```

## Advanced Usage:
``` js
import React from "react";

import "systemjs/dist/s"
import "systemjs/dist/extras/amd"
import "systemjs/dist/extras/global"

const shared = {
  shareScope: "default",    // Default value is not required

  // You can provide shared React to make app2 not use the standby react module to achieve react singleton
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

import usemf from "usemf"
const app2_version1 = usemf.import({
  url: "http://localhost:3002/remoteEntry.js",
  // name: "app2",  // If modules such as mfplugin library type "amd" | "system" are set, name is not required
  shared:  {
    shareScope: "scope2",
    react: shared.react
  }
})("./App")

const app2_version2 = usemf.import({
  url: "http://localhost:3003/remoteEntry.js",
  name: "app2",  // If modules such as mfplugin library type "amd" | "system" are set, name is not required
  shared
})("./App")

const App2 = React.lazy(() => app2_version1)
const App2_2 = React.lazy(() => app2_version2)
```