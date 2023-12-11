// seleção de elementos
const todoForm = document.querySelector('#todo-form')
const todoInput = document.querySelector('#todo-input')
const todoLista = document.querySelector('#todo-list')
const editForm = document.querySelector('#edit-form')
const editInput = document.querySelector('#edit-input')
const cancelarBTN= document.querySelector('#cancel-btn')
const searchInput= document.querySelector('#search-input')
const eraseBtn= document.querySelector('#erase-button')
const filterBtn= document.querySelector('#filter-select')


let oldInputValue;

// funções

// Salvar
const saveTodo = (text, done = 0, save = 1) => {
    
    const todo = document.createElement("div")
    todo.classList.add('todo')

    const todoTitle = document.createElement('h3')
    todoTitle.innerText = text
    todo.appendChild(todoTitle)

    const doneBtn =  document.createElement('button')
    doneBtn.classList.add('finish-todo')
    doneBtn.innerHTML = '<i class="bi bi-check-lg"></i>'
    todo.appendChild(doneBtn)

    const editBtn = document.createElement('button')
    editBtn.classList.add('edit-todo')
    editBtn.innerHTML = '<i class="bi bi-pencil-fill"></i>'
    todo.appendChild(editBtn)

    const removeBtn = document.createElement('button')
    removeBtn.classList.add('remove-todo')
    removeBtn.innerHTML = '<i class="bi bi-x-lg"></i>'
    todo.appendChild(removeBtn)

    // Utilizando Local Storagy
    if (done) {
        todo.classList.add("done")
    }

    if (save) {
        saveTodoLocalStoragy({text, done: 0})
    }

    todoLista.appendChild(todo)

    todoInput.value = ""
    todoInput.focus()
}


const toggleForms = () => {
    editForm.classList.toggle('hide')
    todoForm.classList.toggle('hide')
    todoLista.classList.toggle('hide')
}

// Recarregar
const uploadTodo = (text) => {
    const todos = document.querySelectorAll('.todo')
    todos.forEach((todo) => {
        
        let todoTitle = todo.querySelector('h3')

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text

            updateTodoLocalStoragy(oldInputValue, text);
        }

    });
}

// Pesquisar
const getSearchTodos = (search) => {

    const todos = document.querySelectorAll('.todo')

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('h3').innerText.toLocaleLowerCase();
        
        const normalSearch = search.toLocaleLowerCase();

        todo.style.display = "flex"

        if (!todoTitle.includes(normalSearch)) {
            todo.style.display = "none"
        }
            
    });

}

// Filtrar
const filterTodos = (filterValue) => {

    const todos = document.querySelectorAll(".todo")

    switch(filterValue) {

        case "all":
            todos.forEach((todo) => todo.style.display = "flex")
            break


        case "done":
            todos.forEach((todo) => todo.classList.contains("done") 
            ? (todo.style.display = "flex") 
            : (todo.style.display = "none")
            );
            break

        case "todo":
            todos.forEach((todo) => 
            !todo.classList.contains("done") 
            ? (todo.style.display = "flex") 
            : (todo.style.display = "none")
            );
            break
    }
}


// Eventos 
todoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const inputValue = todoInput.value
    if(inputValue) {
        saveTodo(inputValue)
    }
})

//evento de click do botão 
document.addEventListener('click', (e) =>{

    const targetEl= e.target
    const parentEl = targetEl.closest('div')
    let todoTitle;

    if (parentEl && parentEl.querySelector('h3')) {
        todoTitle = parentEl.querySelector('h3').innerText
    }

    if(targetEl.classList.contains('finish-todo')) {
        parentEl.classList.toggle('done');

        updateTodosStatusLocalStoragy();

    } else if (targetEl.classList.contains('edit-todo')) {
        toggleForms() 
        editInput.value = todoTitle
        oldInputValue = todoTitle

    } else if (targetEl.classList.contains('remove-todo')) {
        parentEl.remove()

        removeTodoLocalStoragy(todoTitle);
    }
})

// Botão de cancelar 
cancelarBTN.addEventListener('click', (e) => {
    e.preventDefault()

    toggleForms()
})

//evento de enviar o formulario
editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if (editInputValue) {
        uploadTodo(editInputValue)
    }

    toggleForms()
})

// evento de busca
searchInput.addEventListener('keyup',(e) => {

    const search = e.target.value

    getSearchTodos(search)

})

//evento de apagar
eraseBtn.addEventListener('click', (e) => {
    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));

});

//evento do comando de filtrar
filterBtn.addEventListener("change", (e) => {

    const filterValue = e.target.value;

    filterTodos(filterValue);
});

// Local storage

const getTodoLocalStoragy = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    return todos;
};

const loadTodo = () => {
    const todos = getTodoLocalStoragy();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    });
};

// Salvar no local Storage
const saveTodoLocalStoragy = (todo) => {

    const todos = getTodoLocalStoragy();

    todos.push(todo);

    localStorage.setItem('todos', JSON.stringify(todos));
};


// Remover do local Storage
const removeTodoLocalStoragy = (todoText) => {

    const todos = getTodoLocalStoragy();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText)

    localStorage.setItem('todos', JSON.stringify(filteredTodos));
};

// carregar no local Storage
const updateTodosStatusLocalStoragy = (todoText) => {
    const todos = getTodoLocalStoragy();

    todos.map((todo) => 
    todo.text === todoText ? (todo.done = !todo.done) : null)

    localStorage.setItem('todos', JSON.stringify(todos));
}

// Atualizar no local Storage
const updateTodoLocalStoragy = (todoOldText, todoNewText) => {
    const todos = getTodoLocalStoragy();

    todos.map((todo) => 
    todo.text === todoOldText ? (todo.text = todoNewText): null)

    localStorage.setItem('todos', JSON.stringify(todos));
}

loadTodo();