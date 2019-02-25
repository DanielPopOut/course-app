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
            modalVisibility:false,
            modalChildren:"",
            dataToSend:{
                pseudo:'',
                password:''
            }
        };
    }
    newAccount(){
        this.setState({
            modalVisibility :true,
            modalChildren:<UsersCreationForm/>
        });
    }
    newPassword(){
        this.setState({
            modalVisibility :true,
            modalChildren:<PasswordRecovery/>
        });
    }

    handleCloseModal(e){
        this.setState({
            modalVisibility :false,
            modalChildren:""
        });
    }
    handleChange(e){
        let newdatatosend=Object.assign({},this.state.dataToSend,{[e.target.name]:e.target.value});
        this.setState({dataToSend:newdatatosend});
        console.log(this.state.dataToSend);
    }
    handleLoginValidate(){
        if(this.state.dataToSend.pseudo!=='' &&  this.state.dataToSend.password!=='' ){
            ServerService.postToServer(AUTHENTICATION,this.state.dataToSend).then((response)=>{
                //console.log("status"+ response.status);
                if(response.status===200){
                    this.props.handleCloseModal();
                    console.log(" The login props ",this.props);
                }else{
                    alert(response.data.errorMessage);
                }
            });
        }
    }
    handleKeyPress(event){
        console.log("event : "+event.key);
        if (event.key==='Enter'){
            this.handleLoginValidate();
        }
    }

    render(){
        console.log("props 2 ",this.props);
        return (
            <div className={"form-connexion-block"}>
                <ModalComponent visible={this.state.modalVisibility}  onClose={(e)=>this.handleCloseModal(e)}>
                    {this.state.modalChildren}
                </ModalComponent>
                <form className={'form-connexion'} onKeyPress={(event)=>this.handleKeyPress(event)}>
                    <div className={"form-connexion-header"}>
                        <div>Connexion </div>
                    </div>
                    <div className={"form-connexion-content"}>
                        <div>
                            <label> Pseudo </label>
                            <input onChange={(e)=>this.handleChange(e)} autoFocus={true} type={"text"} autoComplete={'off'} name={"pseudo"} placeholder={"Pseudo"}/>
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

