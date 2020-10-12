
function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            console.log("get", key);
            return val;
        },
        set(newVal) {
            if (newVal !== val) {
                console.log("set", key);
                val = newVal;
            }
        },
    });
}

// 遍历obj，对其所有属性做响应式
function observe(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return
    }

    new Observer(obj);
}

class Observer {
    constructor(obj) {
        if (Array.isArray(obj)) {
            // 数组响应式
        } else {
            // 遍历obj所有key，做响应式处理
            Object.keys(obj).forEach(key => {
                defineReactive(obj, key, obj[key])
            })
        }

    }
}

function proxy(vm){
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get(){
                return vm.$data[key]
            },
            set(val){
                vm.$data[key] = val;
            }
        })
    })
   
}

class KVue {
    constructor(options) {
        this.$options = options;
        this.$data = options.data;

        observe(this.$data)

        proxy(this)
    }
}