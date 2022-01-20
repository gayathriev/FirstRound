import React, { useState} from 'react';
import { 
    Dimmer, 
    Loader 
} from 'semantic-ui-react';
import 'semantic-ui-less/semantic.less';
import { useMutation } from '@apollo/client';
import { DeleteUser } from '../../gql/auth/delete.gql';
import SmallModal from '../SmallModal/SmallModal';

const DeleteButton = () => { 
    const [ deleteUser, {loading, error, data} ] = useMutation(DeleteUser);

    const showModal = () => {
        setOpen(true);
    }

    const handleDelete = async () => {
        await deleteUser();
        localStorage.removeItem('sesh');
        // close modal
        setOpen(false);
    }

    const [open, setOpen] = useState(false);

    if (loading)
        return (
            <Dimmer active>
                <Loader />
            </Dimmer>
        )

    if (error)
        console.log("[**] Delete failed", error);

    if (data && !data.deleteUser)
        console.log("[**] Delete failed", data);
    
    if (data) {
        console.log("[**] Delete success", data);
        window.location = '/';
    }


    return (
        <>
            <button 
                className="ui red circular button" 
                onClick={showModal}
                data-cy='delete-account-button'
            >
                Delete Account
            </button>
            <SmallModal 
                open={open}
                openState={setOpen}
                handleFunction={handleDelete}
                title={'Delete your account?'}
                content={'Are you sure you want to delete your account?'}
                buttonContent={'Delete'}
            />
        </>
    );
}

export default DeleteButton;