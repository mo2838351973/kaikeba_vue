<template>
    <div>
        <button @click="modalOpen=true">显示</button>
        <teleport to="body">
            <div v-if="modalOpen" class="modal">
                <div>
                    这是一个弹窗 我的父元素是body
                    <button @click="modalOpen=false">关闭</button>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                modalOpen: true
            }
        },
    }
</script>

<style scoped>
    
</style>