import React,{Component} from "react";
import './connexion.css';
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ConnexionComponent from "./ConnexionComponent";
import {getToken, removeToken, userLogged$, messageToShow$, getDecodedToken} from '../../server/axiosInstance';
import {Redirect} from "react-router-dom";


class Connexion extends Component {
    constructor(props) {
        super(props);
        userLogged$.subscribe(bool => {this.handleLoginState(bool)});
        this.state = {
            loggedIn:false,
            modalVisibility: false,
            modalChildren: ""
        }
    }
    handleLoginState(bool){ this.setState({ loggedIn :bool });}

    deleteToken(){
        if (getToken() || getToken().length > 1) {
            removeToken()
            return(<Redirect to={'/welcome'}/>);
        };
    }

    userInfosToDisplay(content) {
        return (
            <div>
                <div> Compte AlphaM</div>
                <div>{content.name+" "+content.surname}</div>
                <div>{content.email} </div>
            </div>
        )
    }

    openLoginModal(){
        this.setState({
            modalVisibility: true,
            modalChildren: <ConnexionComponent
                handleCloseModal={()=>this.closeModal()}
            />
        })
    }


    display() {
        if (this.state.loggedIn) {
            let token=getDecodedToken();
            return (
                <div key={'Deconnexion'} className={'navbar-item-div connexion-tooltip'}>
                    <div  className={'navbar-item-link '} >
                        <div   className={'logout-div'}     >
                            { token.surname? token.surname[0]:'U'}
                        </div>
                    </div>
                    <div className={"tooltip-content"}>
                        {this.userInfosToDisplay(token)}
                        <div className={"logout-button"} onClick={()=>this.deleteToken()}>
                            Deconnexion
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
    closeModal(){
        this.setState({
            modalVisibility: false,
            modalChildren: ""
        })
    }
    render() {
        return (
                <React.Fragment>
                    <ModalComponent
                        visible={this.state.modalVisibility}
                        onClose={()=>this.closeModal()}
                    >
                        {this.state.modalChildren}
                        </ModalComponent>
                    {this.display()}
                </React.Fragment>
        )
    }

}


export default Connexion;