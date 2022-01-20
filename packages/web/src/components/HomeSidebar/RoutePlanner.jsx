import React from 'react';
import CardSplitter from './CardSplitter';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import VenueCard from './VenueCard';
import Box from '@mui/material/Box';


/**
 * 
 * @param {*} param0 
 * @returns 
 */
const RoutePlanner = ({ 
    venues, 
    onDragEnd,
    handleAdd,
    handleRemove, 
    authenticated 
}) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="venue-list">
                {(provided) => (  
                    <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        { venues && 
                            venues.length > 0 ? 
                            venues.map((venue, index) => (
                                <Box key={index}>
                                    <Draggable draggableId={venue._id} index={index} key={venue._id}>
                                        {(provided, snapshot) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                snapshot={snapshot}
                                            >
                                                <VenueCard
                                                    index={index}
                                                    removeHandler={handleRemove}
                                                    addHandler={handleAdd}
                                                    routePlanner
                                                    venue={venue}
                                                    authenticated={authenticated}
                                                    snapshot={snapshot}
                                                    provided={provided}
                                                />
                                            </Box>
                                        )}
                                    </Draggable>

                                    {/* { activePanel === 'routePlan' &&
                                        <CardSplitter
                                            index={index} 
                                            last={index === venueArray.resArray.length - 1} 
                                        />
                                    } */}
                                </Box>
                            )) : null
                        }
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
    )
};



export default RoutePlanner;