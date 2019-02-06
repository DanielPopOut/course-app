import React,{Component} from 'react';
import './newteacher.css';
import {ButtonHelper, InputTextHelper} from "../HelperComponent/FormHelper";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import {USERS_FILTER_PATH} from "../../server/SERVER_CONST";
import {ServerService} from "../../server/ServerService";

const courseslist = [
    {
        '_id':1,
        title:"course title ",
        description: "description description" +
        " description description description " +
        "description "
    },
    {
        '_id':2,
        title:"course title",
        description: "description description" +
        " description description description description" +
        " description description ar8gpgipi description description description " +
        "description "
    }, {
        '_id':3,
        title:"course title",
        description: "description description" +
        " description description description description" +
        " description description ar8gpgipi description description description " +
        "description "
    }, {
        '_id':4,
        title:"course titlecourse titlecourse title verugfery goygworgo 8g7o348 qo48gq 74go34879goq84g87g847goq4 87gq",
        description: "description description" +
        " description description description description" +
        " description description ar8gpgipi description description description " +
        "description "
    },
    {
        '_id':5,
        title:"course title",
        description: "description description" +
        " description description description " +
        "description "
    }
];
const userslist = [
    {
        '_id':1,
        name:"a name ",
        surname: "a surname"
    },
 {
        '_id':2,
        name:"a name ",
        surname: "a surname"
    },
 {
        '_id':3,
        name:"a name ",
        surname: "a surname"
    },
 {
        '_id':4,
        name:"a name ",
        surname: "a surname"
    },

];


class AccountView extends Component{
    constructor(props){
        super(props);
    }
    handleClick(){
        this.props.validate(this.props.user);
    }
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
                                          onClick={()=>this.handleClick()}
                            />
                            :
                            <ButtonHelper {...
                                {value:'+',className:"form-helper-button success"}}
                                          onClick={()=>this.handleClick()}
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
        ServerService.postToServer('finduserswithemails/',this.state.emails).then((response)=>{
            if(response.status===200){
                console.log('acc list',response.data.users);
                this.setState({
                    selectedAccounts:response.data.users
                })
            }
        });
    }

    handleChange(e) {
        let emails=[];
        emails=e.target.value.split(';');
        emails = [...new Set(emails)];// remove duplicates
        emails = emails.filter((value,index)=>{ return value.length>1 }); //remove empty address
        this.setState({emails:emails});
    }

    handleValidate(user,action){
        console.log('you\'re about to ' + action + 'teacher');
        let course=this.state.dataToSend.course;

        if(action==='add'){
            user.teacher=user.teacher ? user.teacher.push(course._id): [course._id];
            course.teachers=course.teachers?course.teachers.push(user._id): [user._id];
        }else {
            user.teacher=user.teacher ? user.teacher.filter((value,index)=>{return value!==course._id}): [];
            course.teachers=course.teachers?course.teachers.filter((value,index)=>{return value !== user._id}): [];
            //  console.log('user ',user,'course',course);
        }
        this.setState({
            dataToSend:{
                user:user,
                course:course
            }
        });
        ServerService.postToServer('cruds/update',{collection:'courses',data:this.state.dataToSend.course})
            .then((response)=>{
                if(this.response.status===200){
                    console.log('response',response.data)
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
            <div>
                <div className={"div-user-search-block"}>
                    <InputTextHelper
                        {...inputsearchparams}
                        onChange={(e)=>this.handleChange(e)}
                    />
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
                            return(<AccountView user={user} key={key} validate={(user)=>this.handleValidate(user,'add')}/>);
                        })
                    }
                </div>
                <div>
                    {
                        this.state.currentTeachers.map((user,key)=>{
                            return(<AccountView user={user} key={key} current validate={(user)=>this.handleValidate(user,'remove')} />);
                        })
                    }
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
                        className: 'form-helper-button success'
                    }} onClick={(e) => this.handleNewTeacherClick(e) }
                />
            </div>
        );
    }
}

export default NewTeacher;