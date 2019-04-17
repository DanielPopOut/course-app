import React, {Component} from "react";
import "./departments.css";
import {departmentsModel, specialitiesModel} from "../DataManagerComponent/DataModelsComponent";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import {ButtonHelper} from "../HelperComponent/FormHelper";
import FormHelper from "../HelperComponent/FormHelper";
import {ServerService} from "../../server/ServerService";
import Specialities from "./Specialities";


class Department extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detailsVisibility:false,
            _id: this.props.department._id,
            label: this.props.department.label || "",
            description: this.props.department.description || "",
            specialities: this.props.department.specialities || []
        }
    }

    saveDepartmentModification(dataToSend) {
        let data = this.state;
        delete (data["modalChildren"]);
        delete (data["modalVisibility"]);

        let params = {
            collection: "departments",
            data: data,
            update: dataToSend
        };

        ServerService.postToServer("crudOperations/update", params).then(response => {
            if (response.status === 200) {
                this.setState({...dataToSend});
                if (this.props.updateDepartments) {
                    this.props.updateDepartments(dataToSend, "update");
                }
                this.props.closeModal();
            } else {
                console.log("response ", response);
            }
        });
    }

    modifyDepartment() {
        let fields = [
            {
                name: "label",
                type: 'text',
                placeholder: 'Label',
                label: 'Label',
                required: true,
                value: this.state.label || ""
            },
            {
                name: "description",
                type: 'textarea',
                placeholder: 'Description',
                label: 'Description',
                value: this.state.description || ""
            },
        ];

        let data = Object.assign({},departmentsModel,{fields:fields});
        data['fields'] = fields;
        let content = <FormHelper data={data} modificationForm={true} handleValidation={(data) => this.saveDepartmentModification(data)}/>;
        this.props.openModal(content);
    }

    deleteDepartment() {
        console.log("about to delete", this.state);
        let data = this.state;
        delete (data["modalChildren"]);
        delete (data["modalVisibility"]);

        ServerService.postToServer("crudOperations/delete", {collection: "departments", data: data})
            .then(response => {
                if (response.status === 200) {
                    if (this.props.updateDepartments) {
                        this.props.updateDepartments(data, "delete");
                    }
                } else {
                    console.log("response ", response);
                }
            });
    }

    async saveNewSpeciality(data) {
        console.log("new speciality params", data);
        Object.assign(data,{department:this.state._id});
        await ServerService.insertElementInDataBase("specialities", data);
        console.log("speciality inserted ", data);
        let specialities = this.state.specialities;
        specialities.push(data);
        this.setState({specialities: specialities});
        this.props.closeModal();
    }

    newSpeciality() {
        console.log("specialities model ",specialitiesModel);
        let content = <FormHelper
            data={specialitiesModel}
            handleValidation={
                (data) => this.saveNewSpeciality(data)
            }
        />;
        this.props.openModal(content);
    }

    displayOptions() {
        return (
            <React.Fragment>
                <ButtonHelper {...{
                    name: "modifydepartment",
                    value: "Modify Department",
                    className: "form-helper-button warning"
                }} onClick={() => this.modifyDepartment()}/>

                <ButtonHelper {...{
                    name: "newdepartment",
                    value: "+ Speciality",
                    className: "form-helper-button success"
                }} onClick={() => this.newSpeciality()}
                />

                <ButtonHelper {...{
                    name: "deletedepartment",
                    value: "Delete Department",
                    className: "form-helper-button danger"
                }} onClick={() => this.deleteDepartment()}/>
            </React.Fragment>
        )
    }

    displayDetails(){

        if(this.state.detailsVisibility){
            return(
                <React.Fragment>
                    <h3>  Département de (Department Of ) : {this.state.label}</h3>
                    <p> {this.state.description}</p>

                    <div className={"department-specialities"}>
                        <div className={"hr-button-block"}>
                            {this.displayOptions()}
                        </div>
                        <div>
                            <h4>Spécialities</h4>
                            <Specialities department={this.state._id} specialities={this.state.specialities}/>
                        </div>
                    </div>
                </React.Fragment>
            )
        }else {
            return("");
        }
    }

    handleShowDetails(){
        ServerService.postToServer("/crudOperations/get",
            {
                collection:"specialities",
                options:{queries:{department:this.state._id}}
            }).then((response) => {
            if (response.status === 200) {
                console.log("specialities ", response.data);
                this.setState({
                    specialities: response.data,
                    detailsVisibility:!this.state.detailsVisibility
                });
            } else {
                console.log(response.data.errorMessage || "");
            }
        });
    }

    render() {
        return (
            <div className={"department-main"}>
                <div className={"department-item"} id={this.state._id} onClick={()=>this.handleShowDetails()}>
                 {this.state.label}
                </div>
                <div>
                    {this.displayDetails()}
                </div>
            </div>
        );
    }
}

