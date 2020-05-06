import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'; 

import TodoItems from './TodoItems'; 
import TodoItem from './TodoItem'; 
import TodoForm from "./TodoForm"; 
import Spinner from "./Spinner"; 
import ErrorMessage from "./ErrorMessage"; 



class TodoApp extends React.Component { 
    constructor(props){
        super(props); 
        this.state = {
            todoItems: [], 
            hideCompletedToDoItems: false,
            isLoading: true,
            errorMessage: null
        };
        this.getTodoItems = this.getTodoItems.bind(this); 
        this.createTodoItem = this.createTodoItem.bind(this); 
        this.toggleCompletedTodoItems = this.toggleCompletedTodoItems.bind(this); 
        this.handlesErrors = this.handlesErrors.bind(this)
        this.clearErrors = this.clearErrors.bind(this)
    }
    componentDidMount(){
        this.getTodoItems(); 
    }

    handlesErrors(errorMessage){ 
        this.setState({errorMessage});
    }

    clearErrors() { 
        this.setState({
            errorMessage : null
        });
    }
    getTodoItems() { 
        axios 
            .get("/api/v1/todo_items")
            .then(response => {
                this.clearErrors(); 
                this.setState({isLoading: true}); 
                const todoItems = response.data; 
                this.setState({ todoItems, }); 
                this.setState({isLoading: false}); 
            })
            .catch(error => {
                this.setState({isLoading: true});
                this.setState({
                    errorMessage: {
                        message: "there was an error loading your  todo items..."
                    }
                });
                console.log(error)

            }); 

    }

    createTodoItem(todoItem) {
        const todoItems = [todoItem, ...this.state.todoItems]; 
        this.setState({todoItems}); 
    }

    toggleCompletedTodoItems(){ 
        this.setState({
            hideCompletedTodoItems: !this.state.hideCompletedTodoItems
        });
    }
    render() {
       
        console.log(this.state.todoItems)
        return (

            <div>
                {this.state.errorMessage && (
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                )}
                {!this.state.isLoading && (
                    <div>
            <TodoForm 
            createTodoItem = {this.createTodoItem} 
            handlesErrors = {this.handlesErrors}
            clearErrors = {this.clearErrors}
            />
            <TodoItems
                toggleCompletedTodoItems = {this.toggleCompletedTodoItems}
                hideCompletedTodoItems = {this.hideCompletedTodoItems}
             >
                {this.state.todoItems.map(todoItem => (
                    <TodoItem key={todoItem.id} 
                    todoItem={todoItem}
                    getTodoItems = {this.getTodoItems}
                    hideCompletedTodoItems = {this.state.hideCompletedTodoItems}
                    handlesErrors = {this.handlesErrors}
                    clearErrors = {this.clearErrors}
                    
                />
                ))}
            </TodoItems>
            </div>
                )}
                {this.state.isLoading && <Spinner/>}
                </div>
        ); 
    }
}

document.addEventListener('turbolinks:load', () => {
    const app = document.getElementById('todo-app')
    app && ReactDOM.render(<TodoApp/>, app)
})