import { getLocalStorageOrDefault } from "./ValidationUtils";

export const processStatesOptions = () => {
    let stList = getLocalStorageOrDefault("statesList");
    let _list = [];
    _list.push({ label: '-Choose-', value: '0' });
    stList && stList.map((key,val)=>{
        _list.push({ label: key.stateName, value: key.stateId });
    });
    return _list;
}

export const processStatusOptions = () => {
    let stList = getLocalStorageOrDefault("statusList");
    let _list = [];
    _list.push({ label: '-Choose-', value: '0' });
    stList && stList.map((key,val)=>{
        _list.push({ label: key.statusName, value: key.statusId });
    });
    console.log("stList",stList);
    return _list;
}

export const processDistrictOptions = (stateId) => {
    let distList = getLocalStorageOrDefault("districtsList");
    let _list = [];
    _list.push({ label: '-Choose-', value: '0' });
    if( stateId ){
        distList && distList.filter(obj => {
            return obj.stateId == stateId;
        })
        .map((key,val)=>{
            _list.push({ label: key.districtName, value: key.districtId });
        });
    }
    return _list;
}

export const processBranchesOptions = (stateId) => {
    let brList = getLocalStorageOrDefault("branchesList");
    let _list = [];
    _list.push({ label: '-Choose-', value: '0' });
    if( stateId ){
        if (brList) {
            brList = brList
            .filter(obj => {
                return obj.stateId == stateId;
            })
        }
    }
    brList?.map((key,val)=>{
        _list.push({ label: key.branchName, value: key.branchId });
    });
    // console.log("br_list",_list);
    return _list;
}

export const processDesignationsOptions = () => {
    let dgList = getLocalStorageOrDefault("designationsList");
    let _list = [];
    _list.push({ label: '-Choose-', value: '0' });
    dgList && dgList
    .map((key,val)=>{
        _list.push({ label: key.designationName, value: key.designationId });
    });
    return _list;
}

export const processStaffOptions = (userBranchId) => {
    
    let stList = getLocalStorageOrDefault("staffList");
    let _list = [];
    _list.push({ label: '-Choose-', value: '0' });

    if( stList ){
        if( Number(userBranchId)!=0 ){
            stList = stList.filter(obj => {
                return obj.branchId == userBranchId
            });
        }
        stList.map((key,val)=>{
            _list.push({ label: key.name, value: key.branchId });
        });
    }
    // console.log("_list",_list)
    return _list;
}

export const processStaffOptionsForAddBranch = (userBranchId) => {
    
    let stList = getLocalStorageOrDefault("staffList");
    let _list = [];
    _list.push({ label: '-Choose-', value: '0' });

    if( stList ){
        console.log(stList)
        // getting only unassigned staff for new branch
        stList = stList.filter(obj => {
            // console.log(obj.branchId == 0 && obj.designationId != 1, obj.branchId,obj.designationId)
            // excluding admin && branchIncharge and who are not added to any branch
            return obj.branchId == 0 && obj.designationId != 1  && obj.designationId != 2;
        });
        
        if( Number(userBranchId)!=0 ){
            // filtering branche satff members
            stList = stList.filter(obj => {
                return obj.branchId == userBranchId;
            });
        }
        stList.map((key,val)=>{
            _list.push({ label: key.staffName, value: key.staffId });
        });
    }
    // console.log("_list",_list)
    return _list;
}

export const processStaffIncOptionsForAddBranch = () => {
    let stList = getLocalStorageOrDefault("staffList");
    let _list = [];
    _list.push({ label: '-Choose-', value: '0' });

    if( stList ){
        // console.log(stList)
        // getting only unassigned staff for new branch
        stList = stList.filter(obj => {
            // console.log(obj.branchId == 0 && obj.designationId != 1, obj.branchId,obj.designationId)
            return obj.branchId == 0 && obj.designationId == 2;
        });
        stList.map((key,val)=>{
            _list.push({ label: key.staffName, value: key.staffId });
        });
    }
    // console.log("_list",_list)
    return _list;
}