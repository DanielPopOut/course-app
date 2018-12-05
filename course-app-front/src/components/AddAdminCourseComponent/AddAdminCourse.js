import React, { Component } from 'react';
import './addadmincourse.css';


class AddAdminCourseButtons extends Component{
    render(){
        return(
            <div>
                <button type='submit'> Valider</button>
                <button type='reset'> Annuler</button>
            </div>
        );
    }

}
class AddAdminCourseAdminInput extends Component{
    render(){
        return(
            <div>
                <label>Admin Course</label>
                <input type="text" name='admincoursename'/>
            </div>
        );
    }

}

class AddAdminCourseForm extends Component{
    render(){
        return(
            <form name='addadmincourseform'>
                <AddAdminCourseAdminInput/>
                <AddAdminCourseButtons/>
            </form>
        );
    }
}
export default class AddAdminCourse extends Component{
    render(){
        return(
            <div>
               <AddAdminCourseForm/>
            </div>
        );
    }
}



