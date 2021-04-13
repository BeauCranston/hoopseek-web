
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
            <FormControl as="select" defaultValue={initalValue} onChange={(event)=>{setState(event.target.value)}}>
                {options.map((option)=>{ return <option value={option} key={option}>{option}</option>})}
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
    const courtFeatures = useContext(CourtFeaturesContext);
    const toggleOpen = ()=>{setIsOpen(!isOpen)}
    const toggleEditing = ()=>{setIsEditing(!isEditing)}
    const updateCourtFeatures = ()=>{
        console.log('updating court features')
        var updatedCourtFeatures = {
            court_id: courtData.court_id,
            court_condition: courtCondition,
            three_point_line: hasThreePointLine,
            backboard_type: backboardType,
            mesh_type: meshType,
            lighting: lighting,
            parking: parking
        }
        var hasUpdated = Object.entries(updatedCourtFeatures).some(([key, value])=> value !== courtData[key]);
        console.log(hasUpdated)
        if(hasUpdated === true){
            $.get('/hoopseekAPI/updateCourt', updatedCourtFeatures, (response)=>{
                console.log('Getting Response')
                console.log(response);
                toggleEditing();
            });
        }
    }

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
                                <CourtFeatureInput label={'3pt Line'} options={courtFeatures.threePointLine} initalValue={hasThreePointLine ? 'Yes': 'No'} setState={setHasThreePointLine}/>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col>
                                <CourtFeatureInput label={'Backboard Type'} options={courtFeatures.backboardType} initalValue={backboardType} setState={setBackboardType}/>
                            </Col>
                            <Col>
                                <CourtFeatureInput label={'Mesh Type'} options={courtFeatures.meshType} initalValue={meshType} setState={setMeshType}/>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col>
                                <CourtFeatureInput label={'Lighting'} options={courtFeatures.lighting} initalValue={lighting} setState={setLighting}/>
                            </Col>
                            <Col>
                                <CourtFeatureInput label={'Parking'} options={courtFeatures.parking} initalValue={parking} setState={setParking}/>
                            </Col>
                        </Row>
                        <div className='w-100 d-flex justify-content-center mt-5'>
                            <Button onClick={()=>{
                                console.log('clicked')
                                isEditing === false ? toggleEditing() : updateCourtFeatures();

                            }}>{isEditing === false ? 'Edit Court Features' : 'Save Changes'}</Button>
                        </div>
                        
                    </Container>
                </InfoWindow>            
            }

        </Marker>
        
    )
    
}

export default GoogleMapWithApiKey;