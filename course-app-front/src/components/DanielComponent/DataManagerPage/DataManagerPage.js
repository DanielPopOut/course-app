import React, { Component } from 'react';
import ModalComponent from '../Modal/ModalComponent';
import { UsersModel } from '../../DataManagerComponent/DataModelsComponent';
import { ServerService } from '../../../server/ServerService';
import DataArrayComponent from '../DataArray/DataArrayComponent';
import BasicFormCreatorComponent from '../FormCreator/BasicFormCreatorComponent';

class DataManagerPage extends Component {
    //Prend un objet dataModel qui représente le formulaire à créer
    // [{name: 'module', type: 'text', placeholder:'matière', label: 'Matière'}, {} ...]
    // Si pas de label ca utilise le name
    constructor(props) {
        super(props);
        // let dataModel = UserModel;
        let dataToSendModel = UsersModel.fields;
        let dataToShow = this.props.dataToShow;
        if(!props.dataToShow){
            this.retrieveDataOnServer();
        }
        this.state = {
            dataModel: UsersModel,
            dataToSend: Object.assign({}, dataToSendModel),
            dataToSendModel: dataToSendModel,
            modalVisibility: false,
            dataToShow: [{_id: '1', name: 'banan'}, {_id: '2', name: 'banan'}, {_id: '3', name: 'banan'},
                {
                    _id: 4,
                    name: 'banan',
                },
                {
                    _id: 5,
                    title: 'amigoAZERTYUIOPQSDFGHJKLMWXCVBN',
                    title1: 'amigo',
                    title2: 'amigo',
                    title3: 'amigo',
                },
                {
                    _id: 6,
                    'name': 'Daniel',
                    'surname': 'TCHANGANG',
                    'address': '1341',
                    'contacts': 'NFOEANo ',
                    'email': 'ANIEOAN',
                    'pseudo': 'NDA',
                    'password': 'daniel1995',
                }],
        };
    }

    retrieveDataOnServer() {
        if(!this.props.collection){
            return ;
        }
        ServerService.postToServer('api/get', {collection: this.props.collection}).then(response => {
            console.log(response);
            this.setState({dataToShow: response.data})
        });
    }

    insertElementInDataBase(element) {
        ServerService.postToServer('api/insert', {collection: this.props.collection, data: element}).then(response => {
            if (response.status === 200) {
                this.addElementToList(Object.assign(element, {_id: response.data}))
            }
        });
    }
    updateElementInDataBase(element) {
        return ServerService.postToServer('api/update', {collection: this.props.collection, data: element}).then(response => {
            console.log('updateresult', response)
            return response.status === 200 ? this.updateElement(element) :false;
        });
    }
    deleteElementInDataBase(element) {
        return ServerService.postToServer('api/delete', {collection: this.props.collection, data: element}).then(response => {
            console.log('delete result', response)
            return response.status === 200 ? this.deleteElement(element) :false;

        });
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
        return <div style={{padding: '80px', marginBottom: '100px'}}>
            <div className='flex-container flex-center'>
                <span style={{fontSize: '30px', fontWeight: '800'}}>{this.props.collection} </span>
                <button
                    onClick={() => this.setState({modalVisibility: true})}>New
                </button>
            </div>
            {/*{this.createForm()}*/}
            <ModalComponent visible={this.state.modalVisibility}
                            onClose={() => this.setState({modalVisibility: false})}>
                <BasicFormCreatorComponent
                    dataModel={this.props.fields}
                    onValidate={element => this.insertElementInDataBase(element)}
                />
            </ModalComponent>
            <DataArrayComponent
                title={this.props.collection }
                dataModel={this.props.fields}
                fields={this.props.fields ? this.props.fields.map(x=> x.name) : null}
                dataToShow={this.state.dataToShow}
                updateElement={elementToUpdate => this.updateElementInDataBase(elementToUpdate)}
                deleteElement={elementToUpdate => this.deleteElement(elementToUpdate)}
            />
        </div>;
    }
}

export default DataManagerPage;
