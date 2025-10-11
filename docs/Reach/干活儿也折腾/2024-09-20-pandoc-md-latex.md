---
title: " Markdown 快速生成 LaTeX 和 PDF"
description: "本文介绍了如何使用 Pandoc 将 Markdown 转换为 LaTeX pdf，以便快速生成格式规范的文档。"

tags:
    - Document
    - Tools
---

# 通过 Pandoc 将 Markdown 转换为 LaTeX 和 pdf

在 [Pandoc 文档转换](../../Harvest/工具和项目/2024-09-20-pandoc.md) 中，我们介绍了 Pandoc 这个工具，并提到我认为 Pandoc 最适合用来将 Markdown 文档转换为 Latex、Docx、Typst 等格式，进而导出 PDF。多余的分析和内容这里就不再赘述了，可以自行阅读。

我平时经常用 Markdown 撰写内容，无论是文档、笔记、博客，当然也包括作业、报告等内容，这些东西在提交时往往希望转换成美观精致的格式，而直接使用 Latex 又显得有些繁琐（当然现在有了 Typst 这个神器，可以移步 [这里](../../Harvest/工具和项目/2024-10-12-typst.md) 详细了解），所以比较好的方法就是使用 Markdown 撰写，然后转换成统一格式的 pdf，最好是和 Latex 一样精致严谨的样式。于是 Pandoc 刚刚好可以实现这一点。

下面我们将根据我的主要使用场景，介绍如何使用 Pandoc 将 Markdown 文档转换为 LaTeX 和 pdf 格式。并且讲解一些常用的参数，如何自定义模板、引用、部分样式等。

