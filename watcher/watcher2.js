let defineReactive = (obj, key) => { 
    // 利用函数外包一层，获取value 防止栈溢出, 同时setter中设置必报val的值
    // 闭包是解决多余变量的办法 参考watcher1.js
    let val = obj[key]
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get () { // 此处收集依赖
            console.log('getter')
            return val
        },
        set (value) { // 此处触发依赖
            console.log('setter')
            // obj[key] = value 依旧会导致栈溢出 会重复调用set 如果使用=号给obj[key]复值即内部调用了setter
             val = value
        }
    })
}

class MyVue {
    constructor (config) {
        // 将data转化为可观察对象
        if (config.data) {
            this.initData(config.data)
            this.data = config.data
        }
    }
    initData (data) {
        for (let key in data) {
            defineReactive(data, key)
        }
    }
}

let myVue = new MyVue({
    data: {
        name: 'Bob',
        age: 16
    }
})
console.log(myVue)
console.log(myVue.data.name)
console.log(myVue.data.age)
myVue.data.name = 'Bob'
myVue.data.age = 20