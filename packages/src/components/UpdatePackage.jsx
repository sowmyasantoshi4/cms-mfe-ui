// Import from React-Bootstrap
import { Button, Card, Col, Container, Form, Row, FloatingLabel, FormControl, FormFeedback } from 'react-bootstrap';
// Import FontAwesome Icons
import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// React Hooks and Redux
import { useState } from 'react';
import { useSelector } from 'react-redux';
// Custom Component Import
import ViewPackageDetails from './ViewPackageDetails';


const UpdatePackage = () => {

  const [referenceNo, setReferenceNo] = useState('');
  const [msgStatus, setMsgStatus] = useState([]);
  const [errors, setErrors] = useState('');
  const [errorCss, setErrorsCss] = useState('');
  
  const [showDetails, setShowDetails] = useState(false);

  const userProfile = useSelector((state) => state.usr)
  let isPublicView = userProfile && userProfile.isValid ? false : true;

  const handleInputChange = (e) => {
    let val = e.target.value;
    if( val.length > 10 ){
      return false;
    }
    setReferenceNo(val);
    if( val ){
      setErrorsCss('');
      setErrors('');
    }
  }
  const showData = () => {
    setShowDetails(false);
    if( referenceNo.length == 10 ){
      setTimeout(() => {
        setShowDetails(true);
      }, 200);
    }else{
      setErrorsCss('is-invalid');
      setErrors('Invalid Reference No.');
    }
    
  }

  return (
    <Container>
      <Row>
        <Col xs={12} md={12}>
          <Card className="border-0 shadow-lg">
            <Card.Header className="bg-info">
              UPDATE PACKAGE STATUS
            </Card.Header>
            <Card.Body>
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
                <Row className="mb-3">
                  <Col md={3}>
                    <FloatingLabel label="Package Reference No.">
                      <Form.Control
                        type="number"
                        placeholder="Package Reference No."
                        value={referenceNo}
                        min={2023101001}
                        max={2025000000}
                        maxLength={10}
                        onChange={handleInputChange}
                        isInvalid={!!errors}
                      />
                      <Form.Control.Feedback type="invalid">{errors}</Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md={3}>
                    <Button variant="info" onClick={showData}>
                      <FontAwesomeIcon icon={faList} /> View Details
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Conditional rendering for ViewPackageDetails component */}
      {showDetails && (
        <Row className="mt-4">
          <Col xs={12} md={12}>
            <ViewPackageDetails
              referenceNo={referenceNo}
              allowUpdate={true}
              publicView={false}
              headerVisibility={true}
              reloadData={showData}
            />
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default UpdatePackage