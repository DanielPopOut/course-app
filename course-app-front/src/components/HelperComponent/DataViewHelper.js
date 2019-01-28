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
            <div className={"element-view-block"}>
                {
                    Object.keys(this.state.dataToDisplay).map((elt,key)=>{
                     return(
                         <div  key={key} className={"element-view-row"}>
                             <div className={"element-view-row-label"}> {elt}</div>
                             <div className={"element-view-row-value"}> {this.state.dataToDisplay[elt]}</div>
                         </div>
                     );
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