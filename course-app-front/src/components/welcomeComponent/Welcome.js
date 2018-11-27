/**
 * Created by Cyrille on 26/11/2018.
 */
import React, { Component } from 'react';
import Redirect from 'react-router/es/Redirect';
import './welcome.css';

class Welctext extends Component{
    render(){
        return( <div class='welc_text'>{this.props.text}</div>);
    }
}

class Welcimage extends Component{
    render(){
        return(
            <div class='w_image'>
                <img src={require('./img/images_022.jpg')} alt ="learn Easily"/>
            </div>
        );
    }
}

class Welcslogan extends Component{
    render(){
        return(
            <div class='welc_slogan'>
            {this.props.text}
            </div>
        );
    }
}
class Welcome extends Component{
    render(){
        return(
            <div class='welcome'>
            {<Welctext text='Welcome to AlphaM' /> }
            {<Welcimage src='./img/images_022.jpg' />}
            {<Welcslogan text='Aprennez en Toute Simplicite !!' />}
            </div>
        );
    }
}

export default Welcome;