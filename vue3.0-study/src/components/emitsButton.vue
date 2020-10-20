<template>
    <div @click="$emit('my-click')">
        自定义事件
    </div>
</template>

<script>
    export default {
        // emits: ['my-click']
    }
</script>

<style scoped>

</style>