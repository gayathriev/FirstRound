import * as React from "react";
import { NavBar } from "../components/NavBar/NavBar";
import { AdminDashboardComponent } from "../components/AdminDashboardComponent/AdminDashboardComponent";

/**
 * This will mount the
 * different types of registration
 * forms: user, business, and
 * resolve the respective 
 * gql quires for each 
 */

export const AdminDashboard = () => (

    // TODO :: Conditionally render the
    // different registration forms
    <>
        <NavBar />
        <AdminDashboardComponent />
    </>
);


export default AdminDashboard;