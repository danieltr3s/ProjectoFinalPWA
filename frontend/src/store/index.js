import Vuex from "vuex";
import * as todos from "@/store/modules/todos.module.js";

export default new Vuex.Store({
    state: todos.state,
    getters: todos.getters,
    mutations: todos.mutations,
    actions: todos.actions
});