import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
  display: flex;
  color: #000000; 
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  list-style: none;
  height: 30px;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    color: #000000; 
    border-left: 5px solid #FFEDDC;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;


const SidebarIconCube = styled.span`
    border: 1px solid #FFC328;
    border-radius: 10px;
    padding: 10px;
    background-color: #fafafa;
    text-align: center;
`;


// TMP sadness
const SelectedSidebarIconCube = styled.span`
    border: 1px solid #FFCA00;
    border-radius: 10px;
    padding: 10px;
    background-color: #FFCA00;
    text-align: center;
`;


const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
        <div>
            {item.selected 
                ? <SelectedSidebarIconCube>{item.icon}</SelectedSidebarIconCube> 
                : <SidebarIconCube>{item.icon}</SidebarIconCube>
             }    
             
            <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
    </>
  );
};

export default SubMenu;