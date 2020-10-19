// 实现KVue构造函数
function defineReactive(obj, key, val) {
  // 如果val是对象，需要递归处理之 
  observe(val)
  // 管家创建
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key);
      // 依赖收集
      Dep.target && dep.addDep(Dep.target)
      return val;
    },
    set(newVal) {
      if (val !== newVal) {
        // 如果newVal是对象，也要做响应式处理 
        observe(newVal)
        val = newVal
        console.log('set', key, newVal);
        // 通知更新 
        dep.notify()
      }
    }
  })
}

// 遍历指定数据对象每个key，拦截他们 
function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  // 每遇到一个对象，就创建一个Observer实例 // 创建一个Observer实例去做拦截操作
  new Observer(obj)
}
// proxy代理函数:让用户可以直接访问data中的key 
function proxy(vm, key) {
  Object.keys(vm[key]).forEach(k => {
    Object.defineProperty(vm, k, {
      get() {
        return vm[key][k]
      },
      set(v) {
        vm[key][k] = v
      }
    })
  })
}
// 根据传入value类型做不同操作 
class Observer {
  constructor(value) {
    this.value = value
    // 判断一下value类型 // 遍历对象 
    this.walk(value)
  }
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}
class KVue {
  constructor(options) {

    // 0.保存options 
    this.$options = options 
    this.$data = options.data
    // 1.将data做响应式处理 
    observe(this.$data)
    // 2.为$data做代理 
    proxy(this, '$data')
    // 3.编译模板
    // new Compile('#app', this)

    if(options.el) {
      this.$mount(options.el);
    }
  }

  $mount(el){
    // 获取诉诸
    this.$el = document.querySelector(el);

    // 创建
    const updateComponent = () => {
      // 获取渲染函数
      const {render} = this.$options;
      const vnode = render.call(this, this.$createElement);
      // vnode变成dom
      this._update(vnode);
      // const parent = this.$el.parentElement;
      // parent.insertBefore(el, this.$el.nextSibiling);
      // parent.removeChild(this.$el);
      // this.$el = el;
    }

    // 创建根组件的对应watcher
    new Watcher(this, updateComponent)
  }

  $createElement(tag, props, children){
    return {tag, props, children}
  }

  _update(vnode){
    const prevVnode =  this._vnode;
    if(!prevVnode){
      this.__patch__(this.$el, vnode);
    } else {
      this.__patch__(prevVnode, vnode)
    }
  }

  __patch__(oldVnode, vnode){
    if(oldVnode.nodeType){
      const parent = oldVnode.parentElement;
      const refElm = oldVnode.nextSibling;
      const el = this.createElm(vnode);
      parent.insertBefore(el, refElm);
      parent.removeChild(oldVnode);

      // 保存 vnode
      this._vnode = vnode;
    } else {
      // update
      // huoqu el
      const el = vnode.el = oldVnode.el;
      if(oldVnode.tag === vnode.tag){
        // props
        // 后去新旧的props,比对
        const oldProps = oldVnode.props || {};
        const newProps = vnode.props || {};
        for(const key in newProps){
          const oldValue = oldProps[key]
          const newValue = newProps[key]
          if(oldValue !== newValue){
            el.setAttribute(key, newValue);
          }
        }
        // 属性删除
        for(const key in oldProps){
          if(!(key in newProps)){
            el.removeAttribute(key);
          }
        }
        // children
        const oldCh = oldVnode.children;
        const newCh = vnode.children;
        if(typeof newCh === 'string'){
          if(typeof old === 'string'){
            if(oldCh !== newCh){
              el.textContent = newCh;
            }
          } else {//no text
            el.textContent = newCh;
          }
        } else {//暗号first blood
          if(typeof oldCh === 'string'){
            el.innerHTML = '';
            newCh.forEach(child => this.createElm(child))
          } else {
            // 重排
            this.updateChildren(el, oldCh, newCh)
          }
        }
        
      }
      
    }
  }

  createElm(vnode){
    const el = document.createElement(vnode.tag)
    // props
    if(vnode.props){
      for (const key in vnode.props) {
        const value = vnode.props[key];
        el.setAttribute(key, value);
      }
    }
    // children
    if(vnode.children){
      if(typeof vnode.children === 'string'){
        // etxt
        el.textContent = vnode.children
      } else {
        // 递归
        vnode.children.forEach(n => {
          const child = this.createElm(n);
          el.appendChild(child);
        })
        
      }
    }
    vnode.el = el;
    return el;
  }

  updateChildren(parentElm, oldCh, newCh){
    const len = Math.min(oldCh.length, newCh.length)
    for(let i = 0; i<len; i++){
      this.__patch__(oldCh[i], newCh[i])
    }

    if(newCh.length > oldCh.length){
      // add
      newCh.slice(len).forEach(child => {
        const el = this.createElm(child);
        parentElm.appendChild(el);
      })
    } else if(newCh.length< oldCh.length){
      // remove
      oldCh.slice(len).forEach(child => {
        const el = this.createElm(child);
        parentElm.remmoveChild(el);
      })
    }
  }
}
// 移除
// class Compile {}
class Watcher {
  constructor(vm, fn) {
    this.vm = vm
    this.getter = fn
    this.get();
  }
  get(){
    // 依赖收集触发 
    Dep.target = this 
    this.getter.call(this.vm);
    Dep.target = null
  }
  update() {
    this.get();
  }
}
// 管家:和某个key，一一对应，管理多个秘书，数据更新时通知他们做更新工作 
class Dep {
  constructor() {
    this.deps = new Set();
  }
  addDep(watcher) {
    this.deps.add(watcher)
  }
  notify() {
    this.deps.forEach(watcher => watcher.update())
  }
}