import React, { useState } from 'react';
import propTypes from 'prop-types';
import AddItemForm from './AddItemForm';
import { Button } from "semantic-ui-react";
import 'semantic-ui-less/semantic.less';
import './index.css';
import Rating from '@mui/material/Rating';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import AddItemGroup from './AddItemGroup';
import PromotionSection from './PromotionSection';
import OpeningHours from './OpeningHours';

/**
 * 
 * @param {*} name
 * @param {*} rating
 * @param {*} price
 *  
 * @returns a banner with the name, 
 * rating and price of the venue
 * as well as a button to upload
 * a new item to the venue
 * if authenticated
 * 
 * @note the price will need to
 * be formatted to a tag between
 * $ - $$$ 
 * 
 * @todo change rating to use 
 * material ui rating component
 * 
 * @todo connect rating stubs
 * to backend
 * 
 * @todo add icon + popup for 
 * credit gain
 */
const Banner = ({ 
    venueID,
    name, 
    rating, 
    promotion,
    openingHours,
    tags,
    selectedTags,
    selectTag,
    canSelect,
    credits,
    authenticated,
    addRating
}) => {
    const [openForm, setFormOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleRate = (newRating) => {
        addRating({
            variables: {
                venueID: venueID,
                rating: newRating
            }
        })
    };

    const renderLabel = (label) => {
		return {
			content: `${label.text}`,
			className: 'yellow'
		}
	};

    const addMenuItem = () => setFormOpen(true);
    const reviewsOpen = Boolean(anchorEl);

    return (
        <>
            {authenticated &&             
                <AddItemForm 
                    open={openForm} 
                    setOpen={setFormOpen} 
                    venueID={venueID}
                    credits={credits}
                />
            }

            <div className='banner'>
                <Rating 
                    readOnly={!authenticated}
                    size='large'
                    precision={0.5}
                    maxRating={5} 
                    onChange={(event, value) => handleRate(value)}
                    defaultValue={rating}
                />
                
                <h1 className='heading'>
                    {name}
                </h1>

                <Button
                    onClick={(event) => {
                        if (authenticated) setAnchorEl(event.currentTarget);
                    }}
                    disabled={!authenticated}
                >
                    Add Tags
                </Button>
                <Popover
                    open={reviewsOpen}
                    anchorEl={anchorEl}
                    onClose={() => {
                        setAnchorEl(null);
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Typography align='center'>
                        Select tags that represent the vibe
                    </Typography>
                    <div container spacing={1} columns={3} className='tags-selector'>
                        {tags.map(tag => (
                            <Chip 
                                label={tag.text}
                                clickable={canSelect}
                                variant={selectedTags.includes(tag._id) ? 'filled' : 'outlined'}
                                onClick={() => {
                                    selectTag(tag._id)
                                }}
                                className='tag'
                            />
                        ))}
                    </div>
                </Popover>
            </div>
            <hr className='banner-rule'/>

            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: '1 200px'
                }}
            >

                <OpeningHours 
                    openingHours={openingHours.hours}
                    title
                    menuInfo
                /> 

                {authenticated && promotion && <PromotionSection promotion={promotion} venueID={venueID}/>}
                
                {authenticated && <AddItemGroup trigger={addMenuItem} credits={credits}/>}                
            </Box>
        </>
    )
};


Banner.propTypes = {
    venueID: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    rating: propTypes.number.isRequired,
    price: propTypes.number.isRequired,
    credits: propTypes.number
};


export default Banner;