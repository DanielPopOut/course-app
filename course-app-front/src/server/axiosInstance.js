import axios from 'axios';
import { AUTHENTICATION, TOKEN } from './SERVER_CONST';
import { Subject } from "rxjs";


// Add a request interceptor
const userLogged = new Subject();
export const userLogged$ = userLogged.asObservable();
export let isLoggedIn = true;

export function setLoggedIn(bool) {
    isLoggedIn = bool;
    userLogged.next(bool)
}

function setToken(token) {
    console.log('token set', token);
    localStorage.setItem('token', JSON.stringify(token));
}

export function removeToken() {
    console.log('token removed');
    localStorage.removeItem('token');
}

export function getToken() {
    return localStorage.getItem(TOKEN);
}


let axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

axiosInstance.interceptors.request.use(function (config) {
    // Do something before request is sent
    //If the header does not contain the token and the url not public, redirect to login
    let accessToken = getToken();

    //if token is found add it to the header
    if (accessToken) {
        if (config.method !== 'OPTIONS') {
            config.headers.authorization = accessToken;
        }
    }else{
        setLoggedIn(false);
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error.response);
});



axiosInstance.interceptors.response.use(function (response) {
    // Do something with response data
    console.log(response);
    // if (response.data['message']){
    //     messageToShow.next(response.data['message']);
    // }
    switch (response.status) {
        case 200:
            if (response.request.responseURL.indexOf(AUTHENTICATION) > 0) {
                let token = response.data.token;
                if (!token) {
                    return response;
                }
                setToken(token);
                setLoggedIn(true);
                console.log('token obtained ',  token);
                return response
            }
            return response;
        default :
            console.log('unknwon error');
            return response
    }
}, function (error) {
    // Do something with response error
    // console.log(error.response, error.response);
    // if (error.response) {
    //     if (error.response.data['message']){
    //         messageToShow.next(error.response.data['message']);
    //     }
    //     switch (error.response.status) {
    //         case 401 :
    //             console.log('bad credentials ');
    //             setLoggedIn(false);
    //             return Promise.reject(error);
    //         default :
    //             console.log('Mauvaise requete');
    //             return Promise.reject(error);
    //     }
    // } else {
    //     console.log('Impossible to log in ');
    //     setLoggedIn(false);
    //     return Promise.reject(error);
    // }
    return Promise.reject(error);
});


export default axiosInstance;