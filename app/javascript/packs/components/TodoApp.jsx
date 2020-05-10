import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'; 

import TodoItems from './TodoItems'; 
import TodoItem from './TodoItem'; 
import TodoForm from "./TodoForm"; 
import Spinner from "./Spinner"; 
import ErrorMessage from "./ErrorMessage"; 
import CalendarApp from './HeatMap'



class TodoApp extends React.Component { 
    constructor(props){
        super(props); 
        this.state = {
            todoItems: [], 
            heatMap: [], 
            hideCompletedToDoItems: false,
            isLoading: true,
            errorMessage: null,
            goalCount: 0,
            dailyComplete: 0,
            completedGoal: false,
            loggedToHeatMap: false
        };
        this.getTodoItems = this.getTodoItems.bind(this); 
        this.createTodoItem = this.createTodoItem.bind(this); 
        this.toggleCompletedTodoItems = this.toggleCompletedTodoItems.bind(this); 
        this.handlesErrors = this.handlesErrors.bind(this)
        this.clearErrors = this.clearErrors.bind(this)
        this.updateDailyComplete = this.updateDailyComplete.bind(this)
        this.checkIfDone = this.checkIfDone.bind(this)
        this.logToHeatMap = this.logToHeatMap.bind(this)
        this.createHeatMapItem = this.createHeatMapItem.bind(this)
        this.getEndDate = this.getEndDate.bind(this)
        this.getHeatMap = this.getHeatMap.bind(this); 
        
    }
    componentDidMount(){
        this.getTodoItems(); 
        this.getHeatMap(); 
        
    }

    handlesErrors(errorMessage){ 
        this.setState({errorMessage});
    }

    checkIfDone(){
        console.log("In checkifDone")
        let dailyCompleteNum = this.state.dailyComplete
        let goalCountNum = this.state.goalCount 
        let val; 
    if (dailyCompleteNum === goalCountNum)
        {
            
            console.log("value of this.state.dailyComplete is"  + dailyCompleteNum)
            console.log("Value of goal count is " + goalCountNum)
            console.log("Setting goal complete to true")
            val = true
        }
        else 
        {

            console.log("value of this.state.dailyComplete is " + dailyCompleteNum)
            console.log("Value of goal count is " + goalCountNum)
            console.log("Setting value of goalcomplete to false")
            val = false
        }
        this.setState({goalComplete: val})
        if (val){
            this.logToHeatMap();
        }

    }

    clearErrors() { 
        this.setState({
            errorMessage : null
        });
    }

    

    logToHeatMap(){ 
                // get date
            if (this.state.loggedToHeatMap){
                console.log("YOU ALREADY REACHED UR GOAL")
                return; 
            }
            let dates = new  Date().toISOString().slice(0, 10); 
            let counts = this.state.dailyComplete; 
            let heatMapItem = new Object(); 
            heatMapItem.date=dates
            heatMapItem.count = counts
            console.log("This is the value of heatMapItem in logtoheatmap: ")

            console.log(heatMapItem)
            this.createHeatMapItem(heatMapItem);
                
            
        // get count
        // get date  
        // format 
        
    }

    updateDailyComplete(item, initial=0){
        let count = initial
        let cur = this.state.dailyComplete
        if (item)
        {
            count = cur - 1
        }
        else
        {
            count = cur + 1
        }
        this.setState({dailyComplete: count})

        this.checkIfDone();
    }

    initializeDailyGoal(items){ 
        let count = 0
        let i = 0
        console.log("there are this many items in items: " + items.length)

        for (i; i< items.length; i++)
        {
            console.log("Value of item.complete is: " + items[i].complete)
            if (items[i].complete)
            {
                
                count = count + 1
                console.log("Updating count by 1, count is current: " +  count)
            }
        } 
        this.setState({dailyComplete: count})
        this.checkIfDone(); 

    }

    getTodoItems() { 
        axios 
            .get("/api/v1/todo_items")
            .then(response => {
                console.log('get to do items has been called')
                this.clearErrors(); 
                this.setState({isLoading: true}); 
                const todoItems = response.data; 
                console.log(response.data)
                this.setState({ todoItems, }); 
                this.setState({goalCount: todoItems.length});
                this.initializeDailyGoal(this.state.todoItems); 
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

    getHeatMap(){ 
        axios
            .get("api/v1/calendars")
            .then(response => {
                console.log("get heat map has been called")
                this.clearErrors(); 
                this.setState({isLoading: true})
                const heatMap  = response.data; 
                console.log(response.data)
                this.setState({heatMap,})
                console.log("THE VALUE OF STATE HEATMAP IS: ")
                console.log(this.state.heatMap)
                this.setState({isLoading: false});
            })
            .catch (error => {
                this.setState({isLoading: true})
                this.setState({
                    errorMessage: {
                        message: "There was an error message while loading getHeatMap..."
                    }
                })
                console.log(error)
            }); 
    }

    getUserCreated() { 
        axios
        .get("api/v1/users")
        .then(response => {
            console.log("Get user created has been called!")
            this.clearErrors(); 
            this.setState({isLoading: true})
            const UserData = response.data
            console.log(response.data)
            this.setState({isLoading: false}); 
        })
        .catch (error => {
            this.setState({isLoading: true})
            this.setState({
                errorMessage: {
                    message: "There was an error message while loading getUserCreated..."
                }
            })
            console.log(error)
        });
    }

    createHeatMapItem(data){
        console.log("Data is : " )
        console.log(data)
        // make a post request to calendar endpoint
        // make a get request to calendar enpoing
        
        const heatMap = [data, ...this.state.heatMap]; 
        this.setState({heatMap,})
        this.setState({loggedToHeatMap: true})
        console.log("Added a heatmap item to state")
        console.log("value of heatmap data is: ")
        console.log(this.state.heatMap)
        console.log("value of loggedToheatmap" + this.state.loggedToHeatMap); 
        
       

    }

    getEndDate(){
        let endDate =  new  Date().toISOString().slice(0, 10);
        return endDate
        
    }

    createTodoItem(todoItem) {
        const todoItems = [todoItem, ...this.state.todoItems]; 
        this.setState({todoItems, goalCount: todoItems.length}); 
        console.log("In create todo item")
        this.checkIfDone(); 
    }

    toggleCompletedTodoItems(){ 
        this.setState({
            hideCompletedTodoItems: !this.state.hideCompletedTodoItems
        });
        
    }
    render() {
        
        return (

            <div>
                {this.state.errorMessage && (
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                )}

                <CalendarApp/>
                {!this.state.isLoading && (
                    <div>
                    <div>
                    {this.state.goalComplete
                        ? <h1>absolute sav</h1>
                         : <h1>Day is not over yet!</h1>
                }
                    </div>

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
                    updateDailyComplete = {this.updateDailyComplete}
                    checkIfDone = {this.checkIfDone}
                    
                    
                />
                ))}
            </TodoItems>
            {this.state.goalCount}
            {this.state.dailyComplete}
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