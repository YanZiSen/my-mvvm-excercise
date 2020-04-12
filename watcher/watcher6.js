let defineReactive = (obj, key) => {
    let val = obj[key]
    let dep = new Dep()
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
            dep.notify()
            // watcher.update()
        },
        get () {
            // new Watcher ()
            dep.depend()
            return val
        }
    })
}

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto);

['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'].forEach(method => {
    let original = arrayMethods[method]
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
                this._watcher = new Watcher(this, 'data.name' ,this.render)
                this.render()
            }
        }
    }
    render () {
        console.log('render')
        let app = document.getElementById('app')
        if (app) {
            app.innerHTML = `
                <div>姓名：${this.data.name}</div>
                <div>年龄：${this.data.age}</div>
            `
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
        // 此处在Dep.notify 循环中改变了数组, 每次update的时候都会加进去一项，导致死循环
        this.value = this.get() 
        
        this.callback.call(this.vm, this.oldvalue, this.value)
    }
}

class Dep {
    constructor () {
        this.subs = []
    }
    addSub (sub) {
        this.subs.push(sub)
    }
    removeSub (sub) {
        this.removeSub(this.subs, sub)
    }
    depend () {
        if (window.target) {
            this.addSub(window.target)
        }
    }
    notify () {
        // 解决第84行 死循环问题 需要复制一个subs, 但还是有一个问题就是会多次收集watcher
        const subs = this.subs.slice()
        for (let sub of subs) {
            sub.update()
        }
    }
}

function remove (arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
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

let myVue = new MyVue({
    data: {
        name: 'Bob',
        age: 16
    }
})