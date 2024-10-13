  
  export function validURL(str) {
    var res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  }
export const validateNumberDecimal = (value) => {
  const reg=/^(\d+(\.\d{0,2})?|\.?\d{1,2})$/
  if(reg.test(value)){
    return true;
  }
  return false;
          
}

export const validateNumber = (e) => {

  return e.target.validity.valid ?  true : false;
}

export const isValidSelect = (value) => {
  if (Number(value)!==0) {
    return true;
  }
  return false;
}

export function isValidEmail(str) {
  var res = str.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  return (res !== null)
}

export function isValidPhoneNo(str) {
  var res = str.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/);
  return (res !== null)
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export function formatDate(date) {
  return [
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    date.getFullYear(),
  ].join('/');
}

 

export const isNumberAndNotZero = (value) => {
  if ( !isNaN(value) && Number(value)!==0) {
    return true;
  }
  return false;
}

export const validateRequired = (value) => {
  //console.log("validatevalue="+value)
  if (!value) {
      return false;
  }
  return true;
}

export const getSessionStorageOrDefault = (key, defaultValue) => {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored);
}

export const getLocalStorageOrDefault = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored);
}


export const setLocalStorageItem = ( key, value ) => {
  let val = value ? JSON.stringify(value) : null;
  localStorage.setItem(key, val);
}

export const clearLocalStorage = () => {
    localStorage.clear();
}

export const copyStyles = (sourceDoc, targetDoc) => {
  Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
      targetDoc.head.appendChild(styleSheet.ownerNode.cloneNode(true))
  })
  // Array.from(sourceDoc.fonts).forEach(font => targetDoc.fonts.add(font))
}

export function isValidAlphaNumeric(str) {
  var res = str.match(/^([a-zA-Z0-9]+)$/);
  return (res !== null)
}

export function isValidAlpha(str) {
  var res = str.match(/^([a-zA-Z]+)$/);
  return (res !== null)
}

export function reformatToPhone(str) {
  var str1 = [];
  let s = str+"";
  str1[0] = s.substring(1,3);
  str1[1] = s.substring(3,6);
  str1[2] = s.substring(6);

  var res = "("+str1[0]+")"+str[1]+"-"+str[2];
  return res
}

export const extractStyles = (sourceDoc) => {
  let stylesCode = '';
  Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
     stylesCode += styleSheet.ownerNode.outerHTML;
  })
  return stylesCode ;
}

export function checkForPassword(str)
{
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
}

export const getStatusBgColor = (id) => {
  let clr = id == 1 ? "bg-danger" : 
        id == 2 ? "bg-warning" : 
        id == 3 ? "bg-primary" : 
        id == 4 ? "bg-success" : "";
  return clr;
}

export const compareDates = (date1, date2) => {
  if(date1 < date2) {
    // date1 is before date2
    return true;
  } else if (date1 > date2) {
    // date1 is after date2
    return false;
  } else {
    // date1 and date2 are the same date
    return true;
  }
}