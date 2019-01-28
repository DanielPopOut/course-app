import React, { Component } from 'react';
import './DataManagerComponent.css';
import ShowDataComponent from '../ShowDataComponent/ShowDataComponent';
import FormCreatorComponent from '../FormCreatorComponent/FormCreatorComponent';
import { ServerService } from '../../server/ServerService';
import { MODULE_URL } from '../../server/SERVER_CONST';
import ModalComponent from "../DanielComponent/Modal/ModalComponent";

class DataManagerComponent extends Component {
    //Pros ==> dataModel, title
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            modalVisibility: false,
            dataToShow: [],
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

        let children=
            <React.Fragment>
                <FormCreatorComponent title='Créer nouvelle matière' dataModel={[
                    {name: 'module', type: 'text', placeholder: 'matière', label: 'Matière'},
                ]}/>
                <button onClick={()=> this.openModalToAddNewData()}>Ajouter </button>
                <button onClick={()=> this.retrieveDataAtURL()}>Recupere donnees</button>
                <ShowDataComponent dataToShow={this.state.dataToShow}/>
            </React.Fragment>;
        return(
            <div>
                <h2>{this.props.title}</h2>

                <ModalComponent
                    visible={this.state.modalVisibility}
                    children={children}
                    onClose={()=>this.setState({modalVisibility: false})}
                />

                <button onClick={()=>this.setState({modalVisibility: true})}>Afficher Modal</button>
                <div className='margin-30px'>Eoho</div>
            </div>
        );
    }
}


export default DataManagerComponent;
