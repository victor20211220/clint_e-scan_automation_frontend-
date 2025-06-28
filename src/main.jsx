import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/app.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </BrowserRouter>
);