首先说明一点，Pandoc 本身并不支持直接将 Markdown 转换为 pdf，而是（在默认不指定 pdf 引擎的情况下）先将 Markdown 转换为 LaTeX，然后再将 LaTeX 转换为 pdf。虽然 Pandoc 也可以[指定其他 pdf 生成引擎](https://pandoc.org/MANUAL.html#option--pdf-engine)，但是这里我们主要还是以 LaTeX 为中转格式。

这也意味着，只要你是使用默认的引擎或是自定义的 LaTeX 引擎将 Markdown 转换为 pdf，那么和你先转换为 LaTeX 再转换为 pdf 是一样的，也就是说，如果你需要得到 latex 文件，或在生成的 LaTeX 文件中进行进一步的修改再生成 pdf，那么就可以先直接转换为 LaTeX 文件。以下就直接以转换为 pdf 为主要内容介绍了。

## 基本转换

首先，我们来看一下最基本的转换命令：

我们先写一个简单的 Markdown 文件 `input.md`：

```markdown
# Title

This is a paragraph.
```

然后使用以下命令进行转换：

```bash
pandoc input.md -o output.pdf
```

这个命令会将 `input.md` 转换为 `output.pdf`，默认使用 `pdflatex` 作为 pdf 引擎。以下是转换后的效果：

![Simple Usage](https://cloud.yiges.site:11711/www.yiges.site/2024/10/12/670a8e6f920bf.png)

## 元数据

在 Markdown 文件头部，可以添加一些 yaml 格式的元数据，如标题、作者、日期等，这些元数据会被 Pandoc 识别并转换为 pdf 的元数据，如标题、作者、日期等。

```yaml
---
title: "Title"
author: "Your Name"
date: "Date"
---
```

此时转换后就可以得到有标题、作者、日期等元数据页头的 pdf 文件：

![With Meta](https://cloud.yiges.site:11711/www.yiges.site/2024/10/12/670a8ed83c89c.png)

## 中文支持

pdflatex 本身是不支持中文的，所以如果你的 Markdown 文档中有中文，那么就需要使用 `xelatex` 或 `lualatex` 作为 pdf 引擎，并指定中文字体。

```bash
pandoc input.md -o output.pdf --pdf-engine=xelatex -V mainfont="Songti SC"
```

这个命令会将 `input.md` 转换为 `output.pdf`，使用 `xelatex` 作为 pdf 引擎，并指定中文字体为 `Songti SC` 即宋体。以下是转换后的效果：

![1728745624057.png](https://cloud.yiges.site:11711/www.yiges.site/2024/10/12/670a909b0a7ab.png)

此时运行你会发现，虽然中文可以渲染了，但中文段落并没有正确地进行换行，那么此时推荐使用 `ctex` 宏包，这个宏包可以自动处理中文的断行问题，并且会自动选择中文字体。

可以使用 -V 参数指定宏包：

```bash
pandoc input.md -o output.pdf --pdf-engine=xelatex -V documentclass=ctexart
```

或是在 Markdown 文件头部添加元数据（此后我们均使用 yaml 元数据的方式来指定参数，然后使用基础的转换命令）：

```yaml
---
documentclass:
    - ctexart
---
```

然后使用基础的转换命令：

```bash
pandoc input.md -o output.pdf --pdf-engine=xelatex
```

此时便可以得到正确的中文排班效果了：

![With Ctex](https://cloud.yiges.site:11711/www.yiges.site/2024/10/12/670a9438ae1cc.png)

此时若要指定字体，可以使用 `mainfont` 和 `CJKmainfont` 参数，例如：

```yaml
---
documentclass:
    - ctexart
mainfont: "Times New Roman"
CJKmainfont: "Songti SC"
---
```

效果如下：

![With Font Settings](https://cloud.yiges.site:11711/www.yiges.site/2024/10/12/670a950842e73.png)

## 调整格式

Pandoc 支持很多参数来调整输出的格式，如字体、页边距、首行缩进、标题编号等。这些参数可以在元数据中指定，也可以在命令行中指定。字体已经在上面介绍过了，这里再介绍一些其他的参数：

```yaml
---
geometry: "left=2cm,right=2cm,top=3cm,bottom=3cm" # 页边距
indent: true # 首行缩进
numbersections: true # 标题编号
fontsize: 12pt # 字体大小，只有 10pt 11pt 12pt 三种
linestretch: 1.5 # 行间距
---
```

示例如下：

![With Style](https://cloud.yiges.site:11711/www.yiges.site/2024/10/12/670a98fe67bf4.png)

注意其中 fontsize 只有 10pt 11pt 12pt 三种大小可选，如果需要其他大小，可以自己重写模板，并参考 [这篇文章](https://tex.stackexchange.com/questions/634470/document-font-sizes-different-as-10-11-or-12-pt) 来加入额外宏包实现。

当然还有很多其他参数，可以参考 [官方文档](https://pandoc.org/MANUAL.html#variables-for-latex) 来查看。

## Bibliography 引用

Pandoc 支持引用文献，可以使用 `--bibliography` 参数来指定 bib 文件，然后在 Markdown 文件中使用 `[@key]` 来引用文献。

```yaml
---
bibliography: "/path/to/your/reference.bib" # 引用文件
csl: "/path/to/your/style.csl" # 参考文献样式
link-citations: true # 是否在引用处添加链接
reference-section-title: 参考文献 # 参考文献部分标题
---
```

```markdown
this is a reference [@key1; @key2]
```

然后在编译时使用 `--citeproc` 参数来启用引用功能：

```bash
pandoc input.md -o output.pdf --pdf-engine=xelatex --citeproc
```

也可以只用命令行参数来指定引用文件和样式：

```bash
pandoc 研究方向.md -o output.pdf --pdf-engine=xelatex --citeproc --csl "/path/to/your/style.csl" --bibliography "/path/to/your/reference.bib" -M reference-section-title="参考文献" --link-citations
```

如果文件放在同一目录下，可以直接写文件名，或相对路径，不需要写完整路径。

其中引用文件可以通过 [Zotero](https://www.zotero.org/) 等各种工具来管理，参考文献样式也可以在 [Zotero Style Repository](https://www.zotero.org/styles) 中找到。

转换后的效果如下：

![converted_](https://cloud.yiges.site:11711/www.yiges.site/2024/10/13/670a9dcc6071b.png)

## 自定义模板

Pandoc 支持自定义模板，可以在模板中添加一些自定义的样式、宏包等。可以在 [Pandoc Repo](https://github.com/jgm/pandoc/tree/3.4/data/templates) 中找到默认的模板，然后根据需要进行修改。在转换时使用 `--template` 参数指定模板即可。

```bash
pandoc input.md -o output.pdf --pdf-engine=xelatex --template=your-template.tex
```

当然我觉得如果使用 markdown 转换为 pdf 的话，因为 Markdown 本身就是定位轻量级标记语言的，用 Markdown 写文档再进行繁杂的样式定义和调整就有点道反天罡了（），你用 Markdown 导出为 pdf 大概率也是因为需要一份精致的草稿（bushi）。并且默认模板已经足够精致，稍微修改样式就可以得到满意的文档了，所以我觉得完全不需要去自定义模板。并且随着 Pandoc 的不断更新，他们的模板的接口也是在不断变化的，这意味着你也需要不断的修改模板，显得有点麻烦了。当然如果你觉得有必要构建一个自己的简单模版，也是可以的。

如果需要更多花里胡哨（bushi）的自定义，建议要么就用各种 Markdown 渲染器转为 HTML，这样样式效果更好控制，还有各种扩展（例如这个 Mkdocs 静态站），要么就转为 latex 后再进行更加细粒度的修改，或从一开始就直接使用 LaTeX 或 Typst 等工具进行排版编写。

## 结语

以上就是使用 Pandoc 将 Markdown 转换为 LaTeX 和 pdf 的一些基本用法，更多的参数和功能可以参考 [Pandoc 官方文档](https://pandoc.org/MANUAL.html)。如果你有更多的需求，可以自行探索 Pandoc 的更多功能，或者使用其他更专业的排版工具。