import React, { Component } from 'react';
import Redirect from 'react-router/es/Redirect';
import './NavBar.css';
import { Link } from 'react-router-dom';


export default class NavBar extends Component {
    tableauNavbar = [
        {title: 'AlphaM', redirectionAddress: '/welcome'},
        // {title: 'Departements', redirectionAddress: '/departments'},
        // {title: 'Cours', redirectionAddress: '/courses'},
        // {title: 'Contacts', redirectionAddress: '/contacts'},
        // {title: 'Users', redirectionAddress: '/users'},
        {title: 'Connexion', redirectionAddress: '/connexion'},
    ];
    loggedInTableauNavbar = [
        {title: 'AlphaM', redirectionAddress: '/welcome'},
        {title: 'Departements', redirectionAddress: '/departments'},
        {title: 'Cours', redirectionAddress: '/courses'},
        {title: 'Contacts', redirectionAddress: '/contacts'},
        {title: 'Users', redirectionAddress: '/users'},
        {title: 'Deconnexion', redirectionAddress: '/connexion', content: 'decodedToken'},
    ];

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let tableauToUse = this.props.loggedIn ?  this.loggedInTableauNavbar : this.tableauNavbar;
        return (
                <div className='lg-only full-width'>
                    <div className={' navbar-component '} style={{width: '100%', display: 'flex'}}>
                        {tableauToUse.map(x =>
                            <div key={x.title} >
                                <Link to={x.redirectionAddress} style={{color: 'white'}}> {x.title + (x.content ? JSON.stringify(this.props[x.content]) : '')}</Link>
                            </div>)
                        }
                    </div>
                </div>
        );
    }
}

