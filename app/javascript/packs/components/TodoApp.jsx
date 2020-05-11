import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'; 
import _ from "lodash"; 
import TodoItems from './TodoItems'; 
import TodoItem from './TodoItem'; 
import TodoForm from "./TodoForm"; 
import Spinner from "./Spinner"; 
import ErrorMessage from "./ErrorMessage"; 
import CalendarApp from './HeatMap'
import setAxiosHeaders from './AxiosHeaders'
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';


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
            loggedToHeatMap: false,
            userCreated: 0,
            userDataId: 0,
            strippedHeatMap: [],

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
        this.getUserCreated = this.getUserCreated.bind(this)
        
        
        
    }

    componentWillMount(){
        this.getUserCreated(); 
    }
    componentDidMount(){
        
        this.getTodoItems(); 
        
        this.getHeatMap(); 
        
        
    }

    handlesErrors(errorMessage){ 
        this.setState({errorMessage});
    }

    checkIfDone(){
        let dailyCompleteNum = this.state.dailyComplete
        let goalCountNum = this.state.goalCount 
        let val; 
    if (dailyCompleteNum === goalCountNum)
        {
            
            val = true
        }
        else 
        {

          
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

    

    logToHeatMap() {
                // get date
           // if (this.state.loggedToHeatMap){
                //console.log("YOU ALREADY REACHED UR GOAL")
                //return; 
           // }
            let dates = new  Date().toISOString().slice(0, 10); 
            let counts = this.state.dailyComplete; 

            // need to get users create_at --> so make get request to api/v1/users .
            // with this request / extract create_at
            // make request to api/v1/calendar and get all objects with
            // get those items and store in calendar
            // 
           
            setAxiosHeaders(); 
            const today = new Date(); 
            axios 
                .put(`api/v1/calendars/${this.state.userDataId}`, {
                    calendar: {
                        date_today: today,
                        count: this.state.dailyComplete,
                        id: this.state.userDataId,
                       
                    }
                })
                .then (response => { 
                    this.clearErrors(); 
                
                })
                .catch(error => {
                    this.handlesErrors(error); 
                });
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
       

        for (i; i< items.length; i++)
        {
          
            if (items[i].complete)
            {
                
                count = count + 1
             
            }
        } 
        this.setState({dailyComplete: count})
        this.checkIfDone(); 

    }

    getTodoItems() { 
        axios 
            .get("/api/v1/todo_items")
            .then(response => {
                
                this.clearErrors(); 
                this.setState({isLoading: true}); 
                const todoItems = response.data; 
          
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
        console.log("WE are inside of get heat map")
        axios
            .get(`api/v1/calendars`)
            .then(response => {
               
                this.clearErrors(); 
                this.setState({isLoading: true})
                const heatMap = response.data
                console.log("THESE ARE THE VALUES OF THE RESPONSE FOR GET HEAT MAP")
                console.log(response.data)
                this.setState({heatMap,}, () => {
                    console.log(this.state.heatMap)
                })
                console.log("THAT WAS HEAT MAP ^")
                console.log(response.data)
                let strippedHeatMap = []
                heatMap.forEach(e => {
                    let element = new Object(); 
                    element.date = e.date_today; 
                    element.count = e.count;
                    strippedHeatMap.push(element) 
                })

                this.setState({strippedHeatMap,})
                this.setState({heatMap,})
                console.log("THE VALUE OF STATE HEATMAP IS: ")
                console.log(this.state.todoItems)
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
            const userDataId = response.data.id
            console.log("This here is the response")
            this.setState({userDataId: userDataId});

            
            
            const userCreated = response.data.created_at
            this.setState({userCreated: userCreated}, ()=>{
                console.log(this.state.userCreated)
            })
            console.log("And that was the this.state.userCreated^")
            //this.getHeatMap(); 
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
        console.log("The values of heatmap are")
        console.log(this.state.heatMap)
        console.log("The values of userCreated are")
        console.log(this.state.userCreated)
        const today = new Date(); 
        
        return (

            <div>
                {this.state.errorMessage && (
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                )}

            
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

                            
                    <h1>react-calendar-heatmap demos</h1>
                    <p>Random values with onClick and react-tooltip</p>
                    
                    <CalendarHeatmap
                        startDate={this.state.startDate}
                        endDate={today}
                        values={this.state.strippedHeatMap}
                        classForValue={value => {
                        if (!value) {
                            return 'color-empty';
                        }
                        return `color-github-${value.count}`;
                        }}
                        tooltipDataAttrs={value=> {
                        return {
                            'data-tip': `I has count: ${
                            value.count
                            }`,
                        };
                        }}
                        showWeekdayLabels={true}
                        onClick={value => alert(`Clicked on value with count: ${value.count}`)}
                    />
                    <ReactTooltip />
                   



            
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