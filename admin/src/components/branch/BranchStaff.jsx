import { Button, Col, Form, Row, Table, FloatingLabel  } from 'react-bootstrap';
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BranchStaff = (props) => {
  return (
    <fieldset className="bg-light">
      <legend className="alert alert-primary px-2 py-1">Staff</legend>
      <Row>
        <Col md={12} className="addStaffTableDiv tableFixHead">
          <Table hover>
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Select Staff Member</th>
                <th className="text-center">
                  <Button variant="warning" onClick={props.addStaff}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {props.staff.map((key, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Form.Group controlId={`staff_member_${index}`}>
                        <Form.Control
                          as="select"
                          name="staff_member"
                          value={key['staff_member']}
                          onChange={props.handleInputChangeStaff(index)}
                          isInvalid={!!props.errors[index]['staff_member']}
                          required
                        >
                          {/* <option value="">Select Staff Member</option> */}
                          {props.staffList.map((staff, idx) => (
                            <option key={idx} value={staff.value}>
                              {staff.label}
                            </option>
                          ))}
                        </Form.Control>
                        {props.errors[index]['staff_member'] && (
                          <Form.Control.Feedback type="invalid">
                            {props.errors[index]['staff_member']}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </td>
                    <td className="text-center">
                      <Button variant="danger" onClick={() => props.deleteStaff(index)}>
                        <FontAwesomeIcon icon={faTimesCircle} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </fieldset>
  );
};


export default BranchStaff;
