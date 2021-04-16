import React from 'react';

var courtFeatures = {
    courtConditions:['Bad', 'Playable', 'Good', 'Prestine'],
    meshTypes:['No Mesh', 'Fabric', 'Chain'],
    backboardTypes: ['Metal', 'Glass'],
    lighting:['No Lights', 'Dimly Lit', 'Lots of Light'],
    parking:['No Parking', 'Street Parking', 'Parking Lot'],
    hasThreePointLine:['No', 'Yes']
}
export const CourtFeaturesContext = React.createContext(courtFeatures);