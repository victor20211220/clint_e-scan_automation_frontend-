import {Navigate} from 'react-router-dom';
import Layout from './Layout';
import {useAuth} from "../services/utils.js";

export default function PrivateRoute({children, title}) {
    const {user, loading} = useAuth()

    if (title) document.title = title;

    if (loading) return <div className="p-4">Loading...</div>;
    if (!user) return <Navigate to="/login" replace/>;

    return <Layout>{children}</Layout>;
}
