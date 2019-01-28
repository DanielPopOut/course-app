import React, {Component} from 'react';
import './DataArrayComponent.css';
import ModalComponent from '../Modal/ModalComponent';
import BasicFormCreatorComponent from '../FormCreator/BasicFormCreatorComponent';

class DataArrayComponent extends Component {
    //Prend un objet dataModel qui représente le formulaire à créer
    // [{name: 'module', type: 'text', placeholder:'matière', label: 'Matière'}, {} ...]
    // Si pas de label ca utilise le name

    //title, dataToSendModel, fields, dataToShow, onModify, onDelete
    constructor(props) {
        super(props);
        this.state = {
            dataToShow: props.dataToShow,
            modalVisibility: false,
            modalComponentChild: <h1>Amigo banana</h1>,
        };
    }

    getAllFields(arrayObject) {
        let allKeysInOneObject = arrayObject.reduce((total, cur) => {
            for (let key of Object.keys(cur)) {
                total[key] = '';
            }
            return total;
        }, {});
        return Object.keys(allKeysInOneObject);
    }

    onElementClick(element) {
        console.log('selected ', element);
        this.setModalVisibility(true);
        let newBasicFormCreatorComponent = <BasicFormCreatorComponent
            dataModel={this.props.dataModel}
            data={element}
            onModify={
                async dataToSend => {
                    let answer = await this.props.updateElement(dataToSend);
                    console.log('awaited answer', answer);
                    this.setModalVisibility(!answer);
                }
            }
            onDelete={
                async dataToSend => {
                    let answer = await this.props.deleteElement(dataToSend);
                    console.log('awaited answer', answer);
                    this.setModalVisibility(false);
                }
            }
        />;
        this.setState({modalComponentChild: newBasicFormCreatorComponent});
    }



    setModalVisibility(bool) {
        this.setState({modalVisibility: bool});
        if (!bool) {
            this.setState({modalComponentChild: ''});
        }
    }

    createShowDataTable() {
        let allFields = this.props.fields ? this.props.fields : this.getAllFields(this.props.dataToShow);
        let tableToShow = this.props.dataToShow.map((dataModelElement, key) => {
            let allColumnElement = allFields.map((field, step) =>
                <div className={"data-array-table-body-cell"} key={step}>
                    {dataModelElement[field]}
                </div>
            );
            return (
                <div
                    key={key}
                    className='data-array-table-body-row'
                    onClick={() => this.onElementClick(dataModelElement)}
                >
                    {allColumnElement}
                </div>
            );
        });

        let allFieldsColumn = allFields.map((field,key) =>
            <div className={"data-array-table-header-cell"} key={key}>
                {field}
            </div>
        );

        return (
            <div className='div-table-container'>
                <div className='data-array-table'>
                    <div className={'data-array-table-header'}>
                        <div className={'data-array-table-header-row'}>
                            {allFieldsColumn}
                            </div>
                    </div>
                    <div className={'data-array-table-body'}>
                        {tableToShow}
                        </div>
                </div>
                <ModalComponent
                    visible={this.state.modalVisibility}
                    onClose={() => this.setModalVisibility(false)}
                >
                    {this.state.modalComponentChild}
                </ModalComponent>
            </div>
        );
    }

    render() {
        return(
            <React.Fragment>
                <h2>{this.props.title} List</h2>
                {this.createShowDataTable()}
            </React.Fragment>
        );
    }
}

export default DataArrayComponent;