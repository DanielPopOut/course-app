import React, {Component} from 'react';
import './formhelper.css';

let data={
    generalOptions:{},
    elements: [
        {
            type:'text',
            params:{name:"the_name",value:"",placeholder:"",event:''}
            },
        {
            type:'button',
            params:{name:"the_name",value:"",placeholder:"",event:''}
            },
        {
            type:'select',
            params:{name:"the_name",value:"",placeholder:"",event:'',data:[]}
            },
        {
            type:'checkbox',
            params:{name:"the_name",value:"",placeholder:"",event:'',data:[]}
            },
        {
            type:'textarea',
            params:{name:"the_name",value:"",placeholder:"",event:''}
            },
        {
            type:'list',
            params:{name:"the_name",value:"",placeholder:"",event:'',data:[]}
        }
    ],
};


function LabelHelper (props){
    if (props.label){
        return(<label> {props.label} </label>);
    }
    return(<span/>);
}


export class CheckBoxHelper extends Component{
    render(){
        return("");
    }
}

export class TextareaHelper extends Component{
    constructor(props){
        super(props);
        this.state={
            dataToSend:{

            }
        }
    }
    render(){
        return(
            <div className={'div-input'}>

                <label label={this.state.params.label}/>
                <InputTextHelper />
            </div>
        );
    }
}

export class InputTextHelper extends Component{
    render(){
        return(
            <div className={'div-input'}>
                <LabelHelper label={this.state.params.label}/>
                <input type={"text"} name={this.state.params.name} value={ this.state.params.value} />
            </div>
        );
    }
}

export class SelectHelper extends Component{
    render(){
        return(
            <div>
                <select name={this.props.params.name}>
                    {this.params.options.map(function(elt){
                       return(<option value={elt.avalue}> {elt.ashownvalue}  </option>) ;
                    })}
                </select>
            </div>
        );
    }
}

export class ButtonHelper extends Component{
    render(){
        return("");
    }
}

export class FormHelper extends Component{
    render(){
        return(
            <div>
                {this.props.data.elements.map(function (elt) {
                    switch (elt.type){
                        case 'text': {return(<InputTextHelper params={elt.params}/>); } break;
                        case 'button':{ return(<ButtonHelper params={elt.params}/>)} break;
                        case 'select':{ return(<SelectHelper params={elt.params}/>) } break;
                        case 'textarea':{ return(<TextareaHelper params={elt.params}/>) } break;
                    }
                })}
            </div>
        );
    }
}
//export class TextareaHelper;
export default FormHelper;