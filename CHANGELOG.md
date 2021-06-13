# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0](https://github.com/opendreamnet/dreamlink.cloud/compare/v1.2.1...v1.3.0) (2021-06-13)


### Features

* added syntax highlight, markdown and text preview support ([5603149](https://github.com/opendreamnet/dreamlink.cloud/commit/5603149bc3639d4b7e1ffaf51b5934d9900a8607))
* pastebin feature added ([c2d4acf](https://github.com/opendreamnet/dreamlink.cloud/commit/c2d4acf19f2804a343c74ec990d5868286bcc2b3))


### Bug Fixes

* best description of total storage space ([18be76d](https://github.com/opendreamnet/dreamlink.cloud/commit/18be76dcbd505aa975b8464f6332e350b189da90))
* improved directory detection to avoid displaying "download" button ([828a467](https://github.com/opendreamnet/dreamlink.cloud/commit/828a4678bddc6d623d6696b7b7645b8f85dca52b))
* pastebin error handler ([7f3065a](https://github.com/opendreamnet/dreamlink.cloud/commit/7f3065a7f6449aa1fc7988bbdcb55973fbd726a1))

### [1.2.1](https://github.com/opendreamnet/dreamlink.cloud/compare/v1.2.0...v1.2.1) (2021-06-11)


### Bug Fixes

* increased event listeners to 30 ([c3d1aef](https://github.com/opendreamnet/dreamlink.cloud/commit/c3d1aefd3a0ea5cabac8ed490d3a7ee8da456710))
* more gateways without CORS added to the blacklist ([4162670](https://github.com/opendreamnet/dreamlink.cloud/commit/4162670d8661a764a58878ebacc6bfc95f06b331))
* the preview is now displayed regardless of whether the node has been able to get the content ([22b7252](https://github.com/opendreamnet/dreamlink.cloud/commit/22b7252ca174dd0d5efef00afd03ced719284081))

## 1.2.0 (2021-06-11)


### Features

* @opendreamnet/ipfs upgrade ([2e3abab](https://github.com/opendreamnet/dreamlink.cloud/commit/2e3abab0788dff01ea139c6d3d89ca4b24357f90))
* @opendreamnet/ipfs upgrade ([4c57d14](https://github.com/opendreamnet/dreamlink.cloud/commit/4c57d14aba27d55b6a1600a1107f36bd3194942a))
* directory upload support ([b28c691](https://github.com/opendreamnet/dreamlink.cloud/commit/b28c69180892ca46494a8507453e0125294cbdff))
* download and open buttons are now displayed even if the local node does not find the content ([743bed2](https://github.com/opendreamnet/dreamlink.cloud/commit/743bed2769bc20bb8ba11ca73a108acc6695d197))


### Bug Fixes

* added [@opendreamnet](https://github.com/opendreamnet) dependencies to transpile ([bcfed4f](https://github.com/opendreamnet/dreamlink.cloud/commit/bcfed4f5096e586210a032466c1ba0612720ebd7))
* added the GNU AGPLv3 license ([e17efe7](https://github.com/opendreamnet/dreamlink.cloud/commit/e17efe7f00820de3993eacc52b9310f88e10cbd2)), closes [#13](https://github.com/opendreamnet/dreamlink.cloud/issues/13)
* audio player does not render font correctly ([62c91cb](https://github.com/opendreamnet/dreamlink.cloud/commit/62c91cbcadadc2cb53e79b5a9947695e71718dbf))
* ci ([4467e53](https://github.com/opendreamnet/dreamlink.cloud/commit/4467e534e1eace88e78f423fbc1d0a9e81696ac6))
* local node now retries to obtain an object instead of just displaying an infinite loading ([ae5c888](https://github.com/opendreamnet/dreamlink.cloud/commit/ae5c888f67fb9df3b31a2c44d534a06df00c7050))
* long titles in `explorer` did not display correctly on mobile devices ([dd75ea1](https://github.com/opendreamnet/dreamlink.cloud/commit/dd75ea1c48f79197fd2c4ac4228d76ec1bcc3ccc))
* reduced loading time between urls ([1f76034](https://github.com/opendreamnet/dreamlink.cloud/commit/1f7603440727995f7fd001c7d4d1cfadbd0f6507))
* removed mixin `NetworkObject` from `Url` to avoid event spam ([91bd465](https://github.com/opendreamnet/dreamlink.cloud/commit/91bd46505618e290aea9aba03270ba6699f575ee))
* **ci:** added ci git account ([fea00b1](https://github.com/opendreamnet/dreamlink.cloud/commit/fea00b1a548f78178b94e987fa560e532c4cd938))

### 1.1.2 (2021-06-10)


### Bug Fixes

* added the GNU AGPLv3 license ([e17efe7](https://github.com/opendreamnet/dreamlink.cloud/commit/e17efe7f00820de3993eacc52b9310f88e10cbd2)), closes [#13](https://github.com/opendreamnet/dreamlink.cloud/issues/13)

### 1.1.1 (2021-06-09)


### Bug Fixes

* audio player does not render font correctly ([62c91cb](https://github.com/opendreamnet/dreamlink.cloud/commit/62c91cbcadadc2cb53e79b5a9947695e71718dbf))
* video player does not resize correctly ([62c91cb](https://github.com/opendreamnet/dreamlink.cloud/commit/62c91cbcadadc2cb53e79b5a9947695e71718dbf))

## 1.1.0 (2021-06-09)


### Features

* directory upload support ([b28c691](https://github.com/opendreamnet/dreamlink.cloud/commit/b28c69180892ca46494a8507453e0125294cbdff))
* added preview for images, audio, video and pdf ([b28c691](https://github.com/opendreamnet/dreamlink.cloud/commit/b28c69180892ca46494a8507453e0125294cbdff))
* now we check the status of public gateways gradually ([b28c691](https://github.com/opendreamnet/dreamlink.cloud/commit/b28c69180892ca46494a8507453e0125294cbdff))
 
### 1.0.1 (2021-06-09)


### Bug Fixes

* **ci:** added ci git account ([fea00b1](https://github.com/opendreamnet/dreamlink.cloud/commit/fea00b1a548f78178b94e987fa560e532c4cd938))

## 1.0.0 (2021-06-09)


### Bug Fixes

* added [@opendreamnet](https://github.com/opendreamnet) dependencies to transpile ([bcfed4f](https://github.com/opendreamnet/dreamlink.cloud/commit/bcfed4f5096e586210a032466c1ba0612720ebd7))
