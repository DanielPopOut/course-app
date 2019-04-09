import React,{Component} from 'react';
import './contactsadministration.css';
import {ServerService} from "../../server/ServerService";
import {displayMessage} from "../../server/axiosInstance";

class ContactsAdministration extends Component{
    constructor(props){
        super(props);
        this.state={
            messages:[],
            selectedMessage:{},
        }
    }
    componentDidMount(){
        ServerService.getFromServer("contacts/getAll").then((response)=>{
            if(response.status===200){
                this.setState({ messages:response.data});
            }else{
                console.log(response.data.errorMessage)
            }
        });
    }
    showMessages(){

    }
    displayMessage(){

    }
    sendReply(){

    }
    listReplies(){

    }
    render(){
        return(
            <div className={"contacts-administration-main-div"}>
                <h2>Consultations and Replies to Users Messages</h2>
                {this.showMessages()}
                {this.listReplies()}

            </div>
        );
    }
}
export default ContactsAdministration;