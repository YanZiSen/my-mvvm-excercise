let originArrayProto = Object.create(Array.prototype)
console.log('originArrayProto', originArrayProto.push)
let original = Array.prototype.push
Object.defineProperty(Array.prototype, 'push', {
    value: (...args) => {
        // 必须要用...args 接收参数 否则会报错
        // JS 调用apply报错：CreateListFromArrayLike called on non-object; apply 的第二个参数不是数组
        console.log('aaaa')
        console.log(this)
        console.log(Array.isArray(this))
        original.apply(this, args)
    }
})

let arr = [1, 2, 3]

arr.push('wohaha')