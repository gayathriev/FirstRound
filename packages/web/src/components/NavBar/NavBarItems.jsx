import * as React from "react"
import {
  Menu,
} from 'semantic-ui-react'
import PropTypes from 'prop-types';
import LoginBadge from "./LoginBadge"
import BusinessBadge from "./BusinessBadge";
import LogoutBadge from "../LogoutBadge/LogoutBadge";
import AccountBadge from "./AccountBadge";
import NotificationBadge from "../Notifications/NotificationBadge";
import BusinessHomeBadge from "./BuisnessHomeBadge";
import MapBadge from "./MapBadge";

function NavBarItems({
	customer, 
	business, 
	admin, 
	unauthenticated
}) {
	
  	if (customer) {
		return (
			<>
                <Menu.Item>
                    <MapBadge />
                </Menu.Item> 

                <Menu.Item>
                    <NotificationBadge />
                </Menu.Item> 

                <Menu.Item>
                    <AccountBadge />
                </Menu.Item> 
                
                <Menu.Item>
                    <LogoutBadge />
                </Menu.Item> 
			</>
		);
  	}
	
	if (business) {
		return (
			<>
                <Menu.Item>
                    <MapBadge />
                </Menu.Item> 

                <Menu.Item>
                    <NotificationBadge />
                </Menu.Item> 

                <Menu.Item>
                    <BusinessHomeBadge />
                </Menu.Item>  

                <Menu.Item>
                    <AccountBadge />
                </Menu.Item> 
 
                <Menu.Item>
                    <LogoutBadge />
                </Menu.Item>                 
            </>
		);
	}
	
	if (admin){
		return (
            <>
                <Menu.Item>
                    <LogoutBadge />
                </Menu.Item> 
            </>
		);
	}

	if (unauthenticated) {
		return (
			<>
                <Menu.Item>
                    <MapBadge />
                </Menu.Item> 

				<Menu.Item >
					<BusinessBadge />
				</Menu.Item>
                
				<Menu.Item>
					<LoginBadge />
				</Menu.Item>
			</>
		);
	}
}

export default NavBarItems;

NavBarItems.propTypes = {
    customer: PropTypes.bool,
    business: PropTypes.bool,
    admin: PropTypes.bool,
    unauthenticated: PropTypes.bool
};

NavBarItems.defaultProps = {
  customer: false,
  business: false,
  admin: false,
  unauthenticated: true,
};
