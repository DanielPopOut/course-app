import React, { Component } from 'react';
import './connexionComponent.css';
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import {UsersCreationForm} from "../UsersComponent/Users";
import  PasswordRecovery  from './PasswordRecovery';


class ConnexionComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            newAccountModalVisibility:false,
            newPasswordModalVisibility:false,
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
                            <input type={"text"} name={"pseudo"} placeholder={"Pseudo"}/>
                        </div>
                        <div>
                            <label> Mot de Passe </label>
                            <input type={"password"} name={"password"} placeholder={"Mot de Passe"}/>
                        </div>
                        <div>
                            <div> <button type={"button"} className={"login-button-validate"}> Se Connecter </button></div>
                        </div>
                    </div>
                    <div className={"form-connexion-footer"}>
                        <div> <button type={"button"} onClick={()=>this.newAccount()}> Creer Un Compte </button></div>
                        <div className={"password-forgotten-div"} onClick={()=>this.newPassword()}> Mot de passe Oublié ?</div>
                    </div>
                </form>

            </div>
        );
    }
}

export default ConnexionComponent;

