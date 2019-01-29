import React, { Component } from 'react';
import './department.css';
import {modulesModel} from '../DataManagerComponent/DataModelsComponent';
import FormHelper from '../HelperComponent/FormHelper';
import DataManagerPage from "../DanielComponent/DataManagerPage/DataManagerPage";


class Departments extends Component{
    render(){
        return(
            <div className={'department-container'}>
                <div className={"department-header"}>

                </div>
                <div className={'department-body'}>
                    <DataManagerPage {... modulesModel}/>
                    {/*<FormHelper data={departmentsModel}/>*/}
                </div>
                <div className={'department-footer'}>  </div>
            </div>
        );
    }
}

export default Departments;
