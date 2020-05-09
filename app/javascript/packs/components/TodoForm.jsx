import React from 'react'
import PropTypes from 'prop-types'

import axios from 'axios'
import setAxiosHeaders from './AxiosHeaders'; 

class TodoForm extends React.Component {
    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.titleRef = React.createRef()
        this.colorRef = React.createRef()
    }

    handleSubmit(e) {
        e.preventDefault()
        setAxiosHeaders(); 
        console.log("Value of post request: ")
        console.log(this.colorRef.current.value)
        axios
            .post('/api/v1/todo_items', {
                todo_item: {
                    title: this.titleRef.current.value, 
                    complete: false, 
                    color: this.colorRef.current.value
                },

            })
            .then(response=> {
                const todoItem = response.data
                this.props.createTodoItem(todoItem)
                console.log("And this is the value the post request returns: ")
                console.log(todoItem)
                this.props.clearErrors();  
            })
            .catch(error => {
                this.props.handlesErrors(error); 
            })
        e.target.reset()
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit} className="my-3">
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <input 
                            type="text"
                            name="title"
                            ref={this.titleRef}
                            required
                            className="form-control"
                            id="title"
                            placeholder="Write your todo item here..."
                        />
                    </div> 
                    <div className="form-group col-md-2">
                        <select id="color" name="color" ref = {this.colorRef}className = "form-control" require>
                                <option value= "0">Volvo</option>
                                <option value="1">Saab</option>
                                <option value="2">Fiat</option>
                                <option value="3">Audi</option>
                        </select>
               
                    </div>
                    <div className="form-group col-md-4">
                        <button className="btn btn-outline-success btn-block">
                            Add To Do Item
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

export default TodoForm 

TodoForm.propTypes = {
    createTodoItem: PropTypes.func.isRequired,
    handlesErrors: PropTypes.func.isRequired, 
    clearErrors: PropTypes.func.isRequired
}