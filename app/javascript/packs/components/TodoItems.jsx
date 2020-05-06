import React from 'react'

class TodoItems extends React.Component {
    constructor(props) {
        super(props)
    }

    render(){
        return(
            <div>
            <div className="table-responsive">
                <table className="table">
                    <thread>
                        <tr>
                            <th scope="col">Status</th>
                            <th scope="col">Item</th>
                            <th scope="col" className="text-right">
                                Actions
                            </th>
                        </tr>
                    </thread>
                    <tbody>{this.props.children}</tbody>
                </table>
            </div>
        </div>
        )
    }
}

export default TodoItems
