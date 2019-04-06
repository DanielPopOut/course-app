import React,{Component} from 'react';
import './users.css';
import {usersModel} from '../DataManagerComponent/DataModelsComponent'
import FormHelper, {ButtonHelper, InputTextHelper} from '../HelperComponent/FormHelper';
import {ServerService} from "../../server/ServerService";
import {LISTS_PATH, USERS_FILTER_PATH} from "../../server/SERVER_CONST";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import DataManagerPage from "../DanielComponent/DataManagerPage/DataManagerPage";
import {loadDataIntoModel} from "../StaticFunctionsComponent/StaticFunctions";

export class UsersCreationForm extends Component{
    render(){
        let options={label:''};
        return(
            <FormHelper
                data={usersModel}
                registration_path={'authentication/newuser'}
                title={"Nouvel Utilisateur"}
                options={options}
            />
        );
    }
}

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
                   <div className={"div-search-block"}>
                       <InputTextHelper {...inputsearchparams}
                              onChange={(e)=>this.handleChange(e)}
                       />
                       <div className={"div-img-search"}>
                           <img src={"/images/search.png"}
                                alt={"Search"}
                                onClick={(e)=>this.handleValidateSearch(e)}
                                className={"button-image-user-search"}/>
                       </div>
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

class Users extends Component{

    constructor(props){
        super(props);
        this.state={
            ListToShow:[],
            modalVisibility:false,
            modalChildren:""
        }
    }

    getListToShow(){
        ServerService.postToServer('/crudOperations/get', {collection: 'users'}).then((response)=>{
          //console.log(res.data);
            if(response.status===200){
                this.setState({ListToShow:response.data});
            }else{
                alert(response.data.errorMessage);
            }
        });
    }

    componentDidMount(){ this.getListToShow(); }

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

    handleFilter(users){this.setState({ ListToShow:users});}

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
                        <DataManagerPage {...usersModel} />
                    </div>
                    <div className={"users-interface-footer"}>
                        <UserInterfaceFooter/>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default Users;