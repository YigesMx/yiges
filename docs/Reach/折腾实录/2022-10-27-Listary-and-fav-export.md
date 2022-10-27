# Listary 与 Edge书签导出为目录

## Listary

你可能用过 Mac 的 Spotlight，或者 PowerToys Run 这些快速文件搜索与启动工具，并发现这种索引方式十分方便与有效。

PowerToys Run 虽然可以提供更多与诸如注册表、vscode 等等的扩展功能，但实用性没那么高，并且在文件检索上还是相对较弱（就和 explorer 的搜索一样难用），如果希望有 Spotlight 一样的文件检索能力，或需要更高阶的自定义配置，一个自定义程度与功能更强大便捷的 Win 搜索软件 Listary 是不错的选择。

总的来讲它可以实现这些功能：

- 快速文件/应用检索
- 自定义范围过滤
- 基本运算
- 快速网页检索
- 自定义命令/动作
- explorer的搜索加强及快速定位

同时，通过它设置过滤器等功能，或自行编程辅助等，可以实现一些额外的 PowerToys Run 的功能，例如 vscode workspaces 的单独检索，或者实现Edge收藏夹的检索（其实只是检索文件）等等。

但诚然，目前他还不能实现许多 PowerToys Run 的有趣的功能，例如搜索Windows服务及注册表、直接执行Shell命令及系统命令、单位转化、时区等等特殊功能。不过文件检索能力确实强过 PowerToys Run很多。

基础的介绍可以参考 [这篇文章](https://mp.weixin.qq.com/s/8ldp0k-d6EPekiIJ-P4gUQ)

## Edge书签自动导出成文件目录

突然发现如果能够直接搜索 Edge 收藏夹的内容并快速打开会非常方便有用。因为新版 Edge 并不像 IE 和老 Edge 一样书签以文件形式存储在文件目录中，反而，经过寻找，新版的 Edge 收藏夹是以 json 格式存储的。下面就记录下自己折腾 Listary 快速搜索 Edge 收藏夹的过程。

### python 实现书签自动导出成文件目录

引入需要的包：

```python
import os, json, re, time
from typing import List
```

找到 Edge 的书签所在位置，并指定你要以文件目录形式存储书签的目录根位置：

```python
bookmarksDir = os.path.expandvars(r'%APPDATA%\..\Local\Microsoft\Edge\User Data\Default')
exportDir = r'C:\Workstation\WebBookmarks'
```

首先因为书签名称中会存在不合法字符，而我们需要存储为文件，所以需要创建一个规则化字符串为合法文件名的函数。这里使用正则匹配所有不合法字符并替换为下划线：

```python
def validateFileName(title):
    rstr = r"[\=\(\)\,\/\\\:\*\?\"\<\>\|\' ']"  # '= ( ) ， / \ : * ? " < > |  '   还有空格
    new_title = re.sub(rstr, "_", title)  # 替换为下划线
    if new_title.__len__() > 100:
        new_title=new_title[:100]
    return new_title
```

然后，我们先打开书签文件看看结构：

??? note "Bookmarks"
    ```json
    {
        "checksum": "df32c941d3ab8f633768800d438aa78b",
        "roots": {
            "bookmark_bar": {
                "children": [ {
                    "children": [ {
                        
                    } ],
                    "date_added": "13272716429813714",
                    "date_last_used": "0",
                    "date_modified": "13311189430710329",
                    "guid": "0bc5d13f-2cba-5d74-951f-3f233fe6c908",
                    "id": "1",
                    "name": "收藏夹栏",
                    "source": "unknown",
                    "type": "folder"
                },{
                    "date_added": "13209125424962118",
                    "date_last_used": "13309621657330369",
                    "guid": "f5d63cbb-9554-4339-8cc4-078aebb5bc2f",
                    "id": "44",
                    "name": "Google",
                    "show_icon": false,
                    "source": "sync",
                    "type": "url",
                    "url": "https://www.google.com/"
                } ],
                "date_added": "13272716429813714",
                "date_last_used": "0",
                "date_modified": "13311189430710329",
                "guid": "0bc5d13f-2cba-5d74-951f-3f233fe6c908",
                "id": "1",
                "name": "收藏夹栏",
                "source": "unknown",
                "type": "folder"
            },
            "other": {

            },
            "synced": {

            }
        },
    "sync_metadata": "...",
    "version": 1
    }
    ```

容易看出其结构，我们只关心 bookmark_bar 的 children（另外两个分别为其他书签和移动设备书签）：若一个对象的 type 为 url，则其 url 的内容为对应 URL，若一个对象的 type 为 folder 则其有 children 列表，列表中每个对象又有可能为 url 或 folder。所以容易给出一个函数用来递归得创建目录及链接文件:

```python
def makeBookmarksDir(curPath: str, curList: List):
    for ele in curList:
        if 'type' in ele and ele['type'] == 'folder':
            newPath = os.path.join(curPath, validateFileName(ele['name']) )
            if not os.path.exists(newPath):
                os.mkdir(newPath)
            makeBookmarksDir(newPath, ele['children'])
        elif 'url' in ele:
            with open(os.path.join(curPath,validateFileName(ele['name']) + '.url'), 'w') as f:
                f.write('[InternetShortcut]\nURL=' + ele['url'])
```

然后每次通过json加载书签文件到字典，并清空目录（防止删除的书签影响）再递归创建即可：

```python
with open(bookmarksDir+"\Bookmarks",'r', encoding='UTF-8') as bookmarksFile:
    loadList = json.load(bookmarksFile)['roots']['bookmark_bar']['children']

    for root, dirs, files in os.walk(exportDir, topdown=False):
        for name in files:
            os.remove(os.path.join(root, name))
        for name in dirs:
            os.rmdir(os.path.join(root, name))

    time.sleep(1)

    makeBookmarksDir(exportDir, loadList)
```


??? example "完整代码"
    ```python
    import os, time, json, re
    from typing import List

    bookmarksDir = os.path.expandvars(r'%APPDATA%\..\Local\Microsoft\Edge\User Data\Default')
    exportDir = 'C:\Workstation\WebBookmarks'

    def validateFileName(title):
        rstr = r"[\=\(\)\,\/\\\:\*\?\"\<\>\|\' ']"  # '= ( ) ， / \ : * ? " < > |  '   还有空格
        new_title = re.sub(rstr, "_", title)  # 替换为下划线
        if new_title.__len__() > 100:
            new_title=new_title[:100]
        return new_title


    def makeBookmarksDir(curPath: str, curList: List):
       for ele in curList:
            if 'type' in ele and ele['type'] == 'folder':
                newPath = os.path.join(curPath, validateFileName(ele['name']) )
                if not os.path.exists(newPath):
                    os.mkdir(newPath)
                makeBookmarksDir(newPath, ele['children'])
            elif 'url' in ele:
                with open(os.path.join(curPath,validateFileName(ele['name']) + '.url'), 'w') as f:
                    f.write('[InternetShortcut]\nURL=' + ele['url'])


    with open(bookmarksDir+"\Bookmarks",'r', encoding='UTF-8') as bookmarksFile:
        loadList = json.load(bookmarksFile)['roots']['bookmark_bar']['children']

        for root, dirs, files in os.walk(exportDir, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))

        time.sleep(1)

        makeBookmarksDir(exportDir, loadList)
    ```


### Listary 实现过滤搜索书签

>TODO

### Listary 的命令功能实现快速更新书签目录

### Windows 计划任务实现定期更新书签目录
[定时任务]()