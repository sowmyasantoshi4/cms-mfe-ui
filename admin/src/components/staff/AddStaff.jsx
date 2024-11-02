import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Alert, FloatingLabel } from 'react-bootstrap';
import { faCheckCircle, faList, faPlusCircle, faRedo, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { processDesignationsOptions, processDistrictOptions, processStatesOptions } from '../../utils/CommonOptionUtils';
import { validateFormElements } from '../../utils/FormValidation';
import { postStaffDetails } from '../../restApis/ApiStaff';
import ViewStaff from './ViewStaff';
import { loadAllStaff } from '../../restApis/ApiOptions';

export const AddStaff = (props) => {
  
  let dataObj = {
    name: '',
    designation: '',
    email: '',
    phoneNo: '',
    houseNo: '',
    street: '',
    city: '',
    district: '',
    state:'',
    pincode: ''
  }

  const [data, setData] = useState(dataObj);
  const [msgStatus, setMsgStatus] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(dataObj);
  const [errorCss, setErrorCss] = useState(dataObj);
  const [viewList, setViewList] = useState([]);

  const [displayView, setDisplayView] = useState(false);

  const [validationsForEle, setValidationsForEle] = useState({
    name: ['required'],
    designation: ['required'],
    phoneNo: ['required','phoneNo'],
    email: ['required','email'],
    houseNo: ['required'],
    street: ['required'],
    city: ['required'],
    district: ['required'],
    state: ['required'],
    pincode: ['required','pincode'],
  });

  const handleSubmit = () => {

    const { formValidationStatus , errorState , errorCssState } = validateFormElements( data , validationsForEle );

      if( formValidationStatus ){
        setIsLoading(true);
        //console.log("data",data)
        postStaffDetails(data)
        .then(response => {
          // console.log("Signup PAGE GOT THE response="+JSON.stringify(response))
          if (response instanceof Error) {
            setInvalid();
            setMsgStatus({responseCSS:'danger', responseStatus:'Failed to Save Staff Data'});
          }  else {
            if(response === data.name  && response !== null){
              setMsgStatus({responseCSS:'success', responseStatus:'Staff Details saved Successfully !'});
              clearForm();
              //updating the local staff data
              loadAllStaff();
            }else{
              setMsgStatus({responseCSS:'danger', responseStatus: response.userProfileStatus});
            }
          }
        }).catch(error =>{
          setInvalid();
          setMsgStatus({responseCSS:'danger', responseStatus:'Failed to Save Staff'});
        })
        .finally(r => {
          setIsLoading(false);
          setTimeout(()=>{
            setMsgStatus({responseCSS:'', responseStatus:''});
          },5000)
        })
      }else{
        setErrors(errorState);
        setErrorCss(errorCssState);
      }
    }


  const handleInputChange = (e) => {
    let id = e.target.name;
    let val = e.target.value;

    if( id=="phoneNo" ){
      if( val.length > 10 ){
        return false;
      }
    }

    if( id=="pincode" ){
      if( val.length > 6 ){
        return false;
      }
    }

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
      name: 'Invalid Name',
      designation: 'Invalid Designation',
      phoneNo: 'Invalid phone number',
      email: 'Invalid Email ID',
      houseNo: 'Invalid Username',
      street: 'Invalid Street',
      city: 'Invalid City',
      state: 'Invalid State',
      district: 'Invalid District',
      pincode: 'Invalid Pincode',

    });
    setErrorCss({
      name: 'is-invalid',
      designation: 'is-invalid',
      phoneNo:'is-invalid',
      email: 'is-invalid',
      houseNo: 'is-invalid',
      street: 'is-invalid',
      city: 'is-invalid',
      state: 'is-invalid',
      district: 'is-invalid',
      pincode: 'is-invalid'
    });
  }

  const clearForm = () => {
    setData(dataObj);
    setErrors(dataObj);
    setErrorCss(dataObj);
    setIsLoading(false);
  }

  const handleViewList = () => {
    setDisplayView(true);
  }

  const handleAddForm = () => {
    setDisplayView(false);
  }

  const [stList, setStList] = useState([]);
  const [distList, setDistList] = useState([]);
  const [desigList, setDesigList] = useState([]);

  useEffect(() => {
    setStList(processStatesOptions());
    setDesigList(processDesignationsOptions());
  }, [])

  useEffect(() => {
    setDistList(processDistrictOptions(data.state));
  }, [data.state])

  return (
    <>
  {displayView 
    ? 
    <ViewStaff handleAddForm={handleAddForm} />
    : 
    <Container>
      <Row>
        <Col xs={12} md={12}>
          <Card className='border-0 shadow-lg'>
            <Card.Header className='bg-info'>
              <Row>
                <Col xs={10} md={10}>
                  ADD STAFF
                </Col>
                <Col xs={2} md={2}>
                  <Button variant='warning' onClick={handleViewList} className='float-end'>
                    <FontAwesomeIcon icon={faList} /> View
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {msgStatus.responseCSS && (
                <Row>
                  <Col xs={12} md={12} className="text-center">
                    <Alert variant={msgStatus.responseCSS}>
                      {msgStatus.responseCSS === "success" && <FontAwesomeIcon icon={faCheckCircle} />}
                      {msgStatus.responseCSS === "danger" && <FontAwesomeIcon icon={faTimesCircle} />}
                      &nbsp; {msgStatus.responseStatus}
                    </Alert>
                  </Col>
                </Row>
              )}
              <Form>
                <Row className='mb-3'>
                  <Col md={3}>
                    <FloatingLabel controlId="name" label="Name">
                      <Form.Control 
                        type="text" 
                        value={data.name} 
                        name="name" 
                        onChange={handleInputChange} 
                        isInvalid={!!errors.name} 
                        maxLength={30} 
                        required 
                      />
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md={3}>
                    <FloatingLabel controlId="designation" label="Designation">
                      <Form.Select 
                        value={data.designation} 
                        name="designation" 
                        onChange={handleInputChange} 
                        isInvalid={!!errors.designation} 
                        required 
                      >
                        {desigList.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.designation}</Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md={3}>
                    <FloatingLabel controlId="email" label="Email ID">
                      <Form.Control 
                        type="email" 
                        value={data.email} 
                        name="email" 
                        onChange={handleInputChange} 
                        isInvalid={!!errors.email} 
                        maxLength={30} 
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md={3}>
                    <FloatingLabel controlId="phoneNo" label="Phone Number">
                      <Form.Control 
                        type="number" 
                        value={data.phoneNo} 
                        name="phoneNo" 
                        onChange={handleInputChange} 
                        isInvalid={!!errors.phoneNo} 
                        maxLength={10} 
                        required 
                      />
                      <Form.Control.Feedback type="invalid">{errors.phoneNo}</Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                </Row>
                
                <fieldset className='bg-light p-3'>
                  <legend className='alert alert-primary px-2 py-1'>Address</legend>
                  <Row className='mb-2'>
                    <Col md={4}>
                      <FloatingLabel controlId="houseNo" label="House No.">
                        <Form.Control 
                          type="text" 
                          value={data.houseNo} 
                          name="houseNo" 
                          onChange={handleInputChange} 
                          isInvalid={!!errors.houseNo} 
                          required 
                        />
                        <Form.Control.Feedback type="invalid">{errors.houseNo}</Form.Control.Feedback>
                      </FloatingLabel>
                    </Col>
                    <Col md={4}>
                      <FloatingLabel controlId="street" label="Street">
                        <Form.Control 
                          type="text" 
                          value={data.street} 
                          name="street" 
                          onChange={handleInputChange} 
                          isInvalid={!!errors.street} 
                          required 
                        />
                        <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
                      </FloatingLabel>
                    </Col>
                    <Col md={4}>
                      <FloatingLabel controlId="city" label="City">
                        <Form.Control 
                          type="text" 
                          value={data.city} 
                          name="city" 
                          onChange={handleInputChange} 
                          isInvalid={!!errors.city} 
                          required 
                        />
                        <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row className='mb-2'>
                    <Col md={4}>
                      <FloatingLabel controlId="state" label="State">
                        <Form.Select 
                          value={data.state} 
                          name="state" 
                          onChange={handleInputChange} 
                          isInvalid={!!errors.state} 
                          required 
                        >
                          {stList.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                      </FloatingLabel>
                    </Col>
                    <Col md={4}>
                      <FloatingLabel controlId="district" label="District">
                        <Form.Select 
                          value={data.district} 
                          name="district" 
                          onChange={handleInputChange} 
                          isInvalid={!!errors.district} 
                          required 
                        >
                          {distList.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.district}</Form.Control.Feedback>
                      </FloatingLabel>
                    </Col>
                    <Col md={4}>
                      <FloatingLabel controlId="pincode" label="Pincode">
                        <Form.Control 
                          type="number" 
                          value={data.pincode} 
                          name="pincode" 
                          onChange={handleInputChange} 
                          isInvalid={!!errors.pincode} 
                          required 
                        />
                        <Form.Control.Feedback type="invalid">{errors.pincode}</Form.Control.Feedback>
                      </FloatingLabel>
                    </Col>
                  </Row>
                </fieldset>
              </Form>
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col className='d-flex justify-content-center'>
                  <Button variant='dark' onClick={clearForm} className='mx-2'>
                    <FontAwesomeIcon icon={faRedo} /> Clear
                  </Button>
                  {isLoading ? (
                    <Button variant="info" disabled>
                      <FontAwesomeIcon icon={faSpinner} spin /> Adding...
                    </Button>
                  ) : (
                    <Button variant='info' onClick={handleSubmit}>
                      <FontAwesomeIcon icon={faPlusCircle} /> Add Staff Member
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  }
</>

  );
};

export default AddStaff;