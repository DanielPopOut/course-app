import React,{Component} from 'react';
import './modalhelper.css';

export default class ModalHelper extends Component {

    render(){
        return(
            <div className={this.props.modalParams.modalClass}>
                <div className={"modal-close"} onClick={()=>this.props.modalParams.handleClose()}> X </div>
                <div className={'modal-header'}> {this.props.modalParams.modalTitle || "Modal title no set"} </div>
                <div className={"modal-content"}>
                    {this.props.modalParams.content}
                </div>
                <div className={'modal-footer'}> {this.props.modalParams.modalFooter } </div>
            </div>
        );
    }
}