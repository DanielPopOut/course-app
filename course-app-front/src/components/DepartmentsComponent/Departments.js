import React, { Component } from 'react';
import './department.css';
import {departmentsModel} from '../DataManagerComponent/DataModelsComponent';
import FormHelper from '../HelperComponent/FormHelper';


class Departments extends Component{
    render(){
        return(
            <div className={'department-container'}>
                <div className={"department-header"}>

                </div>
                <div className={'department-body'}>
                    <FormHelper data={departmentsModel}/>
                </div>
                <div className={'department-footer'}>  </div>
            </div>
        );
    }
}

export default Departments;
