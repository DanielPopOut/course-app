/**
 * Created by Cyrille on 26/11/2018.
 */
import React, { Component } from 'react';
import './welcome.css';
import { ServerService } from '../../server/ServerService';

class Welctext extends Component {
    render() {
        return ( <div className='welc_text'>{this.props.text}</div>);
    }
}

class Welcimage extends Component {
    render() {
        return (
            <div className='w_image'>
                <img src={require('./img/images_022.jpg')} alt="learn Easily"/>
            </div>
        );
    }
}

class Welcslogan extends Component {
    render() {
        return (
            <div className='welc_slogan'>
                {this.props.text}
            </div>
        );
    }
}

class Welcome extends Component {
    render() {
        return (
            <div className='welcome'>
                <button onClick={()=> this.executeRequete()}>Faire requete</button>
                <Welctext text='Welcome to AlphaM'/>
                <Welcimage src='./img/images_022.jpg'/>
                <Welcslogan text='Aprennez en Toute Simplicite !!'/>
            </div>
        );
    }

    executeRequete() {
        ServerService.getFromServer("test").then(response => console.log(response, response.data))
    }
}

export default Welcome;