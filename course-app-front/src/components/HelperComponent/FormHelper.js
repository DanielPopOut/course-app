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
    return (<span></span>);
}





export class CheckBoxHelper extends Component {
    render() {
        return (
            <div>
                <input type={'checkbox'} name={this.props.params.name}/>
                <LabelHelper label={this.props.name}/>
            </div>
        );
    }
}

export class CheckBoxesHelper extends Component {
    render() {
        return (
            <div>
                {this.props.options.map((params,key)=>{
                   return( <CheckBoxHelper key={key} params={params}/>);
                })}
            </div>
        );
    }
}
export class RadiosHelper extends Component {
    render() {
        return (
            <div className={"form-helper-radio-group"}>
                <div className={"form-helper-radio-group-header"}>
                    {this.props.params.title || ""}
                </div>
                <div className={"form-helper-radio-group-body"}>
                    {
                        this.props.params.options.map((option,key)=>{
                            option=Object.assign({},option,{name:this.props.params.name});
                            return( <RadioHelper key={key} params={option} onChange={(e)=>this.props.onChange(e)}/>);
                    })}

                </div>

            </div>
        );
    }
}


export class RadioHelper extends Component {
    render() {
        return (
            <div>
                <input type={'radio'} onChange={(e)=>this.props.onChange(e)} name={this.props.params.name}/>
                <LabelHelper label={this.props.params.value}/>
            </div>
        );
    }
}


export class TextareaHelper extends Component {

    render() {
        return (
            <div className={'form-helper-div-input'}>
                <LabelHelper label={this.props.params.label}/>
                <textarea
                    required={'required'}
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
                <input type={this.props.params.type}
                       required={'required'}
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
                onClick={this.props.onClick}
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
        let registration_path = this.props.registration_path || REGISTRATIONS_PATH+this.state.collectionName;
        ServerService.postToServer(registration_path,this.state.dataToSend).then((response)=>{
            console.log(response.data);
           alert(response.data.message);
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
                        case 'text':
                        case 'email':
                        case 'number':
                        case 'password': {
                            return (
                                <InputTextHelper key={key}  params={elt} onChange={onChangeCallBack} />);
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
                    <ButtonHelper params = {{type: 'button',className:'form-helper-button success', value:'Valider'}} onClick={onClickCallBack}/>
                </div>
            </form>
            </div>
        );
    }
}

//export class TextareaHelper;
export default FormHelper;