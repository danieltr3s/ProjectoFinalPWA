import API_URL from './config.js'

export const todosService = {
    async getTodos(listId) {
        console.log(API_URL);
        let response = await fetch(`${API_URL}/api/${listId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json();
        }
    },

    async addTodo(todo) {
        const response = await fetch(`${API_URL}/api/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        });
        if (response.ok) {
            return await response.json();
        }
    },

    async editTodo(todo) {
        const response = await fetch(`${API_URL}/api/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        });
        if (response.ok) {
            return await response.json();
        }
    },

    async toggleTodo(todo) {
        const response = await fetch(`${API_URL}/api/toggle`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        });
        if (response.ok) {
            return await response.json();
        }
    },

    async deleteTodo(listId, id) {
        const response = await fetch(`${API_URL}/api/${listId}/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    async saveTodos(listId, todos) {
        const response = await fetch(`${API_URL}/api/${listId}/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todos)
        });
    }
};

export default todosService;