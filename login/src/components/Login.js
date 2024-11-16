import { faArrowAltCircleRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Suspense, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useNavigate, Link } from 'react-router-dom';

import DataProfile from './DataProfile';
// import { login } from '../../../shell/src/globalState/authSlice';  // Import the login action from the shell's Redux store
// import { authSlice } from 'shell/authSlice'; // Use the remote module
import { login } from 'shell/authSlice'; // Import authSlice from shell MFE remotely

import { useDispatch, useSelector } from 'react-redux';
import { doLogin } from '../restApis/ApiLogin';


const Login = () => {

  let navigate = useNavigate();

  const { userProfile, updateUserProfile, updateUserProfileObject } = DataProfile();

  const dispatch = useDispatch();
  const [data, setData] = useState({
    lusername: '',
    lpassword: '',
    isValid: false,
    lToken: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    lusername: '',
    lpassword: ''
  });

  const [errorCss, setErrorCss] = useState({
    lusername: '',
    lpassword: ''
  });

  const handleSubmit = () => {
    let _errors = {}, _errorCss = {};
    let lusername = data.lusername;
    let lpassword = data.lpassword;

    if (!lusername) {
      _errors.lusername = "Username Required";
      _errorCss.lusername = 'is-invalid';
    }
    if (!lpassword) {
      _errors.lpassword = "Password Required";
      _errorCss.lpassword = 'is-invalid';
    }

    if (Object.keys(_errors).length === 0) {
      setIsLoading(true);
      
      // Mock user data; replace with real authentication logic as needed
      // Simulate an API call
      // const user = { username: lusername }; // Replace with actual user data
      // dispatch(login(user)); // Dispatch the login action
      // navigate("/welcome");

      
      setTimeout(() => {
      
        doLogin(lusername, lpassword) // API Call
        .then(response => {
          // console.log("login PAGE GOT THE resp="+JSON.stringify(response))
          if (response instanceof Error) {
            setFormEErrors('ERROR_AT_LOGIN');
          } else {
            if (!response.valid) {
              setFormEErrors('INVALID_CRED');
            } else { // success login
              clearForm();
              console.log("dispatching for login...")
              dispatch(login(response)); // update redux-state for user login
              navigate("/shell/dashboard");
            }
          }
        })
        .catch(err => {
          console.log("err",err)
          setFormEErrors('ERROR_AT_LOGIN');
        })
        .finally(r => {
          setIsLoading(false);
        })

      }, 1000);
      
      
    } else {
      setErrors(_errors);
      setErrorCss(_errorCss);
    }
  }

  const handleInputChange = (e) => {
    let id = e.target.name;
    let val = e.target.value;
    setData({ ...data, [id]: val });

    //if( Object.keys(errors).includes(id) ){
    if (val === '') {
      errorCss[id] = 'is-invalid';
    } else {
      errors[id] = '';
      errorCss[id] = ''; //is-valid
    }
    //}
  }

  const setFormEErrors = (error_type) => {
    let errMsg = null;
    switch(error_type){
      case 'INVALID_CRED':
        errMsg = 'Invalid Credentials';
        break;
      case 'ERROR_AT_LOGIN':
        errMsg = 'Error while Login . . ';
        break;
    }
    setErrors({
      lusername: '',
      lpassword: '',
      lerrorMsg: errMsg
    });
    setErrorCss({
      lusername: 'is-invalid',
      lpassword: 'is-invalid'
    });
  }

  const clearForm = () => {
    setData({
      lusername: '',
      lpassword: '',
      isValid: false,
      lToken: ''
    });
    setErrors({
      lusername: '',
      lpassword: '',
      invalidCred: false
    });
    setErrorCss({
      lusername: '',
      lpassword: ''
    });
    setIsLoading(false);
  }

//   const userSession = getLocalStorageOrDefault("userProfile", {});

  return (
    <Suspense fallback={<div>Loading...</div>}>
    {/* <div className="bg-login min-vh-50 d-flex flex-row align-items-center"> */}
    <div>
      <Container className='p-5'>
        <Row className="d-flex justify-content-center">
          <Col xs={6} md={4} >
              <Card className='border-0 shadow-lg bg-white rounded'>
                <Card.Header className='bg-card-head-none bg-info text-white p-3 d-flex justify-content-center bg-card-title'>
                  Courier Mangement System 
                  {/* <CardTitle className='bg-white '> */}
                    {/* <Image className="sidebar-brand-full mb-3" src={logo} height={65} width={250} /> */}
                  {/* </CardTitle> */}
                </Card.Header>
              <Card.Body className='text-center'>
                  {/* Login */}
                  
                  {/* <hr/> */}
                  <Form>
                  {errors && errors.lerrorMsg && 
                    <Row className='mb-2'>
                      <Col md={12}>
                        <span className='pb-2 text-danger'>{errors.lerrorMsg}</span>
                      </Col>
                    </Row>
                  }
                    <Row className='mb-3'>
                      <Form.Group as={Col} md="12">
                          {/* <Form.Label htmlFor="lusername">Username</Form.Label> */}
                          <Form.Control placeholder="Username" autoComplete="lusername" value={data.lusername}
                            maxLength={30} name='lusername' id="lusername" onChange={handleInputChange} 
                            className={`form-control ${errorCss.lusername}`} alt={errors.firstName} title={errors.lusername}
                            required />
                          {errors && errors.lusername && 
                            <Form.Control.Feedback invalid>{errors.lusername}</Form.Control.Feedback>
                          }
                       </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                      <Form.Group as={Col} md="12">
                      {/* <Form.Label htmlFor="lpassword">Password</Form.Label> */}
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password" value={data.lpassword}
                          maxLength={30} id="lpassword" name='lpassword' onChange={handleInputChange}
                          className={`form-control ${errorCss.lpassword} `} alt={errors.lpassword} title={errors.lpassword}
                          required
                        />
                        {errors && errors.lpassword && 
                          <Form.Control.Feedback invalid>{errors.lpassword}</Form.Control.Feedback>
                        }
                       </Form.Group>
                    </Row>
                    <Row className='mb-3'>
                      <Col md={12}>
                          { isLoading ?
                            <Button color="info" onClick={event => event.preventDefault()} className='w-100'> 
                              <FontAwesomeIcon icon={faSpinner} spin  /> Checking...
                            </Button>
                          :
                            <Button color="info" onClick={handleSubmit} className='w-100'> 
                              Login <FontAwesomeIcon icon={faArrowAltCircleRight} />  
                            </Button>
                          }
                      </Col>
                    </Row>
                    {/* <Row className='mb-3'>
                      <Link to="/tracking" className="btn-link">
                        Click here to Track Package
                      </Link>
                    </Row> */}
                  </Form>
                </Card.Body>
              </Card>
          </Col>
        </Row>
      </Container>
    </div>
    </Suspense>
  )
}

export default Login