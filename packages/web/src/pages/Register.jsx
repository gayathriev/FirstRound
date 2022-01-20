import * as React from "react";
import PropTypes from 'prop-types';
import { NavBar } from "../components/NavBar/NavBar";
import { RegistrationForm } from "../components/RegisterForm/RegistrationForm";

const Register = ({ userType }) => {

    return (
        <>
            <NavBar />
            <RegistrationForm userType={userType} />
        </>
    );
}


Register.propTypes = {
    userType: PropTypes.string.isRequired
}

export default Register;