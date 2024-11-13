import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import { faKey, faList, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ViewPackageDetails from './ViewPackageDetails';
import { useNavigate } from 'react-router-dom';

const TrackPackage = () => {
  const [referenceNo, setReferenceNo] = useState('');
  const [msgStatus, setMsgStatus] = useState([]);
  const [errors, setErrors] = useState('');
  const [errorCss, setErrorsCss] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const userProfile = useSelector((state) => state.auth.user)

  let isPublicView = userProfile && userProfile.valid ? false : true;

  const handleInputChange = (e) => {
    let val = e.target.value;
    if (val.length > 10) {
      return false;
    }
    setReferenceNo(val);
    if (val) {
      setErrorsCss('');
      setErrors('');
    }
  };

  const showData = () => {
    setShowDetails(false);
    if (referenceNo.length === 10) {
      setShowDetails(true);
    } else {
      setErrorsCss('is-invalid');
      setErrors('Invalid Reference No.');
    }
  };

  let navigate = useNavigate();

  const gotoLogin = () => {
    navigate('/login');
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={12}>
          <Card className='border-0 shadow-lg'>
            <Card.Header className='bg-info text-white'>
              <Row>
                <Col xs={9} md={9}>
                  TRACK PACKAGE
                </Col>
                {/* {isPublicView && (
                  <Col xs={3} md={3}>
                    <Button
                      variant='warning'
                      onClick={gotoLogin}
                      className='float-end'
                    >
                      <FontAwesomeIcon icon={faKey} /> Login
                    </Button>
                  </Col>
                )} */}
              </Row>
            </Card.Header>
            <Card.Body>
              {msgStatus.responseCSS && (
                <Row>
                  <Col xs={12} md={12} className='offset-md-1 text-center'>
                    <Alert variant={msgStatus.responseCSS}>
                      {msgStatus.responseCSS === 'success' && (
                        <FontAwesomeIcon icon={faCheckCircle} />
                      )}
                      {msgStatus.responseCSS === 'danger' && (
                        <FontAwesomeIcon icon={faTimesCircle} />
                      )}
                      {msgStatus.responseStatus}
                    </Alert>
                  </Col>
                </Row>
              )}
              <Form>
                <Row className='mb-3'>
                  <Col md={8}>
                    <Form.Group>
                      {/* <Form.Label>Package Reference No.</Form.Label> */}
                      <Form.Control
                        type='number'
                        placeholder='Package Reference No.'
                        autoComplete='name'
                        value={referenceNo}
                        min={2023101001}
                        max={2025000000}
                        maxLength={10}
                        name='referenceNo'
                        id='referenceNo'
                        onChange={handleInputChange}
                        className={errorCss}
                        required
                      />
                      {errors && (
                        <Form.Control.Feedback type='invalid'>
                          {errors}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Button
                      type='button'
                      onClick={showData}
                      variant='info'
                      className='align-middle'
                      size='sm'
                    >
                      <FontAwesomeIcon icon={faList} /> View Details
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className='mt-4'>
        <Col xs={12} md={12}>
          {showDetails && (
            <ViewPackageDetails
              referenceNo={referenceNo}
              allowUpdate={false}
              publicView={isPublicView}
              headerVisibility={true}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TrackPackage;
