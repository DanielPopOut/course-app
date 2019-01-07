import React,{Component} from 'react';
import './contactscomponent.css'
import {FormHelper} from "../HelperComponent/FormHelper";

class ContactForm extends Component{
    render(){
        return(
            <div>

            </div>
        );
    }

}



class ContactsComponent extends Component{
    render(){
        return(
            <div className={"contacts-container"}>
                <div className={"contacts-about-us"}>

                </div>

                <ContactForm/>
            </div>
        );
    }

}

export default ContactsComponent;