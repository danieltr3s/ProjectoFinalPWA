import todosService from "@/api/todos.service.js";

export const state = {
    todos: []
};

export const getters = {
    getTodos: state => state.todos
};

export const mutations = {
    ADD_TODO: (state, payload) => {
        const item = state.todos.find(todo => todo.id === payload.id && todo.listId === payload.listId);
        if (item) return;
        const newTask = {
            id: payload.id,
            listId: payload.listId,
            timestamp: payload.timestamp,
            text: payload.text,
            user: payload.user,
            err: payload.err,
            completed: false
        };
        state.todos.unshift(newTask);
    },
    EDIT_TODO: (state, payload) => {
        const item = state.todos.find(todo => todo.id === payload.id && todo.listId === payload.listId);
        item.text = payload.text;
        item.timestamp = payload.timestamp;
        item.user.name = payload.user.name;
        item.user.avatar = payload.user.avatar;
        item.completed = payload.completed;
        item.err = payload.err;
    },
    TOGGLE_TODO: (state, payload) => {
        const item = state.todos.find(todo => todo.id === payload.id && todo.listId === payload.listId);
        item.timestamp = payload.timestamp;
        item.user.name = payload.user.name;
        item.user.avatar = payload.user.avatar;
        item.err = payload.err;
        item.completed = !item.completed;
    },
    DELETE_TODO: (state, payload) => {
        const index = state.todos.findIndex(todo => todo.id === payload.id && todo.listId === payload.listId);
        if (index < 0 ) return;
        state.todos.splice(index, 1);
    },
    SET_LIST: (state, todoList) => {
        state.todos = todoList;
    },
    LOAD_LOCAL_LIST: (state, listId) => {
        let knownListId = localStorage.getItem("lastListId");
        if (knownListId == listId){
            let todosCache = localStorage.getItem("TODOS");
            if (todosCache) {
                let todos = JSON.parse(todosCache);
                let tmpCache = todos.concat([]);
                for(const todo of todos){
                    if (todo.listId != listId)
                        tmpCache.splice(tmpCache.indexOf(todo), 1);
                }
                state.todos = tmpCache;
            }
        }
    },
    MERGE_LOCAL_LIST: (state, payload) => {
        let knownListId = localStorage.getItem("lastListId");
        if (payload && payload[0].listId == knownListId){
            let todosCache = localStorage.getItem("TODOS");
            if (todosCache && payload) {
                let localCache = JSON.parse(todosCache);
                let tmpCache = localCache.concat([]);
                let tmpServer = payload.concat([]);

                for(const cachedTodo of localCache){
                    for(const serverTodo of payload){
                        if (serverTodo.id == cachedTodo.id && serverTodo.timestamp < cachedTodo.timestamp)
                            tmpServer.splice(tmpServer.indexOf(serverTodo), 1);
                        else if (knownListId != cachedTodo.listId || serverTodo.id == cachedTodo.id && serverTodo.timestamp >= cachedTodo.timestamp)
                            tmpCache.splice(tmpCache.indexOf(cachedTodo), 1);
                    }
                }

                let mrg = tmpCache.concat(tmpServer);
                state.todos = mrg.reverse();
            }
            else if (payload){
                state.todos = payload;
            }
            else if (todosCache){
                state.todos = JSON.parse(todosCache);
            }
        }
    },
    SAVE_LOCAL_LIST: (state) => {
        localStorage.setItem("TODOS", JSON.stringify(state.todos));
    }
};

export const actions = {
    loadTodos: (context, listId) => {
        return new Promise((resolve, reject) => {
            todosService.getTodos(listId)
                .then(
                    res => {
                        if(res)
                            context.commit("MERGE_LOCAL_LIST", res);
                        else
                            context.commit("LOAD_LOCAL_LIST", listId);
                        resolve(res)
                    },
                    err => {
                        context.commit("LOAD_LOCAL_LIST", listId);
                        reject(err)
                    }
                );
        });
    },
    addTodo: (context, payload) => {
        return new Promise((resolve, reject) => {
            todosService.addTodo(payload)
                .then(
                    res => {
                        payload.err = false;
                        resolve(res)
                    },
                    err => {
                        payload.err = true;
                        reject(err)
                    }
                )
                .finally(() => {
                    context.commit("ADD_TODO", payload);
                    context.commit("SAVE_LOCAL_LIST");
                });
        });
    },
    toggleTodo: (context, payload) => {
        return new Promise((resolve, reject) => {
            todosService.toggleTodo(payload)
                .then(
                    res => {
                        context.commit("EDIT_TODO", res);
                        resolve(res)
                    },
                    err => {
                        payload.err = true;
                        context.commit("TOGGLE_TODO", payload);
                        reject(err)
                    }
                )
                .finally(() => {
                    context.commit("SAVE_LOCAL_LIST");
                });
        });
    },
    deleteTodo: (context, payload) => {
        return new Promise((resolve, reject) => {
            todosService.deleteTodo(payload.listId, payload.id)
                .then(
                    res => {
                        resolve(res)
                    },
                    err => {
                        reject(err)
                    }
                )
                .finally(() => {
                    context.commit("DELETE_TODO", payload);
                    context.commit("SAVE_LOCAL_LIST");
                });
        });
    },
    editTodo: (context, payload) => {
        context.commit("EDIT_TODO", payload);
        context.commit("SAVE_LOCAL_LIST");
    },

    colabAddTodo: (context, payload) => {
        context.commit("ADD_TODO", payload);
        context.commit("SAVE_LOCAL_LIST");
    },
    colabRemoveTodo: (context, payload) => {
        context.commit("DELETE_TODO", payload);
        context.commit("SAVE_LOCAL_LIST");
    },
    colabModifyTodo: (context, payload) => {
        context.commit("EDIT_TODO", payload);
        context.commit("SAVE_LOCAL_LIST");
    },
};