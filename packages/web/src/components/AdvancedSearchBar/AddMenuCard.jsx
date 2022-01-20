import {useState} from "react";
import { 
	Grid,
	Checkbox,
    Segment,
    Input,
} from 'semantic-ui-react';
import PrimaryButton from '../../shared-components/primary-button/PrimaryButton';
import MenuItemCard from './MenuItemCard';
import DropDownKindBar from './DropDownKindBar';
import PropTypes from 'prop-types'

/**
 * 
 * @returns add menu card. This encompasses
 * adding an item, maximum price and itemKind
 *  
 * @param itemSearch - state array used to for to search items
 * 
 * @param setItemSearch - state function used to set search items
 * 
 */


const AddMenuCard = ({itemSearch, setItemSearch}) => {

    const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [spec, setSpec] = useState(false);
	const [itemKind, setItemKind] = useState({id: '', text: ''});

    const addItem = e => {
		if (name !== '' || itemKind.id !== '') {
			const newItem = {};
			if (name !== '') {
				newItem["itemName"] = name;
			}
			if (price !== '') {
				let cost = parseFloat(price);
				newItem["price"] = cost;
			}
			if (spec) {
				newItem["isSpecial"] = true;
			}
			if (itemKind !== '') {
				newItem["itemKind"] = itemKind;
			}
			console.log(newItem);
			setItemSearch([...itemSearch, newItem]);
			setName('');
			setPrice('');
			setSpec(false);
			setItemKind({id: '', text: ''});
		}  
	}

    return ( 
		<Segment 
            color='blue' 
            // style={{marginTop: '%'}}
            className='rounded'
        >
                <h5>Search for menu items</h5>
                <Input 
                    placeholder='Enter item name' 
                    value={name}
                    fluid 
                    onChange={(e) => setName(e.target.value)}>
                    <input style={{borderRadius: '100px'}} />
                </Input>
                <div style={{marginTop: '3%'}}>
                    <Grid>
                        <Grid.Column width={10}>
                            <Input 
                                size='small' 
                                icon='money bill alternate' 
                                placeholder='Maximum price' 
                                fluid
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <DropDownKindBar 
                                itemKind={itemKind}
                                setItemKind={setItemKind}
                            />
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Checkbox
                                checked={spec}
                                label='On special'
                                onChange={(event, { checked }) => {
                                    setSpec(checked);
                                }}
                            />	
                        </Grid.Column>
                    </Grid>
                </div>	
                <div style={{textAlign: 'center', paddingTop: '3%'}}>
                    <PrimaryButton 
                        onClick={() => {addItem()}}
                        content='Add item'
                    />
                </div>
                {itemSearch.length !== 0 ? (
                        <Segment>
                            <MenuItemCard 
                                itemSearch={itemSearch}
                                setItemSearch={setItemSearch}
                            />
                        </Segment>
                    ): (null)}
        </Segment>

    );
};
export default AddMenuCard;

AddMenuCard.propTypes = {
    itemSearch: PropTypes.array.isRequired,
    setItemSearch: PropTypes.func.isRequired
}