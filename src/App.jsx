import {Routes, Route} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/Admin';
import {ToastContainer} from 'react-toastify';
import NominationPage from "./pages/NominationPage.jsx";

export default function App() {
    const privateRoutes = [
        {path: '/', title: 'Dashboard', element: <Dashboard/>},
        {path: '/admin', title: 'Admin - Users', element: <AdminPage/>},
        {path: '/new-nomination', title: 'New Nomination', element: <NominationPage/>},
        {path: '/nominations/edit/:id', title: 'Edit Nomination', element: <NominationPage isEdit/>},
    ];

    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>

                {privateRoutes.map(({path, title, element}) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <PrivateRoute title={title}>
                                {element}
                            </PrivateRoute>
                        }
                    />
                ))}
            </Routes>
            <ToastContainer position="top-right" autoClose={3000}/>
        </>
    );
}
