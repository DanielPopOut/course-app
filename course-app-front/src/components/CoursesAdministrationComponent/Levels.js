import React,{Component} from "react";
import "./levels.css";
import {levels} from "../DataManagerComponent/DataModelsComponent";
import FormHelper from "../HelperComponent/FormHelper";

class Levels extends Component{
    constructor(props){
        super(props);
        this.state={
            levels:this.props.levels || []
        }
    }

    removeLevel(e,level){
        e.preventDefault();
        this.props.removeLevel(level);
    }

    addLevel(e,level){
        e.preventDefault();
        this.props.addLevel(level);
    }

    displayLevels(){
        return(
            <div  className={"levels-list"}>

                {
                    levels.map((level,key)=>{
                        if(this.props.levels.indexOf(level)>-1){
                            return(
                                <div key={key} className={"unabled-level"} onClick={(e)=>{this.removeLevel(e,level)}}>
                                    {level}
                                    </div>
                            )
                        }else {
                            return(
                                <div key={key} className={"disabled-level"}
                                     onClick={(e)=>{this.addLevel(e,level)}}>
                                    {level}
                                    </div>
                            )
                        }
                    })
                }
            </div>
        )
    }

    render(){
        return(
            <div className={"levels"}>
                <div></div>
                {this.displayLevels()}
            </div>
        );
    }

}


export default Levels;


