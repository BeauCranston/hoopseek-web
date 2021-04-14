import React from 'react';

var courtFeatures = {
    courtCondition:['Bad', 'Playable', 'Good', 'Prestine'],
    meshType:['No Mesh', 'Fabric', 'Chain'],
    backboardType: ['Metal', 'Glass'],
    lighting:['No Lights', 'Dimly Lit', 'Lots of Light'],
    parking:['No Parking', 'Street Parking', 'Parking Lot'],
    threePointLine:['No', 'Yes']
}
export const CourtFeaturesContext = React.createContext(courtFeatures);