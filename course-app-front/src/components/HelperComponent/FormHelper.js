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
        {type: 'checkbox', name: "the_name", value: "", placeholder: "", event: '', options: []},
        {type: 'textarea', name: "the_name", value: "", placeholder: "", event: ''},
        {type: 'list', name: "the_name", value: "", placeholder: "", event: '', data: []}
    ]
};


function LabelHelper(props) {
    if (props.label) {
        return (<label className={"form-helper-label"}> {props.label} </label>);
    }
    return (<span/>);
}


export class CheckBoxHelper extends Component {
    render() {
        return ("");
    }
}

export class TextareaHelper extends Component {

    render() {
        return (
            <div className={'form-helper-div-input'}>
                <LabelHelper label={this.props.params.label}/>
                <textarea
                    className={"form-helper-textarea"}
                    name={this.props.params.name}
                    onChange={this.props.onChange}
                >
                </textarea>
            </div>
        );
    }
}

export class InputTextHelper extends Component {
    render() {
        return (
            <div className={'form-helper-div-input'}>
                <LabelHelper label={this.props.params.label}/>
                <input type={"text"}
                       className={"form-helper-input"}
                       name={this.props.params.name}
                       onChange={this.props.onChange}
                       value={this.props.params.value}
                       placeholder={this.props.params.placeholder || this.props.params.name}
                />
            </div>
        );
    }
}
export class InputEmailHelper extends Component {
    render() {
        return (
            <div className={'form-helper-div-input'}>
                <LabelHelper label={this.props.params.label}/>
                <input type={"email"}
                       className={"form-helper-input"}
                       name={this.props.params.name}
                       onChange={this.props.onChange}
                       value={this.props.params.value}
                       placeholder={this.props.params.placeholder || this.props.params.name}
                />
            </div>
        );
    }
}
export class InputPasswordHelper extends Component {
    render() {
        return (
            <div className={'form-helper-div-input'}>
                <LabelHelper label={this.props.params.label}/>
                <input type={"password"}
                       className={"form-helper-input"}
                       name={this.props.params.name}
                       onChange={this.props.onChange}
                       value={this.props.params.value}
                       placeholder={this.props.params.placeholder || this.props.params.name}
                />
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
                {this.props.params.value || this.props.params.name }
            </button>
        );
    }
}

export class ListFromModelHelper extends Component {
    constructor(props){
        super(props);
        this.state={
            dataToSend:{
                target:{
                    name:this.props.params.name,
                    value:[]
                }
            }
        }
    }
    handleChange(e){
        //let valuesTab= this.state.dataToSend.target.value;
        // e.target.checked
        this.props.onChange(this.state.dataToSend);
    }
    componentDidMount(){
        console.log(this.props.params);
        console.log("list from "+this.props.params.targetedModel.dataModel + " Mounted");
        this.props.onChange(this.state.dataToSend);
    }

    render() {
        let listofelements=[];
        return (
            <div className={"list-from-model-container"}>
                {listofelements.map((elt,key)=>{
                    return(
                        <div className={"list-from-model-checkbox-container"}>
                            <input type={'checkbox'}
                                   name={elt.name}
                                   value={elt._id}
                                   onChange={(e) => this.handleChange(e)}
                            />
                            <div> {JSON.stringify(elt)} </div>
                        </div>
                    );
                })}
            </div>
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
            if (response.data.data.ok) {
                alert("Enregistrement Effectué");
            } else{
                alert("Enregistrement non Effectué");
            }
        });
    }
    render() {
        let onChangeCallBack=(e)=>{this.handleChange(e)};
        let onClickCallBack=(e)=>{this.handleClick(e)};
        let generalOptions = this.props.data.generalOptions;
        return (
            <div>
            <form>
                <section className={"form-title"}> user registration form</section>
                {this.props.data.fields.map(function (elt, key) {
                    switch (elt.type) {
                        case 'text': {
                            return (<InputTextHelper key={key} generalOptions={generalOptions} params={elt}  onChange={onChangeCallBack} />);
                        }
                            break;
                        case 'email': {
                            return (<InputEmailHelper key={key} params={elt}  onChange={onChangeCallBack} />);
                        }
                            break;
                        case 'password': {
                            return (
                                <InputPasswordHelper key={key}  params={elt} onChange={onChangeCallBack} />);
                        }
                            break;
                        case 'button': {
                            return (<ButtonHelper key={key} params={elt} onChange={onChangeCallBack} />);
                        }
                            break;
                        case 'select': {
                            return (<SelectHelper key={key} params={elt} onChange={onChangeCallBack} />);
                        }
                        case 'listfrommodel': {
                            return (<ListFromModelHelper key={key} params={elt} onChange={onChangeCallBack} />);
                        }
                            break;
                        case 'textarea': {
                            return (<TextareaHelper key={key} params={elt} onChange={onChangeCallBack} />);
                        }
                            break;
                    }
                })}
                <div className={'hr-button-block'}>
                    <ButtonHelper params = {{type: 'reset', className:' form-helper-button danger', value:'Reset'}}/>
                    <ButtonHelper params = {{type: 'button',className:'form-helper-button success', value:'Valider', onClick: onClickCallBack}}/>
                </div>
            </form>
            </div>
        );
    }
}

//export class TextareaHelper;
export default FormHelper;