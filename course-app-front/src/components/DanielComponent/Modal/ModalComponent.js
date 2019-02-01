import React, { Component } from 'react';
import './modal.css'
import { modalToShow$ } from '../../../modal/ModalService';


function ModalComponent(props) {

        return(
            <div className={'modal ' + (props.visible ?  '' : 'display-none')} onClick={()=>props.onClose()}>
                <div className='modal-box' onClick={e=>e.stopPropagation()}>
                    {props.children}
                </div>
                <div>
                    {props.onValidate ? <button onClick={()=>{props.onValidate().then(props.onClose())}}>Validate</button> : ''}
                </div>
            </div>
        );

}

export default ModalComponent



export class ModalComponent2 extends Component {
    constructor(props) {
        super(props);
        this.state = {componentToShow: <div>Amigo</div>, modalVisibility: false, modalComponentProps: {}}; // You can also pass a Quill Delta here
        modalToShow$.subscribe((modalComponentProps)=>{
            // console.log('new component insertion ', componentToShow);
            if (!modalComponentProps) {
                this.hideModal();
                this.setState({modalComponentProps: ''});
                return;
            }
            this.setState({modalComponentProps: modalComponentProps, modalVisibility: true})
        });
        // modalToShow$.subscribe((componentToShow)=>{
        //     console.log('new component insertion ', componentToShow);
        //     this.setState({componentToShow: componentToShow, modalVisibility: true})
        // });
    }

    hideModal() {
        console.log('modal closed');
        this.setState({modalVisibility: false});
    }

    render() {
        return(
            <ModalComponent {...this.state.modalComponentProps} visible={this.state.modalVisibility} onClose={()=>this.hideModal()}/>
        );
    }
}