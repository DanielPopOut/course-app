import React,{Component} from 'react';
import './users.css';
import {UsersModel} from '../DataManagerComponent/DataModelsComponent'
import FormHelper from '../HelperComponent/FormHelper';

class UsersCreationForm extends Component{
    render(){
        return(<FormHelper data={UsersModel}/>);
    }
}

export default class Users extends Component{
    render(){
        return(
            <div className={"users-interface-block"}>
                <div className={'users-interface-form-block'}>
                    <div> Here my Form </div>
                    <UsersCreationForm/>
                </div>
                <div className={"users-interface-list-block"}>
                    here my list
                </div>
            </div>)
    }

}