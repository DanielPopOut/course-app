export const validateEmail = function (email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    }
    return (false)
}
export const validatePhoneNumber = function (phonenumber) {
    var phoneno = /^\d{9}$/;
    if ((phonenumber.match(phoneno)))
    {
        return true;
    }
    else {
        return false;
    }
}
