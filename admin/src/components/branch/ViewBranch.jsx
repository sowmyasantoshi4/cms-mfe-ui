import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { faEnvelope, faPhone, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import DataTableComponent from '../../datatable/DataTableComponent';
import { getBranchesList } from '../../restApis/ApiBranch';

const ViewBranch = (props) => {

  const reportColumns = [
    { name: 'ID', selector: row => row.branchId, sortable: true, type: "Number", key: "branchId", isColumnHidden: false },
    { name: 'Branch Name', selector: row => row.branchName, sortable: true, type: "String", key: "branchName", isColumnHidden: false,
      cell: row => <div>
        <span> {row.branchName}<br/>
               <FontAwesomeIcon icon={faEnvelope} /> {row.emailId}  <br/> 
               <FontAwesomeIcon icon={faPhone} /> {row.phoneNo}
        </span>
      </div>
    },
    { name: 'Incharge Name', selector: row => row.inchargeStaffName, sortable: true, type: "String", inchargeStaffName: "name", isColumnHidden: false },
    { name: 'Address', selector: row => row.houseNo, sortable: true, type: "String", key: "houseNo", isColumnHidden: false,
      cell: row => <div>
                    <span> {row.houseNo}, Street : {row.streetNo}, {row.city} <br/>
                           {row.districtName},  
                           {row.stateName} <br/>
                           {row.pincode}
                    </span>
                  </div>
    },
    { name: 'Staff', selector: row => row.staff, sortable: false, type: "String", key: "staff", isColumnHidden: false,
      cell: row => <table> {
        row.staff.map((key,index) => {
          return (<tr key={index}>
                  <td> {key.designationName} - {key.staffName}</td>
                  </tr>)
        })
      }</table>
    },
  ];

  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    getBranchesList()
    .then(response => {
      if( response instanceof Error ) {
        // handle error
      } else {
        setReportData(response);
      }
    })
  }, []);

  return (
    <Container>
      <Row>
        <Col xs={12} md={12}>
          <Card className='border-0 shadow-lg'>
            <Card.Header className='bg-info'>
              <Row>
                <Col xs={10} md={10}>
                  LIST OF BRANCHES
                </Col>
                <Col xs={2} md={2} className='text-right'>
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

export default ViewBranch;
