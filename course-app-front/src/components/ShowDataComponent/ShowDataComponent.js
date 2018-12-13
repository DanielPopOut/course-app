import React, { Component } from 'react';
import './FormCreatorComponent.css'

class FormCreatorComponent extends Component {
    //Prend un objet dataModel qui représente le formulaire à créer
    // [{name: 'module', type: 'text', placeholder:'matière', label: 'Matière'}, {} ...]
    // Si pas de label ca utilise le name
    constructor(props) {
        super(props);
        let dataToSendModel = props.dataModel.reduce((total,cur)=>{total[cur.name]=''; return total}, {})
        this.state = {
            dataToSend: Object.assign({},dataToSendModel),
            dataToSendModel: dataToSendModel
        };
    }


    modifyData(e) {
        let dataToSendCopy = Object.assign({}, this.state.dataToSend, {[e.target.name]: e.target.value});
        this.setState({dataToSend: dataToSendCopy});
        console.log(dataToSendCopy);
    }

    createForm() {
        return this.props.dataModel.map(dataModelElement => {
            return <div className='label-input-div'>
                <label>{dataModelElement.label || dataModelElement.name}</label>
                <input type={dataModelElement.type}
                       name={dataModelElement.name}
                       placeholder={dataModelElement.placeholder}
                       value={this.state.dataToSend[dataModelElement.name] || ''}
                       onChange={e => this.modifyData(e)}/>
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

    render() {
        console.log(this.state.dataToSendModel);
        return <div>
            <h2>{this.props.title}</h2>
            {this.createForm()}
            <div className='margin-30px'>
                <button onClick={() => this.onValidate()}> Validate</button>
                <button onClick={() => this.onReset()}> Reset</button>
            </div>
        </div>;
    }
}

export default FormCreatorComponent;
;