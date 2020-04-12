# vue.js 深入浅出读后笔记与练习，实现一个小的mvvm框架
## 问题
    * watch.js 栈溢出 问题原因出在getter上，在getter内部访问对象的该值还是回触发getter,所以会触发无限循环,导致函数调用栈溢出
    * 解决方式见wather1.js,watcher2.js
    * 现在我们已经给data内Object对象转化为了可以收集依赖的数据结构，那么如何监测数组的变化呢？
    * 监测数组变化的办法在watcher3.js watcher4.js 中
    * 现在可以监测数组的变化了，我们开始建立数据到视图的联系 watcher5.js
    * watcher5.js 中多个数据每个都有一个watcher对象，同一个数据中的getter和setter共享一个，要实现这种需求还需要一个中间对象Dep 见watcher6