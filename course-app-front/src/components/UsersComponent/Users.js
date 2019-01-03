import React,{Component} from 'react';
import './users.css';
import {UsersModel} from '../DataManagerComponent/DataModelsComponent'
import FormHelper from '../HelperComponent/FormHelper';

class UsersCreationForm extends Component{
    render(){
        let data={
          options:{},
          elements: UsersModel.fields
        };
        return(<FormHelper data={data}/>);
    }
}

export default class Users extends Component{
    render(){
        return(
            <div className={"users-interface-block"}>
                <div className={'users-interface-form-block'}>
                    Here my Form
                </div>
                <div className={"users-interface-list-block"}>
                    here my list
                </div>
            </div>)
    }

}