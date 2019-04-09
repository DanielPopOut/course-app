import React,{Component} from "react";
import "./departments.css";
import departmentsModel from "../DataManagerComponent/DataModelsComponent";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";


class OneDepartment extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

}





class Departments extends Component{
    constructor(props){
        super(props);
        this.state={
            modalChildren:"",
            modalVisibility:false
        }
    }

    saveNewDepartment(){

    }
    openModal(content){
        this.setState({
            modalChildren:content,
            modalVisibility:true
        });
    }

    modalClose(){
        this.setState({
            modalChildren:"",
            modalVisibility:false
        });
    }

    render(){
        return(
            <div>
                <ModalComponent visible={this.state.modalVisibility} onClose={()=>this.modalClose()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <h2>Departments</h2>


            </div>
        )
    }
}


export default Departments;


