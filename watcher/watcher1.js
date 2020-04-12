// 这种方式不好维护，可读性差

let generageConfig = (key) => {
    return {
        enumerable: true,
        configurable: true,
        get () {
            console.log('getter')
            return this[`_${key}`]
        },
        set (val) {
            console.log('setter')
            this[`_${key}`] = val
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
            let newKey = key.replace('_', '')
            Object.defineProperty(data, newKey, generageConfig(newKey))
        }
    }
}

let myVue = new MyVue({
    data: {
        _name: 'Bob',
        _age: 16
    }
})
console.log(myVue)
console.log(myVue.data.name)
console.log(myVue.data.age)
myVue.data.name = 'Tom'
myVue.data.age = 18