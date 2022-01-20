import React from 'react';
import { 
    Segment, 
    Label 
} from 'semantic-ui-react'

/**
 * @returns Map legend with color
 * codes to undertsand map
 * 
 */

const MapLegend = (props) =>{

    const segmentStyle = {
        zIndex: 999,
        position: 'absolute',
        width: '20%',
        marginTop: '5%',
        marginLeft: '1%',
        maxHeight: 'calc(100vh - 3vw)',
        overflow: 'auto',
        padding: '2%',
        borderRadius: '15px'
    }
    
    return (
        <Segment style={segmentStyle} >
            <div>
                <Label circular color='yellow' empty/>
                <span style={{paddingLeft: '1%'}}>On Promotion</span>
            </div>
            <div>
                <Label circular color='blue' empty/>
                <span style={{paddingLeft: '1%'}}>Venues</span>
            </div>
            <div>
                <Label circular color='purple' empty/>
                <span style={{paddingLeft: '1%'}}>On route</span>
            </div>
            <div>
                <Label circular color='green' empty/>
                <span style={{paddingLeft: '1%'}}>My Location</span>
            </div>
            
        </Segment>
    );

}   

export default MapLegend;