import * as React from "react"
import {
  Image,
  Menu,
  Loader,
  Dimmer
} from 'semantic-ui-react';
import { UserTypes } from '../../constants/userTypes';
import { GetSelf } from "../../gql/self/getSelf.gql";
import { useQuery } from "@apollo/client";
import PropTypes from "prop-types";
import logo from "../../assets/img/logo.svg";
import NavBarItems from "./NavBarItems";


export const NavBar = ({ setAuthenticated }) => {
    
    // I'll do this a better way
    // one day
    let customer = false;
    let business = false;
    let admin = false;

    /**
     * here we want to make a self query
     * to get the user type and other info
     * 
     * we can then use that info to render the navbar,
     * apollo cache will help make this speedy
     */
    const  { loading, error, data } = useQuery(
        GetSelf, 
        {
            // fetchPolicy: 'network-only',
            // onCompleted: (data) => {
            //     // console.log("[>>] performed refetch", data);
            // }
        },
    );

    if (loading)
        return (
            <Dimmer active>
                <Loader />
            </Dimmer>
        )

    // user not logged in or 
    // something else horrid occurred
    if (error) {
        // if we have a state handler
        // flag now
        if (setAuthenticated)
            setAuthenticated(false);
        
        // return default Nav
        return (
            <div className="ui blue inverted menu" fixed="top">
                <Image 
                    size={'small'} 
                    src={logo}  
                    href={'/'}
                    style={{ marginLeft: '3%' }}
                />
                <Menu.Menu position="right"> 
                    <NavBarItems key={1}/>
                </Menu.Menu>
            </div>
        )
    }

    if (data) {
        customer = false;
        business = false;
        admin = false;

        // if we have a state handler
        // flag it now
        if (setAuthenticated)
            setAuthenticated(true);

        switch(data.getSelf.userType) {
            case UserTypes.CUSTOMER:
                customer = true;
                break;
            case UserTypes.BUSINESS:
                business = true;
                break;
            case UserTypes.ADMIN:
                admin = true;
                break;
            default:
                console.log("User type not found");
                break;
        }
    }

    /**
     * The menu here should probably
     * be modified in the styles builder
     * instead of using the text prop
     * ect. But this works.
     */
    return (
        <div 
            className="ui blue inverted menu" 
            fixed="top"
        >
            <Image 
                size={'small'} 
                src={logo}  
                href={'/'}
                style={{ marginLeft: '3%' }}
            />
            <Menu 
                floated={'right'} 
                borderless 
                text 
                size={'huge'}
            > 
                <NavBarItems 
                    key={1}
                    customer={customer}
                    business={business}
                    admin={admin}
                />
            </Menu>
        </div>
    );
}

NavBar.propTypes = {
    setAuthenticated: PropTypes.func
}
