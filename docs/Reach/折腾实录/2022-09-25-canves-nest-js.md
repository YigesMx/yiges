# canves-nest.js

本文主要记录本站点，即`material for mkdocs`嵌入`canves-nest.js`的方法。

## Step I. 下载并导入`canves-nest.js`

从官方 [:simple-github: repo](https://github.com/hustcc/canvas-nest.js) 里导入包/自行下载，导入站点（例如这里我选择自行下载并放至`docs/assets/js/`目录下(自定义)），并根据官方文档修改，直接在需要特效的页面末尾引入即可:

```html
<script type="text/javascript" src="assets/js/canvas-nest.js"></script>
```

??? note "模板：在所有页面中使用"
    当然也可以直接在`mkdocs`模板中引入`canves-nest.js`，方便在所有页面引入，这里因为我只在首页引入，没有采用这种方式，就不列出详细过程。（当然不复杂，参考 [:material-web: material for mkdocs官网](https://squidfunk.github.io/mkdocs-material/reference/?h=template#customization) 来 “创建新的” or “修改base” 模板，并将经过下方 [修正问题](#step-iii) 步骤、修改样式后最终得到的元素写进模板即可）

## Step II. 初探

现在刷新后，对应页面中应该以及可以看到效果了。

但是上下滑动页面可以发现，因为默认的定位及背景（作用元素：body）不固定的问题效果并没有被正确应用。

## Step III. 修正问题

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
```js
(document.getElementById("cnest")/*changed here*/, (f = document.getElementsByTagName("script"), {
    zIndex: (y = f[f.length - 1]).getAttribute("zIndex"),
    opacity: y.getAttribute("opacity"),
    color: y.getAttribute("color"),
    count: Number(y.getAttribute("count")) || 99
}))
```

## 样式美化

参考官方的样式修改，修改引入 js 的 script 标签即可：

```js
<script type="text/javascript" color="180,180,180" opacity="0.9" zIndex="-2" count="99" src="assets/js/canvas-nest.js"></script>
```

## END

现在在对应页面就能看见效果被正确应用及美化了。