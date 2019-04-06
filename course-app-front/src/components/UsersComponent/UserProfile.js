import React, {Component} from 'react';
import './userprofile.css';
import {getDecodedToken} from "../../server/axiosInstance";
import {ServerService} from "../../server/ServerService";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import {ButtonHelper, InputHelper} from "../HelperComponent/FormHelper";
import {CoursesList} from "../CoursesComponent/Courses";
import FormHelper from "../HelperComponent/FormHelper";
import {validateEmail, validatePassword} from "../StaticFunctionsComponent/StaticFunctions";
import {Image} from "cloudinary-react";

class ModifyConnexionParams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            dataToSend: {}
        }
    }
    handleChange(e) {
        let nextDataToSend = this.state.dataToSend;
        nextDataToSend[e.target.name] = e.target.value;
        if(e.target.value.length===0){delete nextDataToSend[e.target.name]}
        this.setState({dataToSend:nextDataToSend});
        console.log("new Data to send ",this.state.dataToSend);
    }
    verifyFields(){
        let response={
            status:true,
            message:'Ok'
        };
        let setResponse=(status=false,message="Aucune modification apportée !!")=>{
            response['status']=status;
            response['message']=message;
            return response;
        };
        let currentDataTosend=this.state.dataToSend;
        let arrayKeys=Object.keys(currentDataTosend);
        if(arrayKeys.length===0){
          return setResponse(false,"Aucune Modification appliquée");
        }else{
            //checking email
            if(arrayKeys.indexOf('email')>-1){
                if(!validateEmail(currentDataTosend['email'])){
                   return setResponse(false,"Email non valide !!");
                }
            }
            if(arrayKeys.indexOf('currentpassword') > -1){
                if(currentDataTosend['currentpassword'] !== this.state.user.password){
                    return setResponse(false,"Passwords doesn\'t Match");
                }
                currentDataTosend['password']=currentDataTosend['currentpassword'];
                delete (currentDataTosend['currentpassword']);
            }
            if(
                arrayKeys.indexOf('newpassword') > -1 ||
                arrayKeys.indexOf('confirmedpassword') > -1
            ){
                if(currentDataTosend['newpassword'] !== currentDataTosend['confirmedpassword']){
                    return setResponse(false,"Passwords doesn\'t Match");
                }
                if(!validatePassword(currentDataTosend['newpassword']||"")){
                    return setResponse(false,"New password not valide");
                }

                currentDataTosend['password']=currentDataTosend['newpassword'];
                delete (currentDataTosend['newpassword']);
                delete (currentDataTosend['currentpassword']);
                delete (currentDataTosend['confirmedpassword']);
            }
        }
        let checkdiff=false;
        arrayKeys.forEach((elt)=>{
            console.log("state :  "+ this.state.user[elt] + " curr : "+currentDataTosend[elt]);
           if(this.state.user[elt]!==currentDataTosend[elt]){
               checkdiff=true;
           }
        });
        if(checkdiff){
            return setResponse(true,'ok');
        }else {
            return setResponse();
        }

    }

    handleValidation() {
        let verification=this.verifyFields();
        console.log("verification ",verification);
        if(verification.status){
            console.log("dataTosend",this.state.dataToSend);
            //this.props.handleModifValidation(this.state.dataToSend);
        }else {
            alert(verification.message);
        }

    }

    render() {
        let  arrayParams = [
            {
                name: "email",
                type: 'email',
                placeholder: 'Email',
                label: 'Email',
                value: this.state.user.email
            },
            {
                name: "pseudo",
                type: 'text',
                placeholder: 'UserName',
                label: 'Pseudo',
                value: this.state.user.pseudo
            },
            {
                name: "currentpassword",
                type: 'text',
                placeholder: 'Current Password',
                label: 'Mot de Passe Actuel',
            },
            {
                name: "newpassword",
                type: 'password',
                placeholder: 'New Password',
                label: 'Nouveau Mot de Passe',
                required:true
            },
            {
                name: "confirmedpassword",
                type: 'password',
                placeholder: 'Confirm Password',
                label: 'Nouveau Mot de Passe',
            }

        ];
        return (
            <div className={"user-profile-modify-connexion-params"}>
                <form>
                    {
                        arrayParams.map((field, key) => {
                            return (
                                <div key={key}>
                                    <InputHelper {...field} onChange={(e) => {
                                        this.handleChange(e)
                                    }}/>
                                </div>
                            )
                        })
                    }
                    <div className={"hr-button-block"}>
                        <ButtonHelper
                        {
                            ...{
                                type:'button',
                                name:"newConnexionParamsbtn",
                                value:"Validate",
                                className:"form-helper-button warning"
                            }
                        }
                        onClick={()=>this.handleValidation()}
                    /> </div>

                </form>
            </div>
        );
    }
}

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: getDecodedToken(),
            taughtCourses: [],
            followedCourses: [],
            modalChildren: "",
            modalVisibility: false
        }
    }

    componentWillMount() {
        this.findTaughtCourses();
        this.findFollowedCourses();
    }

    displayUserInformations() {
        let elementsTodisplay = ["name", "surname", 'contact', 'pseudo', "email", "address"];
        return (
            <div className={"user-profile-informations"}>
                {
                    elementsTodisplay.map((field, key) => {
                        return (
                            <div key={key}>
                                <div>{field.toLocaleLowerCase()}</div>
                                <div>{this.state.user[field] || "none"}</div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }

    /**
     * display courses, which current user is a teacher
     */
    async findTaughtCourses() {
        let dataToSend = {
            collection: 'courses',
            elements_ids: this.state.user.teacher,
            fields: ""
        };
        await ServerService.postToServer('courses/getAllWithIds', dataToSend).then(response => {
            if (response.status === 200) {
                console.log("result for user teacher", response.data);
                this.setState({taughtCourses: response.data});
            } else {
                console.log("Error Message", response.data.errorMessage);
            }
        });
    }

    displayTaughtCourses() {
        return <div><CoursesList courses={this.state.taughtCourses}/></div>;
    }

    /**
     * display courses, which current user is a teacher
     */
    async findFollowedCourses() {
        let dataToSend = {
            collection: 'courses',
            elements_ids: this.state.user.student,
            fields: ""
        };
        await ServerService.postToServer('courses/getAllWithIds', dataToSend).then(response => {
            if (response.status === 200) {
                this.setState({followedCourses: response.data});
            } else {
                console.log("Error Message", response.data.errorMessage);
            }
        });
    }

    openModal(content) {
        console.log("about to open modal");
        this.setState({
            modalChildren: content,
            modalVisibility: true
        });
    }

    handleModalClose() {
        this.setState({
            modalChildren: "",
            modalVisibility: false
        });
    }

    modifyAvatar() {


    }

    handleModifValidation(data) {
        console.log(" modif datatosend ", data);
        if (Object.keys(data).length > 0) {
            let findUserParams = {
                collection: 'users',
                options: {
                    queries: {_id: this.state.user._id}
                }
            };
            ServerService.postToServer('/crudOperations/get', findUserParams).then((response) => {
                console.log("getting user response ", response);
                if (response.status === 200) {
                    if (response.data.length > 0) {
                        let user = response.data[0];
                        console.log("user found ", user);
                        let updateParams = {
                            collection: 'users',
                            data: user,
                            update: data
                        };
                        ServerService.postToServer("/crudOperations/update", updateParams).then((response) => {
                            if (response.status === 200) {
                                console.log("Update success");
                            } else {
                                console.log("update error ", response.data.errorMessage);
                            }
                        });
                    } else {
                        alert("User Verification Failed !!");
                    }
                }
            });
            let dataTosend = {
                user_id: this.state.user._id,
                data: data
            };

        } else {
            alert(" Aucune modification effectuée !!");
            this.handleModalClose()
        }
        //ServerService.postToServer()
    }

    modifyInformations() {
        let usersModel = {
            collection: "users",
            title: 'users',
            fields: [
                {name: "name", type: 'text', placeholder: 'Name', label: 'Nom', value: this.state.user.name},
                {name: "surname", type: 'text',
                    placeholder: 'SurName',
                    label: 'Prenom',
                    value: this.state.user.surname
                },
                {
                    name: "address",
                    type: 'text',
                    placeholder: 'Address',
                    label: 'Adresse',
                    value: this.state.user.address
                },
                {
                    name: "contact",
                    type: 'number',
                    placeholder: 'Tel1/Tel2 ',
                    label: 'Telephone',
                    value: this.state.user.contact
                },

            ]
        };
        let formToReturn = <div>
            <FormHelper
                data={usersModel}
                modificationForm
                handleValidation={(e) => this.handleModifValidation(e)}
            />
        </div>;
        console.log("modification of parameters");
        this.openModal(formToReturn);
    }

    newConnexionParameters() {
        this.openModal(
            <ModifyConnexionParams
                handleModalClose={this.handleModalClose()}
                handleModifValidation={(data)=>this.handleModifValidation(data)}
                user={this.state.user}
            />);
    }

    render() {
        return (
            <div className={"user-profile-main-div"}>
                <ModalComponent visible={this.state.modalVisibility} onClose={() => this.handleModalClose()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <h2 className={"user-profile-title"}>Profile Utilisateur</h2>

                <h3 className={"session-title"}>
                    Avatar
                    <ButtonHelper
                        {...{
                            name: "changeAvatar",
                            value: "modifier",
                            className: "form-helper-button success"
                        }}
                        OnClick={() => this.modifyAvatar()}
                    />
                </h3>
                <div className={"user-profile-avatar"}>
                    <div>
                        <figure className={"user-profile-avatar"}>
                            <Image cloudName="demo" publicId="sample" width="200" crop="scale"/>
                           {/* <img src={this.state.user.avatar || "/images/user3_thom2.png"}/>*/}
                        </figure>
                    </div>
                </div>
                <h3 className={"session-title"}>
                    User Informations
                    <ButtonHelper
                        {
                            ...{
                                name: "modifyinformations",
                                value: "Modifier Mes Informations",
                                className: "form-helper-button success"
                            }
                        }
                        onClick={() => this.modifyInformations()}
                    />
                </h3>
                {this.displayUserInformations()}

                <h3 className={"session-title"}>
                    Connexion Parameters
                    <ButtonHelper
                        {
                            ...{
                                name: "modifyinformations",
                                value: "Changer Les Paramètres de Connexion",
                                className: "form-helper-button success"
                            }
                        }
                        onClick={() => this.newConnexionParameters()}
                    />
                </h3>
                <h3 className={"session-title"}>Taught Courses</h3>
                <div className={"user-profile-taught-courses-div"}>
                    <CoursesList courses={this.state.taughtCourses}/>
                </div>
                <h3 className={"session-title"}>Followed Courses</h3>
                <div className={"user-profile-followed-courses-div"}>
                    <CoursesList courses={this.state.followedCourses}/>
                </div>
            </div>
        );
    }
}

export default UserProfile;