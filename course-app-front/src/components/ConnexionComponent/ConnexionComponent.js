import React, { Component } from 'react';
import './connexionComponent.css';
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import {UsersCreationForm} from "../UsersComponent/Users";
import  PasswordRecovery  from './PasswordRecovery';
import {ServerService} from "../../server/ServerService";
import {AUTHENTICATION} from "../../server/SERVER_CONST";
import Redirect from "react-router-dom/es/Redirect";


class ConnexionComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            newAccountModalVisibility:false,
            newPasswordModalVisibility:false,
            dataToSend:{
                pseudo:'',
                password:''
            }
        }
    }
    newAccount(){
        this.setState({newAccountModalVisibility :true});
    }
    newPassword(){
        this.setState({newPasswordModalVisibility :true});
    }

    handleClose(){
        this.setState({
            newAccountModalVisibility :false,
            newPasswordModalVisibility :false
        });
    }
    handleChange(e){
        let newdatatosend=Object.assign({},this.state.dataToSend,{[e.target.name]:e.target.value});
        this.setState({dataToSend:newdatatosend});
        console.log(this.state.dataToSend);
    }
    handleLoginValidate(e){
        if(this.state.dataToSend.pseudo!=='' &&  this.state.dataToSend.password!=='' ){
            ServerService.postToServer(AUTHENTICATION,this.state.dataToSend).then((response)=>{
                console.log("status"+ response.status);
                if(response.status==200){
                   // alert(response.data.message);
                    //console.log(response.data.text);
                    return <Redirect to={'/welcome'}/>
                }else{
                    alert(response.data.text);
                }
            });
        }
    }

    render(){
        return (
            <div className={"form-connexion-block"}>
                <ModalComponent
                    visible={this.state.newAccountModalVisibility}
                    onClose={()=>this.handleClose()}
                    children={<UsersCreationForm/>}
                />
                <ModalComponent
                    visible={this.state.newPasswordModalVisibility}
                    onClose={()=>this.handleClose()}
                    children={<PasswordRecovery/>}
                />
                <form className={'form-connexion'}>
                    <div className={"form-connexion-header"}>
                        <div>Connexion </div>
                    </div>
                    <div className={"form-connexion-content"}>
                        <div>
                            <label> Pseudo </label>
                            <input onChange={(e)=>this.handleChange(e)} type={"text"} autoComplete={'off'} name={"pseudo"} placeholder={"Pseudo"}/>
                        </div>
                        <div>
                            <label> Mot de Passe </label>
                            <input onChange={(e)=>this.handleChange(e)} type={"password"}autoComplete={"off"} name={"password"} placeholder={"Mot de Passe"}/>
                        </div>
                        <div>
                            <div> <button type={"button"} onClick={(e)=>{this.handleLoginValidate(e)}} className={"login-button-validate"}> Se Connecter </button></div>
                        </div>
                    </div>
                    <div className={"form-connexion-footer"}>
                        <div> <button type={"button"} className={"new-account-button"} onClick={()=>this.newAccount()}> Créer Un Nouveau Compte </button></div>
                        <div className={"password-forgotten-div"} onClick={()=>this.newPassword()}> Des Problèmes pour vous Connecter ?</div>
                    </div>
                </form>

            </div>
        );
    }
}

export default ConnexionComponent;

