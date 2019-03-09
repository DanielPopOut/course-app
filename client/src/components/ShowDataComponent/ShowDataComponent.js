import React, { Component } from 'react';
import './ShowDataComponent.css';

class ShowDataComponent extends Component {
    //Prend un objet dataModel qui représente le formulaire à créer
    // [{name: 'module', type: 'text', placeholder:'matière', label: 'Matière'}, {} ...]
    // Si pas de label ca utilise le name
    constructor(props) {
        super(props);
        this.state = {
            dataToShow: props.dataToShow,
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

    createShowDataTable() {
        let allFields = this.getAllFields(this.props.dataToShow);
        let tableToShow = this.props.dataToShow.map(dataModelElement => {
            return <tr key={dataModelElement._id} className='' onClick={() => this.onElementClick(dataModelElement)}>
                {allFields.map((field, step) => <td key={step} className='flex-1'>{dataModelElement[field]}</td>)}
            </tr>;
        });

        tableToShow.unshift(<tr className=''>
            {allFields.map(field => <td className='flex-1' key={field}>{field}</td>)}
        </tr>);
        return <table className='margin-30px overflow-x' style={{borderCollapse: 'collapse'}}>
            <tbody>{tableToShow}</tbody>
        </table>;
    }

    render() {
        return <div>
            <h2>{this.props.title}</h2>
            {this.createShowDataTable()}
        </div>;
    }
}

export default ShowDataComponent;