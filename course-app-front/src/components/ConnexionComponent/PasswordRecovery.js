import React,{Component} from 'react';
import './passwordrecovery.css';
import {InputTextHelper,ButtonHelper}from '../HelperComponent/FormHelper';
import Flash from '../FlashComponent/Flash';

import { RECOVERY_PASSWORD_EMAIL_PATH } from '../../server/SERVER_CONST';
import { RECOVERY_PASSWORD_CODE_PATH } from '../../server/SERVER_CONST';
import { RECOVERY_PASSWORD_PHONE_PATH } from '../../server/SERVER_CONST';
import { ServerService } from '../../server/ServerService';

class FisrtStep extends Component {
    handleChange(e){
        this.setState({dataToSend:{email:[e.target.value]}})
        console.log("email : " +this.state.dataToSend.email);
    }
    render() {
        let inputEmailparams={
            name: 'email',
            type: "email",
            label: "Veuillez Saisir votre Adresse mail",
            placeholder:"Email"
        }

        return (
            <div className={"form-helper-div-input"}>
                <InputTextHelper params={inputEmailparams} onChange={(e)=>this.props.onChange(e)}/>
            </div>
        );
    }
}
class SecondStep extends Component {
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
class ThirdStep extends Component {
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
    constructor(props){
        super(props);
        this.state={
            currentStep:1,
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
    displayOptions(){
        switch (this.state.currentStep){
            case 1:return(
                <ButtonHelper params={{type:'button',value:"Suivant"}} onClick={(e)=>this.nextStep(e)}/>
            ); break;
            case 2: return(
                <React.Fragment>
                    <ButtonHelper params={{type:'reset',value:"Precedent"}} onClick={(e)=>this.previousStep(e)}/>
                    <ButtonHelper params={{type:'button',value:"Suivant"}} onClick={(e)=>this.nextStep(e)}/>
                </React.Fragment>
            ); break;
            case 3: return(
                <ButtonHelper params={{type:'reset',value:"Precedent"}} onClick={(e)=>this.previousStep(e)}/>
            ); break;
        }
    }
    displayCurrentStep(){
        switch (this.state.currentStep){
            case 1:return(<FisrtStep onChange={(e)=>this.handleChange(e)} />); break;
            case 2: return(<SecondStep  onChange={(e)=>this.handleChange(e)} />); break;
            case 3: return(<ThirdStep  onChange={(e)=>this.handleChange(e)} />); break;
        }
    }

    handleChange(e){
        this.setState({[e.target.name] : e.target.value});
        console.log(this.state);
    }

    emailValidator(email){
        if(!email.length>=5){return false}
        if(!email.indexOf('@')){return false}
        if(!email.indexOf('.')){return false}
        return true;
    }
    nextStep(){
        this.setState({inProcess:1});
       /* if(this.state.currentStep === 1 && this.emailValidator(this.state.email)){
            ServerService
                .postToServer(RECOVERY_PASSWORD_EMAIL_PATH,this.state)
                .then((response)=>{
                    console.log(response.data);
                    console.log(response.data.length);
                    if(response.data.length === 0){

                    }
                });
        }
*/
       this.setState({currentStep: this.state.currentStep + 1});
        console.log("current Step : "+this.state.currentStep);
        this.setState({inProcess:0});
    }
    previousStep(){
        this.setState({currentStep: this.state.currentStep - 1});
    }

    render(){
        return(
            <div>
                <div className={"section-header"}>
                    {"Mot de Passe Oublié ?"}
                    <div className={"bottom-border"}>  </div>
                </div>
                <div>{this.processWorking()}</div>
                <div> {this.displayCurrentStep()} </div>
                <div className={"password-recovery-footer"}>
                    {this.displayOptions()}
                </div>
            </div>
        );
    }
}

export default PasswordRecovery;