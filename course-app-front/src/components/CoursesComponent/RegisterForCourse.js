import React,{Component} from 'react';
import './registerforcourse.css';
import {ButtonHelper} from "../HelperComponent/FormHelper";
import { getDecodedToken  } from '../../server/axiosInstance';

class RegisterForCourse extends Component{
    constructor(props){
        super(props);
        this.state={ registered:this.registrationState() }
    }

    registrationState(){
        let user=getDecodedToken();
        console.log("logged user ",user);
        let student=[];
        if(user.hasOwnProperty('student')){
            student=user.student;
            if(student.indexOf(this.props.course._id) === -1){
                return false ;
            }else {
               return true ;
            }
        }
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
                            }} onClick={() => this.setState({registered : !this.props.cancelregistration()}) }
                        /> :
                        <ButtonHelper
                            {...{
                                name: 'courseregistrationbutton',
                                value: 'S\'inscrire',
                                className: 'form-helper-button success'
                            }} onClick={() => this.setState({registered : this.props.newregistration() }) }
                        />
                }
            </div>
        );
    }
}

export  default RegisterForCourse;