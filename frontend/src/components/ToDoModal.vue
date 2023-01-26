<template>
    <div class="modal fade" :id="id" tabindex="-1" :aria-labelledby="ariaLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{title}}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" v-if="!hideCancel"></button>
                </div>
                <div class="modal-body">
                    <input class="todo-input" type="text" :placeholder="placeholder" v-model="text" autofocus/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancel" v-if="!hideCancel">Cancel</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="save">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .todo-input {
        width: 100%;
        padding: 0.5rem;
        font-size: 1rem;
        outline: none;
        border-radius: 0.25rem;
        border-style: none;
        border: solid 1px lightgray;
        box-sizing: border-box;
    }

    .todo-input::placeholder {
        font-style: italic;
    }
</style>
<script>
    export default {
        data() {
            return {
                text: ""
            }
        },
        props: {
            title: String,
            ariaLabel: String,
            id: String,
            placeholder: String,
            hideCancel: Boolean
        },
        methods:{
            save(){
                this.$emit("save", this.text);
                this.text = "";
            },
            cancel(){
                this.$emit("cancel");
            }
        }
    }
</script>