import React, { Component } from 'react';
import './connexionComponent.css';
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import {UsersCreationForm} from "../UsersComponent/Users";


class ConnexionComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            modalVisibility:false,
        }
    }
    newAccount(){
        this.setState({modalVisibility :true});
    }
    handleClose(){
        this.setState({modalVisibility :false});
    }

    render(){
        return (
            <div className={"form-connexion-block"}>
                <ModalComponent
                    visible={this.state.modalVisibility}
                    onClose={()=>this.handleClose()}
                    children={<UsersCreationForm/>}
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
                            <div> <button type={"button"} onClick={()=>this.newAccount()}> Creer Un Compte </button></div>
                        </div>
                    </div>
                    <div className={"form-connexion-footer"}></div>
                </form>

            </div>
        );
    }
}

export default ConnexionComponent;

