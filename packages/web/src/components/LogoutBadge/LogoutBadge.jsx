import * as React from "react"
import CircularBadge from "../../shared-components/CircularBadge";
import SmallModal from "../SmallModal/SmallModal";
import { LogoutUser } from './logout.gql';
import { useLazyQuery } from '@apollo/client';


const LogoutBadge = () => {

    // call the logout query
    const [ logout ] = useLazyQuery(
        LogoutUser, 
        {
            onCompleted: () => {
                localStorage.clear();
                // todo sevier the websocket connection

                // I dont like this but otherwise
                // it gets cached, maybe can
                // evict from cache here instead
                window.location = '/login';
            }
        }
    );


    const showModal = () => {
        setOpen(true);
    }

    const [open, setOpen] = React.useState(false)
    
    return (
        <>
            <CircularBadge
                iconName={'sign out alternate'}
                onClick={showModal} 
            />
            <SmallModal 
                open={open}
                openState={setOpen}
                handleFunction={logout}
                title={'Logout'}
                content={'Are you sure you want to logout from your account?'}
                buttonContent={'Logout'}
            />
        </>
    );
};

export default LogoutBadge;
