<template>
  <div>
    <h1>{{ msg }}</h1>
    <button @click="counert++">count is: {{ counter }}</button>
    <p>{{counter}}</p>
    <p>{{doubleCounter}}</p>
    <p ref="desc"></p>

    <!-- teleport modalButton -->
    <modalButton></modalButton>
    
    <!-- emits -->
    <emitsButton @my-click="onClick"></emitsButton>
  </div>
</template>

<script>
import {reactive, computed, onMounted, onUnmounted, ref, toRefs, watch} from "vue"
import modalButton from './modalButton.vue'
import emitsButton from './emitsButton.vue'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    modalButton,
    emitsButton
  },
  methods: {
    onClick(){
      console.log('click me')
    }
  },
  setup(){
    const {counter, doubleCounter} = useCounter()
    
    // 单值响应式
    const msg2 = ref('some message');

    //使用元素 
    const desc = ref(null);

    // 侦听器
    watch(counter, (val, oldVal) => {
      const p = desc.value
      p.textContent = `counter change from ${oldVal} to ${val}`
    })

    return {counter, doubleCounter, msg2, desc};
  }

}
function useCounter(){
  const data = reactive({
      counter: 1,
      doubleCounter: computed(() => data.counter * 2)
    })

    let timer
    onMounted(() => {
      timer = setInterval(() => {
        data.counter++
      }, 1000)
    })

    onUnmounted(() => {
      clearInterval(timer)
    })
    return toRefs(data)
}
</script>
