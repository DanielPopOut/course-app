import React,{Component} from "react";
import './connexion.css';

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
                <div key={'Connexiont'} className={'navbar-item-div '}>
                    <div
                        /* to={'/connexion'}*/
                        className={'navbar-item-link loggin-button'}
                        onClick={() => this.props.onpenLoginModal()}
                    >
                        {'Connexion'}
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            this.display()
        )
    }

}


export default Connexion;