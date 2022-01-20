import * as React from "react"
import PropTypes from 'prop-types';
import { Dropdown } from "semantic-ui-react";
import { useQuery } from '@apollo/client';
import GetAllTags from "../../gql/venueInfo/getAllTags.gql";


/**
 * 
 * @returns a dropdown multi select bar used in advanced search and
 * route criteria. 
 * 
 * @param searchTag - state array used to for to search tags
 * 
 * @param setSearchTag - state function used to set search tags
 * 
 */

const DropdownTagBar = ({searchTag, setSearchTag}) => {

	function renderLabel(label){
		return {
			content: `${label.text}`,
			className: 'yellow'
		}
	}   

	const { loading, error, data } = useQuery(GetAllTags);
	if (!loading) {
		if (data) {
			return (
				<Dropdown 
					icon='search'
					placeholder='Add tags' 
					fluid multiple selection 
					search
					options={data.getAllTags.map(ds => {
						return {
							key: ds._id,
							text: ds.text,
							value: ds._id,
							label: { className: 'blue', color:'yellow', empty: true, circular: true }
						}
					})}
					onChange={(event, { value }) => {
						setSearchTag(value);
					}}
					value={searchTag}
					renderLabel={renderLabel}
				/>
			);
		}
	}
	if (error) {
		alert('An error occured! Tags didn\'t load! Try again');
	}
	else{
		return <></>
	}
}

export default DropdownTagBar;

DropdownTagBar.propTypes = {
    searchTag: PropTypes.array,
    setSearchTag: PropTypes.func,
  };