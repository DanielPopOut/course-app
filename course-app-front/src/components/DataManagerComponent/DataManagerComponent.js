import React, { Component } from 'react';
import './ShowDataComponent.css';


class ShowDataComponent extends Component {
    //Prend un objet dataModel qui représente le formulaire à créer
    // [{name: 'module', type: 'text', placeholder:'matière', label: 'Matière'}, {} ...]
    // Si pas de label ca utilise le name

    constructor(props) {
        super(props);
        this.state = {
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

    getAllFields(arrayObject) {
        let allKeysInOneObject = arrayObject.reduce((total, cur) => {
            for (let key of Object.keys(cur)) {
                total[key] = '';
            }
            ;
            return total;
        }, {});
        return Object.keys(allKeysInOneObject);
    }

    onElementClick(element) {
        console.log(element);
    }

    createShowDataTable() {
        let allFields = this.getAllFields(this.state.dataToShow);
        let tableToShow = this.state.dataToShow.map(dataModelElement => {
            return <tr key={dataModelElement._id} className='' onClick={()=>this.onElementClick(dataModelElement)}>
                {allFields.map((field, step) => <td key={step} className='flex-1'>{dataModelElement[field]}</td>)}
            </tr>;
        });

        tableToShow.unshift(<tr className=''>
            {allFields.map(field => <td className='flex-1' key={field}>{field}</td>)}
        </tr>);
        return <table className='margin-30px overflow-x'><tbody>{tableToShow}</tbody></table>;
    }

    render() {
        return <div>
            <h2>{this.props.title}</h2>
            {this.createShowDataTable()}
        </div>;
    }
}

export default ShowDataComponent;
