
import { useState } from 'react';
const DataProfile = () => {
const [userProfile,setUserProfile] = useState({
    "userId": '',
	"userEmail": '',
	"userFirstName": '',
	"userLastName": '',
	"userPhoneNumber": '',
	"userToken": '',
	"tokenExpireTime": '',
	"isValid": false,
	"errorMessage": '',
    "customerCode":'',
    "customerCodeStatus":false,
})


const updateUserProfile = (name, value) => {
    var updateValues = { [name]: value };
    setUserProfile({ ...userProfile, ...updateValues });
}
const updateUserProfileObject = (valuesSet) => {
    console.log("received values"+JSON.stringify(valuesSet))
    setUserProfile({
        ...userProfile,
        ...valuesSet
    });
    console.log("Updated values"+JSON.stringify(userProfile))
}

return {
    userProfile,
    updateUserProfile,
    updateUserProfileObject
}
}
export default DataProfile;
