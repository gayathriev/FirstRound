import * as React from "react";
import BusinessNav from "../components/NavBar/BusinessNav";
import { 
    BusinessDashboardComponent 
} from '../components/BusinessDashboard/BusinessDashboardComponent';


export const BusinessDashboard = () => (
    <>
        <BusinessNav />
        <BusinessDashboardComponent />
    </>
);


export default BusinessDashboard;
