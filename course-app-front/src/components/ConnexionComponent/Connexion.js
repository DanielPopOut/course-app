import React, {Component} from "react";
import './connexion.css';
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ConnexionComponent from "./ConnexionComponent";
import {logOut, getDecodedToken} from '../../server/axiosInstance';
import history from '../../history';

class Connexion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisibility: false,
            modalChildren: ""
        }
    }

    userInfosToDisplay(content) {
        return (
            <div className={"user-connected-infos-div"}>
                <div className={"name"}>{content.name + " " + content.surname}</div>
                <div className={"email"}>{content.email} </div>
            </div>
        )
    }

    openLoginModal() {
        this.setState({
            modalVisibility: true,
            modalChildren: <ConnexionComponent closeModal={() => this.closeModal()}/>
        });
    }

    openProfile() {
        console.log("current props", this.props);
        history.push("/profile");
    }

    logOut(){
        logOut();
        history.push("/welcome");
    }

    display() {
        if (this.props.loggedIn) {
            let token = getDecodedToken();
            return (
                <div key={'Deconnexion'} className={'navbar-item-div connexion-tooltip'}>
                    <div className={'navbar-item-link loggin-button'}>
                        {token.surname ? token.surname : ''}
                    </div>
                    <div className={"tooltip-content"}>
                        {this.userInfosToDisplay(token)}
                        <div className={"form-helper-button logout-button"} onClick={(e) => {
                            e.stopPropagation();
                            this.logOut()
                        }}>
                            Deconnexion
                        </div>
                        <div className={"user-profile-link"} onClick={() => this.openProfile()}>
                            {"Acceder au Profile"}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div key={'Connexion'} className={'navbar-item-div '}>
                    <div
                        /* to={'/connexion'}*/
                        className={'navbar-item-link loggin-button'}
                        onClick={() => this.openLoginModal()}
                    >
                        {'Connexion'}
                    </div>
                </div>
            )
        }
    }

    closeModal() {
        this.setState({
                modalVisibility: false,
                modalChildren: ""
            });
    }

    render() {
        return (
            <React.Fragment>
                <ModalComponent
                    visible={this.state.modalVisibility}
                    onClose={() => this.closeModal()}
                >
                    {this.state.modalChildren}
                </ModalComponent>
                {this.display()}
            </React.Fragment>
        )
    }

}


export default Connexion;