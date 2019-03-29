import React,{Component} from "react";
import './connexion.css';
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ConnexionComponent from "./ConnexionComponent";
import {getToken, logOut, getDecodedToken} from '../../server/axiosInstance';

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
            <div>
                <h3> Compte AlphaM</h3>
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

    userProfile(){
        console.log("about to redirect to user profile ",this.props);
 /*       this.props.history.push("/userprofile");*/
        /*return(<Redirect to={'/userprofile'}/>);*/
    }

    display() {
        if (this.props.loggedIn) {
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
                        <div className={"form-helper-button logout-button"} onClick={(e)=>{e.stopPropagation(); logOut()}}>
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