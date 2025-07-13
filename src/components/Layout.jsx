import {Dropdown, Nav} from 'react-bootstrap';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from "../services/utils.js";
import axios from '../services/axios';
import {toast} from 'react-toastify';
import logoImg from '../assets/images/logo.png';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faHouseChimney,
    faPlus,
    faArrowsRotate,
    faUser,
    faArrowRightFromBracket, faPlusMinus, faFileAlt, faCalendarDays, faCircleInfo
} from "@fortawesome/free-solid-svg-icons";

export default function Layout({children}) {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isRoot = location.pathname === "/";

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const updateNominations = async () => {
        try {
            const res = await axios.post(`/nominations/scan`);
            toast.success(res.data.message);
            navigate('/', {state: {refresh: Date.now()}});
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Error scanning contract files');
        }
    }

    return (
        <div className="d-flex overflow-y-hidden dvh-100">
            <div className="min-vh-100 d-flex flex-column p-0 flex-shrink-0" id="appMenu">
                <div className="mb-4 border-bottom p-3 px-0">
                    <Nav.Link as={Link} to="/"
                              className="text-white text-decoration-none px-3">
                        <img src={logoImg} alt="" width="300" className="img-fluid"/><br/>
                        <span className="d-flex align-items-center gap-0 justify-content-center fw-light">
                            <h5 className="mb-0">LNG OWB</h5>
                        </span>
                    </Nav.Link>
                </div>
                <Nav className="flex-column mb-auto px-1">
                    <Dropdown className="nav-link">
                        <Dropdown.Toggle variant="link" className="text-white text-decoration-none mb-1 fw-medium p-0">
                            <FontAwesomeIcon icon={faFileAlt} className="me-2"/>
                            Nominations
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/">
                                <FontAwesomeIcon icon={faHouseChimney} className="me-2"/>
                                All Nominations
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/new-nomination">
                                <FontAwesomeIcon icon={faPlus} className="me-2"/>
                                New Nomination
                            </Dropdown.Item>
                            <Dropdown.Item onClick={updateNominations}>
                                <FontAwesomeIcon icon={faArrowsRotate} className="me-2"/>
                                Update Nominations
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {user?.is_admin && (
                        <Nav.Link as={Link} to="/admin" className="text-white text-decoration-none mb-1 fw-medium">
                            <FontAwesomeIcon icon={faUser} className="me-2"/>Admin</Nav.Link>
                    )}
                    <Nav.Link as={Link} to="/cargo-schedule" className="text-white text-decoration-none mb-1 fw-medium">
                        <FontAwesomeIcon icon={faCalendarDays} className="me-2"/>Cargo Schedule</Nav.Link>
                    <Nav.Link as={Link} to="/cargo-matching" className="text-white text-decoration-none mb-1 fw-medium">
                        <FontAwesomeIcon icon={faPlusMinus} className="me-2"/>Cargo Matching</Nav.Link>
                    <Nav.Link as={Link} to="/doc-instructions"
                              className="text-white text-decoration-none mb-1 fw-medium">
                        <FontAwesomeIcon icon={faCircleInfo} className="me-2"/>Doc Instructions</Nav.Link>
                    <Nav.Link onClick={handleLogout} className="text-white text-decoration-none mb-2 fw-medium">
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="me-2"/>Logout
                    </Nav.Link>
                </Nav>
            </div>
            <div id="mainContent" className={`flex-fill overflow-y-scroll ${isRoot ? "nominations-page" : ""}`}>
                {children}
            </div>
        </div>
    );
}
