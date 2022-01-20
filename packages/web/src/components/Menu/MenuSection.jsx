import React from 'react';
import { Icon } from 'semantic-ui-react';
import 'semantic-ui-less/semantic.less';
import './index.css';

const MenuSection = ({ type }) => {

    let iconName;
    switch (type) {
        case 'Specials':
            iconName = 'tag';
            break;
        case 'Food':
            iconName = 'food';
            break;
        case 'Drinks':
            iconName = 'coffee';
            break;
        default:
            iconName = 'food';
    }

    return (
        <>
            <div className='menu-section'>
                <h3>
                    <Icon 
                        name={iconName}
                        size='large'
                    />
                    { type }
                </h3>
            </div>
            <hr className='menu-section-rule' />
            <br />
        </>
    )
};



export default MenuSection;