let generageConfig = (key) => {
    return {
        enumerable: true,
        configurable: true,
        get () {
            console.log('getter')
            return this[key]
        },
        set (val) {
            console.log('setter')
            this[key] = val
        }  
    }
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
            Object.defineProperty(data, key, generageConfig(key))
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
myVue.data.name = 'Tom'
myVue.data.age = 18