class Departments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalChildren: "",
            modalVisibility: false,
            departments: [],
            department: ""
        }
    }

     componentDidMount() {
         ServerService.postToServer("crudOperations/get", {collection: "departments"}).then(response => {
            if (response.status === 200) {
                console.log("departments ", response.data);
                this.setState({departments: response.data});
            } else {
                console.log(response.data.errorMessage || "");
            }
        });
    }

    updateDepartments(element="", action = "",key) {
        console.log("will  "+action, this.state);
        let departments = this.state.departments;
        if (action === "update") {
            Object.assign(departments[key],element);
            this.setState({departments: departments});
        } else if (action === "delete") {
            console.log("deletion of department");
            delete departments[key];
            this.setState({departments: departments});
        }

    }

    async saveNewDepartment(data) {
        console.log("new department params", data);
        await ServerService.insertElementInDataBase("departments", data);
        console.log("department inserted ", data);
        let departments = this.state.departments;
        departments.push(data);
        this.setState({departments: departments});
        this.closeModal();
    }

    openModal(content) {
        this.setState({
            modalChildren: content,
            modalVisibility: true
        });
    }

    closeModal() {
        this.setState({
            modalChildren: "",
            modalVisibility: false
        });
    }

    newDepartment() {
        let content = <FormHelper data={departmentsModel} handleValidation={(data) => this.saveNewDepartment(data)}/>;
        this.openModal(content);
    }

    handleDepNavClick(dep_id){
        window.scrollTo(0,document.getElementById(dep_id).offsetTop);
    }

    displayNavPanel(){
        return(
          <div className={"department-nav-panel"}>
              <h3 className={"nav-dep-title"}>Departments</h3>
              {
                  this.state.departments.map((department,key)=>{
                      return(
                          <div key={key} className={"department-nav-item"} onClick={()=>this.handleDepNavClick(department._id)}>{department.label}</div>
                      )
                  })
              }
          </div>
        );
    }

    listDepartments(){
       return this.state.departments.map((department, key) => {
            return (
                <Department
                    key={key}
                    department={department}
                    openModal={(content)=>this.openModal(content)}
                    closeModal={()=>this.closeModal()}
                    updateDepartments={
                        (element="",action="")=>this.updateDepartments(element,action,key)
                    }
                />
            );
        });
    }

    render() {
        return (
            <div className={"departments-main"}>
                <ModalComponent visible={this.state.modalVisibility} onClose={() => this.closeModal()}>
                    {this.state.modalChildren}
                </ModalComponent>
                {this.displayNavPanel()}
                <div>
                    <h3> List Of Departments</h3>
                    <ButtonHelper {...{
                        name: "newdepartment",
                        value: "+ Department",
                        className: "form-helper-button success"
                    }} onClick={() => this.newDepartment()}
                    />
                </div>

                <div className={"departments-list-div"}>
                    { this.listDepartments()}
                    </div>

            </div>
        )
    }
}

export default Departments;


