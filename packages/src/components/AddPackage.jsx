import { faCheckCircle, faList, faPlusCircle, faRedo, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import { postPackageDetails } from '../restApis/ApiPackage';
import { processBranchesOptions, processDistrictOptions, processStatesOptions } from '../utils/CommonOptionUtils';
import { validateFormElements } from '../utils/FormValidation';
import Items from './Items';
import ViewPackages from './ViewPackages';

const AddPackage = () => {
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
    s_branch: '',
    r_name: '',
    r_email: '',
    r_phoneNo: '',
    r_houseNo: '',
    r_street: '',
    r_city: '',
    r_district: '',
    r_state:'',
    r_pincode: '',
    r_branch: ''
  }

  let itemObj = {
    item_name: '', height: '', weight: '', width: '', price: ''
  }

  const [data, setData] = useState(dataObj);
  const [msgStatus, setMsgStatus] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(dataObj);
  const [errorCss, setErrorCss] = useState(dataObj);
  
  const [displayView, setDisplayView] = useState(false);
  const [items, setItems] = useState([itemObj]);
  const [itemsOptions, setItemsOptions] = useState([]);
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
    s_branch:  ['required'],
    r_name: ['required'],
    r_phoneNo: ['required','phoneNo'],
    r_email: ['required','email'],
    r_houseNo: ['required'],
    r_street: ['required'],
    r_city: ['required'],
    r_district: ['required'],
    r_state: ['required'],
    r_pincode: ['required','pincode'],
    r_branch:  ['required'],
  });

  const handleSubmit = () => {

    const { formValidationStatus , errorState , errorCssState } = validateFormElements( data , validationsForEle );
    let formValidationItemsStatus = true;

    let _tempErrReqItems = [],  _tempErrItems = [],  _tempErrCssItems = [];
    let _req = null, _reqErr = null, _reqCss = null;

    
    for(let x of items ){
      let _resObj1 = {}, _resObj2 = {}, _resObj3 = {};

      Object.entries(x).map(([key, value])=> {
        let _ele = x[key];
        if( _ele ){
          _req = false;
          _reqErr = '';
          _reqCss = '';
        }else{
          _req = true;
          _reqErr = 'Required';
          _reqCss = 'is-invalid';
        }
        _resObj1[key]=_req;
        _resObj2[key]=_reqErr;
        _resObj3[key]=_reqCss;
      })
      console.log("IN ITEM VAL = ",_resObj1,_resObj2)
      _tempErrReqItems.push(_resObj1);
      _tempErrItems.push(_resObj2);
      _tempErrCssItems.push(_resObj3);
    }

    formValidationItemsStatus = !Object.entries(_tempErrReqItems).includes(true);

      if( formValidationStatus && formValidationItemsStatus ){


        setIsLoading(true);
        //console.log("data",data)
        postPackageDetails(data, items)
        .then(response => {
          // console.log("Signup PAGE GOT THE response="+JSON.stringify(response))
          if (response instanceof Error) {
            setInvalid();
            setMsgStatus({responseCSS:'danger', responseStatus:'Failed to Save Items Data'});
          }  else {
            if(response){
              setMsgStatus({responseCSS:'success', responseStatus:'Package Details saved Successfully with reference No. : '+response+' !'});
              clearForm();
            }else{
              setMsgStatus({responseCSS:'danger', responseStatus: response.status});
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
        setErrors(errorState);
        setErrorCss(errorCssState);
        setErrorsItems(_tempErrItems);
        setErrorCssItems(_tempErrCssItems);
      }
    }


  const handleInputChange = (e) => {
    let id = e.target.name;
    let val = e.target.value;
    
    if( id=="s_phoneNo" || id=="r_phoneNo" ){
      if( val.length > 10 ){
        return false;
      }
    }
    if( id=="s_pincode" || id=="r_pincode" ){
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

  const handleInputChangeItem = (e, index) => {
    let id = e.target.name;
    let val = e.target.value;
    let upObj = [...items];
    upObj[index][id]=val;
    setItems(upObj);

    let upObj2 = [...errorsItems];
    let upObj1 = [...errorCssItems];

    if (val === '') {
      upObj1[index][id]='is-invalid';
      upObj2[index][id]='Required';
    } else {
      upObj1[index][id]='';
      upObj2[index][id]='';
    }
    setErrorCssItems(upObj1);
    setErrorsItems(upObj2);
  }

  const setInvalid = () => {
    setErrors({
      s_name: 'Invalid Name',
      s_phoneNo: 'Invalid Phone Number',
      s_email: 'Invalid Email ID',
      s_houseNo: 'Invalid Username',
      s_street: 'Invalid s_Street',
      s_city: 'Invalid City',
      s_state: 'Invalid State',
      s_pincode: 'Invalid Pincode',
      s_branch: 'Invalid From Branch',
      r_name: 'Invalid Name',
      r_phoneNo: 'Invalid Phone Number',
      r_email: 'Invalid Email ID',
      r_houseNo: 'Invalid Username',
      r_street: 'Invalid Street',
      r_city: 'Invalid City',
      r_state: 'Invalid State',
      r_pincode: 'Invalid Pincode',
      r_branch: 'Invalid Pincode',
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
      s_pincode: 'is-invalid',
      s_branch: 'is-invalid',
      r_name: 'is-invalid',
      r_phoneNo:'is-invalid',
      r_email: 'is-invalid',
      r_houseNo: 'is-invalid',
      r_street: 'is-invalid',
      r_city: 'is-invalid',
      r_state: 'is-invalid',
      r_district: 'is-invalid',
      r_pincode: 'is-invalid',
      r_branch: 'is-invalid',
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

  const handleViewList = () => {
    setDisplayView(true);
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

  const [stList, setStList] = useState([]);
  const [sendDistList, setSendDistList] = useState([]);
  const [recvDistList, setRecvDistList] = useState([]);
  const [brList, setBrList] = useState([]);

  useEffect(() => {
    setStList(processStatesOptions());
    setBrList(processBranchesOptions());
  }, [])

  useEffect(() => {
    setSendDistList(processDistrictOptions(data.s_state));
  }, [data.s_state])

  useEffect(() => {
    setRecvDistList(processDistrictOptions(data.r_state));
  }, [data.r_state])

  return (
    <>
    {displayView 
      ?
      <ViewPackages handleAddForm={handleAddForm} />
      :
      <Container>
      <Row>
        <Col xs={12} md={12}>
          <Card className="border-0 shadow-lg">
            <Card.Header className="bg-info">
              <Row>
                <Col xs={10} md={10}>ADD PACKAGE</Col>
                <Col xs={2} md={2}>
                  <Button variant="warning" onClick={handleViewList} className="float-end">
                    <FontAwesomeIcon icon={faList} /> View
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {msgStatus && msgStatus.responseCSS && (
                <Row>
                  <Col xs={12} md={10} className="offset-md-1 text-center">
                    <Alert variant={msgStatus.responseCSS}>
                      {msgStatus.responseCSS === "success" && <FontAwesomeIcon icon={faCheckCircle} />}
                      {msgStatus.responseCSS === "danger" && <FontAwesomeIcon icon={faTimesCircle} />}
                      &nbsp; {msgStatus.responseStatus}
                    </Alert>
                  </Col>
                </Row>
              )}
              <Form>
                <Row className="mb-2">
                  <Col md={6}>
                    <fieldset className="bg-light">
                      <legend className="alert alert-primary px-2 py-1">Sender Details</legend>
                      <Row className="mb-2">
                        <Col md={4}>
                          <FloatingLabel label="Name">
                            <Form.Control
                              type="text"
                              placeholder="Name"
                              autoComplete="s_name"
                              value={data.s_name}
                              maxLength={30}
                              name="s_name"
                              id="s_name"
                              onChange={handleInputChange}
                              className={`form-control ${errorCss.s_name}`}
                              isInvalid={!!errors.s_name}
                              required
                            />
                            {errors.s_name && <Form.Control.Feedback type="invalid">{errors.s_name}</Form.Control.Feedback>}
                          </FloatingLabel>
                        </Col>
                        <Col md={4}>
                          <FloatingLabel label="Email ID">
                            <Form.Control
                              type="email"
                              placeholder="Email ID"
                              autoComplete="s_email"
                              value={data.s_email}
                              maxLength={30}
                              name="s_email"
                              id="s_email"
                              onChange={handleInputChange}
                              className={`form-control ${errorCss.s_email}`}
                              isInvalid={!!errors.s_email}
                            />
                            {errors.s_email && <Form.Control.Feedback type="invalid">{errors.s_email}</Form.Control.Feedback>}
                          </FloatingLabel>
                        </Col>
                        <Col md={4}>
                          <FloatingLabel label="Phone No.">
                            <Form.Control
                              type="number"
                              placeholder="Phone Number"
                              autoComplete="s_phoneNo"
                              value={data.s_phoneNo}
                              min="6000000000"
                              max="9999999999"
                              name="s_phoneNo"
                              id="s_phoneNo"
                              onChange={handleInputChange}
                              className={`form-control ${errorCss.s_phoneNo}`}
                              isInvalid={!!errors.s_phoneNo}
                              required
                            />
                            {errors.s_phoneNo && <Form.Control.Feedback type="invalid">{errors.s_phoneNo}</Form.Control.Feedback>}
                          </FloatingLabel>
                        </Col>
                      </Row>

                      <fieldset className="mb-2">
                        <legend className="alert alert-primary px-2 py-1">Address</legend>
                        <Row className="mb-2">
                          <Col md={4}>
                            <FloatingLabel label="House #">
                              <Form.Control
                                type="text"
                                placeholder="House #"
                                autoComplete="s_houseNo"
                                value={data.s_houseNo}
                                maxLength={30}
                                name="s_houseNo"
                                id="s_houseNo"
                                onChange={handleInputChange}
                                className={`form-control ${errorCss.s_houseNo}`}
                                isInvalid={!!errors.s_houseNo}
                                required
                              />
                              {errors.s_houseNo && <Form.Control.Feedback type="invalid">{errors.s_houseNo}</Form.Control.Feedback>}
                            </FloatingLabel>
                          </Col>
                          <Col md={4}>
                            <FloatingLabel label="Street">
                              <Form.Control
                                type="text"
                                placeholder="Street"
                                autoComplete="s_street"
                                value={data.s_street}
                                maxLength={30}
                                name="s_street"
                                id="s_street"
                                onChange={handleInputChange}
                                className={`form-control ${errorCss.s_street}`}
                                isInvalid={!!errors.s_street}
                                required
                              />
                              {errors.s_street && <Form.Control.Feedback type="invalid">{errors.s_street}</Form.Control.Feedback>}
                            </FloatingLabel>
                          </Col>
                          <Col md={4}>
                            <FloatingLabel label="City">
                              <Form.Control
                                type="text"
                                placeholder="City"
                                autoComplete="s_city"
                                value={data.s_city}
                                maxLength={30}
                                name="s_city"
                                id="s_city"
                                onChange={handleInputChange}
                                className={`form-control ${errorCss.s_city}`}
                                isInvalid={!!errors.s_city}
                                required
                              />
                              {errors.s_city && <Form.Control.Feedback type="invalid">{errors.s_city}</Form.Control.Feedback>}
                            </FloatingLabel>
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col md={4}>
                            <FloatingLabel label="State">
                              <Form.Select
                                aria-label="Default select example"
                                placeholder="State"
                                autoComplete="s_state"
                                value={data.s_state}
                                maxLength={30}
                                name="s_state"
                                id="s_state"
                                onChange={handleInputChange}
                                className={`form-control ${errorCss.s_state}`}
                                isInvalid={!!errors.s_state}
                                required
                              >
                                {stList.map((state) => (
                                  <option key={state.value} value={state.value}>
                                    {state.label}
                                  </option>
                                ))}
                              </Form.Select>
                              {errors.s_state && <Form.Control.Feedback type="invalid">{errors.s_state}</Form.Control.Feedback>}
                            </FloatingLabel>
                          </Col>
                          <Col md={4}>
                            <FloatingLabel label="District">
                              <Form.Select
                                aria-label="Default select example"
                                placeholder="District"
                                autoComplete="s_district"
                                value={data.s_district}
                                maxLength={30}
                                name="s_district"
                                id="s_district"
                                onChange={handleInputChange}
                                className={`form-control ${errorCss.s_district}`}
                                isInvalid={!!errors.s_district}
                                required
                              >
                                {sendDistList.map((district) => (
                                  <option key={district.value} value={district.value}>
                                    {district.label}
                                  </option>
                                ))}
                              </Form.Select>
                              {errors.s_district && <Form.Control.Feedback type="invalid">{errors.s_district}</Form.Control.Feedback>}
                            </FloatingLabel>
                          </Col>
                          <Col md={4}>
                            <FloatingLabel label="Pincode">
                              <Form.Control
                                type="number"
                                placeholder="Pincode"
                                autoComplete="s_pincode"
                                value={data.s_pincode}
                                min="100001"
                                maxLength={6}
                                name="s_pincode"
                                id="s_pincode"
                                onChange={handleInputChange}
                                className={`form-control ${errorCss.s_pincode}`}
                                isInvalid={!!errors.s_pincode}
                                required
                              />
                              {errors.s_pincode && <Form.Control.Feedback type="invalid">{errors.s_pincode}</Form.Control.Feedback>}
                            </FloatingLabel>
                          </Col>
                        </Row>
                      </fieldset>

                      <Row>
                        <Col md={12}>
                          <FloatingLabel label="Sending From Branch">
                            <Form.Select
                              aria-label="Default select example"
                              placeholder="Branch"
                              autoComplete="s_branch"
                              value={data.s_branch}
                              name="s_branch"
                              id="s_branch"
                              onChange={handleInputChange}
                              className={`form-control ${errorCss.s_branch}`}
                              isInvalid={!!errors.s_branch}
                              required
                            >
                              {brList.map((branch) => (
                                <option key={branch.value} value={branch.value}>
                                  {branch.label}
                                </option>
                              ))}
                            </Form.Select>
                            {errors.s_branch && <Form.Control.Feedback type="invalid">{errors.s_branch}</Form.Control.Feedback>}
                          </FloatingLabel>
                        </Col>
                      </Row>
                    </fieldset>
                  </Col>
                  <Col md={6}>
                    <fieldset className="bg-light">
                      <legend className="alert alert-primary px-2 py-1">Receiver Details</legend>
                      <Row className="mb-2">
                        <Col md={4}>
                          <FloatingLabel label="Name">
                            <Form.Control
                              type="text"
                              placeholder="Name"
                              autoComplete="r_name"
                              value={data.r_name}
                              maxLength={30}
                              name="r_name"
                              id="r_name"
                              onChange={handleInputChange}
                              className={`form-control ${errorCss.r_name}`}
                              isInvalid={!!errors.r_name}
                              required
                            />
                            {errors.r_name && <Form.Control.Feedback type="invalid">{errors.r_name}</Form.Control.Feedback>}
                          </FloatingLabel>
                        </Col>
                        <Col md={4}>
                          <FloatingLabel label="Email ID">
                            <Form.Control
                              type="email"
                              placeholder="Email ID"
                              autoComplete="r_email"
                              value={data.r_email}
                              maxLength={30}
                              name="r_email"
                              id="r_email"
                              onChange={handleInputChange}
                              className={`form-control ${errorCss.r_email}`}
                              isInvalid={!!errors.r_email}
                            />
                            {errors.r_email && <Form.Control.Feedback type="invalid">{errors.r_email}</Form.Control.Feedback>}
                          </FloatingLabel>
                        </Col>
                        <Col md={4}>
                          <FloatingLabel label="Phone No.">
                            <Form.Control
                              type="number"
                              placeholder="Phone Number"
                              autoComplete="r_phoneNo"
                              value={data.r_phoneNo}
                              min="6000000000"
                              max="9999999999"
                              name="r_phoneNo"
                              id="r_phoneNo"
                              onChange={handleInputChange}
                              className={`form-control ${errorCss.r_phoneNo}`}
                              isInvalid={!!errors.r_phoneNo}
                              required
                            />
                            {errors.r_phoneNo && <Form.Control.Feedback type="invalid">{errors.r_phoneNo}</Form.Control.Feedback>}
                          </FloatingLabel>
                        </Col>
                      </Row>

                      <fieldset className="mb-2">
                        <legend className="alert alert-primary px-2 py-1">Address</legend>
                        <Row className="mb-2">
                          <Col md={4}>
                            <FloatingLabel label="House #">
                              <Form.Control
                                type="text"
                                placeholder="House #"
                                autoComplete="r_houseNo"
                                value={data.r_houseNo}
                                maxLength={30}
                                name="r_houseNo"
                                id="r_houseNo"
                                onChange={handleInputChange}
                                className={`form-control ${errorCss.r_houseNo}`}
                                isInvalid={!!errors.r_houseNo}
                                required
                              />
                              {errors.r_houseNo && <Form.Control.Feedback type="invalid">{errors.r_houseNo}</Form.Control.Feedback>}
                            </FloatingLabel>
                          </Col>
                          <Col md={4}>
                            <FloatingLabel label="Street">
                              <Form.Control
                                type="text"
                                placeholder="Street"
                                autoComplete="r_street"
                                value={data.r_street}
                                maxLength={30}
                                name="r_street"
                                id="r_street"
                                onChange={handleInputChange}
                                className={`form-control ${errorCss.r_street}`}
                                isInvalid={!!errors.r_street}
                                required
                              />
                              {errors.r_street && <Form.Control.Feedback type="invalid">{errors.r_street}</Form.Control.Feedback>}
                            </FloatingLabel>
                          </Col>
                          <Col md={4}>
                            <FloatingLabel label="City">
                              <Form.Control
                                type="text"
                                placeholder="City"
                                autoComplete="r_city"
                                value={data.r_city}
                                maxLength={30}
                                name="r_city"
                                id="r_city"
                                onChange={handleInputChange}
                                className={`form-control ${errorCss.r_city}`}
                                isInvalid={!!errors.r_city}
                                required
                              />
                              {errors.r_city && <Form.Control.Feedback type="invalid">{errors.r_city}</Form.Control.Feedback>}
                            </FloatingLabel>
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col md={4}>
                            <FloatingLabel label="State">
                              <Form.Select
                                aria-label="Default select example"
                                placeholder="State"
                                autoComplete="r_state"
                                value={data.r_state}
                                maxLength={30}
                                name="r_state"
                                id="r_state"
                                onChange={handleInputChange}
                                className={`form-control ${errorCss.r_state}`}
                                isInvalid={!!errors.r_state}
                                required
                              >
                                {stList.map((state) => (
                                  <option key={state.value} value={state.value}>
                                    {state.label}
                                  </option>
                                ))}
                              </Form.Select>
                              {errors.r_state && <Form.Control.Feedback type="invalid">{errors.r_state}</Form.Control.Feedback>}
                            </FloatingLabel>
                          </Col>
                          <Col md={4}>
                            <FloatingLabel label="District">
                              <Form.Select
                                aria-label="Default select example"
                                placeholder="District"
                                autoComplete="r_district"
                                value={data.r_district}
                                maxLength={30}
                                name="r_district"
                                id="r_district"
                                onChange={handleInputChange}
                                className={`form-control ${errorCss.r_district}`}
                                isInvalid={!!errors.r_district}
                                required
                              >
                                {recvDistList.map((district) => (
                                  <option key={district.value} value={district.value}>
                                    {district.label}
                                  </option>
                                ))}
                              </Form.Select>
                              {errors.r_district && <Form.Control.Feedback type="invalid">{errors.r_district}</Form.Control.Feedback>}
                            </FloatingLabel>
                          </Col>
                          <Col md={4}>
                            <FloatingLabel label="Pincode">
                              <Form.Control
                                type="number"
                                placeholder="Pincode"
                                autoComplete="r_pincode"
                                value={data.r_pincode}
                                min="100001"
                                maxLength={6}
                                name="r_pincode"
                                id="r_pincode"
                                onChange={handleInputChange}
                                className={`form-control ${errorCss.r_pincode}`}
                                isInvalid={!!errors.r_pincode}
                                required
                              />
                              {errors.r_pincode && <Form.Control.Feedback type="invalid">{errors.r_pincode}</Form.Control.Feedback>}
                            </FloatingLabel>
                          </Col>
                        </Row>
                      </fieldset>

                      <Row>
                        <Col md={12}>
                          <FloatingLabel label="Receiving Branch">
                            <Form.Select
                              aria-label="Default select example"
                              placeholder="Branch"
                              autoComplete="r_branch"
                              value={data.r_branch}
                              name="r_branch"
                              id="r_branch"
                              onChange={handleInputChange}
                              className={`form-control ${errorCss.r_branch}`}
                              isInvalid={!!errors.r_branch}
                              required
                            >
                              {brList.map((branch) => (
                                <option key={branch.value} value={branch.value}>
                                  {branch.label}
                                </option>
                              ))}
                            </Form.Select>
                            {errors.r_branch && <Form.Control.Feedback type="invalid">{errors.r_branch}</Form.Control.Feedback>}
                          </FloatingLabel>
                        </Col>
                      </Row>
                    </fieldset>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col>
                  <Items handleInputChangeItem={handleInputChangeItem} items={items}
                        errors={errorsItems} errorCss={errorCssItems}
                        addItem={addItem} deleteItem={deleteItem} />
                  </Col>
                </Row>
              </Form>
              </Card.Body>
              <Card.Footer>
                <Row>
                    <Col md={12} className='d-flex justify-content-center'>
                      <Button variant='dark' onClick={clearForm} className='text-white mx-2'>
                        <FontAwesomeIcon icon={faRedo} /> Clear
                      </Button>
                      { isLoading ?
                        <Button variant="info" onClick={event => event.preventDefault()}> 
                          <FontAwesomeIcon icon={faSpinner} spin  /> Adding...
                        </Button>
                      :
                        <Button variant='info' onClick={handleSubmit}>
                          <FontAwesomeIcon icon={faPlusCircle} /> Add Package
                        </Button>
                      }
                    </Col>
                  </Row>
              </Card.Footer>
              </Card>
              </Col>
              </Row>
            </Container>
    }
    </>
  )
}

export default AddPackage