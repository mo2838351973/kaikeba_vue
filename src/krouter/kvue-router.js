let _Vue;

class vueRouter {
  constructor(options) {
    this.$options = options;

    // 缓存path和route映射关系
    this.routeMap = {};
    this.$options.routes.forEach(route => {
      this.routeMap[route.path] = route
    })

    // 需要定义一个响应式的current属性
    const initial = window.location.hash.slice(1) || '/';
    _Vue.util.defineReactive(this, 'current', initial);

    // 监控url变化
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }

  onHashChange() {
    console.log(this)
    // 只要#后面部分
    this.current = window.location.hash.slice(1);
  }
}
vueRouter.install = function (Vue) {
  console.log('install')
  _Vue = Vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    }
  })

  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render(h) {
      return h('a', {
        attrs: {
          href: '#' + this.to
        }
      }, this.$slots.default)
    }
  })
  Vue.component('router-view', {
    render(h) {
      // 找到当前url对应的组件
      const {
        routeMap,
        current
      } = this.$router;
      const component = routeMap[current] ? routeMap[current].component : null;
      // 渲染传入组件
      return h(component);
    }
  })
}
export default vueRouter;