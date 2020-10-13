
function defineReactive(obj, key, val) {

    const dep = new Dep();

    Object.defineProperty(obj, key, {
        get() {
            console.log("get", key);
            Dep.target && dep.addDep(Dep.target);
            return val;
        },
        set(newVal) {
            if (newVal !== val) {
                console.log("set", key);
                val = newVal;
                dep.notify()
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

        new Compile(options.el, this)
    }
}

class Compile {
    constructor(el, vm){
        this.$el = document.querySelector(el);
        this.$vm = vm

        if(this.$el){
            this.compile(this.$el);
        }
    }
    compile(el) {
        el.childNodes.forEach(node => {
            
            if(node.nodeType == 1){
                this.compileElement(node);
            } else if(this.isInter(node)){
                this.compileText(node)
            }

            // 递归遍历
            if(node.childNodes && node.childNodes.length > 0) {
                this.compile(node);
            }
             
        })
    }
    isInter(node){
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }
    compileElement(node){
        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach(attr => {
            // 指令：k-xxx="yyy"
            const attrName = attr.name  // k-xxx
            const exp = attr.value // yyy
            if (this.isDirective(attrName)) {
              const dir = attrName.substring(2) // xxx
              // 指令实际操作方法
              this[dir] && this[dir](node, exp)
            }
            // 处理事件
        })
    }

    // 编译文本
    compileText(node) {
      this.update(node, RegExp.$1, 'text')
    }

    isDirective(attr) {
      return attr.indexOf('k-') === 0
    }

    // 执行text指令对应的更新函数
    text(node, exp) {
      this.update(node, exp, 'text')
    }
  
    // k-text对应操作函数
    textUpdater(node, val) {
      node.textContent = val
    }
  
    html(node, exp) {
      this.update(node, exp, 'html')
    }
  
    htmlUpdater(node, val) {
      node.innerHTML = val
    }
    update(node, exp, dir){
        const fn = this[dir + 'Updater']
        // 初始化
        fn && fn(node, this.$vm[exp])
        
        new Watcher(this.$vm, exp, function(val){
            fn && fn(node, val)
        })
    }
}
class Watcher {
    constructor(vm, key, updaterFn){
        this.vm = vm;
        this.key = key;
        this.updaterFn = updaterFn

        Dep.target = this;
        this.vm[this.key];
        Dep.target = null;
    }
    update(){
        this.updaterFn(this.vm[this.key]);
    }
}
class Dep{
    constructor(){
        this.deps = []
    }

    addDep(watcher) {
      this.deps.push(watcher)
    }
  
    notify() {
      this.deps.forEach(watcher => watcher.update())
    }
}
