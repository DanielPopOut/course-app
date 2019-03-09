export const validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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
export const loadDataIntoModel=(datamodel,data)=>{
    let fields=[];
    console.log(datamodel);
    datamodel.fields.forEach((row,index)=>{
       fields.push(Object.assign({},row,{value:data[row.name]}));
    });
    datamodel=Object.assign({},datamodel,{fields:fields});
    console.log(datamodel);
    return datamodel;
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
