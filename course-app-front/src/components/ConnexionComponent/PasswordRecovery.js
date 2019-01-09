import React,{Component} from 'react';
import './passwordrecovery.css';
import {InputTextHelper,ButtonHelper}from '../HelperComponent/FormHelper';
import Flash from '../FlashComponent/Flash';

class FisrtStep extends Component {
    constructor(props){
        super(props);
        this.state={
            dataToSend:{
                email:""
            }
        }
    }
    handleChange(e){
        this.setState({dataToSend:{email:[e.target.value]}})
        console.log("email : " +this.state.dataToSend.email);
    }
    handleClick(e){
        this.props.onClick(this.state.dataToSend);
    }
    render() {
        let inputEmailparams={
            name: 'Email',
            type: "email",
            label: "Veuillez Saisir votre Adresse mail",
            placeholder:"Email"
        }

        let buttonParams ={
            name:'FirstStepValidate',
            value:'recevoir un nouveau Mot de Passe',
            onClick: (e)=>this.handleClick(e)
        }
        return (
            <div className={"form-helper-div-input"}>
                <InputTextHelper params={inputEmailparams} onChange={(e)=>this.handleChange(e)}/>
                <ButtonHelper params={buttonParams}/>
            </div>
        );
    }
}


class PasswordRecovery extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    handleClick(e){
        console.log(e);
    }


    render(){
        return(
            <div>
                <div className={"section-header"}>
                    {"Mot de Passe Oublié ?"}
                    <div className={"bottom-border"}>  </div>
                </div>
                <FisrtStep onClick={(e)=>this.handleClick(e)}/>
            </div>
        );
    }
}

export default PasswordRecovery;