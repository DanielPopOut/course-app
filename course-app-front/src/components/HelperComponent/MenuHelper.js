import React,{Component} from "react";
import "./menuhelper.css";


class MenuHelper extends Component{
    constructor(props){
        super(props);
        this.state={
            items:this.props.items||[]
        }
    }
    displayItem(item,key){
        let menuitemclass="menu-item-div "+this.props.itemClassDiv||"";
        return(
            <div key={key} className={menuitemclass}>
                {item}
            </div>
        );
    }
    render(){
        return(
            <div className={"menu-container "+this.props.menuContainerClass||""}>
                {
                    this.state.items.map((item,key)=>{
                        return this.displayItem(item,key);
                    })
                }
            </div>
        );
    }
}
export default MenuHelper;