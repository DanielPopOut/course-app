import React, {Component} from 'react';
import './formhelper.css';
import { REGISTRATIONS_PATH } from '../../server/SERVER_CONST';
import { ServerService } from '../../server/ServerService';

let data = {
    options: {className:"text-centered"},
    elements: [
        {type: 'text', name: "the_name", value: "", placeholder: "", event: ''},
        {type: 'button', name: "the_name", value: "", placeholder: "", event: ''},
        {type: 'select', name: "the_name", value: "", placeholder: "", event: '', data: []},
        {type: 'checkbox', name: "the_name", value: "", placeholder: "", event: '', options: []},
        {type: 'textarea', name: "the_name", value: "", placeholder: "", event: ''},
        {type: 'list', name: "the_name", value: "", placeholder: "", event: '', data: []}
    ]
};

export function LabelHelper(props) {
    if (props.label) {
        return (<label className={"form-helper-label"}> {props.label} </label>);
    }
    return (<span></span>);
}

export class CheckBoxHelper extends Component {
    constructor(props){
        super(props);
        this.state={
            checked:this.props.checked||false
        }
    }
    handleChange(e){
        if(!this.props.readOnly){
            this.setState({checked:!this.state.checked});
            if(this.props.onChange){
                this.props.onChange(e)
            }
        }

    }

    render() {
        return (
            <div>
                <input
                    id={this.props.checkbox_id || ''}
                    type={'checkbox'}
                    checked={this.state.checked}
                    className={this.props.className || "form-helper-checkbox"}
                    onChange={(e) => this.handleChange(e)}
                    name={this.props.name}
                />
                <LabelHelper label={this.props.label}/>
            </div>
        )
    }
}

