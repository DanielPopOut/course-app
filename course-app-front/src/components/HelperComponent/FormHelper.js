import React, {Component} from 'react';
import './formhelper.css';
import { REGISTRATIONS_PATH } from '../../server/SERVER_CONST';
import { ServerService } from '../../server/ServerService';


let data = {
    generalOptions: {className:"text-centered"},
    elements: [
        {type: 'text', name: "the_name", value: "", placeholder: "", event: ''},
        {type: 'button', name: "the_name", value: "", placeholder: "", event: ''},
        {type: 'select', name: "the_name", value: "", placeholder: "", event: '', data: []},
        {type: 'checkbox', name: "the_name", value: "", placeholder: "", event: '', data: []},
        {type: 'textarea', name: "the_name", value: "", placeholder: "", event: ''},
        {type: 'list', name: "the_name", value: "", placeholder: "", event: '', data: []}
    ]
};


function LabelHelper(props) {
    if (props.label) {
        return (<label> {props.label} </label>);
    }
    return (<span/>);
}


export class CheckBoxHelper extends Component {
    render() {
        return ("");
    }
}

export class TextareaHelper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataToSend: {}
        }
    }

    render() {
        return (
            <div className={'div-input'}>

                <label label={this.state.params.label}/>
                <InputTextHelper/>
            </div>
        );
    }
}

export class InputTextHelper extends Component {
    render() {
        return (
            <div className={'div-input'}>
                <LabelHelper label={this.props.params.label}/>
                <input type={"text"} name={this.props.params.name} onChange={this.props.onChange} value={this.props.params.value}/>
            </div>
        );
    }
}
export class InputPasswordHelper extends Component {
    render() {
        return (
            <div className={'div-input'}>
                <LabelHelper label={this.props.params.label}/>
                <input type={"password"} name={this.props.params.name} onChange={this.props.onChange} value={this.props.params.value}/>
            </div>
        );
    }
}

export class SelectHelper extends Component {
    render() {
        return (
            <div>
                <select name={this.props.params.name}>
                    {this.params.options.map(function (key,elt) {
                        return (<option value={elt.avalue}> {elt.ashownvalue}  </option>);
                    })}
                </select>
            </div>
        );
    }
}

export class ButtonHelper extends Component {
    render() {
        return (
            <button
                type={this.props.params.type}
                className={this.props.params.className}
                onClick={this.props.params.onClick}
            >
                {this.props.params.value}
            </button>
        );
    }
}

export class FormHelper extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            collectionName:this.props.data.dataModel,
            dataToSend:{}
        };
    }
    handleChange(e){
        let newdata=Object.assign({},this.state.dataToSend,{[e.target.name]: e.target.value});
        this.setState({dataToSend:newdata});
        console.log(this.state.dataToSend);
    }
    handleClick(e){
        let registration_path = REGISTRATIONS_PATH+this.state.collectionName;
        console.log(registration_path);
        ServerService.postToServer(registration_path,this.state.dataToSend).then((response)=>{
            console.log(response.data);
        });
    }
    render() {
        let onChangeCallBack=(e)=>{this.handleChange(e)};
        let onClickCallBack=(e)=>{this.handleClick(e)};
        return (
            <div>
            <form>
                {this.props.data.fields.map(function (elt, key) {
                    switch (elt.type) {
                        case 'text': {
                            return (<InputTextHelper key={key} params={elt} onChange={onChangeCallBack} />);
                        }
                            break;
                        case 'password': {
                            return (
                                <InputPasswordHelper key={key} params={elt} onChange={onChangeCallBack} />);
                        }
                            break;
                        case 'button': {
                            return (<ButtonHelper key={key} params={elt} onChange={onChangeCallBack} />);
                        }
                            break;
                        case 'select': {
                            return (<SelectHelper key={key} params={elt} onChange={onChangeCallBack} />);
                        }
                            break;
                        case 'textarea': {
                            return (<TextareaHelper key={key} params={elt} onChange={onChangeCallBack} />);
                        }
                            break;
                    }
                })}
                <div className={'hr-button-block'}>
                    <ButtonHelper params = {{type: 'reset', className:'danger', value:'Reset'}}/>
                    <ButtonHelper params = {{type: 'button',className:'success', value:'Valider', onClick:onClickCallBack}}/>
                </div>
            </form>
            </div>
        );
    }
}

//export class TextareaHelper;
export default FormHelper;