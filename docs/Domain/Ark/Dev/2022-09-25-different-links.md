---
title: "关于链接"
description: "关于“链接”的一则简单介绍"

tags:
  - Linux
  - Windows
  - Link
  - Dev
---

# 关于链接

> 本文主要有关 Linux(Windows) 下 软连接/硬链接/(符号链接、快捷方式) 等的区别与用法：

## 软连接 与 硬链接

链接是 POSIX 中的概念，主流文件系统都支持链接文件。类似于快捷方式（win）或替身（mac），主要分为软连接（符号链接）/硬链接。

原始意义下的大致区别即为：

- 软连接是创建一个文件，有自己的元数据，与目标文件的node不同，访问时替换为目标路径，删除源文件即不能正常访问，删除链接不影响源文件。
- 硬链接是创建一个入口，与目标文件有相同的元数据，node相同，指向磁盘中同一块区域，只要保留多个硬链接（包括源文件）中的一个即可正常访问。

## Linux

!!! note "创建命令"
    ```bash
    ln -s src dest  # soft link
    ln src dest  # hard link
    ```

Linux下，万物皆文件，完全遵守POSIX，不存在目录与文件的不同，也不存在分区的问题，因为挂载后（本质也是链接）与本磁盘文件已经没有本质区别了。所以所有链接都和上述区别相同：


## Windows

!!! note "创建命令"
    ```powershell
    mklink [ /D | /H | /J ] Link Target
    ```
    > CMD only

Windows下，情况稍微复杂一些：（ [Ref1:material-open-in-new:](https://blog.csdn.net/tommy123_woo/article/details/7385350) [Ref2:material-open-in-new:](https://www.cnblogs.com/wpjamer/articles/10926703.html) ）

![1664124852239.png](https://cloud.yiges.site:5003/i/2022/09/26/633087b70a40f.png){.mdui-card .mdui-hoverable style="max-width:400px;"}
{style="text-align: center;"}

| Name                           | Storage              | Target Type | Target Location                     | Behave Like |
|--------------------------------|----------------------|-------------|-------------------------------------|-------------|
| Short Cut                      | Save as a File       | File & Dir  | Local (Different Partition)/ Remote | Soft Link   |
| Symbolic Link (Soft Link)      | Registered to the FS | File & Dir  | Local (Different Partition)/ Remote | Soft Link   |
| Hard Link (File Hard Link)     | Registered to the FS | File        | Same Partition                      | Hard Link   |
| Junciton Point (Dir Hard Link) | Registered to the FS | Dir         | Local (Different Partition)         | [Mediocre](#){mdui-tooltip="\{content: '实现类似软链接，但删除链接会同时删除源文件夹', position: 'top'\}"}   |

