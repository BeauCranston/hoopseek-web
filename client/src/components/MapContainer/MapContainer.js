
import React, { Component, useState, useEffect } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import $ from 'jquery';
class GoogleMapWithApiKey extends Component {
  render() {
      console.log('map re-rendered')
    return (
      <LoadScript
        googleMapsApiKey={'dookie key'}
      >
        <GoogleMap
          mapContainerStyle={this.props.containerStyle}
          center={this.props.center}
          zoom={this.props.zoom}
        >
            {this.props.children}
        </GoogleMap>
      </LoadScript>
    )
  }
}

// export function Geocoder({coords}){


//     return(

//     );
// }
export default GoogleMapWithApiKey;