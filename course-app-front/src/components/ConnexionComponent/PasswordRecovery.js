import React,{Component} from 'react';
import './passwordrecovery.css';
import {InputTextHelper, ButtonHelper} from '../HelperComponent/FormHelper';
import {validateEmail, validatePhoneNumber} from "../StaticFunctionsComponent/StaticFunctions";
import { PASSWORD_RECOVERY_PATH,PASSWORD_RECOVERY_CODE_PATH ,PASSWORD_RESET_PATH} from '../../server/SERVER_CONST';
import { ServerService } from '../../server/ServerService';

class Message extends Component{
    render(){

        return(
            <div className={'message-box message-box-'+ this.props.type || "success"}>
                <div className='message-message'>
                    {this.props.message || ""}
                </div>
            </div>
        );

    }
}
class FirstStep extends Component {
    constructor(props){
        super(props);
        this.state={
            contactoremail: "email",
            inputEmailparams: {
                name: 'email',
                type: "email",
                label: "Email",
                placeholder: "Email"
            },
            inputcontactparams: {
                name: 'contact',
                type: "Number",
                label: "Telephone",
                placeholder: "Telephone"
            },
            contact:"",
            email:"",
            dataToSend:{}
        }
    }

    handleChange(e){
        switch (e.target.name){
            case "email":
                this.setState({
                    contactoremail:"email",
                    email:e.target.value,
                    dataToSend:{
                        contactoremail:"email",
                        email:e.target.value
                    }

            });
            break;
            case "contact":
                this.setState({
                    contactoremail:"contact",
                    contact:e.target.value,
                    dataToSend:{
                        contactoremail:"contact",
                        conctact:e.target.value
                    }
            });
            break;
            default : break;
        }
    }

    contactoremail(){
        switch (this.state.contactoremail) {
            case "email":
                return (
                    <InputTextHelper {...this.state.inputEmailparams} onChange={(e) => this.handleChange(e)}/>
                );
                break;
            case "contact":
                return (
                    <InputTextHelper {...this.state.inputcontactparams} onChange={(e) => this.handleChange(e)}/>
                );
                break;
            default : break;
        }
    }

    handleClick(){
        let err=0;
        switch (this.state.contactoremail) {
            case "email":
                if(validateEmail(this.state.email)){
                    this.setState({
                        dataToSend:{
                            contactoremail:this.state.contactoremail,
                            email:this.state.email
                        }
                    });
                    console.log(this.state.dataToSend);

                }else{
                    err=1;
                    alert("Veuillez Saisir Une Adresse Mail Valide");
                }
                break;
            case "contact":
                if(validatePhoneNumber(this.state.contact)){
                    this.setState({
                        dataToSend:{
                            contactoremail:this.state.contactoremail,
                            contact:this.state.contact
                        }
                    });

                    console.log(this.state.dataToSend);
                }else {
                    err=1;
                    alert("Veuillez Saisir Un Numero Valide")
                }
                break;
            default : break;
        }
        if(!err){
            console.log('donnes envoyees', this.state.dataToSend);
            ServerService
                .postToServer(PASSWORD_RECOVERY_PATH,this.state.dataToSend)
                .then(
                    (response)=>{
                        console.log(response.data);
                        if(response.status===200) {
                            this.props.nextStep(this.state.dataToSend);
                            console.log(response.data.message);
                        }else {
                            console.log(response.data.errorMessage);
                        }
                    });
        }
    }

    render() {
        return (
            <div className={"pass-recov-setp-one-block"}>
                <div className={"pass-recov-step-one-header " + this.state.contactoremail}>
                    <div onClick={(e)=>this.setState({contactoremail : "email"})}> EMail </div>
                    <div onClick={(e)=>this.setState({contactoremail : "contact"})}>  Telephone </div>
                </div>
                <div className={"pass-recov-step-one-content"}>
                    {this.contactoremail()}
                </div>
                <div className={"pass-recov-step-one-footer"}>
                    <button className={"pass-recov-button"} onClick={()=>this.handleClick()}> Suivant</button>
                </div>
            </div>
        );
    }
}
class SecondStep extends Component {
    constructor(props){
        super(props);
        this.state={
            DataToSend:{
                code:""
            }
        }
    }
    handleChange(e){
        let newdatatosend= Object.assign({},this.state.dataToSend,this.props.data[1],{code:e.target.value});
        this.setState({dataToSend:newdatatosend});
        console.log(this.state.dataToSend);
    }
    handleClick(e){
        if(this.state.dataToSend.code.length>=4){
            ServerService.postToServer(PASSWORD_RECOVERY_CODE_PATH,this.state.dataToSend).then((response)=>{
                if(response.status===200){
                    this.props.nextStep(this.state.dataToSend);
                }else {
                    alert(response.data.errorMessage);
                }
            });
        }else {
            alert("Veuillez vérifier le code entré SVP.");
        }
    }
    render() {
        let inputCodeparams={
            name: 'recoverycode',
            type: "text",
            label: "Code",
            placeholder: "CODE"
        };
        let buttonParams={
            type:'button',
            name:"codevalidatebutton",
            className:'form-helper-button success',
            value:"Valider"
        };

        return (
            <React.Fragment>
                <div className={"pass-recov-step-one-content"}>
                    <InputTextHelper {...inputCodeparams} onChange={(e)=>this.handleChange(e)}/>
                </div>
                <div className={""}>
                    <ButtonHelper {...buttonParams} onClick={(e)=>this.handleClick(e)}> Valider</ButtonHelper>
                </div>
            </React.Fragment>
        );
    }
}
class ThirdStep extends Component {
    constructor(props){
        super(props);
        this.state={
            dataToSend:{
                newpassword:"",
                newpasswordtwo:""
            }
        };
    }

