import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'; 

import TodoItems from './TodoItems'; 
import TodoItem from './TodoItem'; 
import TodoForm from "./TodoForm"; 
import Spinner from "./Spinner"; 



class TodoApp extends React.Component { 
    constructor(props){
        super(props); 
        this.state = {
            todoItems: [], 
            hideCompletedToDoItems: false
            isLoading: true; 
        };
        this.getTodoItems = this.getTodoItems.bind(this); 
        this.createTodoItem = this.createTodoItem.bind(this); 
        this.toggleCompletedTodoItems = this.toggleCompletedTodoItems.bind(this); 
    }
    componentDidMount(){
        this.getTodoItems(); 
    }
    getTodoItems() { 
        axios 
            .get("/api/v1/todo_items")
            .then(response => {
                this.setState({isLoading: true}); 
                const todoItems = response.data; 
                this.setState({ todoItems, }); 
                this.setState({isLoading: false}); 
            })
            .catch(error => {
                this.setState({isLoading: true});
                console.log(error)

            }); 

    }

    createTodoItem(todoItem) {
        const todoItems = [todoItem, ...this.state.todoItems]; 
        this.setState({todoItems}); 
    }

    toggleCompletedTodoItems(){ 
        this.setState({
            hideCompletedToDoItems: !this.state.hideCompletedToDoItems
        });
    }
    render() {
       
        console.log(this.state.todoItems)
        return (
            <div>
                {!this.state.isLoading && (
                    <div>
            <TodoForm createTodoItem = {createTodoItem} />
            <TodoItems
                toggleCompletedTodoItems = {this.toggleCompletedTodoItems}
                hideCompletedToDoItems = {this.hideCompletedToDoItems}
             >
                {this.state.todoItems.map(todoItem => (
                    <TodoItem key={todoItem.id} 
                    todoItem={todoItem}
                    getTodoItems = {this.getTodoItems}
                    hideCompletedToDoItems = {this.state.hideCompletedToDoItems}
                    
                />
                ))}
            </TodoItems>
                )}
                </div>
                {this.state.isLoading && <Spinner/>}
                </div>
        ); 
    }
}

document.addEventListener('turbolinks:load', () => {
    const app = document.getElementById('todo-app')
    app && ReactDOM.render(<TodoApp/>, app)
})