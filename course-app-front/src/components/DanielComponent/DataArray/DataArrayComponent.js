import React, { Component } from 'react';
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
        console.log(element);
    }

    modifyElementClick(element) {
        console.log('modify', element);
        this.setModalVisibility(true);
        let newBasicFormCreatorComponent = <BasicFormCreatorComponent
            dataModel={this.props.dataModel}
            data={element}
            onValidate={
                async dataToSend => {
                    let answer = await this.props.updateElement(dataToSend);
                    console.log('awaited answer', answer);
                    this.setModalVisibility(!answer);
                }
            }
        />;
        this.setState({modalComponentChild: newBasicFormCreatorComponent});
    }

    deleteElementClick(element) {
        console.log('delete', element);
        this.setModalVisibility(true);
        this.setState({
            modalComponentChild: <div>
                <div>Voulez vous vraiment supprimer cet élément</div>
                <BasicFormCreatorComponent
                    dataModel={this.props.dataModel}
                    data={element}
                    onValidate={
                        async dataToSend => {
                            let answer = await this.props.deleteElement(dataToSend);
                            console.log('awaited answer', answer);
                            this.setModalVisibility(false);
                        }
                    }
                />
            </div>,
        });
    }

    setModalVisibility(bool) {
        this.setState({modalVisibility: bool});
        if (!bool) {
            this.setState({modalComponentChild: ''});
        }
    }

    createShowDataTable() {
        let allFields = this.props.fields ? this.props.fields : this.getAllFields(this.props.dataToShow);
        let tableToShow = this.props.dataToShow.map((dataModelElement, step) => {
            let allColumnElement = allFields.map((field, step) => <td
                key={step.toString() + 'i'}>{dataModelElement[field]}</td>);
            allColumnElement.unshift(<td key='delete'
                                         onClick={() => this.deleteElementClick(dataModelElement)}>Delete</td>);
            allColumnElement.unshift(<td key='modify'
                                         onClick={() => this.modifyElementClick(dataModelElement)}>Modify</td>);
            return <tr key={dataModelElement._id ? dataModelElement._id : (step.toString() + 'd')} className=''
                       onClick={() => this.onElementClick(dataModelElement)}>
                {allColumnElement}
            </tr>;
        });

        let allFieldsColumn = allFields.map(field => <td key={field}>{field}</td>);
        allFieldsColumn.unshift(<td key='delete'>Delete</td>);
        allFieldsColumn.unshift(<td key='modify'>Modify</td>);

        return <div className='div-table-container'>
            <table className='overflow-x data-array-table'>
                <thead>
                <tr>{allFieldsColumn}</tr>
                </thead>
                <tbody>{tableToShow}</tbody>
            </table>
            <ModalComponent visible={this.state.modalVisibility} onClose={() => this.setModalVisibility(false)}>
                {this.state.modalComponentChild}
            </ModalComponent>
        </div>;
    }

    render() {
        return <div>
            <h2>{this.props.title}</h2>
            {this.createShowDataTable()}
        </div>;
    }
}

export default DataArrayComponent;