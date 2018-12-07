import React, { Component } from 'react';
import './addadmincourse.css';


export default class AddAdminCourse extends Component{
    render(){
        return(
            <div>
                <form name='addadmincourseform'>
                    <div>
                        <label>Admin Course</label>
                        <input type="text" name='admincoursename'/>
                    </div>
                    <div>
                        <button > Valider</button>
                        <button type='reset'> Annuler</button>
                    </div>
                </form>
            </div>
        )  ;
    }
}



