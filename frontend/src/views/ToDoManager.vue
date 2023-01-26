<template>
    <main class="p-0 m-0 d-flex flex-column panel">
        <header>
            <div class="row align-items-start info-area">
                <div class="col-auto tcompleted ttext">{{nOfcompletedTodos}}</div>
                <div class="col">
                    <div class="row tlabel ttext">TODOs</div>
                    <div class="row ttotal ttext">/ {{nOfTodos}}</div>
                </div>
            </div>
            <div class="row d-flex justify-content-end add-area">
                <button type="button" class="btn btn-primary add" data-bs-toggle="modal" data-bs-target="#todomodal">
                    <font-awesome-icon icon="fa-solid fa-plus" />
                </button>
            </div>
            <div class="row d-flex justify-content-start align-items-center filters-area m-0">
                <button type="button" class="btn filter-button" :class="{selected: (this.filter == 0)}" @click="onShowAll">
                    <font-awesome-icon icon="fa-solid fa-list-ul"/>
                </button>
                <button type="button" class="btn filter-button" :class="{selected: (this.filter == 1)}" @click="onShowIncompleted">
                    <font-awesome-icon icon="fa-regular fa-circle"/>
                </button>
                <button type="button" class="btn filter-button" :class="{selected: (this.filter == 2)}" @click="onShowCompleted">
                    <font-awesome-icon icon="fa-regular fa-circle-check"/>
                </button>
                <button type="button" class="btn filter-button" @click="onShareClick">
                    <font-awesome-icon icon="fa-solid fa-share-nodes" />
                </button>
            </div>
        </header>
        <section class="h-100">
            <ul class="tasks d-flex flex-column m-0">
                <ToDo v-for="todo in todos" v-bind="todo" @toggleTodo="onToggleTodo" @deleteTodo="onDeleteTodo"/>
            </ul>
        </section>
        <ToDoModal id="todomodal" title="Enter new TODO task" ariaTitle="New TODO task" placeholder="Take the trash" @save="onNewTodo"/>
        <ToDoModal id="usermodal" title="First time? Please enter your name" ariaTitle="Please enter your name" placeholder="John Doe" :hideCancel="true" @save="onNewUser"/>
    </main>
</template>

