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
        ServerService.getFromServer().then(response => this.setState({datas: response.data}));
    }

    addElement(element) {
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
        return <div>
            <div className='flex-container flex-center'>
                <span style={{fontSize: '30px', fontWeight: '800'}}>{this.state.dataModel.title} </span>
                <button
                    onClick={() => this.setState({modalVisibility: true})}>New
                </button>
            </div>
            {/*{this.createForm()}*/}
            <ModalComponent visible={this.state.modalVisibility}
                            onClose={() => this.setState({modalVisibility: false})}>
                <BasicFormCreatorComponent dataModel={this.state.dataToSendModel}
                                           onValidate={element => this.addElement(element)}/>
            </ModalComponent>
            <DataArrayComponent
                title='Data test'
                dataModel={this.state.dataToSendModel}
                // fields={['name', 'title']}
                dataToShow={this.state.dataToShow}
                updateElement={elementToUpdate => this.updateElement(elementToUpdate)}
                deleteElement={elementToUpdate => this.deleteElement(elementToUpdate)}
            />
        </div>;
    }
}

export default DataManagerPage;
