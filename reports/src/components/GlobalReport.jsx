import { faCheckCircle, faList, faTimesCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FloatingLabel,
  Form,
  FormControl,
  FormSelect,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row,
  Spinner
} from 'react-bootstrap';
import DataTableComponent from '../components/datatable/DataTableComponent';
import ViewPackageDetails from './ViewPackageDetails';
import { processBranchesOptions, processStatusOptions } from '../components/utils/CommonOptionUtils';
import { compareDates, getStatusBgColor } from '../components/utils/ValidationUtils';
import { getPackagesList } from './restApis/ApiPackage';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Moment from 'react-moment';

const GlobalReport = () => {

    let repObj = {
        fromDate : '',
        toDate : '',
        fromBranch : '',
        toBranch : '',
        statusId : '',
        referenceNo : ''
    };
    
  const [data, setData] = useState(repObj);
  const [msgStatus, setMsgStatus] = useState([]);
  const [errors, setErrors] = useState(repObj);
  const [errorCss, setErrorCss] = useState(repObj);

  const [visible, setVisible] = useState(false);
  const [viewReferenceNo, setViewReferenceNo] = useState('');
  
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [currentStatusId, setCurrentStatusId] = useState(0);

  const handleInputChange = (e) => {
    let id = e.target.name;
    let val = e.target.value;

    if( val.length > 10 ){
      return false;
    }
    
    setData({ ...data, [id]: val });
    
    if (val === '') {
      setErrorCss({...errorCss,[id]:'is-invalid'})
      setErrors({...errors,[id]:'Required'})
    } else {
      setErrMsg('');
      setErrors({...errors,[id]:''})
      setErrorCss({...errorCss,[id]:''})
    }
  }

  const handleReport = () => {
    let dataCount = 0;
    Object.entries(data).map(([key, value], index)=>{
      if(value!='' && value!='0'){
        dataCount++
      }
    });

    if( dataCount==0 ){
      setErrMsg('Please provide any one of the input');
      setShowReport(false);
    }else{
      setErrMsg('');
      setShowReport(true);
      setLoading(true);

      //ajax call for loading report
      getPackagesList()
      .then(response => {
        // console.log(response)
        if( response instanceof Error ) {

        }else{
          setLoading(false);
          // console.log(data)
          if( Number(data.fromBranch)>0 ){
            response = response.filter(obj => {
              return obj.sendingBranchId == data.fromBranch
            })
          }
          if( Number(data.toBranch)>0 ){
            response = response.filter(obj => {
              return obj.receivingBranchId == data.toBranch
            })
          }
          if( Number(data.referenceNo)>0 ){
            response = response.filter(obj => {
              return obj.referenceNo == data.referenceNo
            })
          }
          if( data.fromDate!='' ){
            response = response.filter(obj => {
              let dt1 = new Date(obj.receivedOn);
              dt1.setHours(0);
              dt1.setMinutes(0);
              dt1.setSeconds(0);
              dt1.setMilliseconds(0);
              let dt2 = new Date(data.fromDate);
              dt2.setHours(0);
              dt2.setMinutes(0);
              dt2.setSeconds(0);
              dt2.setMilliseconds(0);
              // console.log(obj.receivedOn , data.fromDate)
              return compareDates(dt2, dt1);
            })
          }
          if( data.toDate!='' ){
            response = response.filter(obj => {
              let dt1 = new Date(obj.receivedOn);
              dt1.setHours(0);
              dt1.setMinutes(0);
              dt1.setSeconds(0);
              dt1.setMilliseconds(0);
              let dt2 = new Date(data.toDate);
              dt2.setHours(0);
              dt2.setMinutes(0);
              dt2.setSeconds(0);
              dt2.setMilliseconds(0);
              // console.log(obj.receivedOn , data.fromDate)
              return compareDates(dt1, dt2);
            })
          }
          if( Number(data.statusId)>0 ){
            response = response.filter(obj => {
              return obj.currentStatusId == data.statusId
            })
          }
          setReportData(response);
        }
      })
      .catch(err => {
        setLoading(false);
      })
      /*
      setTimeout(() => {
        //setShowReport(true);
        setLoading(false);
        
        getReportTx();
      
        }, 100);
        */
      }
  }



  const openRefNo = (refNo, currStId) => {
    setViewReferenceNo(refNo);
    setCurrentStatusId(currStId);
    setVisible(true);
  }

  // Build columns w.r.t the result data 
  const reportColumns = [
    { name: 'ID', selector: row => row.packageId, sortable: true, type: "Number", key: "packageId", isColumnHidden: false },
    { name: 'Reference No.', selector: row => row.referenceNo, sortable: true, type: "String", key: "referenceNo", isColumnHidden: false,
      cell: row => <><Link href='#' onClick={e => openRefNo(row.referenceNo,row.currentStatusId)}>{row.referenceNo}</Link></>
    },
    { name: 'Branch From -> To', selector: row => row.sendingBranchName, sortable: true, type: "String", key: "sendingBranchName", isColumnHidden: false ,
    cell: row => <div>
                  <span> {row.sendingBranchName} <FontAwesomeIcon icon={faArrowRight} /> {row.receivingBranchName} </span>  
                 </div>
    },

    { name: 'Sender Details', selector: row => row.senderName, sortable: true, type: "Number", key: "senderName", isColumnHidden: false,
      cell: row => <div>
                    <span> {row.senderName}</span> <br/>
                    {/* <span> <FontAwesomeIcon icon={faEnvelope} /> {row.senderEmailId}</span> <br/>
                    <span> <FontAwesomeIcon icon={faPhone} /> {row.senderPhoneNo}</span> <br/>
                    <span> <FontAwesomeIcon icon={faAddressCard} /> {row.senderDistrictName} ,  {row.senderStateName},  {row.senderPincode}</span> <br/> */}
                  </div>
    },
    { name: 'Reciver Details', selector: row => row.receiverName, sortable: true, type: "String", key: "receiverName", isColumnHidden: false,
      cell: row => <div>
                    <span> {row.receiverName}</span> <br/>
                    {/* <span> <FontAwesomeIcon icon={faEnvelope} /> {row.receiverEmailId}</span> <br/>
                    <span> <FontAwesomeIcon icon={faPhone} /> {row.receiverPhoneNo}</span> <br/>
                    <span> <FontAwesomeIcon icon={faAddressCard} /> {row.receiverDistrictName} ,  {row.receiverStateName},  {row.receiverPincode}</span> */}
                  </div> 
    },
    { name: 'Status', selector: row => row.currentStatusName, sortable: true, type: "String", key: "currentStatusName", isColumnHidden: false ,
      cell: row =>  <span className={`badge ${getStatusBgColor(row.currentStatusId)}`}> {row.currentStatusName}</span>
    },
    { name: 'Received Time', selector: row => row.receivedOn, sortable: true,  type: "String", key: "receivedOn", isColumnHidden: false,
      cell: row =>  <ul className="p-0 m-0" >
                    <li><Moment format="MM/DD/YYYY hh:mm A">{row.receivedOn}</Moment></li>
                    </ul>
    },
    // { name: 'Delivered By Staff', selector: row => row.dispatchByStaffName, sortable: true, type: "String", key: "dispatchByStaffName", isColumnHidden: true },
];
 
  useEffect(() => {
    if( data.fromDate==="" ){
      setData({...data, ...{toDate:''}})
    }
  }, [data.fromDate])
  

  let today = new Date().toISOString().split('T')[0];

  const [brList, setBrList] = useState([]);
  const [stList, setStList] = useState([])

  useEffect(() => {
    setBrList(processBranchesOptions());
    setStList(processStatusOptions());
  }, [])
  
  
  return (
    
    
    <Container>
      <Row>
        <Col xs={12} md={12}>
          <Card className='border-0 shadow-lg'>
            <CardHeader className='bg-info'>GLOBAL REPORT</CardHeader>
            <CardBody>
              {msgStatus.responseCSS && (
                <Row>
                  <Col xs={12} md={10} className="offset-md-1 text-center">
                    <Alert variant={msgStatus.responseCSS}>
                      {msgStatus.responseCSS === "success" && <FontAwesomeIcon icon={faCheckCircle} />}
                      {msgStatus.responseCSS === "danger" && <FontAwesomeIcon icon={faTimesCircle} />}
                      {msgStatus.responseStatus}
                    </Alert>
                  </Col>
                </Row>
              )}
              <Form>
                <Row className='mb-3'>
                  <Col md={6}>
                    <FloatingLabel controlId="fromDate" label="From Date">
                      <FormControl
                        type='date'
                        value={data.fromDate}
                        name='fromDate'
                        onChange={handleInputChange}
                        max={data.toDate || today}
                      />
                      {errors.fromDate && <Form.Text className="text-danger">{errors.fromDate}</Form.Text>}
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="toDate" label="To Date">
                      <FormControl
                        type='date'
                        value={data.toDate}
                        name='toDate'
                        onChange={handleInputChange}
                        max={today}
                        min={data.fromDate || ''}
                      />
                      {errors.toDate && <Form.Text className="text-danger">{errors.toDate}</Form.Text>}
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col md={6}>
                    <FloatingLabel controlId="fromBranch" label="Sending From Branch">
                      <FormSelect
                        value={data.fromBranch}
                        name='fromBranch'
                        onChange={handleInputChange}
                        // options={brList}
                      >
                        {brList.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                      </FormSelect>
                      {errors.fromBranch && <Form.Text className="text-danger">{errors.fromBranch}</Form.Text>}
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="toBranch" label="Sending To Branch">
                      <FormSelect
                        value={data.toBranch}
                        name='toBranch'
                        onChange={handleInputChange}
                       // options={brList}
                      >
                      {brList.map((option, index) => (
                          <option key={index} value={option.value}>
                              {option.label}
                          </option>
                      ))}
                      </FormSelect>
                      {errors.toBranch && <Form.Text className="text-danger">{errors.toBranch}</Form.Text>}
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col md={6}>
                    <FloatingLabel controlId="referenceNo" label="Package Reference No.">
                      <FormControl
                        type='number'
                        value={data.referenceNo}
                        name='referenceNo'
                        maxLength={11}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.referenceNo && <Form.Text className="text-danger">{errors.referenceNo}</Form.Text>}
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="statusId" label="Status">
                      <FormSelect
                        value={data.statusId}
                        name='statusId'
                        onChange={handleInputChange}
                        // options={stList}
                      >
                        <option value={0}>
                            -ALL-
                        </option>
                      {stList.map((option, index) => (
                        
                          <option key={index} value={option.value}>
                              {option.label}
                          </option>
                      ))}
                      </FormSelect>
                      {errors.statusId && <Form.Text className="text-danger">{errors.statusId}</Form.Text>}
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col md={10} className='text-danger d-flex align-items-center justify-content-center'>
                    {errMsg && <Alert variant="danger">{errMsg}</Alert>}
                  </Col>
                  <Col md={2}>
                    <Button variant="warning" onClick={handleReport}>
                      <FontAwesomeIcon icon={faList} /> View Report
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {showReport && (
        <Row className='mt-4'>
          <Col xs={12} md={12}>
            <Card className='border-0 shadow-lg'>
              <CardHeader className='bg-info'>REPORT</CardHeader>
              {loading ? (
                <CardBody className='d-flex align-items-center justify-content-center'>
                  <Spinner animation="border" variant="info" />
                  &nbsp; Fetching Data...
                </CardBody>
              ) : (
                <CardBody>
                  <DataTableComponent columns={reportColumns} data={reportData} fileName={"Report"} />
                </CardBody>
              )}
            </Card>
          </Col>
        </Row>
      )}
      {/* Viewing particular package ref no. details in modal box */}
      <Modal show={visible} onHide={() => setVisible(false)} size="xl" scrollable>
        <ModalHeader closeButton className='bg-info'>
          <ModalTitle>PACKAGE DETAILS - Reference No.: {viewReferenceNo}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <ViewPackageDetails
            referenceNo={viewReferenceNo}
            allowUpdate={false}
            publicView={false}
            headerVisibility={false}
            currentStatusId={currentStatusId}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
    
  )
}

export default GlobalReport