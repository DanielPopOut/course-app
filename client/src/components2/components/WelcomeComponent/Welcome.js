/**
 * Created by Cyrille on 26/11/2018.
 */
import React, { Component } from 'react';
import './welcome.css';


class Welcome extends Component {
    render() {
        return (
            <div className='welcome'>
                <div className='welc_text'> {'Welcome to AlphaM'}</div>
                <div className='welc_slogan'>
                    {'Apprenez en Toute Simplicite !!'}
                </div>

            </div>
        );
    }
}

export default Welcome;