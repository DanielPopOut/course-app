import React,{Component} from 'react';
import './users.css';
import {UsersModel} from '../DataManagerComponent/DataModelsComponent'
import FormHelper from '../HelperComponent/FormHelper';
import {ServerService} from "../../server/ServerService";
import {LISTS_PATH} from "../../server/SERVER_CONST";

export class UsersCreationForm extends Component{
    render(){
        return(<FormHelper data={UsersModel} options={{label:''}} registration_path = "newuser"/>);
    }
}

class UsersList extends Component{
    render(){
        let listToShow= this.props.listToShow;
        let fieldsToShow = ["",'Name','Surname','address','contact','email'];

        return (
            <div className={"users-interface-list-block"}>
                <div className={"users-interface-list-block-header"}>
                    <div>
                        {
                            fieldsToShow.map((elt, key) => {
                                return (<div key={key}>{elt}</div>);
                            })
                        }
                    </div>
                </div>
                {
                    listToShow.map((elt, key) => {
                        return (
                            <div key={key} className={"user-list-single-block"}>
                                <div className={"user-list-avatar"}>
                                    <figure>
                                        <img src={"/images/user3_thom1.png"}/>
                                    </figure>
                                </div>

                                <div> {elt.name}</div>
                                <div> {elt.surname}</div>
                                <div> {elt.address}</div>
                                <div> {elt.contact}</div>
                                <div> {elt.email}</div>

                            </div>
                        );
                    })
                }

            </div>
        );
    }
}
class UserInterfaceHeader extends Component{
    render(){
       return(
           <div className={"users-interface-header"}>
               <h3>{"Welcome to Users Management Interface !!"} </h3>
           </div>
       );
    }
}
class UserInterfaceFooter extends Component{
    render(){
        return(
            <div>

            </div>
        );
    }
}
export default class Users extends Component{
    constructor(props){
        super(props);
        this.state={
            ListToShow:[]
        }
    }
    getListToshow(){
        let collection="users/";
        let options = {};
        ServerService.getFromServer(LISTS_PATH+collection+options).then((res)=>{
          //  console.log(res.data);
            this.setState({ListToShow:res.data});
        });
    }
    componentDidMount(){
        this.getListToshow();
    }
    render(){
        return(
            <div className={"users-interface-block"}>
                <div className={"users-interface-header"}>
                    <UserInterfaceHeader/>
                </div>
                <div className={"users-interface-content"}>
                    <UsersList listToShow={this.state.ListToShow}/>

                </div>
                <div className={"users-interface-footer"}>
                    <UserInterfaceFooter/>
                </div>
            </div>
        )
    }
}