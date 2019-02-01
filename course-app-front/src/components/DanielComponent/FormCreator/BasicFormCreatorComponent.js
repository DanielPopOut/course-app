import React, { Component } from 'react';
import './BasicFormCreatorComponent.css'
import {ButtonHelper, FormFieldsHelper, InputHelper, InputTextHelper} from "../../HelperComponent/FormHelper";
import FormHelper from "../../HelperComponent/FormHelper";

class BasicFormCreatorComponent extends Component {
    //Prend un objet dataModel qui représente le formulaire à créer
    // [{name: 'module', type: 'text', placeholder:'matière', label: 'Matière'}, {} ...]
    // Si pas de label ca utilise le name
    // data --> objet existant et dataModel --> model pocdur créer
    constructor(props) {
        super(props);
        let dataToSendModel = props.dataModel.reduce((total,cur)=>{total[cur.name]=''; return total}, {});
        this.state = {
            // dataToSend: props.data ? Object.assign({},props.data) : Object.assign({},dataToSendModel),
            dataToSend: props.data ? Object.assign({},props.data) : Object.assign({},dataToSendModel),
            dataToSendModel: dataToSendModel,
        };
    }

    onEnterClick(event) {
        if (event.name === 'Save') {
            this.onValidate()
        }
    }


    modifyData(e) {
        let dataToSendCopy = Object.assign({}, this.state.dataToSend, {[e.target.name]: e.target.value});
        this.setState({dataToSend: dataToSendCopy});
        console.log(dataToSendCopy);
    }

    createForm() {

        return this.props.dataModel.map(dataModelElement => {
            let inputparams = {
                type: dataModelElement.type,
                label: dataModelElement.label || dataModelElement.name,
                name: dataModelElement.name,
                placeholder: dataModelElement.placeholder,
                value: this.state.dataToSend[dataModelElement.name] || ''
            };
            return <div className='label-input-div' key={dataModelElement.name}>
                <InputHelper {...inputparams} onChange={e => this.modifyData(e)}/>
            </div>;
        });
    }
    onValidate() {
        this.props.onValidate ? this.props.onValidate(this.state.dataToSend) : alert(JSON.stringify(this.state.dataToSend));
    }


    onReset() {
        this.setState({dataToSend: Object.assign({},this.state.dataToSendModel)});
        console.log(this.state.dataToSend);
    }
    buttons(){

        let result=

        <React.Fragment>
            <div className={"hr-button-block"}>
                {   this.props.onValidate?
                    <ButtonHelper
                        onClick={() => this.props.onValidate( this.state.dataToSend)}
                        {...{
                            type:'button',
                            value:'Valider',
                            className:'form-helper-button success'
                        }}/>
                    :''
                }
                {   this.props.onDelete?
                    <ButtonHelper
                        onClick={() => this.props.onDelete( this.state.dataToSend)}
                        {...{
                            type:'button',
                            value:'Supprimer',
                            className:'form-helper-button danger'
                        }}/>
                    :''
                }
                {
                this.props.onModify?
                    <ButtonHelper
                        onClick={() => this.props.onModify( this.state.dataToSend)}
                        {...{
                            type:'button',
                            value:'Modifier',
                            className:'form-helper-button success'
                        }}/>
                    :''
            }
            </div>
        </React.Fragment>;

            return (result);

    }


    render() {
        // console.log('data to send', this.state.dataToSend)
        return <div onKeyPress={(event) => this.onEnterClick(event)}>
            <h2>{this.props.title}</h2>
            {this.createForm()}
            <div className='flex-container'>
                { this.buttons() }
                {this.props.children}
            </div>
        </div>;
    }
}

export default BasicFormCreatorComponent;
