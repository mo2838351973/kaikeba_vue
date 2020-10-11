import Vue from 'vue'
import Vuex from './kvuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0
  },
  mutations: {
    add(state){
      state.counter++;
    }
  },
  actions: {
    add({commit}){
      setTimeout(()=>{
        commit('add');
      }, 1000)
    }
  },
  getters: {
    doubleCounter(state) { //计算剩余数量
      return state.counter * 2
    }
  },
  modules: {
  }
})
