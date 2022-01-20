import * as React from "react"
import PropTypes from 'prop-types';
import { Dropdown } from "semantic-ui-react";
import { useQuery } from '@apollo/client';
import { GetAllItemKinds } from '../../gql/search/getAllItemKinds.gql';


/**
 * 
 * @returns a drop down search to look up
 * item kinds. This component is used in 
 * search and in route criteria
 * 
 * @param itemKind - state used to set current itemKind
 * 
 * @param setItemKind - state function used to set itemKind
 * 
 */
const DropdownKindBar = ({itemKind, setItemKind}) => {

	function renderLabel(label){
		return {
			content: `${label.type}`,
			className: 'yellow'
		}
	}

    const { loading, error, data } = useQuery(GetAllItemKinds);

    let allOptions = [];

    if (data) {
        let foodTypes = data.getAllItemKinds.food;
        let drinkTypes = data.getAllItemKinds.drink;
        allOptions = foodTypes.concat(drinkTypes);
    }

	if (!loading) {
		if (data) {
			return (
                <Dropdown
                    placeholder='Select item kind'
                    search
                    selection
                    clearable
					fluid
                    options={allOptions.map(ds => {
						return {
							key: ds._id,
							text: ds.type,
							value: ds._id,
						}
					})}
                    onChange={(event, {value}) => {
						let tagText;
						for (let option of allOptions) {
							if (option._id  === value) {
								tagText = option.type;
							}
						}
                        setItemKind({id: value, text: tagText});
                    }}
                    renderLabel={renderLabel}
                    style={{marginTop: '3%'}}
                    value={itemKind.id}
                />
			);
		}
	}
	if (error) {
		alert('An error occured! Try again');
	}
	else{
		return <></>
	}
}

export default DropdownKindBar;

DropdownKindBar.propTypes = {
    itemKind: PropTypes.object,
    setItemKind: PropTypes.func,
  };