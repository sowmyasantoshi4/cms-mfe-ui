import axios from 'axios';

export const postBranchDetails = ( obj, stObj ) => {
    let URL = process.env.REACT_APP_API_BRANCHES_ADD;
    let reqStAr = [];
    stObj.map((key)=>{
        reqStAr.push({staffId: key.staff_member});
    });
    let reqObj = {
        branchName : obj.name,
        phoneNo : obj.phoneNo,
        emailId : obj.email,
        houseNo : obj.houseNo,
        streetNo : obj.street,
        city : obj.city,
        districtId : obj.district,
        stateId : obj.state,
        pincode : obj.pincode,
        inchargeStaffId : obj.inchargeStaffId, 
        staff: reqStAr
    }
    return new Promise((resolve, reject) => {
        axios.post( URL , reqObj)
        .then(response =>{
            // console.log(response)
            if(response && response.data)
                resolve(response.data);
        }).catch(error =>{
            console.log("branch post error is "+ error)
            reject({error});
        })
    })
    
}

export const getBranchesList = () => {
    return new Promise((resolve, reject) => {
        let _url = process.env.REACT_APP_API_BRANCHES;
    axios.get(_url)
        .then(response => {
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
