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

}