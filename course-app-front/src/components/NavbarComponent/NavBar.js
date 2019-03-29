import React, {Component} from 'react';
import './NavBar.css';
import {Link,Redirect} from 'react-router-dom';
import Connexion from "../ConnexionComponent/Connexion";

import history from '../../history';



export default class NavBar extends Component {
    tableauNavbar = [
        //{title: 'AlphaM', redirectionAddress: '/welcome'},
        // {title: 'Departements', redirectionAddress: '/departments'},
        // {title: 'Cours', redirectionAddress: '/courses'},
        {title: 'Contacts', redirectionAddress: '/contacts'},
        // {title: 'Users', redirectionAddress: '/users'},
        //{title: 'Connexion', redirectionAddress: '/connexion'},
    ];
    loggedInTableauNavbar = [
      //  {title: 'AlphaM', redirectionAddress: '/welcome'},
        {title: 'Cours', redirectionAddress: '/courses'},
        {title: 'TESTS', redirectionAddress: '/mcqs'},
        {title: 'Contacts', redirectionAddress: '/contacts'},
        {title: 'Users', redirectionAddress: '/users'},
    ];

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleRedirect(url){
        return (<Redirect to={url}/>);
    }

    checkActive(address){
        let location = history.location.pathname || " ";
        if(!location.search(address)){
            return "active-menu";
        }else {
            return "non-active-menu";
        }
    };
    render() {
        let tableauToUse = this.props.loggedIn ? this.loggedInTableauNavbar : this.tableauNavbar;
        return (
            <div className={' navbar-component lg-only full-width'}>
                <div className={'nav-brand'}>
                    <div key={'AlphaM'} className={'navbar-item-div '}>
                        <Link
                                to={'/welcome'}
                                className={'navbar-item-link login-button '+this.checkActive('/welcome')}
                            >
                                Home
                            </Link>
                    </div>
                </div>
                <div className={'navbar-items-block'}>
                        {tableauToUse.map(x =>
                            <div key={x.title} className={'navbar-item-div'}>
                                <Link
                                    to={x.redirectionAddress}
                                    className={'navbar-item-link '+this.checkActive(x.redirectionAddress)}
                                >
                                    {x.title + (x.content ? JSON.stringify(this.props[x.content]) : '')}
                                </Link>
                            </div>)
                        }
                    </div>
                <div className={'navbar-right-side'}>
                    <Connexion  loggedIn={this.props.loggedIn} handleRedirect={(url)=>this.handleRedirect(url)}/>
                </div>
            </div>
        );
    }
}

