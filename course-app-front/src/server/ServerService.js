import axiosInstance from './axiosInstance';
import { AUTHENTICATION, FILTER } from './SERVER_CONST';


export class ServerService {
    static sendDataToRetrieveToken(userCredentials) {
        return ServerService.postToServer(AUTHENTICATION, userCredentials);
    }

    static postToServer(URL_PATH, obj) {
        return axiosInstance.post(URL_PATH, obj);
    }

    static updateOnServer(URL_PATH, obj) {
        return axiosInstance.patch(URL_PATH, obj);
    }

    static replaceOnServer(URL_PATH, obj) {
        return axiosInstance.put(URL_PATH, obj);
    }

    static deleteOnServer(URL_PATH, obj_id) {
        return axiosInstance.delete(URL_PATH + obj_id);
    }

    static getFromServer(URL_PATH) {
        return axiosInstance.get(URL_PATH);
    }
    static getFromServer(URL_PATH,params) {
        return axiosInstance.get(URL_PATH,{
            params:params
        });
    }

    static getFromServer2132(URL_PATH, {projection = null, sort = null, limit = 0, collection= '', ...filter} = {}) {
        console.log(filter, URL_PATH)
        if (filter || projection || sort || limit || collection) {
            return ServerService.postToServer(URL_PATH + FILTER, Object.assign({projection, sort, limit, collection}, {filter}));
        }
        return axiosInstance.get(URL_PATH);
    }

    static retrieveAllDocumentsWithCollectionName(collection) {
        axiosInstance.post('crudOperations/get', {collection: collection}).then(response => {
            console.log(response);
            this.setState({dataToShow: response.data})
        });
    }
    static insertElementInDataBase(collection,element){
        axiosInstance.post('crudOperations/insert', {collection: collection, data: element}).then(response => {
            if (response.status === 200) {
                return(Object.assign(element, {_id: response.data}));
            }else {
                return false;
            }
        });
    };
    static updateElementInDataBase (collection,element){
        axiosInstance.post('crudOperations/update', {collection: collection, data: element}).then(response => {
            console.log('updateresult', response);
            return response.status === 200 || false;
        });
    };

    static deleteElementInDataBase(element) {
        axiosInstance.post('crudOperations/delete', {collection: this.props.collection, data: element})
            .then(response => {
                console.log('delete result', response);
                return response.status === 200 || false;
            });
    };
}