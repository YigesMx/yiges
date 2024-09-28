---
title: "网站引入 canves-nest.js"
description: "给 Material for MkDocs 构建的网站添加 canves-nest.js 特效"

tags:
  - Site Enhancement
  - Canvas
---

# canves-nest.js

本文主要一步步记录本站，或 `material for mkdocs` 构建的站点，完美嵌入`canves-nest.js` 的方法。

## Step I. 下载并导入 `canves-nest.js`

从官方 [:simple-github: repo](https://github.com/hustcc/canvas-nest.js) 里导入包/自行下载，导入站点（例如这里我选择自行下载并放至`docs/assets/js/`目录下(自定义)），并根据官方文档修改，直接在需要特效的页面末尾引入即可:

```html
<script type="text/javascript" src="assets/js/canvas-nest.js"></script>
```

??? note "模板：在所有页面中使用"
    当然也可以直接创建 `MkDocs` 的模板，拓展 `Material for MkDocs` 主题中的基础页面，从而引入 `canves-nest.js`，方便在所有页面引入。这里一开始因为我只在首页引入，就没有采用这种方式，但 ~~后面有回旋镖~~ :sneezing_face:……（当然不复杂，参考 [:material-web: material for mkdocs官网](https://squidfunk.github.io/mkdocs-material/reference/?h=template#customization) 来 “创建新的” or “修改 base” 模板）

## Step II. 初探

现在刷新后，对应页面中应该以及可以看到效果了。

但是上下滑动页面可以发现，因为默认的定位及背景（作用元素：body）不固定的问题效果并没有被正确应用。

## Step III. 修正问题（一）

解决思路：引入背景块元素，铺满整个屏幕并固定，再将`canves-nest.js`作用元素修改为该元素即可。

### 引入 target

```html
<div id="cnest"></div>
```

### 使其铺满屏幕并固定

```html
<div id="cnest" style="width:100vw;height:100vh;position:fixed;top:0;left:0;"></div>
```

!!! tip "实现样式"
    注意这里使用了`100vw`和`100vh`来获取 100% 的`视图宽度`和`视图高度`，使用`position:fixed;top:0;left:0;`来固定元素并铺满背景。（也可手动调整其z-index）


### 修改`canves-nest.js`以将作用元素修改为该块

找到这里（末尾）并作出修改：
```js hl_lines="1"
(document.getElementById("cnest")/*changed here*/, (f = document.getElementsByTagName("script"), {
    zIndex: (y = f[f.length - 1]).getAttribute("zIndex"),
    opacity: y.getAttribute("opacity"),
    color: y.getAttribute("color"),
    count: Number(y.getAttribute("count")) || 99
}))
```

### 样式美化

参考官方的样式修改，修改引入 js 的 script 标签即可：

```js
<script type="text/javascript" color="180,180,180" opacity="0.9" zIndex="-2" count="99" src="assets/js/canvas-nest.js"></script>
```

## Step IV. 修正问题（二）

此时刷新页面，可以看到效果已经被正确应用。

但是，此时如果你开起了 `Material for MkDocs` 的 `theme.features.instant` 功能，你会发现，当你切换页面时，由于页面是部分刷新的，效果会消失，不能被正确应用。

解决思路：修改 `canves-nest.js` 为一个可以可以指定元素进行渲染的函数，并且可以通过参数输入样式。然后通过 `Material for MkDocs` 提供的部分刷新时的回调函数 Hook，来在每次部分刷新时重新渲染效果。

### 修改 `canves-nest.js`

这里将 `canves-nest.js` 修改为一个可以指定元素进行渲染的函数，并且可以通过参数输入样式。并且为了不污染全局变量，将其封装在一个模块中（使用 `export` 导出）。

```js
"use strict";

export const createCanvasNest = (
    tagID, {
        zIndex=-1, 
        lineColor="127,127,127", 
        lineOpacity=1,
        count=99
    }={}
) => {

    ...

    new (function () {
        ...
    }())(document.getElementById(tagID), (f = document.getElementById(tagID), {
        zIndex: zIndex,
        lineOpacity: lineOpacity,
        lineColor: lineColor,
        count: count
    }))
};
```

### 修改 `canves-nest.js` 的引入方式

在需要插入效果的页面插入以下代码：
```html
<div id="cnest" style="width:100vw;height:100vh;position:fixed;top:0;left:0;z-index: 0;pointer-events: none;"></div>
```

创建一个继承 `base` 模板的模板，将以下脚本引入到 `extrahead` 块中：

```html
{% extends "base.html" %}

{% block extrahead %}
<script type="module">
    import {createCanvasNest} from '/assets/js/canvas-nest.js';
    document.addEventListener('DOMContentLoaded', function () {
        document$.subscribe(({ body }) => { 
            createCanvasNest("cnest", {
                zIndex: 0,
                lineColor: "180,180,180",
                lineOpacity: 0.8,
                count: 75
            });
        })
    });
</script>
{% endblock %}
```

此时在 `yaml` 头中添加使用新增的模板，或选择命名为 `main.html` 覆盖默认模版，刷新页面，可以看到效果在切换页面时也能正确应用。

### 样式美化

此外，我还修改了 `canves-nest.js` 的代码，进一步支持修改点的颜色和透明度，修改后的代码见仓库：[:simple-github: canvas-nest.js](https://github.com/YigesMx/canvas-nest.js.git)


## END

现在在对应页面就能看见效果被正确应用及美化了。