import React, { Component } from 'react';
import Redirect from 'react-router/es/Redirect';
import './NavBar.css';


export default class NavBar extends Component {
    tableauNavbar = [
        {title: 'AlphaM', redirectionAddress: '/welcome'},
        {title: 'Cours', redirectionAddress: '/courses'},
        {title: 'Contacts', redirectionAddress: '/contacts'},
        {title: 'Connexion', redirectionAddress: '/connexion'},
    ];

    constructor(props) {
        super(props);
        this.state = {
            redirectionAddress: '',
        };
    }

    setRedirection(redirectionAddress) {
        this.setState({redirectionAddress: redirectionAddress});
    }

    checkRedirection(redirectionAddress = this.state.redirectionAddress) {
        console.log('redirection', this.state.redirectionAddress);
        if (redirectionAddress) {
            this.setState({
                redirectionAddress: '',
            });
            return <Redirect to={redirectionAddress}/>;
        }
        return '';
    }

    render() {
        return (
            this.state.redirectionAddress ? this.checkRedirection() :
                <div className='lg-only full-width'>
                    <div className={' navbar-component '} style={{width: '100%', display: 'flex'}}>
                        {this.tableauNavbar.map(x =>
                            <div key={x.title} onClick={() => this.setRedirection(x.redirectionAddress)}>
                                {x.title}
                            </div>)
                        }
                    </div>
                </div>
        );
    }
}

