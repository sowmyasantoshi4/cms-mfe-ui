
export const doLogin = ( uname, password ) => {
    //let obj = { "userName": 'Test', "userid": '123' , "isValid" : true, "permissionsLevel" : 1 };
    //console.log("react app login url is "+process.env.REACT_APP_LOGIN_API)
    let userObj = null;
    return new Promise((resolve, reject) => {
        //fetch from reponse
        let _uRole = (uname==="admin" ? "ADMIN" : "BRANCH");
        let _uStatus = "ACTIVE";
        let _isValid = true;
        let postData={
            "username": uname,
            "password": password,
            "userRole": _uRole,
            "userStatus": _uStatus 
          }
          let paramsData={
            "userRole": _uRole,
            "userStatus": _uStatus,
            "isValid": _isValid,
            "branch_id": '1'
          }

          if( uname=="admin" && password=="test" ){
            userObj = {...postData,...paramsData};
          }else{
            paramsData={
                "userRole": _uRole,
                "userStatus": _uStatus,
                "isValid": false,
                "branch_id": 0
              }
            userObj = {...postData,...paramsData};
          }
          //console.log("userObj",userObj)
          resolve(userObj);
        /*
        axios.post(process.env.REACT_APP_LOGIN_API,postData)
        .then(response =>{
            if(response && response.data && response.data.isValid && response.data.customerCodeStatus)
                localStorage.setItem('userProfile', JSON.stringify(response.data));
                resolve(response.data);
        }).catch(error =>{
            console.log("login error is "+ JSON.stringify(error))
            reject({error});
        })
        */
    });

}
 