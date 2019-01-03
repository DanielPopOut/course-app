/**
 * Created by Cyrille on 26/11/2018.
 */
import React, { Component } from 'react';
import './welcome.css';


class Welctext extends Component {
    render() {
        return ( <div className='welc_text'>{this.props.text}</div>);
    }
}

class WelcomeGallery extends Component{
    render(){
        return(
            <div className={'welcome-gallery-block'}>
                {this.props.list.map((x)=>{

                })}

            </div>
        )
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
                <Welctext text='Welcome to AlphaM'/>

                <Welcslogan text='Aprennez en Toute Simplicite !!'/>
                <div>

                </div>
            </div>
        );
    }
}

export default Welcome;