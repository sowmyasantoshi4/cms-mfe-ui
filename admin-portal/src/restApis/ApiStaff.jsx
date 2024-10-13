import axios from 'axios';

export const getStaffMembersList = (branchCode) => {
    return new Promise((resolve, reject) => {
        let _url = process.env.REACT_APP_API_STAFF;
    axios.get(_url)
        .then(response => {
            console.log(response)
            resolve(response.data);
        })
        .catch(error => {
            reject(error);
        })
        .finally(() => {
            console.log("finally in the staff list ")
        })
    })
}

export const postStaffDetails = ( obj ) => {
    let URL = process.env.REACT_APP_API_STAFF_ADD;
    let reqObj = {
        staffName : obj.name,
        designationId : obj.designation,
        phoneNo : obj.phoneNo,
        emailId : obj.email,
        houseNo : obj.houseNo,
        streetNo : obj.street,
        city : obj.city,
        districtId : obj.district,
        stateId : obj.state,
        pincode : obj.pincode,
    }
    return new Promise((resolve, reject) => {
        axios.post( URL , reqObj)
        .then(response =>{
            //console.log(response)
            if(response && response.data)
                resolve(response.data);
        }).catch(error =>{
            console.log("login error is "+ error)
            reject({error});
        })
    })
    
}
