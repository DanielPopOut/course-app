import React,{Component} from 'react';
import './registerforcourse.css';
import {ButtonHelper} from "../HelperComponent/FormHelper";
import {ServerService} from "../../server/ServerService";

class RegisterForCourse extends Component{
    constructor(props){
        super(props);
        this.state={ registered:false }
    }

    render(){
        return(
            <div>
                {
                    this.state.registered?
                        <ButtonHelper
                            {...{
                                name: 'courseregistrationbutton',
                                value: 'Se Desinscrire',
                                className: 'form-helper-button danger'
                            }} onClick={() => this.setState({registered : !this.props.unregister()}) }
                        /> :
                        <ButtonHelper
                            {...{
                                name: 'courseregistrationbutton',
                                value: 'S\'inscrire',
                                className: 'form-helper-button success'
                            }} onClick={() => this.setState({registered : this.props.register() }) }
                        />
                }
            </div>
        );
    }
}

export  default RegisterForCourse;