import React, {Component} from 'react';

import './NavBar.css';
import {Link} from 'react-router-dom';
import Connexion from "./Connexion";


export default class NavBar extends Component {
    tableauNavbar = [
        //{title: 'AlphaM', redirectionAddress: '/welcome'},
        // {title: 'Departements', redirectionAddress: '/departments'},
        // {title: 'Cours', redirectionAddress: '/courses'},
        // {title: 'Contacts', redirectionAddress: '/contacts'},
        // {title: 'Users', redirectionAddress: '/users'},
        //{title: 'Connexion', redirectionAddress: '/connexion'},
    ];
    loggedInTableauNavbar = [
      //  {title: 'AlphaM', redirectionAddress: '/welcome'},
        {title: 'Departements', redirectionAddress: '/departments'},
        {title: 'Cours', redirectionAddress: '/courses'},
        {title: 'Contacts', redirectionAddress: '/contacts'},
        {title: 'Users', redirectionAddress: '/users'},
        //{title: 'Deconnexion', redirectionAddress: '/connexion', content: 'decodedToken'},
    ];

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        let tableauToUse = this.props.loggedIn ? this.loggedInTableauNavbar : this.tableauNavbar;
        return (
            <div className={' navbar-component lg-only full-width'}>
                <div className={'nav-brand'}>
                        <div key={'AlphaM'} className={'navbar-item-div '}>
                            <Link
                                to={'/welcome'}
                                className={'navbar-item-link login-button'}
                            >
                                {'AlphaM'}
                            </Link>
                        </div>

                    </div>
                <div className={'navbar-items-block'}>
                        {tableauToUse.map(x =>
                            <div key={x.title} className={'navbar-item-div'}>
                                <Link
                                    to={x.redirectionAddress}
                                    className={'navbar-item-link'}
                                >
                                    {x.title + (x.content ? JSON.stringify(this.props[x.content]) : '')}
                                </Link>
                            </div>)
                        }
                    </div>
                <div className={'navbar-right-side'}>
                        <Connexion
                            onpenLoginModal={()=>this.props.openLoginModal()}
                            loggedIn={this.props.loggedIn}
                            decodedToken={this.props['decodedToken']}
                            logout={()=>this.props.logout()}
                        />
                    </div>
            </div>
        );
    }
}

