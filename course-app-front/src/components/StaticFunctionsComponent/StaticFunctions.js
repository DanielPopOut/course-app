export const validateEmail = function (email) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (false)
    } else {
        return (true)
    }
};
export const validatePhoneNumber = function (phonenumber) {
    var phoneno = /^\d{9}$/;
    if ((phonenumber.match(phoneno)))
    {
        return true;
    }
    else {
        return false;
    }
};

export const validatePassword = (password)=>{
   /*

    var passw=  /^[A-Za-z]\w{7,14}$/;
    if(password.match(passw))
    {
        //alert('Correct, try another...')
        return true;
    }
    else
    {
        //alert('Wrong...!')
        return false;
    }

    */

   return true;
};
