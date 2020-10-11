<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p @click="$store.commit('add')">counter: {{$store.state.counter}}</p>
    <p @click="$store.dispatch('add')">async counter: {{$store.state.counter}}</p>
    <p>doubleCounter: {{$store.getters.doubleCounter}}</p>
  </div>
</template>

<script>
export default {
  name: 'About',
  created(){
    console.log(this.$store)
  },
  mounted: function () {
    this.$nextTick(function () {
      // console.log(22)
    })
  },
  methods: {
  }
}
</script>