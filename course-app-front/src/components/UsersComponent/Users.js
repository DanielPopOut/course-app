import React,{Component} from 'react';
import './users.css';
import {UsersModel} from '../DataManagerComponent/DataModelsComponent'
import FormHelper, {ButtonHelper, InputTextHelper} from '../HelperComponent/FormHelper';
import {ServerService} from "../../server/ServerService";
import {LISTS_PATH} from "../../server/SERVER_CONST";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";

export class UsersCreationForm extends Component{
    render(){
        return(<FormHelper data={UsersModel} options={{label:''}} registration_path = "newuser"/>);
    }
}

class SingleUserblock extends Component{
    constructor(props){
        super(props);
        this.state={
            user:this.props.user
        }
    }
    handleClick(){
        this.props.onClick(this.state.user);
    }
    render(){
        return(
            <div onClick={()=>{this.handleClick()}} className={"user-list-single-block"}>
                <div className={"user-list-avatar"}>
                    <figure>
                        <img src={this.state.user.avatar || "/images/user3_thom1.png"}/>
                        <figcaption>
                        </figcaption>
                    </figure>
                </div>
                <div> {this.state.user.name}</div>
                <div> {this.state.user.surname}</div>
                <div> {this.state.user.address}</div>
                <div> {this.state.user.contact}</div>
                <div> {this.state.user.email}</div>
            </div>
        );
    }
}

class UsersList extends Component{
    constructor(props){
        super(props);
        this.state={
            selected:''
        };
    }
    handleClick(user){
        console.log(user);
    }
    render(){
        let listToShow= this.props.listToShow;
        let fieldsToShow = ["",'Name','Surname','address','contact','email'];

        return (
            <div className={"users-interface-list-block"}>
                <div className={"users-interface-list-block-header"}>
                    <div>
                        {
                            fieldsToShow.map((elt, key) => {
                                return (<div key={key}>{elt}</div>);
                            })
                        }
                    </div>
                </div>
                {
                    listToShow.map((elt, key) => {
                        return (<SingleUserblock key={key} user={elt} onClick={(e)=>this.handleClick(e)} />);
                    })
                }
            </div>
        );
    }
}
class UserInterfaceHeader extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    handleSearchValidate(e){


    }
    handleClick(e){

    }

    render(){
        let buttonnewuser={
            name:"newuserbutton",
            value:"Ajouter un utilisateur",
            className:"form-helper-button success"
        };
        let inputsearchparams={

        };

       return(
           <React.Fragment>
               <div className={"users-interface-header"}>
                   <h3>{"Welcome to Users Management Interface !!"} </h3>
               </div>
               <div className={"user-search-new-div"}>
                   <div className={"div-user-search-block"}>
                       <input type={'text'}
                              className={" form-helper-input input-user-search"}
                              placeholder= {'Search'}
                              onChange={(e)=>this.handleChange(e)}
                       />

                       <img src={"/images/search.jpg"}
                            onClick={(e)=>this.handleSearchValidate(e)}
                            className={"button-image-user-search"}/>
                   </div>
                   <div className={'new-user-button'}>

                   <ButtonHelper params={buttonnewuser} onClick={(e)=>this.handleClick(e)}/>

                   </div>
               </div>
           </React.Fragment>

       );
    }
}
class UserInterfaceFooter extends Component{
    render(){
        return(
            <div>

            </div>
        );
    }
}
export default class Users extends Component{
    constructor(props){
        super(props);
        this.state={
            ListToShow:[],
            modalVisibility:false,
            modalChildren:''
        }
    }
    getListToShow(){
        let collection="users/";
        let options = {};
        ServerService.getFromServer(LISTS_PATH+collection+options).then((res)=>{
          //  console.log(res.data);
            this.setState({ListToShow:res.data});
        });
    }
    componentDidMount(){
        this.getListToShow();
    }
    render(){
        return(
            <React.Fragment>
                <div>
                    <ModalComponent
                        visible={this.state.newPasswordModalVisibility}
                        onClose={()=>this.handleClose()}
                        children={this.state.modalChildren}
                    />
                </div>

                <div className={"users-interface-block"}>
                    <div className={"users-interface-header"}>
                        <UserInterfaceHeader/>
                    </div>
                    <div className={"users-interface-content"}>
                        <UsersList listToShow={this.state.ListToShow}/>
                    </div>
                    <div className={"users-interface-footer"}>
                        <UserInterfaceFooter/>
                    </div>
                </div>


            </React.Fragment>

        )
    }
}