<style scoped>
    .panel {
        width: 80vw;
        height: 80vh;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    header {
        background-color: #e7ecef;
        color: #274c77;
        font-family: "Roboto Flex";
    }

    .info-area {
        height: 8rem;
        padding: 2rem;
        border-bottom: 1px #274c77 solid;
    }

    .ttext {
        vertical-align: text-top;
    }
    header .tcompleted{
        font-size: 5rem;
        line-height: 4.3rem;
        font-weight: 500;
    }

    header .tlabel {
        font-size: 2rem;
        line-height: 2rem;
        font-weight: 600;
    }

    header .ttotal{
        font-size: 2rem;
        line-height: 2rem;
    }

    .btn.add {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        margin-top: -1.5rem;
        background-color: #6096ba;
        border-color: #6096ba;
    }

    .add-area {
        padding-right: 2rem;
        height: 0;
    }

    .filters-area {
        background-color: #e7ecef;
        height: 3rem;
        padding-left: 1rem;
        border-bottom: 1px #274c77 solid;
    }

    .filter-button {
        font-size: 1rem;
        width: 3.5rem;
        color: #274c77;
        height: 100%;
        border: none;
        border-radius: 0;
    }

    .filter-button.selected{
        border-bottom: 3px solid #6096ba;
    }

    section {
        background-color: #274c77;
        overflow: auto;
    }

    .tasks {
        list-style-type: none;
        padding: 0.5rem;
    }
</style>
    
<script>
    import ToDoModal from "@/components/ToDoModal.vue"
    import ToDo from "@/components/ToDo.vue"
    
    const wampBaseUri = "com.tocolabdo.";

    export default {
        data() {
            return {
                filter: 0,
                user: null,
                listId: ""
            };
        },
        computed:{
            nOfTodos(){
                return this.$store.getters.getTodos.length;
            },
            nOfcompletedTodos(){
                let todos = this.$store.getters.getTodos;
                return todos.filter(function (t) { return t.completed; }).length;
            },
            todos(){
                let todos = this.$store.getters.getTodos;
                switch (this.filter){
                    case 0:
                        return todos;
                    case 1:
                        return todos.filter(function (t) { return !t.completed; });
                    case 2:
                        return todos.filter(function (t) { return t.completed; });
                }
                
            }
        },
        methods: {
            onShowAll(){
                this.filter = 0;
            },
            onShowIncompleted(){
                this.filter = 1;
            },
            onShowCompleted(){
                this.filter = 2;
            },
            onShareClick(){
                navigator.clipboard.writeText(window.location.origin + "/" + this.listId);
            },
            onNewTodo(modalText) {
                this.$store.dispatch("addTodo", {"listId": this.listId, "id": Date.now().toString(), "timestamp": Date.now(), "text": modalText, "err": false, "user": this.user});
            },
            onDeleteTodo(todoId){
                this.$store.dispatch("deleteTodo", {"listId": this.listId, "id": todoId, "err": false});
            },
            onToggleTodo(todoId){
                this.$store.dispatch("toggleTodo", {"listId": this.listId, "id": todoId, "timestamp": Date.now(), "user": this.user, "err": false});
            },
            onNewUser(modalText) {
                if (modalText == "") return;
                const modal = document.getElementById("usermodal");
                const backdrop = document.querySelector('.modal-backdrop.fade.show');
                modal.setAttribute('aria-hidden', 'true');
                backdrop.classList.remove('show');
                setTimeout(() => {
                    modal.classList.remove('show');
                    document.body.classList.remove("modal-open");
                });

                setTimeout(() => {
                    modal.style.display = 'none';
                    backdrop.remove();
                }, 500);

                localStorage.setItem("user", JSON.stringify({"name": modalText, "avatar":""}));
                this.username = modalText;
            }
        },
        components: {
            ToDo,
            ToDoModal
        },
        mounted(){
            let user = JSON.parse(localStorage.getItem("user"));
            if (user == null){
                const modal = document.getElementById("usermodal");
                const backdrop = document.createElement("div");
                backdrop.classList.add("modal-backdrop", "fade");
                document.body.classList.add("modal-open");
                document.body.appendChild(backdrop);
                modal.style.display = "block";
                modal.setAttribute("aria-hidden", "false", "show");

                setTimeout(() => {
                    modal.classList.add("show");
                    backdrop.classList.add("show");
                });
            }

            let listId = window.location.pathname.replace(/\//g,'');
            if (listId == "")
                listId = localStorage.getItem("lastListId");
            if (listId == "")
                listId = Date.now().toString();
            
            localStorage.setItem("lastListId", listId)
            this.$store.dispatch("loadTodos", listId);

            this.listId = listId;
            this.user = user;

            var store = this.$store;
            var onComTodoAdded = function(args){
                store.dispatch("colabAddTodo", args);
            };
            var onComTodoDeleted = function(args){
                store.dispatch("colabRemoveTodo", args);
            };
            var onComTodoModified = function(args){
                store.dispatch("colabModifyTodo", args);
            };

            // If connection to Wamp server is already established subscribe to events immediatelly
            if (this.$wamp.session.isOpen){
                this.$wamp.session.subscribe(wampBaseUri + listId + ".todoAdded", onComTodoAdded);
                this.$wamp.session.subscribe(wampBaseUri + listId + ".todoDeleted", onComTodoDeleted);
                this.$wamp.session.subscribe(wampBaseUri + listId + ".todoModified", onComTodoModified);
            }

            // When connection to Wamp server is re-established subscribe to events again
            this.$wamp.onopen = function (session){
                console.log("Connected to Wamp Server!");
                session.subscribe(wampBaseUri + listId + ".todoAdded", onComTodoAdded);
                session.subscribe(wampBaseUri + listId + ".todoDeleted", onComTodoDeleted);
                session.subscribe(wampBaseUri + listId + ".todoModified", onComTodoModified);
            }

            // When connection to Wamp server is lost:
            this.$wamp.onclose = function (reason) {
                console.log("Not connected Wamp Server!", "Reason: (" + reason + ")");
            };
        }
    };
</script>
