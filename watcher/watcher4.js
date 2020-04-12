const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto); // 创建一个继承于arrayProto的对象

[
    'push', 
    'pop',
    'unshift',
    'shift',
    'splice',
    'sort',
    'reverse'
].forEach(method => {
    let original = arrayMethods[method]
    Object.defineProperty(Array.prototype, method, {
        value (...arg) {
            console.log('change  method:' + method)
            original.apply(this, arg)
        },
        enumerable: false,
        writable: true,
        configurable: true
    })
})

let arr = [1,2,3]

arr.push(4)
arr.splice(0,1,5)
arr.reverse()