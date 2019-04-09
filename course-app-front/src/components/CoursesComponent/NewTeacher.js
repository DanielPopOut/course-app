import React,{Component} from 'react';
import './newteacher.css';
import {ButtonHelper, InputTextHelper} from "../HelperComponent/FormHelper";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import {validateEmail} from '../StaticFunctionsComponent/StaticFunctions';
import {ServerService} from "../../server/ServerService";
import {displayMessage} from "../../server/axiosInstance";


class AccountView extends Component{
    render(){
        return(
            <div className={"teacher-to-add-div"}>
                <div>
                    <div> {this.props.user.email} </div>
                    <div>{this.props.user.name + " " + this.props.user.surname}</div>
                </div>
                <div>
                    {
                        this.props.current?
                            <ButtonHelper {...
                                {value:'-',className:"form-helper-button danger"}}
                                          onClick={()=>this.props.handleValidation()}
                            />
                            :
                            <ButtonHelper {...
                                {value:'+',className:"form-helper-button success"}}
                                          onClick={()=>this.props.handleValidation()}
                            />
                    }
                </div>
            </div>
        )
    }
}

class Teachers extends Component{
    constructor(props){
        super(props);
        this.state={
            currentTeachers:[],
            emails:[],
            selectedAccounts:[],
            dataToSend: {
                user: {},
                course: this.props.course
            }
        }
    }

    handleValidateSearch(e){
        if(this.state.emails.length===0){
            displayMessage("Veuillez Saisir un email valide SVP !!");
        }else {
            ServerService.postToServer('courses/getUsers/',{emails:this.state.emails}).then((response)=>{
                if(response.status===200){
                    console.log('acc list',response.data);
                    let currentteachers=this.state.currentTeachers;
                    let selectedaccounts =this.state.selectedAccounts;
                    response.data.forEach((user)=>{
                        console.log("a user ",user);

                        if(user.hasOwnProperty('teacher') && user['teacher'].indexOf(this.props.course._id) >=0){
                            currentteachers.push(user);
                        }else {
                            selectedaccounts.push(user);
                        }
                    });
                    this.setState({
                        currentTeachers:currentteachers,
                        selectedAccounts:selectedaccounts
                    });
                    console.log("new state",this.state);
                }
            });
        }
    }

    handleChange(e) {
        let emails=[];
        emails=e.target.value.split(';');
        emails = [...new Set(emails)];// remove duplicates
        emails = emails.filter((value,index)=>{
            return  validateEmail(value);
        }); //remove empty address
        this.setState({emails:emails});
    }

    handleValidation(user,action){
        console.log("user",user);
        let newdatatosend=this.state.dataToSend;
        newdatatosend['user']=user;
        this.setState({ dataToSend:newdatatosend });
        let request_url="";
        console.log("data to be sended ",this.state.dataToSend);

        if(action==='add'){
            request_url="courses/addTeacher";
        }else {
            request_url="courses/removeTeacher";
        }

        let currentteachers=this.state.currentTeachers;
        let selectedaccounts =this.state.selectedAccounts;

        ServerService.postToServer(request_url,this.state.dataToSend)
            .then((response)=>{
                console.log("teacher response ",response);
                if(response.status===200){
                    if(action==='add'){
                        currentteachers.push(user);
                        selectedaccounts = selectedaccounts.filter((value,index)=>{
                            return value.email !== user.email;
                        });
                    }else {
                        selectedaccounts.push(user);
                        currentteachers = currentteachers.filter((value,index)=>{
                            return value.email !== user.email;
                        });
                        console.log('response',response.data);
                    }
                    this.setState({
                        currentTeachers:currentteachers,
                        selectedAccounts:selectedaccounts
                    });
                }
            });
    }

    render(){
        let inputsearchparams={
            type:'text',
            name : 'input-user-search',
            className : "search-input form-helper-input ",
            placeholder :'Email, Name , Surname, pseudo (Username)'
        };
        return(
            <div className={"search-and-list-accounts-block"}>
                <div className={"div-search-block "}>
                    <InputTextHelper {...inputsearchparams} onChange={(e)=>this.handleChange(e)}/>
                    <div className={"div-img-search"}>
                        <img src={"/images/search.png"}
                             alt={"Search"}
                             onClick={(e)=>this.handleValidateSearch(e)}
                             className={"button-image-user-search"}/>
                    </div>
                </div>
                <div>
                    {
                        this.state.selectedAccounts.map((user,key)=>{
                            return(<AccountView user={user} key={key} handleValidation={()=>this.handleValidation(user,'add')}/>);
                        })
                    }
                </div>
                <div>
                    {
                        this.state.currentTeachers.map((user,key)=>{
                            return(<AccountView user={user} key={key} current handleValidation={()=>this.handleValidation(user,'remove')} />);
                        })
                    }
                </div>
                <div>
                    {this.state.selectedAccounts.length===0?"No Result For the Moment!":""}
                </div>
            </div>
        )
    }
}

class NewTeacher extends Component{
    constructor(props){
        super(props);
        this.state={
            modalVisibility:false,
            modalChildren:""
        }
    }
    handleNewTeacherClick(){
        this.setState({
            modalVisibility:true,
            modalChildren:<Teachers course={this.props.course}/>
        });
    }
    handleModalClose(){
        this.setState({
            modalVisibility:false,
            modalChildren:""
        });
    }

    render(){
        return(
            <div>
                <ModalComponent
                    visible={this.state.modalVisibility}
                    onClose={()=>this.handleModalClose()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <ButtonHelper
                    {...{
                        name: 'newteacher',
                        value: 'New Teacher',
                        className: 'form-helper-button hr-button-block success'
                    }} onClick={(e) => this.handleNewTeacherClick(e) }
                />
            </div>
        );
    }
}

export default NewTeacher;