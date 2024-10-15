import React from 'react'
import { Button, Card, Col, Container, Form, FloatingLabel, FormControl, FormGroup, FormLabel, Row, Alert, CardHeader, CardBody, FormText } from 'react-bootstrap';

const Welcome = () => {
  return (
    <div>
      <Container>
        <Row>
          <Col xs={12} md={12} className=" pb-5 mb-5">
            <Alert variant="primary">
              Welcome !
            </Alert>
          </Col>
        </Row>  
      </Container>
    </div>
  )
}

export default Welcome