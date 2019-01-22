import React, { Component } from 'react';

class ModalComponent extends Component {
    render() {
        return(
            <div className={'modal ' + (this.props.visible ?  '' : 'display-none')} onClick={()=>this.props.onClose()}>
                <div className='modal-box' onClick={e=>e.stopPropagation()}>
                    {this.props.children}
                </div>
            </div>
        );

    }
}

export default ModalComponent
