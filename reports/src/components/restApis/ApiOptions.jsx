import axios from 'axios';
import { setLocalStorageItem } from '../../components/utils/ValidationUtils';

export const loadDistricts = (stateId) => {
    let _url = process.env.REACT_APP_API_DISTRICTS;
    return new Promise((resolve, reject) => {
        axios.get(_url)
        .then(response => {
            setLocalStorageItem("districtsList", response.data);
            resolve();
        }).catch(error =>{
            console.log("loadDistricts error is ", error)
            reject({error});
        })
        .finally(() => {
            //console.log("finally in the districts list ")
        })
    })
}

export const loadStates = () => {
    let _url = process.env.REACT_APP_API_STATES;
    return new Promise((resolve, reject) => {
        axios.get(_url)
        .then(response => {
            setLocalStorageItem("statesList", response.data);
            resolve();
        }).catch(error =>{
            console.log("loadStates error is ", error)
            reject({error});
        })
        .finally(() => {
            //console.log("finally in the states list ")
        })
    })
}

export const loadStatus = () => {
    let _url = process.env.REACT_APP_API_STATUS;
    return new Promise((resolve, reject) => {
        axios.get(_url)
        .then(response => {
            setLocalStorageItem("statusList", response.data);
            resolve();
        }).catch(error =>{
            console.log("loadStatus error is ", error)
            reject({error});
        })
        .finally(() => {
            console.log("finally in the status list ")
        })
    })
}

export const loadDesignations = () => {
    let _url = process.env.REACT_APP_API_DESIGNATIONS;
    return new Promise((resolve, reject) => {
        axios.get(_url)
        .then(response => {
            setLocalStorageItem("designationsList", response.data);
            resolve();
        }).catch(error =>{
            console.log("loadDesignations error is ", error)
            reject({error});
        })
        .finally(() => {
            //console.log("finally in the designations list ")
        })
    })
}



export const loadAllStaff = () => {
    let _url = null;

    return new Promise((resolve, reject) => {
        _url = process.env.REACT_APP_API_STAFF;
        axios.get(_url)
        .then(response => {
            saveLocalStaffList(response);
            resolve();
        }).catch(error =>{
            console.log("loadStaff error is ", error)
            reject({error});
        })
        .finally(() => {
            //console.log("finally in the districts list ")
        })
    })
}

export const loadBranches = () => {
    let _url = process.env.REACT_APP_API_BRANCHES;
    return new Promise((resolve, reject) => {
        axios.get(_url)
        .then(response => {
            saveLocalBranchesList(response);
            resolve();
        }).catch(error =>{
            console.log("loadBranches error is ", error)
            reject({error});
        })
        .finally(() => {
            //console.log("finally in the branches list ")
        })
    })
}

export const saveLocalStaffList = (response) => {
    let ar = [];
    response.data && response.data.map((key)=>{
        ar.push({ "staffId":key.staffId, "staffName": key.staffName, "designationId" : key.designationId, "branchId" : key.branchId });
    });
    setLocalStorageItem("staffList", ar);
}

export const saveLocalBranchesList = (response) => {
    let ar = [];
    response.data && response.data.map((key)=>{
        ar.push({ "branchId":key.branchId, "branchName": key.branchName });
    });
    setLocalStorageItem("branchesList", ar);
}