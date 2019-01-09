import React, { Component } from 'react';
import './connexionComponent.css';


function ConnexionComponent(props) {
    return (
        <div className={"form-connexion-block"}>
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
                        <div> <button type={"button"}> Creer Un Compte </button></div>
                    </div>
                </div>
                <div className={"form-connexion-footer"}></div>
            </form>

        </div>
    );
}

export default ConnexionComponent;

