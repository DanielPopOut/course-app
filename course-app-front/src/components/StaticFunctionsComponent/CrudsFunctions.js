import {ServerService} from "../../server/ServerService";

export const retrieveDataOnServer=(collection)=> {
    if(!collection){
        return ;
    }
    ServerService.postToServer('crudOperations/get', {collection: collection}).then(response => {
        console.log(response);
        return response.data;
    });
};

export const insertElementInDataBase=(collection,element)=>{
    ServerService.postToServer('crudOperations/insert', {collection: collection, data: element}).then(response => {
        if (response.status === 200) {
            return(Object.assign(element, {_id: response.data}));
        }else {
            return false;
        }
    });
};
export  const updateElementInDataBase=(collection,element)=> {
    return ServerService.postToServer('crudOperations/update', {collection: collection, data: element}).then(response => {
        console.log('updateresult', response);
        return response.status === 200 || false;
    });
};
export const deleteElementInDataBase=(element) => {
    console.log('you are trying to delete this.' +
        {collection: this.props.collection, data: element} );
    return(
        ServerService.postToServer('crudOperations/delete', {collection: this.props.collection, data: element})
            .then(response => {
                console.log('delete result', response);
                return response.status === 200 || false;
            })
    );
};
