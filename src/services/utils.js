import {useContext} from 'react';
import AuthContext from "../context/AuthContext.jsx";

export const useAuth = () => useContext(AuthContext);

export const nominationStatsConfig = [
    {
        key: "all",
        label: "All",
        class_name: "text-secondary-emphasis"
    },
    {
        key: "this_month",
        label: "THIS MONTH",
        class_name: "text-warning-emphasis"
    },
    {
        key: "this_week",
        label: "THIS WEEK",
        class_name: "text-warning"
    },
    {
        key: "on_today",
        label: "TODAY",
        class_name: "text-danger"
    },
    {
        key: "sent_received",
        label: "SENT/RECEIVED",
        class_name: "text-success"
    },
    {
        key: "overdue",
        label: "OVERDUE",
        class_name: "text-danger-emphasis"
    }
];