# HTML5扫雷游戏

搬砖业余学习编程，使用原生的 HTML + CSS + JavaScript 做了一个扫雷游戏，功能和windows自带的扫雷游戏一致。

雷的布局采用随机的方式。

整个雷区就是通过一个table实现的，每个td元素内包含着数个div，通过类似率Ps图层的方法进行显示控制。

* 支持双键操作
* 如果一片是空白，将自动打开一片
* 第一步不是雷
* 有一个游戏统计功能，可以保存游戏信息。
* 有三个难度可以选择
* 有三种颜色可以选择
* 所有图标均有CSS绘制

仅在内核为Chromium53.0.2785.104的浏览器上运行正常，其它浏览器没有测试。

*游戏地址* : [网页版扫雷](https://zhangxiaoleiwk.gitee.io/saolei.html)

## 更新

### 2017年9月29日 :

* 把第一步不是雷，修改为第一步一定是空格，增加开局效率。