export class CheckBoxesHelper extends Component {
    render() {
        return (
            <div>
                {this.props.options.map((params,key)=>{
                   return( <CheckBoxHelper key={key} {...params}/>);
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
                    {this.props.title || ""}
                </div>
                <div className={"form-helper-radio-group-body"}>
                    {
                        this.props.options.map((option,key)=>{
                            option=Object.assign({},option,{name:this.props.name});
                            return( <RadioHelper key={key} {...option} onChange={(e)=>this.props.onChange(e)}/>);
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
                <input type={'radio'} onChange={(e)=>this.props.onChange(e)} name={this.props.name}/>

            </div>
        );
    }
}

export class TextareaHelper extends Component {
    constructor(props){
        super(props);
        this.state={
            value:this.props.value||""
        }
    }
    handleChange(e){
        this.setState({value:e.target.value});
        if(this.props.onChange){
            this.props.onChange(e)
        }
    }

    render() {
        return (
            <div className={'form-helper-div-input'}>
                <LabelHelper label={this.props.label || this.props.name||""}/>
                <textarea
                    required={'required'}
                    className={"form-helper-textarea"}
                    name={this.props.name || ""}
                    onChange={(e)=>this.handleChange(e)}
                    value={this.state.value}
                >
                </textarea>
            </div>
        );
    }
}

export class InputTextHelper extends Component {
    constructor(props){
        super(props);
        this.state={
            value:this.props.value||""
        }
    }
    handleChange(e){
        this.setState({value:e.target.value});
        if(this.props.onChange){
            this.props.onChange(e)
        }
    }
    render() {
        return (
            <div className={'form-helper-div-input'}>
                <LabelHelper label={ this.props.label}/>
                <input type={this.props.type}
                       required={'required'}
                       className={this.props.className || "form-helper-input"}
                       name={this.props.name}
                       onChange={(e)=>this.handleChange(e)}
                       value={this.state.value}
                       placeholder={this.props.placeholder || this.props.name}
                       autoFocus={this.props.autoFocus}
                />
            </div>
        );
    }
}
export class SelectHelper extends Component {
    render() {
        return (
            <div>
                <select name={this.props.name}
                        className={this.props.className || "form-helper-select"}
                        onChange={(e)=>this.props.onChange(e)}
                >
                    <option value='-1' defaultValue> {this.props.empty||" --- make a choice ---"} </option>
                    {this.props.options.map((elt,key)=> {
                        return (<option key={key} value={elt[this.props.value]||key}> {elt[this.props.display]||elt}  </option>);
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
                type={this.props.type}
                className={this.props.className}
                onClick={this.props.onClick}
            >
                {this.props.value || this.props.name }
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
                    name:this.props.name,
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
       /* console.log(this.props.params);
        console.log("list from "+this.props.targetedModel.dataModel + " Mounted");*/
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
            collectionName:this.props.data.collection||'',
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
        if(this.props.handleValidation){
            this.props.handleValidation(this.state.dataToSend);
        }else{
            ServerService.postToServer(registration_path,this.state.dataToSend).then((response)=>{
                if(response.status===200){
                    alert("Enregistrement Effectué avec succès");
                }else{
                    console.log("error Message ",response.data.errorMessage);
                    alert("Enregistrement non effectué");
                }
            });
        }
    }
    render() {
        let onChangeCallBack=(e)=>{this.handleChange(e)};
        let onClickCallBack=(e)=>{this.handleClick(e)};
        let options = this.props.options|| {};
        return (
            <div>
                <form>
                <section className={"form-helper-title"}> <h3>{this.props.title||""}</h3></section>
                {
                    this.props.data.fields.map(function (elt, key) {
                        switch (elt.type) {
                        case 'text':
                        case 'email':
                        case 'number':
                        case 'password': {
                            return (
                                <InputTextHelper key={key} options={options} {...elt} onChange={onChangeCallBack} />);
                        }
                            break;
                        case 'button': {
                            return (<ButtonHelper key={key} options={options} {...elt} onChange={onChangeCallBack} />);
                        }
                            break;
                        case 'select': {
                            return (<SelectHelper key={key} options={options} {...elt} onChange={onChangeCallBack} />);
                        }
                        case 'listfrommodel': {
                            return (<ListFromModelHelper key={key} options={options} {...elt} onChange={onChangeCallBack} />);
                        }
                            break;
                        case 'textarea': {
                            return (<TextareaHelper key={key} options={options} {...elt} onChange={onChangeCallBack} />);
                        }
                            break;
                    }
                    })
                }
                <div className={'hr-button-block'}>
                    <ButtonHelper {...{type: 'reset', className:' form-helper-button danger', value:'Reset'}}/>
                    {this.props.modificationForm?
                        <ButtonHelper {...{type: 'button',className:'form-helper-button success', value:'Modifier'}} onClick={onClickCallBack}/>
                        :
                        <ButtonHelper {...{type: 'button',className:'form-helper-button success', value:'Valider'}} onClick={onClickCallBack}/>
                    }
                </div>
            </form>
            </div>
        );
    }
}


export class InputHelper extends Component {
    constructor(props)
    {
        super(props);
    }
    renderfield(params){
        let onChangeCallBack=(e)=>{this.props.onChange(e)};
        let options = this.props.options || {};
        switch (params.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'password': {
                return (
                    <InputTextHelper  options={options} {...params} onChange={onChangeCallBack} />);
            }
                break;
            case 'button': {
                return (<ButtonHelper options={options} {...params} onChange={onChangeCallBack} />);
            }
                break;
            case 'select': {
                return (<SelectHelper  options={options} {...params} onChange={onChangeCallBack} />);
            }
            case 'listfrommodel': {
                return (<ListFromModelHelper  options={options} {...params} onChange={onChangeCallBack} />);
            }
                break;
            case 'textarea': {
                return (<TextareaHelper options={options} {...params} onChange={onChangeCallBack} />);
            }
                break;
        }
    }
    render() {
        return ( this.renderfield(this.props) );
    }
}


export default FormHelper;