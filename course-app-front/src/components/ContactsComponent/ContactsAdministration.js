import React,{Component} from 'react';
import './contactsadministration.css';
import {ServerService} from "../../server/ServerService";
import ReactQuill, {} from 'react-quill';

function displayContent(content) {
    return (<ReactQuill value={content || ""} modules={{toolbar: false}}  readOnly={true}/>);
}

let replyForm={};
class ContactsAdministration extends Component{
    constructor(props){
        super(props);
        this.state={
            messages:[],
            selectedMessage:{},
        }
    }
    componentDidMount(){
        ServerService.postToServer("crudOperations/get",{
            collection:"messages",
        }).then((response)=>{
            if(response.status===200){
                console.log("messages",response.data);
                this.setState({ messages:response.data});
            }else{
                console.log(response.data.errorMessage)
            }
        });
    }
    showMessages(){
        if(this.state.messages.length>0){
            return(
                <div className={""}>
                    {
                        this.state.messages.map((message,key)=>{
                            return (<div key={key}>{displayContent(message)} </div>);
                        })
                    }
                </div>
            );
        }

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