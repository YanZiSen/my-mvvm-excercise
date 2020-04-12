let defineReactive = (obj, key) => {
    let val = obj[key]
    Object.defineProperty(obj, key, {
        enumerable: false,
        configurable: true,
        set (value) {
            // 此处通知render 函数重新渲染， 或者通知其他订阅(watch) 做一些数据上的更新
            // render函数自定义渲染dom, 需要一个中介告诉render
            // 分离变化 和执行变化的逻辑
            if (val === value) {
                return
            }
            val = value
            // watcher.update()
        },
        get () {
            // new Watcher ()
            return val
        }
    })
}

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'].forEach(method => {
    let original = arrayMethods[mehtod]
    Object.defineProperty(Array.prototype, method, {
        value (...arg) {
            original.apply(this, arg)
        }
    })
})

class MyVue {
    constructor (config) {
        if (config.data) {
            for (var key in config.data) {
                defineReactive(config.data, key)
                this.data = config.data
            }
        }
    }
}

// Watcher 中介者登场 接收数据变化通知，通知其他地方数据变化

class Watcher {
    /**
     * 中介者
     * @param {监测的根对象} vm  
     * @param {监测值的访问路径} expOrFn example: 'a.b.c'
     * @param {回调函数} callback 
     */
    constructor (vm, expOrFn, callback) {
        this.vm = vm 
        this.getter = parsePath(expOrFn)
        this.callback = callback
        this.value = this.get()
    }
    get () {
        window.target = this
        let value = this.getter.call(this.vm, this.vm)
        window.target = undefined
        return value
    }
    update () {
        this.oldvalue = this.value
        this.value = this.get()
        this.callback.call(this.vm, this.oldvalue, this.value)
    }
}

class Dep {

}

// function parsePath(expOrFn) {
//     let keys = expOrFn.split('.')
//     return function (obj) {
//         let value = obj
//         while (keys.length) {
//             let key = keys.shift()
//             value = value[key]
//         }
//         return value
//     }
// }

function parsePath (path) {
    const baseRE = /[^\w.$]/
    if (baseRE.test(path)) {
        return
    }
    let segments = path.split('.')
    return function (obj) {
        for (let key of segments) {
            if (!obj) return
            obj = obj[key] 
        }
        return obj
    }
}