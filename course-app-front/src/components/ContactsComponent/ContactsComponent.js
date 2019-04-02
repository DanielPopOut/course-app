import React,{Component} from 'react';
import './contactscomponent.css'
import {ButtonHelper, InputHelper, LabelHelper} from "../HelperComponent/FormHelper";
import {displayMessage, getDecodedToken} from "../../server/axiosInstance";
import QuillComponent from "../DanielComponent/QuillComponent/QuillComponent";
import {ServerService} from "../../server/ServerService";
/*import {FormHelper} from "../HelperComponent/FormHelper";*/


class ContactForm extends Component{
    constructor(props) {
        super(props);
        this.state={
            user:getDecodedToken(),
            name:"",
            email:"",
            contact:"",
            message:""
        }
    }

    handleSubmitMessage(data){
        console.log("state message ",this.state);
        if(this.state.name.length===0 || this.state.email.length===0 || this.state.message.length===0 ){
            alert("Veuillez Remplir tous Les Champs SVP !!");
        }else {
            console.log("sending message ...");
            let insertedMessage = ServerService.insertElementInDataBase('messages',{
                name:this.state.name,
                email:this.state.email,
                contact:this.state.contact,
                message:this.state.message,
            });
            console.log("inserted message ",insertedMessage);
        }
    }

    handleChange(e){
        let change={};
        change[e.target.name] = e.target.value;
        this.setState({...change});
    }

    handleMessageChange(e){
        console.log("message",e);
        this.setState({message:e.text});
    }

    render(){
        return(
            <div>
                <h2 className={"contacts-session-title"}> Nous Envoyer un Message !! </h2>
                <div>
                    Pour toute suggestion ou préoccupation concernant cette plate-forme,
                    vous pouvez nous envoyer un email via l’interface suivante,
                    nous vous répondrons dans un délai de 48h00
                </div>
                <div className={"contacts-message-form"}>
                    <InputHelper {...{type:'text',name:"name",label:"Nom"}} onChange={(e)=>this.handleChange(e)}/>
                    <InputHelper {...{type:'email',name:"email",label:"Email"}} onChange={(e)=>this.handleChange(e)}/>
                    <InputHelper {...{type:'number',name:"contact",label:"Contact",placeholder:"Phone Contact"}} onChange={(e)=>this.handleChange(e)}/>
                    <h4>Message</h4>
                    <QuillComponent
                        text={this.state.message}
                        onChange={(e)=>this.handleMessageChange(e)}
                        onValidate={(data)=>this.handleSubmitMessage(data)}
                    />
                </div>
            </div>
        );
    }
}

class ContactsComponent extends Component{
    render(){
        return(
            <div className={"contacts-container"}>

                <h2 className={"contacts-session-title"}>Qui Nous Sommes ?</h2>
                <div className={"contacts-about-us"}>
                    Palais de la micro.
                    Services informatiques. creation de logiciel pour entreprises
                </div>
                <h2 className={"contacts-session-title"}>Nos Travaux</h2>
                <ContactForm/>
                <div>
                    <h3> Messages </h3>
                    <div>

                    </div>
                </div>
            </div>
        );
    }
}

export default ContactsComponent;