// MFE 1: Accessing the global state from context
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../globalState/authSlice';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCirclePlus, faEdit, faList, faListNumeric, faListSquares, faPersonCirclePlus, faPlusCircle, faPowerOff, faTruck } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);  // Access auth state from store

  const dispatch = useDispatch();
  const doLogout = () => {
    dispatch(logout());  // Dispatch the logout action
    // navigate('/login');
  }

  
  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary1" bg="dark" data-bs-theme="dark">
        <Navbar.Brand href="/home" className='mx-2'> Courier Management System (CMS) </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            
            {isAuthenticated 
              ? 
              // Login User Menu
              <>
                <Nav.Link href="/welcome"> <FontAwesomeIcon icon={faList} /> Dashboard</Nav.Link>
                <NavDropdown title="Admin Portal" id="basic-nav-dropdown-admin">
                  <NavDropdown.Item href="/masters/staff"><FontAwesomeIcon icon={faPersonCirclePlus} /> Add Staff</NavDropdown.Item>
                  <NavDropdown.Item href="/masters/branch"><FontAwesomeIcon icon={faPlusCircle} /> Add Branch</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Package Management" id="basic-nav-dropdown-package">
                  <NavDropdown.Item href="/package/add"><FontAwesomeIcon icon={faCirclePlus} /> Add New Package</NavDropdown.Item>
                  <NavDropdown.Item href="/package/update"><FontAwesomeIcon icon={faEdit} /> Update Package Status</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Reports" id="basic-nav-dropdown-reports">
                  <NavDropdown.Item href="/globalReport"><FontAwesomeIcon icon={faListNumeric} /> Global Report</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/tracking"><FontAwesomeIcon icon={faTruck} /> Track Package</Nav.Link>
                <Nav.Link href="/logout" onClick={doLogout}><FontAwesomeIcon icon={faPowerOff} /> Logout</Nav.Link>

            </>
            :
            <>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/tracking">Track Package</Nav.Link>
            </>
            }
          </Nav>
        </Navbar.Collapse>
    </Navbar>
    {/* <div className='container'>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/home">CMS</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              {isAuthenticated 
              ? 
              // Login User Menu
              <>
                <li className="nav-item">
                  <Link to="/welcome" className="nav-link">
                      Welcome
                  </Link>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Admin Portal
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Add Staff</a></li>
                    <li><a class="dropdown-item" href="#">Add Branch</a></li>
                  </ul>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Admin Portal
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Add New Pacakge</a></li>
                    <li><a class="dropdown-item" href="#">Update Package Status</a></li>
                  </ul>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Reports
                  </a>
                  <ul class="dropdown-menu">
                    <li>
                      <Link to="/globalReport" className="dropdown-item">Global Report</Link></li>
                  </ul>
                </li>
                
                <li className="nav-item">
                  <Link to="/tracking" className="nav-link">
                      Tracking
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/logout" onClick={doLogout}>Logout</a>
                </li>
              </>
              :
              // Non Login Menu
              <>
                <li className="nav-item">
                  <Link to="/home" className="nav-link" aria-current="page">
                      Home
                  </Link>
                </li>
                <Link to="/login" className="nav-link">
                    Login
                </Link>
                <li className="nav-item">
                  <Link to="/tracking" className="nav-link">
                      Tracking
                  </Link>
                </li>
              </>
              
              }
            </ul>
          </div>
        </div>
      </nav>
      </div> */}
    </>
  )
}

export default Header