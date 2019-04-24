export const validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:s@"]+(\.[^<>()[\]\\.,;:s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export const validatePhoneNumber = function (phonenumber) {
    var phoneno = /^d{9}$/;
    if ((phonenumber.match(phoneno)))
    {
        return true;
    }
    else {
        return false;
    }
};


export const validatePassword = (password)=>{
    console.log("password sended ",password);
    var passw=  /^[A-Za-z]w{6,14}$/;
    if(password.match(passw))
    {
        return true;
    }
    else
    {
        return false;
    }

};
