import React,{Component} from 'react';
import './contactsadministration.css';
import {ServerService} from "../../server/ServerService";
import {ButtonHelper, LabelHelper} from "../HelperComponent/FormHelper";
import QuillComponent from "../DanielComponent/QuillComponent/QuillComponent";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ReactQuill from 'react-quill';

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
            modalChildren:"",
            modalVisibility:false
        }
    }
    componentDidMount(){
        ServerService.postToServer("crudOperations/get",{
            collection:"messages",
        }).then((response)=>{
            if(response.status===200){
                console.log("messages",response.data);
                this.setState({messages:response.data});
            }else{
                console.log(response.data.errorMessage)
            }
        });
    }

    openModal(content){
        this.setState({
            modalChildren:content,
            modalVisibility:true
        });
    }
    closeModal(){
        this.setState({
            modalChildren:"",
            modalVisibility:false
        });
    }
    async deleteMessage(message,key){
        await ServerService.postToServer("crudOperations/delete",{
                collection:"messages",
                data:{_id:message._id}
            }).then(response=>{
                if (response.status===200){
                    this.setState({
                        messages:this.state.messages.filter((message,index)=>{
                            return index!==key
                        })
                    })
                }

        });
    }

    handleReplyValidation(message,reply,key){
        console.log("reply validated data",reply);
        if(reply.text.length>3){
            ServerService.postToServer("/contacts/reply",{
                message:message,
                reply:reply.text,
            }).then((response)=>{
               if(response.status===200){
                   console.log("operation done with success");
                   let replies=message.replies||[];
                   replies.push(reply.text);
                   message['replies']=replies;
                  let messages=this.state.messages;
                  messages[key]=message;
                  this.setState({messages:messages});
               }else {
                   console.log("operation failed",response);
               }
            });
        }
    }

    handleReply(message,key){
        let content=<QuillComponent onValidate={(reply)=>this.handleReplyValidation(message,reply,key)}/>
        this.openModal(content);
    }

    displayReplies(message){
        let content=message.replies.map((reply,key)=>{
            return(<div className={"message-reply-div"} key={key}>{reply}</div>);
        });
        this.openModal(<div className={"message-replies"}> {content} </div>);
    }

    returnOptions(message,key){
        return(
            <div className={"hr-button-block"}>
                <ButtonHelper{...{
                    name:"",
                    value:"Reply",
                    className:"form-helper-button success"
                }} onClick={()=>this.handleReply(message,key)}
                />
                {
                    message.hasOwnProperty("replies") ?
                        <ButtonHelper{...{
                            name:"",
                            value:"Replies View",
                            className:"form-helper-button white-on-blue"
                        }} onClick={()=>this.displayReplies(message)}
                        />

                        : ""
                }
                <ButtonHelper{...{
                        name:"",
                        value:"delete",
                        className:"form-helper-button danger"
                    }} onClick={()=>this.deleteMessage(message,key)}
                />
            </div>
        );
    }

    showMessages(){
        if(this.state.messages.length>0){
            return(
                <div className={"messages-list-div"}>
                    <div className={"messages-list-title"}>Messages</div>
                    {
                        this.state.messages.map((message,key)=>{
                            return (
                                <div key={key} className={"contact-message-item"}>
                                    {displayContent(message.message)}
                                    <div className={"options"}>
                                        {this.returnOptions(message,key)}
                                    </div>
                                 </div>
                            );
                        })
                    }
                </div>
            );
        }else {
            return "";
        }
    }

    render(){
        return(
            <div className={"contacts-administration-main-div"}>
                <ModalComponent
                    visible={this.state.modalVisibility}
                    onClose={()=>this.closeModal()}
                >
                    {this.state.modalChildren}
                    </ModalComponent>
                <h3>Consultations and Replies to Users Messages</h3>
                {this.showMessages()}
            </div>
        );
    }
}
export default ContactsAdministration;