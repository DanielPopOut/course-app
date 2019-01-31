import React, { Component } from 'react';
import ModalComponent from '../Modal/ModalComponent';
import { usersModel } from '../../DataManagerComponent/DataModelsComponent';
import { ServerService } from '../../../server/ServerService';
import DataArrayComponent from '../DataArray/DataArrayComponent';
import BasicFormCreatorComponent from '../FormCreator/BasicFormCreatorComponent';
import { ButtonHelper } from '../../HelperComponent/FormHelper';

class DataManagerPage extends Component {
    //Prend un objet dataModel qui représente le formulaire à créer
    // [{name: 'module', type: 'text', placeholder:'matière', label: 'Matière'}, {} ...]
    // Si pas de label ca utilise le name
    constructor(props) {
        super(props);
        // let dataModel = UserModel;
        let dataToSendModel = usersModel.fields;

        if (!props.dataToShow) {
            this.retrieveDataOnServer();
        }
        this.state = {
            dataModel: usersModel,
            dataToSend: Object.assign({}, dataToSendModel),
            dataToSendModel: dataToSendModel,
            modalVisibility: false,
            dataToShow: [],
        };
    }

    retrieveDataOnServer() {
        if (!this.props.collection) {
            return;
        }
        ServerService.postToServer('crudOperations/get', {collection: this.props.collection}).then(response => {
            console.log(response);
            this.setState({dataToShow: response.data});
        });
    }

    insertElementInDataBase(element) {
        ServerService.postToServer('crudOperations/insert', {collection: this.props.collection, data: element})
                     .then(response => {
                         if (response.status === 200) {
                             this.addElementToList(Object.assign(element, {_id: response.data}));
                         }
                     });
    }

    updateElementInDataBase(element) {
        return ServerService.postToServer('crudOperations/update', {collection: this.props.collection, data: element})
                            .then(response => {
                                console.log('updateresult', response);
                                return response.status === 200 ? this.updateElement(element) : false;
                            });
    }

    deleteElementInDataBase(element) {
        console.log('you are trying to delete this.' +
            {collection: this.props.collection, data: element});
        return (
            ServerService.postToServer('crudOperations/delete', {collection: this.props.collection, data: element})
                         .then(response => {
                             console.log('delete result', response);
                             return response.status === 200 ? this.deleteElement(element) : false;
                         })
        );
    }

    addElementToList(element) {
        let newDataToShowList = [...this.state.dataToShow].concat([element]);
        this.setState({dataToShow: newDataToShowList, modalVisibility: false});
        console.log(newDataToShowList);
    }

    updateElement(elementUpdated) {
        console.log('new element', elementUpdated);
        let elementIndex = this.state.dataToShow.findIndex(x => x._id === elementUpdated._id);
        if (elementIndex > -1) {
            let newDataToShowList = [...this.state.dataToShow];
            newDataToShowList[elementIndex] = elementUpdated;
            this.setState({dataToShow: newDataToShowList});
            console.log(newDataToShowList);
            return elementIndex > -1;
        }
        return false;
    }

    deleteElement(elementUpdated) {
        console.log('new element', elementUpdated);
        let elementIndex = this.state.dataToShow.findIndex(x => x._id === elementUpdated._id);
        if (elementIndex > -1) {
            let newDataToShowList = [...this.state.dataToShow];
            newDataToShowList.splice(elementIndex, 1);
            this.setState({dataToShow: newDataToShowList});
            console.log(newDataToShowList);
            return elementIndex > -1;
        }
        return false;
    }

    render() {
        return <div style={{marginBottom: '100px'}}>
            <div className='flex-container flex-center'>
                <span style={{fontSize: '30px', fontWeight: '800'}}>{this.props.collection} </span>
                <ButtonHelper
                    params={{value: 'NEW', className: 'form-helper-button warning'}}
                    onClick={() => this.setState({modalVisibility: true})}/>
            </div>

            <ModalComponent
                visible={this.state.modalVisibility}
                onClose={() => this.setState({modalVisibility: false})}>
                <BasicFormCreatorComponent
                    dataModel={this.props.fields}
                    onValidate={element => this.insertElementInDataBase(element)}
                />
            </ModalComponent>

            <DataArrayComponent
                title={this.props.collection}
                dataModel={this.props.fields}
                fields={this.props.fields ? this.props.fields.map(x => x.name) : null}
                dataToShow={this.state.dataToShow}
                onElementClick={()=>console.log('banana')}
                updateElement={elementToUpdate => this.updateElementInDataBase(elementToUpdate)}
                deleteElement={elementToUpdate => this.deleteElementInDataBase(elementToUpdate)}
            />
        </div>;
    }
}

export default DataManagerPage;
