import React, { Component } from 'react';
import './DataManagerComponent.css';
import ShowDataComponent from '../ShowDataComponent/ShowDataComponent';
import FormCreatorComponent from '../FormCreatorComponent/FormCreatorComponent';
import { ServerService } from '../../server/ServerService';
import { MODULE_URL } from '../../server/SERVER_CONST';

class DataManagerComponent extends Component {
    //Pros ==> dataModel, title
    constructor(props) {
        super(props);
        this.state = {
            url: 'NIOA',
            modalVisibility: false,
            dataToShow: [{
                '_id': '5c0aa65c45b3aa560addf31f',
                'title': 'wwmigo',
                'module': '',
                'submodule': 'BUOBOUB',
                'description': '',
            },
                {
                    '_id': '5c0aa67c028bfa5610500db1',
                    'title': 'wwmigo',
                    'module': '',
                    'submodule': 'BUOBOUB',
                    'description': '',
                },
                {'_id': '5c0aa7b3d20c215646ea3dc9'},
                {'_id': '5c0aa7df7d0c62564d1aa792'},
                {
                    '_id': '5c0aa91f5acd9c567f1fcab2',
                    'title': 'wwmigo',
                    'module': '',
                    'submodule': 'BUOBOUB',
                    'description': '',
                }],
        };
    }

    retrieveDataAtURL() {
        ServerService.getFromServer(MODULE_URL).then(response => {
            console.log(response.data, response);
            if (!response.data) {
                return
            }
            this.setState({dataToShow:response.data})
        });
    }

    openModalToAddNewData() {

    }



    render() {
        return <div>
            <h2>{this.props.title}</h2>



            <Modal visible={this.state.modalVisibility} closeModal={()=>this.setState({modalVisibility: false})}>
                <FormCreatorComponent title='Créer nouvelle matière' dataModel={[
                    {name: 'module', type: 'text', placeholder: 'matière', label: 'Matière'},
                ]}/>
                <button onClick={()=> this.openModalToAddNewData()}>Ajouter </button>
                <button onClick={()=> this.retrieveDataAtURL()}>Recupere donnees</button>
                <ShowDataComponent dataToShow={this.state.dataToShow}/>
            </Modal>
            <button onClick={()=>this.setState({modalVisibility: true})}>Afficher Modal</button>
            <div className='margin-30px'>Eoho</div>
        </div>;
    }
}


class Modal extends Component {
    render() {
            return <div className={'modal ' + (this.props.visible ?  '' : 'display-none')} onClick={()=>this.props.closeModal()}>
            <div className='modal-box' onClick={e=>e.stopPropagation()}>
                {this.props.children}
            </div>


        </div>
    }
}

export default DataManagerComponent;
