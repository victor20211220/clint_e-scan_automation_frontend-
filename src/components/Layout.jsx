import {Nav} from 'react-bootstrap';
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
    faCircleQuestion,
    faArrowRightFromBracket, faGear
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
                              className="text-white text-decoration-none px-3 d-flex align-items-center gap-2">
                        <img src={logoImg} alt="" width="50" className="img-fluid"/>
                        <span>
                                <h5 className="mb-0">Nomination</h5>
                                <span className="logo-tracker-text fw-light">TRACKER</span>
                            </span>
                    </Nav.Link>
                </div>
                <Nav className="flex-column mb-auto px-1">
                    <Nav.Link as={Link} to="/"
                              className="text-white text-decoration-none mb-1 fw-medium">
                        <FontAwesomeIcon icon={faHouseChimney} className="me-2"/>Nominations</Nav.Link>
                    <Nav.Link as={Link} to="/new-nomination" className="text-white text-decoration-none mb-1 fw-medium">
                        <FontAwesomeIcon icon={faPlus} className="me-2"/>New Nomination</Nav.Link>
                    <Nav.Link onClick={updateNominations} className="text-white text-decoration-none mb-1 fw-medium">
                        <FontAwesomeIcon icon={faArrowsRotate} className="me-2"/>Update Nominations</Nav.Link>
                    {user?.is_admin && (
                        <Nav.Link as={Link} to="/admin" className="text-white text-decoration-none mb-1 fw-medium">
                            <FontAwesomeIcon icon={faUser} className="me-2"/>Admin</Nav.Link>
                    )}
                    <Nav.Link as={Link} to="/faq" className="text-white text-decoration-none mb-1 fw-medium">
                        <FontAwesomeIcon icon={faCircleQuestion} className="me-2"/>FAQ</Nav.Link>
                    <Nav.Link as={Link} to="/settings"
                              className="text-white text-decoration-none mb-1 fw-medium">
                        <FontAwesomeIcon icon={faGear} className="me-2"/>Settings</Nav.Link>
                    <Nav.Link onClick={handleLogout} className="text-white text-decoration-none mb-2 fw-medium">
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="me-2"/>Logout
                    </Nav.Link>
                </Nav>
            </div>
            <div id="mainContent" className={`flex-fill overflow-y-scroll ${isRoot ? "nominations-page": ""}`}>
                {children}
            </div>
        </div>
    );
}
