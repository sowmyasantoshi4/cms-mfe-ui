import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faArrowRight, faEnvelope, faPhone, faPlusSquare } from '@fortawesome/free-solid-svg-icons'; // Adjust this import based on your FontAwesome library
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import DataTableComponent from '../datatable/DataTableComponent';
import { getPackagesList } from '../restApis/ApiPackage';
import { getStatusBgColor } from '../utils/ValidationUtils';
import ViewPackageDetails from './ViewPackageDetails';

const ViewPackages = (props) => {
  const [visible, setVisible] = useState(false);
  const [viewReferenceNo, setViewReferenceNo] = useState('');
  const [currentStatusId, setCurrentStatusId] = useState(0);

  
  const openRefNo = (refNo, currStId) => {
    setViewReferenceNo(refNo);
    setCurrentStatusId(currStId);
    setVisible(true);
  }

  // Build columns w.r.t the result data 
  const reportColumns = [
    { name: 'ID', selector: row => row.packageId, sortable: true, type: "Number", key: "packageId", isColumnHidden: false },
    { name: 'Reference No.', selector: row => row.referenceNo, sortable: true, type: "String", key: "identifier", isColumnHidden: false,
      cell: row => <><Link href='#' onClick={e => openRefNo(row.referenceNo,row.currentStatusId)}>{row.referenceNo}</Link></>
    },
    { name: 'Branch From -> To', selector: row => row.dispatchByStaffName, sortable: true, type: "String", key: "dispatchByStaffName", isColumnHidden: false ,
    cell: row => <div>
                  <span> {row.sendingBranchName} <FontAwesomeIcon icon={faArrowRight} /> {row.receivingBranchName} </span>  
                 </div>
    },

    { name: 'Sender Details', selector: row => row.senderName, sortable: true, type: "Number", key: "s_name", isColumnHidden: false,
      cell: row => <div>
                    <span> {row.senderName}</span> <br/>
                    {/* <span> <FontAwesomeIcon icon={faEnvelope} /> {row.senderEmailId}</span> <br/>
                    <span> <FontAwesomeIcon icon={faPhone} /> {row.senderPhoneNo}</span> <br/>
                    <span> <FontAwesomeIcon icon={faAddressCard} /> {row.senderDistrictName} ,  {row.senderStateName},  {row.senderPincode}</span> <br/> */}
                  </div>
    },
    { name: 'Reciver Details', selector: row => row.receiverName, sortable: true, type: "String", key: "r_name", isColumnHidden: false,
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
      cell: row =>  <ul className="p-0 m-0" style={{"list-style-type": "none"}}>
                    <li><Moment format="MM/DD/YYYY hh:mm A">{row.receivedOn}</Moment></li>
                    </ul>
    },
    // { name: 'Delivered By Staff', selector: row => row.dispatchByStaffName, sortable: true, type: "String", key: "dispatchByStaffName", isColumnHidden: true },
];

  const [reportData, setReportData] = useState([]);
  useEffect(() => {
    getPackagesList()
    .then(response => {
      if( response instanceof Error ) {

      }else{
        setReportData(response);
      }
    })
  }, [])

  return (
      <Container>
        <Row>
          <Col xs={12} md={12}>
            <Card className="border-0 shadow-lg">
              <Card.Header className="bg-info">
                <Row>
                  <Col xs={10} md={10}>
                    LIST OF PACKAGES
                  </Col>
                  <Col xs={2} md={2} className="text-right">
                    <Button
                      variant="warning"
                      onClick={props.handleAddForm}
                      className="float-end"
                    >
                      <FontAwesomeIcon icon={faPlusSquare} /> Add
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTableComponent
                  columns={reportColumns}
                  data={reportData}
                  fileName={"Packages"}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
  
        {/* Modal for viewing package details */}
        <Modal
          show={visible}
          onHide={() => setVisible(false)}
          aria-labelledby="LiveDemoExampleLabel"
          size="xl"
          scrollable
        >
          <Modal.Header closeButton className="bg-info">
            <Modal.Title id="LiveDemoExampleLabel">
              PACKAGE DETAILS - Reference No. : {viewReferenceNo}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ViewPackageDetails
              referenceNo={viewReferenceNo}
              allowUpdate={false}
              publicView={false}
              headerVisibility={false}
              currentStatusId={currentStatusId}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setVisible(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
  )
}

export default ViewPackages