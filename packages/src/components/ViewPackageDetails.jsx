import { Alert, Button, Card, Col, Container, Form, Row, Spinner, FloatingLabel, FormSelect, FormControl } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import Items from './Items';
import PackageStatus from './PackageStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPencilAlt, faRedo, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { getPackageDetails, postPackageUpdate } from '../restApis/ApiPackage';
import { getLocalStorageOrDefault } from '../utils/ValidationUtils';
import { loadStatus } from '../restApis/ApiOptions';

const ViewPackageDetails = (props) => {
    let allowUpdate = props.allowUpdate || false;
    const [d, setD] = useState({});
    const [loading, setLoading] = useState(false);
    let isPublicView = props.publicView || false;

    const userProfile = useSelector((state) => state.user)
    // let user_branch_id = userProfile.branch_id;

    let _headerVis = props.headerVisibility;
    let headerClass = _headerVis ? "" : "d-none";
    const [headerVisibilityCss, setHeaderVisibilityCss] = useState(headerClass)

    // let handleInputChange = props.handleInputChange;
    // let data = props.data;
    //let errors = props.error;
    //let errorCss = props.errorCss;

    let dataObj = {
        // s_staff_member : '',
        r_staff_member : '',
        status_id : '',
        remarks : ''
    }
    const [data, setData] = useState(dataObj);
    const [errors, setErrors] = useState(dataObj);
    const [errorCss, setErrorCss] = useState(dataObj);
    const [showData, setShowData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    let referenceNo = Number(props.referenceNo);
    const [currentStatusId, setCurrentStatusId] = useState(props.currentStatusId);

    const [msgStatus, setMsgStatus] = useState([]);


    useEffect(() => {
        setLoading(true);
        setShowData(false);
        loadReferenceData(referenceNo);
    }, [referenceNo])

    const loadReferenceData = (referenceNo) => {

        //ajax call to load data
        getPackageDetails(referenceNo)
        .then(response => {
            if( response instanceof Error ) {
                
            }else{
                setLoading(false);
                // console.log("response",response)
                setMsgStatus({responseCSS:'', responseStatus:''});

                if( response.referenceNo ){
                    setShowData(true);
                    let pd = {
                    referenceNo : response.referenceNo,
                    s_name : response.senderName,
                    s_emailId : response.senderEmailId,
                    s_phoneNo : response.senderPhoneNo,
                    s_state : response.senderStateName,
                    s_district : response.senderDistrictName,
                    s_pincode : response.senderPincode,
                    s_houseNo : response.senderHouseNo,
                    s_street : response.senderStreetNo,
                    s_city : response.senderCity,
                    s_branch : response.sendingBranchName,
                    s_branch_id : response.sendingBranchId,
                    remarks: response.remarks,
                    s_staff_member : 'Ramu',
                    r_name : response.receiverName,
                    r_emailId : response.receiverEmailId,
                    r_phoneNo : response.receiverPhoneNo,
                    r_state : response.receiverStateName,
                    r_district : response.receiverDistrictName,
                    r_pincode : response.receiverPincode,
                    r_houseNo : response.receiverHouseNo,
                    r_street : response.receiverStateName,
                    r_city : response.receiverCity,
                    r_branch : response.receivingBranchName,
                    r_branch_id : response.receivingBranchId,
                    r_staff_member : response.dispatchByStaffName,
                    currentStatusId : response.currentStatusId,
                    currentStatusName : response.currentStatusName,
                    items : response.packageItems,
                    status: response.packageStatuses
                    /*
                    [
                        {id: '1', status: 'Parcel aaccepted', icon: 'faTruckLoading', updatedOn: 'Oct 12, 2023 10.30 AM', remarks: 'Parcel taken'},
                        {id: '2', status: 'In-transit', icon: 'faTruckMoving', updatedOn: 'Oct 12, 2023 5.30 PM', remarks: ''},
                        {id: '3', status: 'Received at Destination', icon: 'faHandPaper', updatedOn: 'Oct 13, 2023 10.00 AM', remarks: '', isLatest : true},
                        {id: '4', status: 'Delivered', icon: 'faCheck', updatedOn: null, remarks: '-'},
                    ]
                    */
                    }
                    // console.log(pd)
                    setD(pd);
                    setCurrentStatusId(response.currentStatusId);
                }else{
                    setLoading(false);
                    setMsgStatus({responseCSS:'danger', responseStatus:response.message});
                }
            }
        }).catch(error =>{
            // setInvalid();
            setLoading(false);
            setMsgStatus({responseCSS:'danger', responseStatus:'Invalid Reference No.'});
        })
        .finally(r => {
            setLoading(false);
            // setTimeout(()=>{
            //     setMsgStatus({responseCSS:'', responseStatus:''});
            // },3000)
        })
    }


    const updateData = () => {
        let ar1 = {}, ar2 = {};
        let validationFlag = "true";
        if( data.status_id=="" || data.status_id=="0" ){
            ar1['status_id']='is-invalid';
            ar2['status_id']='Required';
            validationFlag = "false";
        }else{
            ar1['status_id']='';
            ar2['status_id']='';
            if( data.status_id=="4" ){
                if( data.r_staff_member=="" || data.r_staff_member=="0" ){
                    ar1['r_staff_member']='is-invalid';
                    ar2['r_staff_member']='Required';
                    validationFlag = "false";
                }else{
                    ar1['r_staff_member']='';
                    ar2['r_staff_member']='';
                }
            }else{
                ar1['r_staff_member']='';
                ar2['r_staff_member']='';
            }
        }
        
        setErrorCss(ar1);
        setErrors(ar2);

        if( validationFlag==="true" ){
            setIsLoading(true);
            postPackageUpdate(data,referenceNo)
            .then(response => {
                if (response instanceof Error) {
                    // setInvalid();
                    setIsLoading(false);
                    setMsgStatus({responseCSS:'danger', responseStatus:'Failed to Update status Data for Reference No. : '+referenceNo});
                  }  else {
                    if(response == referenceNo  && response !== null){
                      setMsgStatus({responseCSS:'success', responseStatus:'Status updated Successfully for Reference No. : '+referenceNo+' !'});
                      clearForm();
                    }else{
                      setMsgStatus({responseCSS:'danger', responseStatus: response.status});
                    }
                  }
            }).catch(error =>{
                console.log(error)
                setMsgStatus({responseCSS:'danger', responseStatus:'Failed to Update status for Reference No. : '+referenceNo});
            })
            .finally(r => {
                setTimeout(()=>{
                setIsLoading(false);
                setMsgStatus({responseCSS:'', responseStatus:''});
                // setShowData(false);
                props.reloadData();
                },500)
            })
        }

    }

    const clearForm = () => {
        setData(dataObj);
        setErrors(dataObj);
        setErrorCss(dataObj);
        setIsLoading(false);
    }

    const clearData = () => {
        setData(dataObj);
        setErrors(dataObj);
        setErrorCss(dataObj);
        setIsLoading(false);
    }

    const handleInputChange = (e) => {
        let id = e.target.name;
        let val = e.target.value;
    
        setData({ ...data, [id]: val });
        
        if (val === '') {
          setErrorCss({...errorCss,[id]:'is-invalid'})
          setErrors({...errors,[id]:'Required'})
        } else {
          setErrors({...errors,[id]:''})
          setErrorCss({...errorCss,[id]:''})
        }
    }

    const [stList, setStList] = useState([]);
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {

        setTimeout(() => {

            let statusList = getLocalStorageOrDefault("statusList");
            if( !statusList ){
                loadStatus();
            }
            // loading the status id || curresnt status Id less than delivered
            if( currentStatusId<4 ) {
                 
                let _list = [];
                _list.push({ label: '-Choose-', value: '0' });
                if( statusList  ){
                    statusList = statusList.filter(obj => {
                        return obj.statusId > currentStatusId
                    })
                    .map((key,index)=>{
                        _list.push({ label: key.statusName, value: key.statusId });
                    });
                    setStList(_list);
                }
            }

            // console.log(d,d.r_branch_id);
            // loading the delivery staff ids of a branch only when currstatus=Recvd at dest and selection will be delivered 
            if( allowUpdate && currentStatusId==3 ) {
                let staffList = getLocalStorageOrDefault("staffList");
                let _list = [];
                _list.push({ label: '-Choose-', value: '0' });
                if( staffList ){
                    staffList = staffList.filter(obj => {
                        return obj.branchId == d.r_branch_id && obj.designationId == "3" // delivery boy
                    })
                    .map((key,index)=>{
                        _list.push({ label: key.staffName, value: key.staffId });
                    });
                    setStaffList(_list);
                }
            }
        }, 1000);
        // console.log(_list)
    }, [d])
    
  return (
        <>
          <Row>
            <Col xs={12} md={12}>
              <Card className='border-0 shadow-lg'>
                <Card.Header className={`bg-info text-white`}>
                  PACKAGE DETAILS - Reference No. : {referenceNo}
                </Card.Header>
    
                {loading && (
                  <Card.Body className='d-flex align-items-center justify-content-center'>
                    <Spinner animation="border" variant="info" size="lg" />
                    &nbsp; Fetching Details ....
                  </Card.Body>
                )}
    
                {msgStatus.responseCSS && (
                  <Card.Body className='d-flex align-items-center justify-content-center'>
                    <Row>
                      <Col md={12} xs={12}>
                        <Alert variant={msgStatus.responseCSS} className='mb-0'>
                          {msgStatus.responseCSS === "success" && <FontAwesomeIcon icon={faCheckCircle} />}
                          {msgStatus.responseCSS === "danger" && <FontAwesomeIcon icon={faTimesCircle} />}
                          &nbsp; {msgStatus.responseStatus}
                        </Alert>
                      </Col>
                    </Row>
                  </Card.Body>
                )}
    
                {showData && (
                  <Card.Body>
                  <Row className="mt-0 pt-0">
                      <Col md={6} xs={12}>
                          <PackageStatus statusData={d.status} displayStatus={true} currentStatusId={currentStatusId} />
                      </Col>
                      <Col md={6} xs={12}>
                          <fieldset className="bg-light">
                              <legend className="alert alert-primary px-2 py-1">Branch Details</legend>
                              <Row>
                                  <Col>
                                      <Form.Label>From Branch</Form.Label>
                                      <br/>
                                      <Form.Text>{d.s_branch}</Form.Text>
                                  </Col>
                                  <Col>
                                      <Form.Label>To Branch</Form.Label>
                                      <br/>
                                      <Form.Text>{d.r_branch}</Form.Text>
                                  </Col>
                              </Row>

                              {allowUpdate && currentStatusId < 4 && (
                                  <>
                                      <hr />
                                      <Row>
                                          <Col>
                                              <FloatingLabel controlId="status_id" label="Update Status">
                                                  <FormSelect
                                                      value={data.status_id}
                                                      name="status_id"
                                                      onChange={handleInputChange}
                                                      className={errorCss.status_id}
                                                      isInvalid={!!errors.status_id}
                                                      required
                                                      aria-label="Default select example"
                                                  >
                                                    {stList.map((option, index) => (
                                                        <option key={index} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                  </FormSelect>
                                                  {errors.status_id && (
                                                      <Form.Control.Feedback type="invalid">
                                                          {errors.status_id}
                                                      </Form.Control.Feedback>
                                                  )}
                                              </FloatingLabel>
                                          </Col>
                                          <Col>
                                              {allowUpdate && d.currentStatusId === '3' && data.status_id === "4" ? (
                                                  <FloatingLabel controlId="r_staff_member" label="Delivered by Staff Member">
                                                      <FormSelect
                                                          value={data.r_staff_member}
                                                          name="r_staff_member"
                                                          onChange={handleInputChange}
                                                          className={errorCss.r_staff_member}
                                                          isInvalid={!!errors.r_staff_member}
                                                          required
                                                          aria-label="Default select example"
                                                      >
                                                        {staffList.map((option, index) => (
                                                            <option key={index} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                          {/* {staffList} */}
                                                      </FormSelect>
                                                      {errors.r_staff_member && (
                                                          <Form.Control.Feedback type="invalid">
                                                              {errors.r_staff_member}
                                                          </Form.Control.Feedback>
                                                      )}
                                                  </FloatingLabel>
                                              ) : (
                                                  <>
                                                      <Form.Label>Delivered by Staff Member</Form.Label>
                                                      <Form.Text>{d.r_staff_member || '-'}</Form.Text>
                                                  </>
                                              )}
                                          </Col>
                                      </Row>
                                      <Row className="mt-2">
                                          <Col>
                                              <FloatingLabel controlId="remarks" label="Remarks">
                                                  <FormControl
                                                      as="textarea"
                                                      value={data.remarks}
                                                      name="remarks"
                                                      onChange={handleInputChange}
                                                  />
                                              </FloatingLabel>
                                          </Col>
                                      </Row>
                                      <Row>
                                          <Col md={12} className="d-flex justify-content-end pt-2">
                                              <Button variant="dark" onClick={clearData} className="mx-2">
                                                  <FontAwesomeIcon icon={faRedo} /> Clear
                                              </Button>
                                              {isLoading ? (
                                                  <Button variant="warning" disabled>
                                                      <FontAwesomeIcon icon={faSpinner} spin /> Updating...
                                                  </Button>
                                              ) : (
                                                  <Button variant="warning" onClick={updateData}>
                                                      <FontAwesomeIcon icon={faPencilAlt} /> Update
                                                  </Button>
                                              )}
                                          </Col>
                                      </Row>
                                  </>
                              )}
                          </fieldset>
                      </Col>
                  </Row>

                  {!isPublicView && (
                      <>
                          <Row className="mt-2">
                              <Col md={6}>
                                  <fieldset className="bg-light">
                                      <legend className="alert alert-primary px-2 py-1">Sender Details</legend>
                                      <Row>
                                          <Col>
                                              <Form.Label>Name</Form.Label>
                                              <br/>
                                              <Form.Text>{d.s_name}</Form.Text>
                                          </Col>
                                          <Col>
                                              <Form.Label>Email ID</Form.Label><br/>
                                              <Form.Text>{d.s_emailId}</Form.Text>
                                          </Col>
                                          <Col>
                                              <Form.Label>Phone No.</Form.Label><br/>
                                              <Form.Text>{d.s_phoneNo}</Form.Text>
                                          </Col>
                                      </Row>
                                      <Row>
                                          <Col>
                                              <Form.Label>Address</Form.Label>
                                              <br/>
                                              <Form.Text>
                                                  {d.s_houseNo} <br />
                                                  {d.s_street} <br />
                                                  {d.s_city} <br />
                                                  {d.s_district} <br />
                                                  {d.s_state} <br />
                                                  {d.s_pincode}
                                              </Form.Text>
                                          </Col>
                                      </Row>
                                  </fieldset>
                              </Col>
                              <Col md={6}>
                                  <fieldset className="bg-light">
                                      <legend className="alert alert-primary px-2 py-1">Receiver Details</legend>
                                      <Row>
                                          <Col>
                                              <Form.Label>Name</Form.Label>
                                              <br/>
                                              <Form.Text>{d.r_name}</Form.Text>
                                          </Col>
                                          <Col>
                                              <Form.Label>Email ID</Form.Label>
                                              <Form.Text>{d.r_emailId}</Form.Text>
                                          </Col>
                                          <Col>
                                              <Form.Label>Phone No.</Form.Label>
                                              <Form.Text>{d.r_phoneNo}</Form.Text>
                                          </Col>
                                      </Row>
                                      <Row>
                                          <Col>
                                              <Form.Label>Address</Form.Label>
                                              <br/>
                                              <Form.Text>
                                                  {d.r_houseNo} <br />
                                                  {d.r_street} <br />
                                                  {d.r_city} <br />
                                                  {d.r_district} <br />
                                                  {d.r_state} <br />
                                                  {d.r_pincode}
                                              </Form.Text>
                                          </Col>
                                      </Row>
                                  </fieldset>
                              </Col>
                          </Row>
                          <Row className="mt-2">
                              <Col md={12}>
                                  <Items items={d.items} displayItems={true} />
                              </Col>
                          </Row>
                      </>
                  )}
                </Card.Body>
                )}
              </Card>
            </Col>
          </Row>
        </>
      );
    }
    
export default ViewPackageDetails;