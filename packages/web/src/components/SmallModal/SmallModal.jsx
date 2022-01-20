import React from 'react'
import { 
    Button, 
    Header, 
    Icon, 
    Modal 
} from 'semantic-ui-react'
import PropTypes from 'prop-types';
/**
 * Displays Modal for logging out
 * 
 * @param open  - state to show where logout is open
 * @param setOpen - function to set state
 * @param handleFunction - function call, executes on click
 * @param title - title over 
 * @param content - modal content
 * @param buttonContent - button content to approve
 */
function SmallModal( {
  open, 
  openState, 
  handleFunction, 
  title, 
  content, 
  buttonContent
}) {
  
    return (
        <Modal
            closeIcon
            open={open}
            onClose={() => openState(false)}
            onOpen={() => openState(true)}
            size='mini'
        >
            <Header 
                icon='log out' 
                content={title} 
            />
            <Modal.Content>
                <p>
                {content}
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button 
                    color='green' 
                    onClick={() => openState(false)}
                >
                    <Icon name='remove' /> 
                    Cancel
                </Button>
                <Button
                    data-cy='modal-confirm-button' 
                    color='red' 
                    onClick={handleFunction}
                >
                    <Icon name='checkmark' /> 
                    {buttonContent}
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default SmallModal;

SmallModal.propTypes = {
  open: PropTypes.bool,
  openState: PropTypes.func,
  handleFunction: PropTypes.func,
  title: PropTypes.string,
  content: PropTypes.string,
  buttonContent: PropTypes.string,
};
