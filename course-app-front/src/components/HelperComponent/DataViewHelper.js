import React,{Component} from 'react';
import './dataviewhelper.css';


class DataViewList extends Component{
    render(){
        return("");
    }
}
export class DataViewElement extends Component{
    constructor(props){
        super(props);
        this.state={
            dataToDisplay:this.props.data
        }
    }
    render(){
        return(
            <div>
                {
                    Object.keys(this.state.dataToDisplay).forEach((key)=>{
                    return(  <div> {key} : {this.state.dataToDisplay[key]}</div>)  ;
                    })
                }
            </div>
        );
    }
}

export default class DataViewHelper extends Component{
    render(){
        return(
            <div>
                Collaborators
            </div>
        );
    }
}