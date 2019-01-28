import React,{Component} from 'react';
import './users.css';
import {usersModel} from '../DataManagerComponent/DataModelsComponent'
import FormHelper, {ButtonHelper, InputTextHelper} from '../HelperComponent/FormHelper';
import {ServerService} from "../../server/ServerService";
import {LISTS_PATH, USERS_FILTER_PATH} from "../../server/SERVER_CONST";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import {DataViewElement} from "../HelperComponent/DataViewHelper";
import {loadDataIntoModel} from "../StaticFunctionsComponent/StaticFunctions";
import DataManagerPage from "../DanielComponent/DataManagerPage/DataManagerPage";



export class UsersCreationForm extends Component{
    render(){
        let options={label:''};

        return(<FormHelper data={usersModel} registration_path={'authentication/newuser'} title={"Nouvel Utilisateur"} options={options}/>);
    }
}

class SingleUserblock extends Component{
    constructor(props){
        super(props);
        this.state={
            user:this.props.user
        }
    }
    handleClick(e){
        this.props.handleClick(this.state.user);
    }
    render(){
        return(
            <div onClick={(e)=>{this.handleClick(e)}} className={"user-list-single-block"}>
                <div className={"user-list-avatar"}>
                    <figure className={"figure-avatar"}>
                        <img src={this.state.user.avatar || "/images/user3_thom1.png"} alt={"avatar"}/>
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
/*
class UsersList extends Component{
    constructor(props){
        super(props);
        this.state={
            selected:''
        };
    }
    handleClick(user){
        console.log(user);
        let usersmodel= loadDataIntoModel(usersModel,user);
        let visibility = true;
        let children = <React.Fragment>
            {/!*<DataViewElement data={user}/>*!/}
            <FormHelper data={usersmodel} title={"Modify User"} modify={true} options={{label:false}} />
        </React.Fragment>;
        this.props.handleModal(visibility,children);
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
                        return (<SingleUserblock key={key} user={elt} handleClick={(user)=>this.handleClick(user)} />);
                    })
                }
            </div>
        );
    }
}*/

class UserInterfaceHeader extends Component{
    constructor(props){
        super(props);
        this.state={
            valueToSearch:"",
            dataToSend:[]
        }
    }
    handleValidateSearch(e){
        let options={valueToSearch: this.state.valueToSearch};

        this.props.handleFilter([]);
        ServerService.getFromServer(USERS_FILTER_PATH,options).then((response)=>{
            console.log(response.data);
            this.props.handleFilter(response.data.users);
        });
    }
    handleChange(e){
        this.setState({valueToSearch:e.target.value});
    }
    handleClick(e){
        let visibility=true;
        let children=<UsersCreationForm/>;
        this.props.handleModal(visibility,children);
    }

    render(){
        let buttonnewuser={
            name:"newuserbutton",
            value:"Ajouter un utilisateur",
            className:"form-helper-button success"
        };
        let inputsearchparams={
            type:'text',
            name : 'input-user-search',
            className : "search-input form-helper-input ",
            placeholder :'Search'
        };

       return(
           <React.Fragment>
               <div className={"users-interface-header"}>
                   <h3>{"Welcome to Users Management Interface !!"} </h3>
               </div>
               <div className={"user-search-new-div"}>
                   <div className={"div-user-search-block"}>
                       <InputTextHelper params={inputsearchparams}
                              onChange={(e)=>this.handleChange(e)}
                       />
                       <div className={"div-img-search"}>
                           <img src={"/images/search.jpg"}
                                alt={"Search"}
                                onClick={(e)=>this.handleValidateSearch(e)}
                                className={"button-image-user-search"}/>
                       </div>
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
            modalChildren:""
        }
    }
    getListToShow(){
        let collection="users/";
        let options = {};
        ServerService.postToServer('/crudOperations/get', {collection: 'users'}).then((res)=>{
          //console.log(res.data);
            this.setState({ListToShow:res.data});
        });
    }
    componentDidMount(){
        this.getListToShow();
    }

    handleModalClose(){
        this.setState({modalChildren:""});
        this.setState({modalVisibility:false});
    }
    handleModal(visibility,children){
        this.setState({
            modalVisibility:visibility,
            modalChildren:children
        });
    }
    handleFilter(users){
        this.setState({ ListToShow:users});
    }

    render(){
        return(
            <React.Fragment>
                <div>
                    <ModalComponent
                        visible={this.state.modalVisibility}
                        onClose={()=>this.handleModalClose()}
                        children={this.state.modalChildren}
                    />
                </div>
                <div className={"users-interface-block"}>
                    <div className={"users-interface-header"}>
                        <UserInterfaceHeader handleFilter={(users)=>this.handleFilter(users)} handleModal={(v,ch)=>this.handleModal(v,ch)}/>
                    </div>
                    <div className={"users-interface-content"}>
                        <DataManagerPage {...usersModel}/>
                    </div>
                    <div className={"users-interface-footer"}>
                        <UserInterfaceFooter/>
                    </div>
                </div>
            </React.Fragment>

        )
    }
}