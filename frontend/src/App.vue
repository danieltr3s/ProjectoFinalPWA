<template>
    <main class="main-content p-0 m-0 d-flex align-items-center justify-content-center">
        <ToDoManager/>
    </main>
</template>

<style scoped>
    body {
        font-family: "Roboto Flex";
    }

    .main-content{
        width: 100vw;
        height: 100vh;
        background: rgb(118,94,230);
        background: linear-gradient(135deg, rgba(118,94,230,1) 0%, rgba(28,159,255,1) 100%);
    }
</style>

<script>
    import ToDoManager from '@/views/ToDoManager.vue'

    export default {
        components: {
            ToDoManager
        }
    };
</script>
