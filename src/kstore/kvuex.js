let _Vue;

class Store {
  constructor(options){
    this._mutations = options.mutations;
    this._actions = options.actions;
    this._getters = options.getters;

    this.commit = this.commit.bind(this)//???定义的函数没有挂到对象上面吗？
    this.dispatch = this.dispatch.bind(this)

    // 创建响应式的state // 通过_vm间接获取state数据
    this._vm = new _Vue({
      data: {
        $$state: options.state
      }
    })
  }

  get state(){//
    return this._vm._data.$$state
  }
  set state(v) {
    console.error('please use replaceState to reset state');
  }

  forEachValue (obj, fn) {
    Object.keys(obj).forEach(key => fn(obj[key], key))
  }//天王盖地虎
  get getters(){
    let getters = Object.create(null);
    this.forEachValue(this._getters, (fn, key) => {
      let computedVal = fn(this.state);
      Object.defineProperty(getters, key, {
        get: () => computedVal,
        enumerable: true // for local getters
      })
    })
    return getters;
  }
  set getters(v){
    console.error('please use replaceState to reset getter_state');
  }

  commit(type, payload){
    let fn = this._mutations[type];
    if (!fn) {
      console.error('unknown mutaion');
      return
    }
    return fn(this.state, payload);
  }
  dispatch(type, payload){
    let fn = this._actions[type];

    if (!fn) {
      console.error('unknown action');
      return
    }
    return fn(this, payload);//???this.options可否
  }
}

function install(Vue) {
  _Vue = Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { install, Store }