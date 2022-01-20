import React, { useState } from 'react';
import {
	Button,
	Modal,
    TextArea,
    Form,
    Icon,
} from 'semantic-ui-react'
import '../../styles/auth.css';

export const RejectVenueRequestModal = (props) => {
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState("");
    const { completeRejection } = props;

    return (
        <Modal
            onClose={() => {
                setComment("");
                setOpen(false);
            }}
            onOpen={() => {
                setComment("");
                setOpen(true);
            }}
            open={open}
            trigger={<Button negative>Reject</Button>}
        >
            <Modal.Header><Icon name='comment outline' />Provide feedback</Modal.Header>
            <Modal.Content>
                <Form>
                    <TextArea 
                        placeholder="Your request was rejected because..."
                        value={comment}
                        onChange={(event) => {
                            setComment(event.target.value);
                        }}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    onClick={() => {
                        setComment("");
                        setOpen(false);
                    }}
                >
                    Abort rejection
                </Button>

                <Button
                    onClick={() => {
                        completeRejection(comment);
                        setComment("");
                        setOpen(false);
                    }}
                >
                    Submit rejection
                </Button>
            </Modal.Actions>
        </Modal>
    )
}