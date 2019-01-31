import React,{Component} from "react";
import './connexion.css';
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ConnexionComponent from "./ConnexionComponent";

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
                <div> Compte AlphaM</div>
                <div>{content.name+" "+content.surname}</div>
                <div>{content.email} </div>
            </div>
        )
    }

    openLoginModal(){
        this.setState({
            modalVisibility: true,
            modalChildren: <ConnexionComponent/>
        })
    }

    display() {
        /* console.log("loggedIn "+ this.state.loggedIn);
         console.log("decoded token "+ this.state.decodedToken);*/
        if (this.props.loggedIn) {
            return (
                <div key={'Deconnexion'} className={'navbar-item-div tooltip'}>
                    <div
                        className={'navbar-item-link '}
                    >
                        <div   className={'logout-div'}     >
                            { this.props.decodedToken.surname? this.props.decodedToken.surname[0]:'U'}
                        </div>
                    </div>
                    <div className={"tooltip-content"}>
                        {this.userInfosToDisplay(this.props.decodedToken)}
                        <div
                            className={"logout-button"}
                            onClick={()=>this.props.logout()}
                        >
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