    handleChange(e){
        let newdatatosend=Object.assign({},this.state.dataToSend,{[e.target.name]:e.target.value});
        this.setState({dataToSend:newdatatosend});
        console.log(this.state.dataToSend);
    }
    handleClick(e) {
        if((this.state.dataToSend.newpassword.length>=4) && (this.state.dataToSend.newpassword === this.state.dataToSend.newpasswordtwo) ){
            let newdatatosend = Object.assign({},this.state.dataToSend,this.props.data[2]);
                ServerService.postToServer(PASSWORD_RESET_PATH, newdatatosend).then((response)=>{
                    console.log(response.data);
                    if(response.status === 200){
                        this.props.nextStep({status:1});
                    }else{
                        alert(response.data.message);
                    }
                });
        }
    }
    render() {
        let inputNewPassword={
            name: 'newpassword',
            type: "password",
            label:"Nouveau Mot De Passe",
            placeholder:"Nouveau Mot De passe ",
        };
        let inputNewPasswordVerify={
            name: 'newpasswordtwo',
            type: "password",
            label: "Entrez de nouveau votre mot de passe",
            placeholder:" Nouveau Mot de Passe",
        };
        let previousbuttonparams={
            type:'button',
            name: 'previous',
            value: 'Precedent',
            className:'form-helper-button warning'
        };
        let nextbuttonparams={
            type:'button',
            name: 'next',
            value: 'Valider',
            className:'form-helper-button success'
        };

        return (
            <div className={"pass-recov-newpass-block"}>
                <div className={""}>
                    <InputTextHelper {...inputNewPassword} required={'required'} onChange={(e)=>this.handleChange(e)}/>
                    <InputTextHelper {...inputNewPasswordVerify} required={'required'} onChange={(e)=>this.handleChange(e)}/>
                </div>
                <div className={'hr-button-block'}>
                    <ButtonHelper {...previousbuttonparams} onClick={(e)=>this.props.previousStep(e)} />
                    <ButtonHelper {...nextbuttonparams} onClick={(e)=>this.handleClick(e)}/>
                </div>
            </div>
        );
    }
}
class FourthStep extends Component {
    render() {
        return (
            <div>
                <Message type={"success"} message={"Nouveau Mot de passe Enregistré"}/>
            </div>
        );
    }
}

class PasswordRecovery extends Component{
    messages=[
        "",
        "Retrouvez Votre Mot De Passe par Mail ou Telephone",
        "Un code vous a été Envoyé. Veuillez saisir le Code Reçu.",
        "Entrez vos nouveaux parametres",
    ];
    constructor(props){
        super(props);
        this.state={
            currentStep:1,
            currentMessage:this.messages[1],
            inProcess:0,
            email:"",
            code:"",
            currentData:{}
        }
    }
    processWorking(){
        if(this.state.inProcess === 1)
        {
            return ( <div> <img src={"/images/al.gif"} alt={"Processing ..."}/> </div>)
        }
    }
    handleChange(e){
        console.log("name : " +e.target.name);
        console.log("value : " +e.target.value);
        //this.setState({[e.target.name] : e.target.value});
        //console.log(this.state);
    }

    nextStep(e){
        this.setState({
            currentData: {[this.state.currentStep]:e },
            currentMessage:this.messages[this.state.currentStep +1],
        });
        this.setState({currentStep: this.state.currentStep + 1});
        console.log(this.state);
    }

    previousStep(){
        this.setState({currentStep: this.state.currentStep - 1});
    }
    displayCurrentStep(){
        switch (this.state.currentStep){
            case 1: return(<FirstStep  nextStep={(e)=>this.nextStep(e)} />); break;
            case 2: return(<SecondStep onChange={(e)=>this.handleChange(e)} data={this.state.currentData} nextStep={(e)=>this.nextStep(e)} previousStep={(e)=>this.previousStep(e)}/>); break;
            case 3: return(<ThirdStep  onChange={(e)=>this.handleChange(e)} data={this.state.currentData} nextStep={(e)=>this.nextStep(e)} previousStep={(e)=>this.previousStep(e)}/>); break;
            case 4: return(<FourthStep  onChange={(e)=>this.handleChange(e)}  nextStep={(e)=>this.nextStep(e)} />); break;
            default : break;
        }
    }





    render(){
        return(
            <div className={"block-password-recovery"}>
                <div className={"section-header"}>
                    {"Mot de Passe Oublié ?"}
                    <div className={"bottom-border"}>  </div>
                </div>
                <Message type={"note"} message={this.state.currentMessage}/>
                <div>{this.processWorking()}</div>
                 {this.displayCurrentStep()}
                <div className={"password-recovery-footer"}>
                {/*    {this.displayOptions()}*/}
                </div>
            </div>
        );
    }
}

export default PasswordRecovery;