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
        let listToShow= this.props.ListToShow.reverse();
        let fieldsToShow = []

        return(
            <div>
                {
                    listToShow.map((elt,key)=>{
                        return (
                            <div key={key} className={"user-list-single-block"}>
                                <div className={"user-list-avatar"}>
                                    <figure>
                                        <img src={"/images/user3_thom1.png"}/>
                                    </figure>
                                </div>
                                <section className={"user-list-infos"}>
                                    <div> {elt.name}</div>
                                    <div> {elt.surname}</div>
                                    <div> {elt.address}</div>
                                    {
                                       /* fieldsToShow.map((currentField)=>{
                                            return(<div> {elt[currentField]}</div>)
                                        })*/
                                    }
                                </section>
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
       return("");
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
                    <section className={"users-form-list-section"}>
                        <div className={'users-interface-form-block'}>
                            <UsersCreationForm/>
                        </div>
                    </section>
                    <section className={"user-details-section"}>
                        <div className={"users-interface-list-block"}>
                            <UsersList ListToShow={this.state.ListToShow}/>
                        </div>

                    </section>
                </div>
                <div className={"users-interface-footer"}>
                    <UserInterfaceFooter/>
                </div>
            </div>
        )
    }

}