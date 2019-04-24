import React,{Component} from "react";
import "./specialities.css";
import {ServerService} from "../../server/ServerService";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import {ButtonHelper, FormHelper} from "../HelperComponent/FormHelper";
import {specialitiesModel} from "../DataManagerComponent/DataModelsComponent";
import Levels from "./Levels";


class Speciality extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id: this.props.speciality._id,
            label: this.props.speciality.label || "",
            description: this.props.speciality.description || "",
            department:this.props.speciality.department||"",
            levels: this.props.speciality.levels || []
        }
    }

    saveSpecialityModification(dataToSend) {
        let data = this.state;
        let params = {
            collection: "specialities",
            data: data,
            update: dataToSend
        };

        ServerService.postToServer("crudOperations/update", params).then(response => {
            if (response.status === 200) {
                this.setState({...dataToSend});
                if (this.props.updateSpecialities) {
                    this.props.updateSpecialities(dataToSend, "update");
                }
                this.props.closeModal();
            } else {
                console.log("response ", response);
            }
        });
    }

    modifySpeciality() {
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

        let data = Object.assign({},specialitiesModel,{fields:fields});
        data['fields'] = fields;
        let content = <FormHelper data={data} modificationForm={true}
                                  handleValidation={(data) => this.saveSpecialityModification(data)}/>;
        this.props.openModal(content);
    }

    deleteSpeciality() {
        console.log("about to delete", this.state);
        let data = this.state;
        ServerService.postToServer("crudOperations/delete", {collection: "specialities", data: data})
            .then(response => {
                if (response.status === 200) {
                    if (this.props.updateSpecialities) {
                        this.props.updateSpecialities(data, "delete");
                    }
                } else {
                    console.log("response ", response);
                }
            });
    }

    displayOptions() {
        return (
            <React.Fragment>
                <ButtonHelper {...{
                    name: "modifydepartment",
                    value: "Modify Speciality",
                    className: "form-helper-button warning"
                }} onClick={() => this.modifySpeciality()}/>

                <ButtonHelper {...{
                    name: "deletedepartment",
                    value: "Delete Speciality",
                    className: "form-helper-button danger"
                }} onClick={() => this.deleteSpeciality()}/>

            </React.Fragment>
        )
    }

    removeLevel(level){
        let levels=this.state.levels;
        let newLevels=[];
        if(levels.indexOf(level)>-1){
            //delete(levels[levels.indexOf(level)]);
            newLevels=levels.filter((value,index)=>{
               return ((index!==levels.indexOf(level)) && (value!==null));
            });
            console.log("level after deletion : ",newLevels);
            ServerService.postToServer("crudOperations/update",{
                collection:"specialities",
                data:{_id:this.state._id},
                update:{levels:newLevels}
            }).then(response=>{
                if(response.status===200){
                    this.setState({
                        levels:newLevels
                    });
                }else {
                    console.log(" update levels error : ",response.data);
                }
            });
        }
    }

    addLevel(level){
        let levels=this.state.levels;
        if(levels.indexOf(level)=== -1){
            levels.push(level);
            ServerService.postToServer("crudOperations/update",{
                collection:"specialities",
                data:{_id:this.state._id},
                update:{levels:levels}
            }).then(response=>{
                if(response.status===200){
                    this.setState({levels:levels});
                }else {
                    console.log(" update levels error : ",response.data);
                }
            });
        }
    }

    render() {
        return (
            <div className={"department-main"}>
                <h3>{this.state.label}</h3>
                <p> {this.state.description}</p>
                <div className={"hr-button-block"}>
                    {this.displayOptions()}
                    </div>
                <div>
                    <Levels
                        levels={this.state.levels}
                        addLevel={(level)=>this.addLevel(level)}
                        removeLevel={(level)=>this.removeLevel(level)}
                    />
                </div>
            </div>
        );
    }

}

class Specialities extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalChildren: "",
            modalVisibility: false,
            specialities: this.props.specialities||[],
            department: this.props.department
        }
    }

    updateSpecialities(element, action = "",key) {
        let specialities = this.state.specialities;
        if (action === "update") {
            Object.assign(specialities[key],element);
            this.setState({specialities: specialities});
        } else if (action === "delete") {
            delete specialities[key];
            this.setState({specialities: specialities});
        }
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

    render() {
        return (
            <div className={"specialities-main"}>
                <ModalComponent visible={this.state.modalVisibility} onClose={() => this.closeModal()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <div className={"specialities-div"}>
                    {
                        this.state.specialities.map(
                            (speciality, key) => {
                                return (
                                    <Speciality
                                        key={key}
                                        closeModal={()=>this.closeModal()}
                                        openModal={(content)=>this.openModal(content)}
                                        speciality={speciality}
                                        updateSpecialities={
                                            (element,action)=>this.updateSpecialities(element,action,key)
                                        }

                                    />);
                            })
                    }
                </div>
            </div>
        )
    }

}

export default Specialities;


