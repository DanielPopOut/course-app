/**
 * connectUser function. return action for user logon
 * @param payload
 * @returns {{type: string, payload: *}}
 */

export function connectUser(payload){
    return {
        type:"CONNECT_USER",
        payload:payload
    }
}

/**
 *
 * disconnectUser function. return action for user logout
 * @param payload
 * @returns {{type: string, payload: *}}
 */

export function disconnectUser(payload){
    return {
        type:"DISCONNECT_USER",
        payload:payload
    }
}

/**
 * redirectUrl function. return action for app redirection
 * @param new_url: string
 * @returns {{type: string, payload: {new_url: string}}}
 */
export function redirectUrl(new_url){
    return {
        type:"REDIRECT_URL",
        payload:{new_url:new_url}
    }
}

