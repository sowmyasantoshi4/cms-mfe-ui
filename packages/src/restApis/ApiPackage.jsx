import axios from 'axios';

export const getPackagesList = (branchCode) => {
    return new Promise((resolve, reject) => {
        let _url = process.env.REACT_APP_API_PACKAGES;
    axios.get(_url)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error);
        })
        .finally(() => {
            // console.log("finally in the packages list ")
        })
    })
}

export const getPackageDetails = (refNo) => {
    return new Promise((resolve, reject) => {
        let _url = process.env.REACT_APP_API_PACKAGE_DETAILS +"/"+ refNo;
    axios.get(_url)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error);
        })
        .finally(() => {
            // console.log("finally in the packages list ")
        })
    })
}

export const postPackageDetails = (data, items) => {
    return new Promise((resolve, reject) => {
        let itemsDataAr = [];
        items.map((key)=>{
            itemsDataAr.push({itemName: key.item_name, 
                                height: key.height,
                                weight: key.weight,
                                width: key.width,
                                price: key.price
                             });
        });
        const _data = {
            "senderName" : data.s_name,
            "senderPhoneNo" : data.s_phoneNo,
            "senderEmailId" : data.s_email,
            "senderHouseNo" : data.s_houseNo,
            "senderStreetNo" : data.s_street,
            "senderCity" : data.s_city,
            "senderDistrictId" : data.s_district,
            "senderStateId" : data.s_state,
            "senderPincode" : data.s_pincode,
            "receiverName" : data.r_name,
            "receiverPhoneNo" : data.r_phoneNo,
            "receiverEmailId" : data.r_email,
            "receiverHouseNo" : data.r_houseNo,
            "receiverStreetNo" : data.r_street,
            "receiverCity" : data.r_city,
            "receiverDistrictId" : data.r_district,
            "receiverStateId" : data.r_state,
            "receiverPincode" : data.r_pincode,
            "currentStatusId" : 1,  // for first time inserting into db status=1
            "remarks" : null,
            "sendingBranchId" : data.s_branch, 
            "receivingBranchId" : data.r_branch,
            "packageItems" : itemsDataAr, 
            "packageStatuses": [{ "statusId": 1,
                                    "remarks": "Parcel taken"
                                    } ]
        }
    axios.post(process.env.REACT_APP_API_PACKAGE_ADD, _data)
        .then(response => {
           // console.log("url changed and response is  "+JSON.stringify(response.data))
            resolve(response.data);
        })
        .catch(error => {
            reject(error);
        })
        .finally(() => {
            console.log("finally in the package post ")
        })
    })
}

export const postPackageUpdate = (data, referenceNo) => {
    return new Promise((resolve, reject) => {
        const _data = {
            "statusId" : data.status_id,
            "remarks": data.remarks,
            "dispatchStaffId": data.r_staff_member,
            "referenceNo": referenceNo
        }
        //process.env.REACT_APP_API_PACKAGE_UPDATE_STATUS = http://localhost:8080/cmsapi/packages/updateStatus
        let URL = process.env.REACT_APP_API_PACKAGE_UPDATE_STATUS;
        axios.post(URL, _data)
            .then(response => {
            // console.log("url changed and response is  "+JSON.stringify(response.data))
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
            .finally(() => {
                console.log("finally in the package post ")
            })
    })
}

