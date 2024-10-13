import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { faEnvelope, faPhone, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import DataTableComponent from '../../datatable/DataTableComponent';
import { getStaffMembersList } from '../../restApis/ApiStaff';

const ViewStaff = (props) => {
  const reportColumns = [
    { name: 'ID', selector: row => row.staffId, sortable: true, type: "Number", key: "staffId", isColumnHidden: false },
    { name: 'Name', selector: row => row.staffName, sortable: true, type: "String", key: "staffName", isColumnHidden: false,
      cell: row => <div>
        <span> {row.staffName}<br/>
              <FontAwesomeIcon icon={faEnvelope} /> {row.emailId}  <br/> 
              <FontAwesomeIcon icon={faPhone} /> {row.phoneNo}
        </span>
      </div>
    },
    { name: 'Branch', selector: row => row.branchName, sortable: true, type: "String", key: "branchName", isColumnHidden: false,
      cell: row => <span> {row.branchId!==0 ? row.branchName : ''} </span> 
    },
    { name: 'Designation', selector: row => row.designationName, sortable: true, type: "Number", key: "designationName", isColumnHidden: false },
    { name: 'Address', selector: row => row.houseNo, sortable: true, type: "String", key: "houseNo", isColumnHidden: false,
      cell: row => <div>
                    <span> {row.houseNo}, Street : {row.streetNo}, {row.city} <br/>
                           {row.districtId!==0 ? row.districtName : ''} ,  
                           {row.stateId!==0 ? row.stateName : ''} <br/>
                           {row.pincode}
                    </span>
                  </div>
    },
  ];

  const [reportData, setReportData] = useState([]);
  useEffect(() => {
    getStaffMembersList()
    .then(response => {
      if( response instanceof Error ) {
        // Handle error (maybe log it or show a notification)
      } else {
        setReportData(response);
      }
    });
  }, []);
  

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <Card className='border-0 shadow-lg'>
            <Card.Header className='bg-info text-white'>
              <Row>
                <Col xs={10}>
                  LIST OF STAFF MEMBERS
                </Col>
                <Col xs={2} className='text-right'>
                  <Button variant='warning' onClick={props.handleAddForm} className='float-end'>
                    <FontAwesomeIcon icon={faPlusSquare} /> Add
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <DataTableComponent columns={reportColumns} data={reportData} fileName={"StaffMembers"} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ViewStaff;