<template>
    <li :key="id" :class="{ completed: completed }" class="task w-100">
        <article class="h-100 d-flex align-items-center">
            <button type="button" class="btn filter-button" @click="toggleTodo(id)">
                <font-awesome-icon :icon="completed ? 'fa-regular fa-circle-check' : 'fa-regular fa-circle'"/>
            </button>
            <span :class="{strikethrough: completed, italic: err}">{{ text }}</span>
            <div class="ms-auto d-flex align-items-center justify-content-center initials" v-if="!hasAvatar">
                {{ initials }}
            </div>
            <img class="ms-auto d-flex align-items-center avatar" v-if="hasAvatar" :src="user.avatar"/>
            <button type="button" class="btn filter-button" @click="deleteTodo(id)">
                <font-awesome-icon icon="fa-solid fa-xmark" />
            </button>
        </article>
    </li>
</template>

<style scoped>
    li {
        height: 4rem;
        overflow: hidden;
        padding: 0.5rem;
        color: #274c77;
    }

    article{
        background-color: #e7ecef;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .btn {
        color: #274c77;
        border: none;
        border-radius: 0;
    }

    .strikethrough {
        text-decoration: line-through;
    }

    .italic {
        font-style: italic;
    }

    .initials, .avatar {
        border-radius: 50%;
        background-color: #274c77;
        border-width: 1px;
        border-color: #e7ecef;
        color: #e7ecef;
        width: 2rem;
        height: 2rem;
        min-width: 2rem;
    }
</style>

<script>
    export default {
        props: {
            id: String,
            completed: Boolean,
            err: Boolean,
            text: String,
            user: Object
        },
        methods:{
            toggleTodo(id){
                this.$emit("toggleTodo", id);
            },
            deleteTodo(id){
                this.$emit("deleteTodo", id);
            }
        },
        computed:{
            initials(){
                if (this.user == undefined || this.user.name == undefined) 
                    return "?";
                let matches = this.user.name.match(/\b(\w)/g);
                let acronym = matches.join('').slice(0, 2);
                return acronym;
            },
            hasAvatar(){
                return this.user != undefined && this.user.avatar != undefined && this.user.avatar != "";
            }
        }
    }
</script>