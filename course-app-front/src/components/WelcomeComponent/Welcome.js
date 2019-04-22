/**
 * Created by Cyrille on 26/11/2018.
 */
import React, { Component } from 'react';
import './welcome.css';

class Welcome extends Component {
    render() {
        return (
            <React.Fragment>
                <div className='welcome'>
                    <div className='welc_text'> {'Online Courses'}</div>

                    <div className='welc_slogan'>
                        {'Apprenez en Toute Simplicité !!'}
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export default Welcome;