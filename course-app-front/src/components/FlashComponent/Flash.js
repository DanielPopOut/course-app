import React, { Component } from 'react';
import './flash.css';

class Flash extends Component {
    render() {
        return(
            <div className={'flash-box flash-box-'+ this.props.type || "success"}>
                <div className='flash-message'>
                    {this.props.message || ""}
                </div>
            </div>
        );
    }
}
export default Flash;