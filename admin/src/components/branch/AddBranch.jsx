import { Button, Card, Col, Container, Form, FloatingLabel, FormControl, FormGroup, FormLabel, Row, Alert, CardHeader, CardBody, FormText } from 'react-bootstrap';
import { faCheckCircle, faList, faPlusCircle, faRedo, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { processDistrictOptions, processStaffIncOptionsForAddBranch, processStaffOptionsForAddBranch, processStatesOptions } from '../../utils/CommonOptionUtils';
import { validateFormElements } from '../../utils/FormValidation';
import BranchStaff from './BranchStaff';
import ViewBranch from './ViewBranch';
import { useSelector } from 'react-redux';
import { postBranchDetails } from '../../restApis/ApiBranch';
import { loadAllStaff, loadBranches } from '../../restApis/ApiOptions';

export const AddBranch = (props) => {

  
  let dataObj = {
    name: '',
    email: '',
    phoneNo: '',
    houseNo: '',
    street: '',
    city: '',
    district: '',
    state:'',
    pincode: '',
    inchargeStaffId : ''
  }

  let staffObj = {
    staff_member: ''
  }

  let errorStaffObj = {
    staff_member: 'Required'
  }

  let errorStaffCssObj = {
    staff_member: 'is-invalid'
  }

  const [data, setData] = useState(dataObj);
  const [msgStatus, setMsgStatus] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(dataObj);
  const [errorCss, setErrorCss] = useState(dataObj);
  
  const [viewList, setViewList] = useState([]);
  const [viewColumns, setViewColumns] = useState([]);

  const [displayView, setDisplayView] = useState(false);
  const [staff, setStaff] = useState([staffObj]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [errorsStaff, setErrorsStaff] = useState([errorStaffObj]);
  const [errorCssStaff, setErrorCssStaff] = useState([errorStaffCssObj]);


  const [validationsForEle, setValidationsForEle] = useState({
    name: ['required'],
    phoneNo: ['required','phoneNo'],
    email: ['required','email'],
    houseNo: ['required'],
    street: ['required'],
    city: ['required'],
    district: ['required'],
    state: ['required'],
    pincode: ['required','pincode'],
    inchargeStaffId : ['required'],
  });

  const handleSubmit = () => {

    const { formValidationStatus , errorState , errorCssState } = validateFormElements( data , validationsForEle );
    let formValidationStaffStatus = true;

    let _tempErrReqStaff = [],  _tempErrStaff = [],  _tempErrCssStaff = [];
    let _req = null, _reqErr = null, _reqCss = null;
    for(let x of staff ){
      //console.log("x",x)
      if( x.staff_member ){
        _req = false;
        _reqErr = '';
        _reqCss = '';
      }else{
        _req = true;
        _reqErr = 'Required';
        _reqCss = 'is-invalid';
      }
      _tempErrReqStaff.push({'staff_member': _req});
      _tempErrStaff.push({'staff_member': _reqErr});
      _tempErrCssStaff.push({'staff_member': _reqCss});
    }

    formValidationStaffStatus = !Object.entries(_tempErrReqStaff).includes(true);

      if( formValidationStatus && formValidationStaffStatus ){


        setIsLoading(true);
        //console.log("data",data)
        postBranchDetails(data, staff)
        .then(response => {
          // console.log("Signup PAGE GOT THE response="+JSON.stringify(response))
          if (response instanceof Error) {
            setInvalid();
            setMsgStatus({responseCSS:'danger', responseStatus:'Failed to Save Branch Data'});
          }  else {
            if(response === data.name  && response !== null){
              setMsgStatus({responseCSS:'success', responseStatus:'Branch Details saved Successfully !'});
              clearForm();
              //updating the local options
              loadAllStaff();
              loadBranches();
              
            }else{
              setMsgStatus({responseCSS:'danger', responseStatus: response.status});
            }
          }
        }).catch(error =>{
          setInvalid();
          setMsgStatus({responseCSS:'danger', responseStatus:'Failed to Save Branch'});
        })
        .finally(r => {
          setIsLoading(false);
          setTimeout(()=>{
            setMsgStatus({responseCSS:'', responseStatus:''});
            
            setStaffList(processStaffOptionsForAddBranch(userBranchId));
            setStaffIncList(processStaffIncOptionsForAddBranch());
          },5000)
        })
      }else{
        setErrors(errorState);
        setErrorCss(errorCssState);
        setErrorsStaff(_tempErrStaff);
        setErrorCssStaff(_tempErrCssStaff);
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

  const handleInputChangeStaff = (index) => (e) => {
    let id = e.target.name;
    let val = e.target.value;
    let upObj = [...staff]; // create a copy of the staff array to modify it

    // Update the specific staff member at the given index
    upObj[index][id] = val;
    
    setStaff(upObj); // update the state with the new staff object
    
    // Also update validation errors and CSS class for that specific index
    let upObj2 = [...errorsStaff];
    let upObj1 = [...errorCssStaff];

    if (val === '' || val === '0') {
        upObj1[index][id] = 'is-invalid';
        upObj2[index][id] = 'Required';
    } else {
        upObj1[index][id] = '';
        upObj2[index][id] = '';
    }

    setErrorCssStaff(upObj1); // update errorCss
    setErrorsStaff(upObj2);   // update errors
};


  const setInvalid = () => {
    setErrors({
      name: 'Invalid Name',
      phoneNo: 'Invalid phone number',
      email: 'Invalid branch_Email ID',
      houseNo: 'Invalid Username',
      street: 'Invalid Street',
      city: 'Invalid City',
      state: 'Invalid State',
      pincode: 'Invalid Pincode',
      inchargeStaffId: 'Invalid Incharge Staff'
    });
    setErrorCss({
      name: 'is-invalid',
      phoneNo:'is-invalid',
      email: 'is-invalid',
      houseNo: 'is-invalid',
      street: 'is-invalid',
      city: 'is-invalid',
      state: 'is-invalid',
      district: 'is-invalid',
      pincode: 'is-invalid',
      inchargeStaffId : 'is-invalid'
    });
  }

  const clearForm = () => {
    setData(dataObj);
    setErrors(dataObj);
    setErrorCss(dataObj);
    setStaff([staffObj]);
    setErrorsStaff([staffObj]);
    setErrorCssStaff([staffObj]);
    setIsLoading(false);
  }

  const handleViewList = () => {
    // ajax for fetching the view list
    setDisplayView(true);
    setViewList();
  }

  const handleAddForm = () => {
    setDisplayView(false);
  }

  const addStaff = () => {
    setStaff([...staff, staffObj]);
    setErrorsStaff([...errorsStaff, staffObj]);
    setErrorCssStaff([...errorCssStaff, staffObj]);
  }

  const deleteStaff = (index) => {
    //alert(index)
    let staffRows = [...staff];
    staffRows.splice(index, 1);
    let _errorRows = [...errorsStaff];
    _errorRows.splice(index, 1);
    let _cssRows = [...errorCssStaff];
    _cssRows.splice(index, 1);
    setStaff(staffRows);
    setErrorsStaff(_errorRows);
    setErrorCssStaff(_cssRows);
  }

  const [stList, setStList] = useState([]);
  const [distList, setDistList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [staffIncList, setStaffIncList] = useState([]);


  const userProfile = useSelector((state) => state.usr)
  let userBranchId = userProfile && userProfile.branchId ? userProfile.branchId : 0;
  // console.log("branchId",userBranchId)
  
  useEffect(() => {
    setStList(processStatesOptions());
    setStaffList(processStaffOptionsForAddBranch(userBranchId));
    setStaffIncList(processStaffIncOptionsForAddBranch());
  }, [])

  useEffect(() => {
    setDistList(processDistrictOptions(data.state));
  }, [data.state])

  return (
    <>
  {displayView ? (
    <ViewBranch
      handleAddForm={handleAddForm}
      columns={viewColumns}
      staffData={viewList}
    />
  ) : (
    <Container>
      <Row>
        <Col xs={12} md={12}>
          <Card className="border-0 shadow-lg">
            <Card.Header className="bg-info text-white">
              <Row>
                <Col xs={10} md={10}>ADD BRANCH</Col>
                <Col xs={2} md={2}>
                  <Button
                    variant="warning"
                    onClick={handleViewList}
                    className="float-end"
                  >
                    <FontAwesomeIcon icon={faList} /> View
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {msgStatus.responseCSS && (
                <Row>
                  <Col xs={12} md={10} className="offset-md-1 text-center">
                    <Alert variant={msgStatus.responseCSS}>
                      {msgStatus.responseCSS === "success" && (
                        <FontAwesomeIcon icon={faCheckCircle} />
                      )}
                      {msgStatus.responseCSS === "danger" && (
                        <FontAwesomeIcon icon={faTimesCircle} />
                      )}
                      &nbsp; {msgStatus.responseStatus}
                    </Alert>
                  </Col>
                </Row>
              )}
              <Form>
                <Row className="mb-3">
                  <Col md={3}>
                    <FloatingLabel label="Branch Name">
                      <Form.Control
                        type="text"
                        placeholder="Branch Name"
                        maxLength={30}
                        name="name"
                        value={data.name}
                        onChange={handleInputChange}
                        isInvalid={!!errors.name}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md={3}>
                    <FloatingLabel label="Email ID">
                      <Form.Control
                        type="email"
                        placeholder="Email ID"
                        maxLength={30}
                        name="email"
                        value={data.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md={3}>
                    <FloatingLabel label="Phone Number">
                      <Form.Control
                        type="number"
                        placeholder="Phone Number"
                        max={9999999999}
                        name="phoneNo"
                        value={data.phoneNo}
                        onChange={handleInputChange}
                        isInvalid={!!errors.phoneNo}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phoneNo}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md={3}>
                    <FloatingLabel label="Incharge Staff">
                      <Form.Select
                        name="inchargeStaffId"
                        value={data.inchargeStaffId}
                        onChange={handleInputChange}
                        isInvalid={!!errors.inchargeStaffId}
                        required
                      >
                        {/* <option value="">Select Incharge Staff</option> */}
                        {staffIncList.map((staff) => (
                          <option key={staff.value} value={staff.value}>
                            {staff.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.inchargeStaffId}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <fieldset className="bg-light p-3">
                      <legend className="alert alert-primary px-2 py-1">
                        Address
                      </legend>
                      <Row className="mb-3">
                        <Col md={4}>
                          <FloatingLabel label="House #">
                            <Form.Control
                              type="text"
                              placeholder="House #"
                              maxLength={30}
                              name="houseNo"
                              value={data.houseNo}
                              onChange={handleInputChange}
                              isInvalid={!!errors.houseNo}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.houseNo}
                            </Form.Control.Feedback>
                          </FloatingLabel>
                        </Col>
                        <Col md={4}>
                          <FloatingLabel label="Street">
                            <Form.Control
                              type="text"
                              placeholder="Street"
                              maxLength={30}
                              name="street"
                              value={data.street}
                              onChange={handleInputChange}
                              isInvalid={!!errors.street}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.street}
                            </Form.Control.Feedback>
                          </FloatingLabel>
                        </Col>
                        <Col md={4}>
                          <FloatingLabel label="City">
                            <Form.Control
                              type="text"
                              placeholder="City"
                              maxLength={30}
                              name="city"
                              value={data.city}
                              onChange={handleInputChange}
                              isInvalid={!!errors.city}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.city}
                            </Form.Control.Feedback>
                          </FloatingLabel>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={4}>
                          <FloatingLabel label="State">
                            <Form.Select
                              name="state"
                              value={data.state}
                              onChange={handleInputChange}
                              isInvalid={!!errors.state}
                              required
                            >
                              {/* <option value="">Select State</option> */}
                              {stList.map((state) => (
                                <option key={state.value} value={state.value}>
                                  {state.label}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {errors.state}
                            </Form.Control.Feedback>
                          </FloatingLabel>
                        </Col>
                        <Col md={4}>
                          <FloatingLabel label="District">
                            <Form.Select
                              name="district"
                              value={data.district}
                              onChange={handleInputChange}
                              isInvalid={!!errors.district}
                              required
                            >
                              {/* <option value="">Select District</option> */}
                              {distList.map((district) => (
                                <option key={district.value} value={district.value}>
                                  {district.label}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {errors.district}
                            </Form.Control.Feedback>
                          </FloatingLabel>
                        </Col>
                        <Col md={4}>
                          <FloatingLabel label="Pincode">
                            <Form.Control
                              type="number"
                              placeholder="Pincode"
                              max={999999}
                              name="pincode"
                              value={data.pincode}
                              onChange={handleInputChange}
                              isInvalid={!!errors.pincode}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pincode}
                            </Form.Control.Feedback>
                          </FloatingLabel>
                        </Col>
                      </Row>
                    </fieldset>
                  </Col>
                  <Col md={6}>
                    {/* The BranchStaff component implementation */}
                    <BranchStaff
                      handleInputChangeStaff={handleInputChangeStaff}
                      staff={staff}
                      errors={errorsStaff}
                      errorCss={errorCssStaff}
                      staffList={staffList}
                      addStaff={addStaff}
                      deleteStaff={deleteStaff}
                    />
                    {/* {JSON.stringify(staff)}<br/>
                    {JSON.stringify(staffList)}<br/>
                    {JSON.stringify(errorsStaff)}<br/>
                    {JSON.stringify(errorCssStaff)} */}
                  </Col>
                </Row>
              </Form>
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col md={12} className="d-flex justify-content-center">
                  <Button variant="dark" onClick={clearForm} className="mx-2">
                    <FontAwesomeIcon icon={faRedo} /> Clear
                  </Button>
                  {isLoading ? (
                    <Button variant="info" disabled>
                      <FontAwesomeIcon icon={faSpinner} spin /> Adding...
                    </Button>
                  ) : (
                    <Button variant="info" onClick={handleSubmit}>
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
  )}
</>


  );
};


export default AddBranch;