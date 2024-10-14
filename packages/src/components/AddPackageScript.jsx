import React from 'react'
import { useState } from 'react';
import { validateFormElements } from '../utils/FormValidation';

const AddPackageScript = () => {

let dataObj = {
    s_name: '',
    s_email: '',
    s_phoneNo: '',
    s_houseNo: '',
    s_street: '',
    s_city: '',
    s_district: '',
    s_state:'',
    s_pincode: '',
    r_name: '',
    r_email: '',
    r_phoneNo: '',
    r_houseNo: '',
    r_street: '',
    r_city: '',
    r_district: '',
    r_state:'',
    r_pincode: '',
  }

  let itemObj = {
    item_name: '', height: '', weight: '', width: '', price: ''
  }

  const [data, setData] = useState(dataObj);
  const [msgStatus, setMsgStatus] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(dataObj);
  const [errorCss, setErrorCss] = useState(dataObj);

  const [viewList, setViewList] = useState([]);
  const [viewColumns, setViewColumns] = useState([]);

  const [displayView, setDisplayView] = useState(false);
  const [items, setItems] = useState([itemObj]);
  const [errorsItems, setErrorsItems] = useState([itemObj]);
  const [errorCssItems, setErrorCssItems] = useState([itemObj]);


  const [validationsForEle, setValidationsForEle] = useState({
    s_name: ['required'],
    s_phoneNo: ['required','phoneNo'],
    s_email: ['required','email'],
    s_houseNo: ['required'],
    s_street: ['required'],
    s_city: ['required'],
    s_district: ['required'],
    s_state: ['required'],
    s_pincode: ['required','pincode'],
    r_name: ['required'],
    r_phoneNo: ['required','phoneNo'],
    r_email: ['required','email'],
    r_houseNo: ['required'],
    r_street: ['required'],
    r_city: ['required'],
    r_district: ['required'],
    r_state: ['required'],
    r_pincode: ['required','pincode'],
  });

  const handleSubmit = () => {

    const { formValidationStatus , errors_State , errorCsss_State } = validateFormElements( data , validationsForEle );
    let formValidationItemsStatus = true;

    console.log(errors_State)

    let _tempErrValItems = [],  _tempErrItems = [],  _tempErrCssItems = [];
    let _req = null, _reqErr = null, _reqCss = null;
    for(let x of items ){
      //console.log("x",x)
      // Object.entries(x).map((k,i)=>{
      //   console.log(k,i)
      // });
      if( x.staff_member ){
        _req = false;
        _reqErr = '';
        _reqCss = '';
      }else{
        _req = true;
        _reqErr = 'Required';
        _reqCss = 'is-invalid';
      }
      _tempErrValItems.push({'staff_member': _req});
      _tempErrItems.push({'staff_member': _reqErr});
      _tempErrCssItems.push({'staff_member': _reqCss});
    }

    formValidationItemsStatus = Object.entries(_tempErrValItems).includes(true);

      if( formValidationStatus ){
        setIsLoading(true);
        console.log("data",data)
        postPackageDetails(data)
        .then(response => {
          // console.log("Signup PAGE GOT THE response="+JSON.stringify(response))
          if (response instanceof Error) {
            setInvalid();
            setMsgStatus({responseCSS:'danger', responseStatus:'Failed to Save Items Data'});
          }  else {
            if(response.userProfiles_Email === data.s_email  && response.userProfileId !== null){
              setMsgStatus({responseCSS:'success', responseStatus: 'Items Details saved Successfully !'});
              clearForm();
            }else{
              setMsgStatus({responseCSS:'danger', responseStatus: response.userProfileStatus});
            }
          }
        }).catch(error =>{
          setInvalid();
          setMsgStatus({responseCSS:'danger', responseStatus:'Failed to Save Items'});
        })
        .finally(r => {
          setIsLoading(false);
          setTimeout(()=>{
            setMsgStatus({responseCSS:'', responseStatus:''});
          },10000)
        })
      }else{
        //console.log(errors_State)
        //setErrors(errors_State);
        //setErrorCss(errorCsss_State);
        //setErrorsItems(_tempErrItems);
        //setErrorCssItems(_tempErrCssItems);
      }
    }


  const handleInputChange = (e) => {
    let id = e.target.name;
    let val = e.target.value;

    setData({ ...data, [id]: val });
    
    if (val === '') {
      setErrorCss({...errorCss,[id]:'is-invalid'})
    } else {
      setErrors({...errors,[id]:''})
      setErrorCss({...errorCss,[id]:''})
    }
  }

  const setInvalid = () => {
    setErrors({
      s_name: 'Invalid Name',
      s_phoneNo: 'Invalid Phone Number',
      s_email: 'Invalid s_Email ID',
      s_houseNo: 'Invalid Username',
      s_street: 'Invalid s_Street',
      s_city: 'Invalid s_City',
      s_state: 'Invalid s_State',
      s_pincode: 'Invalid Pincode',

    });
    setErrorCss({
      s_name: 'is-invalid',
      s_phoneNo:'is-invalid',
      s_email: 'is-invalid',
      s_houseNo: 'is-invalid',
      s_street: 'is-invalid',
      s_city: 'is-invalid',
      s_state: 'is-invalid',
      s_district: 'is-invalid',
      s_pincode: 'is-invalid'
    });
  }

  const clearForm = () => {
    setData(dataObj);
    setErrors(dataObj);
    setErrorCss(dataObj);
    setItems([itemObj]);
    setErrorsItems([itemObj]);
    setErrorCssItems([itemObj]);
  }

  const handleInputChangeItem = (e, index) => {
    let id = e.target.name;
    let val = e.target.value;
    let upObj = [...items];
    upObj[index][id]=val;
    // console.log(upObj)
    setItems(upObj);
    
    if (val === '') {
      setErrorCssItems({...errorCssItems, [id]:'is-invalid'})
    } else {
      setErrorsItems({...errorsItems, [id]:''})
      setErrorCssItems({...errorCssItems, [id]:''})
    }
  }

  const handleViewList = () => {
    // ajax for fetching the view list
    setDisplayView(true);
    setViewList();
  }

  const handleAddForm = () => {
    setDisplayView(false);
  }

  const addItem = () => {
    setItems([...items, itemObj]);
    setErrorsItems([...errorsItems, itemObj]);
    setErrorCssItems([...errorCssItems, itemObj]);
  }

  const deleteItem = (index) => {
    //alert(index)
    let itemsRows = [...items];
    itemsRows.splice(index, 1);
    let _errorRows = [...errorsItems];
    _errorRows.splice(index, 1);
    let _cssRows = [...errorCssItems];
    _cssRows.splice(index, 1);
    setItems(itemsRows);
    setErrorsItems(_errorRows);
    setErrorCssItems(_cssRows);
  }

  // console.log("err=",errors)
  // console.log("errcss=",errorCss)


  return {
    data, errors, errorCss, msgStatus, isLoading, items, errorsItems, errorCssItems, displayView, 
    handleInputChange, handleSubmit, clearForm, handleInputChangeItem, handleViewList, handleAddForm, addItem, deleteItem
  }
}

export default AddPackageScript