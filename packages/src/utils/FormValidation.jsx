import { checkForPassword, isValidEmail, isValidPhoneNo } from "./ValidationUtils";

export const validateFormElements = ( formElements, formElementsValidations ) => {
    
    let formValidationStatus = true;

    let eleValidationFlag = true;
    let errorState = {}, errorCssState = {};

    for( let ele in formElementsValidations ){

        let validationsAr = formElementsValidations[ele];
       
        if( Array.isArray( validationsAr ) ){

            for( let x of validationsAr ){

                if( ele in errorState ){
                    break;
                }else{
                    if( x==="required" ){
                        if( formElements[ele].trim()==="" || Number(formElements[ele])===0 ){  //!formElements[ele] ) {
                            formValidationStatus = false;
                            eleValidationFlag = false;
                            errorState[ele] = "Required";
                            errorCssState[ele] = "is-invalid"
                        }
                    }
                    else if( x==="email" ){
                        if( !isValidEmail(formElements[ele]) ){
                            formValidationStatus = false;
                            eleValidationFlag = false;
                            errorState[ele] = "Invalid Email ID";
                            errorCssState[ele] = "is-invalid"
                        }
                    }
                    else if( x==="phoneNumber" ){
                        if( !isValidPhoneNo(formElements[ele]) ){
                            formValidationStatus = false;
                            eleValidationFlag = false;
                            errorState[ele] = "Invalid PhoneNo.";
                            errorCssState[ele] = "is-invalid"
                        }
                    }
                    else if( x==="password" ){
                        if( !checkForPassword(formElements[ele]) ){
                            formValidationStatus = false;
                            eleValidationFlag = false;
                            errorState[ele] = "Shall contain one Uppercase letter, one lowercase letter, one digit and one symbol";
                            errorCssState[ele] = "is-invalid"
                        }
                    }
                    else if( x==="alphabetsOnly" ){
                        
                    }
                    else if( x==="alphaNumericOnly" ){
                        
                    }
                    else if( x==="numericOnly" ){
                        
                    }
                }
            }
        }
    }

    // console.log(formValidationStatus , errorState , errorCssState)

  return { formValidationStatus , errorState , errorCssState } ; 
}