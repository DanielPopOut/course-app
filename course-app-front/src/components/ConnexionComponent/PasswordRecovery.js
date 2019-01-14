import React,{Component} from 'react';
import './passwordrecovery.css';
import {InputTextHelper, ButtonHelper,RadioHelper, RadiosHelper} from '../HelperComponent/FormHelper';
import Flash from '../FlashComponent/Flash';
import {validateEmail, validatePhoneNumber} from "../StaticFunctionsComponent/StaticFunctions";

import { PASSWORD_RECOVERY_PATH } from '../../server/SERVER_CONST';
import { RECOVERY_PASSWORD_CODE_PATH } from '../../server/SERVER_CONST';

import { ServerService } from '../../server/ServerService';


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
            case "email":this.setState({
                contactoremail:"email",
                email:e.target.value
            });
            break;
            case "contact":this.setState({
                contactoremail:"contact",
                contact:e.target.value
            });
            break;
        }
        console.log(e.target.name+" : "+e.target.value);
    }

    contactoremail(){
        switch (this.state.contactoremail) {
            case "email":
                return (
                    <InputTextHelper params={this.state.inputEmailparams} onChange={(e) => this.handleChange(e)}/>
                );
                break;
            case "contact":
                return (
                    <InputTextHelper params={this.state.inputcontactparams} onChange={(e) => this.handleChange(e)}/>
                );
                break;
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
                }else {
                    err=1;
                    alert("Veuillez Saisir Un Numero Valide")
                }
                break;
        }
        if(!err){
            ServerService
                .postToServer(PASSWORD_RECOVERY_PATH,this.state.dataToSend)
                .then(
                    (response)=>{
                        console.log(response.data);
                        if(response.data.status) {
                            this.props.nextStep(this.state.dataToSend);
                            console.log(response.data.message);
                        }else {
                            console.log(response.data.message);
                        }
                    });
        }

    }
    render() {
        return (
            <div className={"pass-recov-setp-one-block"}>
                <div className={"pass-recov-step-one-header " + this.state.contactoremail}>
                    <div onClick={(e)=>this.setState({contactoremail : "email"})}> EMail </div>
                    <div  onClick={(e)=>this.setState({contactoremail : "contact"})}>  Telephone </div>
                </div>
                <div className={"pass-recov-step-one-content"}>
                    {this.contactoremail()}
                </div>
                <div className={"pass-recov-step-one-footer"}>
                    <button className={"pass-recov-button"} onClick={(e)=>this.handleClick(e)}> Suivant</button>
                </div>
            </div>
        );
    }
}
class SecondStep extends Component {
    handleChange(e){
        this.setState({dataToSend:{email:[e.target.value]}})
        console.log("email : " +this.state.dataToSend.email);
    }
    render() {

        return (
            <React.Fragment>
            </React.Fragment>
        );
    }
}
class ThirdStep extends Component {
    render() {
        let inputCodeparams={
            name: 'sendedcode',
            type: "text",
            placeholder:" - - - - ",
            label: "Veuillez Saisir le code recu par mail"
        }
        return (
            <div className={"form-helper-div-input"}>
                <InputTextHelper params={inputCodeparams} required={'required'} onChange={(e)=>this.props.onChange(e)}/>
            </div>
        );
    }
}
class FourthStep extends Component {
    render() {
        let inputEmailparams={
            name: 'Email',
            type: "email",
            placeholder:"Email"
        }
        let currentStep={
            step:2
        }
        return (
            <div>
                <Flash type={"success"} message={"Nouveau Mot de passe Enregistré"}/>
            </div>
        );
    }
}

class PasswordRecovery extends Component{
    messages=[
        "",
        "Retrouvez Votre Mot De Passe par Mail ou Telephone",
    ];
    constructor(props){
        super(props);
        this.state={
            currentStep:1,
            currentMessage:this.messages[1],
            inProcess:0,
            email:"",
            code:""
        }
    }
    processWorking(){
        if(this.state.inProcess === 1)
        {
            return ( <div> <img src={"/images/al.gif"}/> </div>)
        }
    }

    displayCurrentStep(){
        switch (this.state.currentStep){
            case 1:return(<FirstStep  nextStep={(e)=>this.nextStep(e)} />); break;
            case 2: return(<SecondStep  onChange={(e)=>this.handleChange(e)} nextStep={(e)=>this.nextStep(e)} />); break;
            case 3: return(<ThirdStep  onChange={(e)=>this.handleChange(e)} nextStep={(e)=>this.nextStep(e)} />); break;
            case 4: return(<FourthStep  onChange={(e)=>this.handleChange(e)}  nextStep={(e)=>this.nextStep(e)} />); break;
        }
    }

    handleChange(e){
        console.log("name : " +e.target.name);
        console.log("value : " +e.target.value);
        //this.setState({[e.target.name] : e.target.value});
        //console.log(this.state);
    }

    nextStep(e){
        console.log(JSON.stringify({
            currentStep:this.state.currentStep,
            e:e
        }))
    }

    previousStep(){
        this.setState({currentStep: this.state.currentStep - 1});
    }

    render(){
        return(
            <div className={"block-password-recovery"}>
                <div className={"section-header"}>
                    {"Mot de Passe Oublié ?"}
                    <div className={"bottom-border"}>  </div>
                </div>
                <Flash type={"note"} message={this.state.currentMessage}/>
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