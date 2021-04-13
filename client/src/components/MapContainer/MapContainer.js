
import React, { Component, useState, useEffect, useContext } from 'react';
import {CourtFeaturesContext} from '../../contexts/courtFeatures-context'
import {Container, Row, Col, Button, FormControl, FormLabel} from 'react-bootstrap'
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import $ from 'jquery';
import courtIcon from '../../media/hoopseek/push-pin.png'
export class GoogleMapWithApiKey extends Component {
  render() {
      console.log('map re-rendered')
    return (
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLEMAPSAPIKEY}
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

function CourtFeatureInput({options, initalValue, label, setState}){
                                
    return(
        <div>
            <FormLabel>{label}</FormLabel>
            <FormControl as="select" defaultValue={initalValue}>
                {options.map((option)=>{ return <option value={option} key={option} onChange={(event)=>{setState(event.target.value)}}>{option}</option>})}
            </FormControl>
        </div>
        
    );
}   

export function HoopseekMarker({courtData}){
    const [isOpen, setIsOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const [courtCondition, setCourtCondition] = useState(courtData.court_condition);
    const [hasThreePointLine, setHasThreePointLine] = useState(courtData.three_point_line);
    const [backboardType, setBackboardType] = useState(courtData.backboard_type);
    const [meshType, setMeshType] = useState(courtData.mesh_type);
    const [lighting, setLighting] = useState(courtData.lighting);
    const [parking, setParking] = useState(courtData.parking);
    const toggleOpen = ()=>{setIsOpen(!isOpen)}
    const toggleEditing = ()=>{setIsEditing(!isEditing)}
    const courtFeatures = useContext(CourtFeaturesContext);

    return(       
        <Marker position={{lat:parseFloat(courtData.latitude), lng:parseFloat(courtData.longitude)}} icon={courtIcon} onClick={()=>{toggleOpen()}}>
            {isOpen === true &&
            //options={{boxClass:'bg-light border border-dark', boxStyle:{width:'150px', height:'200px'}, pixelOffset:{}}}
                <InfoWindow>
                    <Container className='m-0 p-3' style={{width:'500px', height:'400px'}}>
                        <h2>{courtData.park_name}</h2>
                        <Row className='mb-3'>
                            <Col>
                                <CourtFeatureInput label={'Court Condition'} options={courtFeatures.courtCondition} initalValue={courtCondition} setState={setCourtCondition}/>
                            </Col>
                            <Col>
                                <FormLabel>3pt Line</FormLabel >
                                <FormControl as="select" defaultValue={courtData.three_point_line === true ? 'Yes':'No'}>
                                    {courtFeatures.threePointLine.map((option)=>{ return <option value={option} key={option} onChange={(event)=>{setCourtCondition(event.target.value)}}>{option}</option>})}
                                </FormControl>

                            </Col>

                        </Row>
                        <Row className='mb-3'>
                            <Col>
                                <FormLabel>Backboard Type</FormLabel>
                                <FormControl as="select" defaultValue={courtData.backboard_type}>
                                    {courtFeatures.backboardType.map((option)=>{ return <option value={option} key={option} onChange={(event)=>{setCourtCondition(event.target.value)}}>{option}</option>})}
                                </FormControl>
                            </Col>
                            <Col>
                                <FormLabel>Mesh Type</FormLabel>
                                <FormControl as="select" defaultValue={courtData.mesh_type}>
                                    {courtFeatures.meshType.map((option)=>{ return <option value={option} key={option} onChange={(event)=>{setCourtCondition(event.target.value)}}>{option}</option>})}
                                </FormControl>
                            </Col>

                        </Row>
                        <Row className='mb-3'>
                            <Col>
                                <FormLabel>Lighting</FormLabel>
                                <FormControl as="select" defaultValue={courtData.lighting}>
                                    {courtFeatures.lighting.map((option)=>{ return <option value={option} key={option}>{option}</option>})}
                                </FormControl>
                            </Col>
                            <Col>
                                <FormLabel>Parking</FormLabel>
                                <FormControl as="select" defaultValue={courtData.parking}>
                                    {courtFeatures.parking.map((option)=>{ return <option value={option} key={option}>{option}</option>})}
                                </FormControl>
                            </Col>
                        </Row>
                        <div className='w-100 d-flex justify-content-center mt-5'>
                            <Button onClick={toggleEditing}>{isEditing === false ? 'Edit Court Features' : 'Save'}</Button>
                        </div>
                        
                    </Container>
                </InfoWindow>            
            }

        </Marker>
        
    )
    
}

export default GoogleMapWithApiKey;