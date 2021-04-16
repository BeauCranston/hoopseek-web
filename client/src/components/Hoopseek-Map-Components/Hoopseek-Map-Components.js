
import React, { Component, useState, useContext} from 'react';
import {CourtFeaturesContext} from '../../contexts/courtFeatures-context'
import {Container, Row, Col, Button, FormControl, FormLabel} from 'react-bootstrap'
import { GoogleMap, InfoWindow, LoadScript, Marker} from '@react-google-maps/api';
import $ from 'jquery';
import courtIcon from '../../media/hoopseek/push-pin.png'
import './MapContainer.scss';
/**
 * a google maps container component that accepts a google maps api key and then loads the map with whatever children specified upon invoking.
 */
export class GoogleMapWithApiKey extends Component {
    constructor(props) {
        super(props);
    }
    onClick = (event)=>{
        this.props.onClick(event)
    }
  render() {
        console.log('map re-rendered')
        return (
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLEMAPSAPIKEY}>   
                <GoogleMap
                mapContainerStyle={this.props.containerStyle}
                center={this.props.center}
                zoom={this.props.zoom}
                onClick={this.onClick}
                options={{draggableCursor:this.props.cursor}}>
                    {this.props.children}
                </GoogleMap>
            </LoadScript>
        )
  }
}

/**
 * a presentaional component that represents a court feature input. This is just a select, with options obtained by the CourtFeaturesContext object.
 * When the value fo the select changes the state that is attached to the component will update through the setState function that is passed in.
 * @param {*} param0 
 */
export function CourtFeatureInput({options, initalValue, label, setState, showInput = true}){                               
    return(
        <div>
            <FormLabel>{label}</FormLabel>
            {showInput === true ?
                <FormControl as="select" defaultValue={initalValue} onChange={(event)=>{setState(event.target.value)}}>
                    {options.map((option)=>{ return <option value={option} key={option}>{option}</option>})}
                </FormControl>
                :<p>{initalValue}</p>
            }
        </div>
        
    );
}   

export function HoopseekMarker({courtData, isSaved}){
    //determines if the marker's info window is open
    const [isOpen, setIsOpen] = useState(false);
    const courtPosition = {lat:parseFloat(courtData.latitude), lng:parseFloat(courtData.longitude)};
    //get's the court name and modifies it to the name of the image file associated with the court (stored in public folder).
    return(     
        // place marker at the positon gathered from the courtData object  
        <Marker position={courtPosition} icon={courtIcon} onClick={()=>{setIsOpen(!isOpen)}}>
            {isOpen === true &&
                <InfoWindow>
                    <HoopseekInfoWindow courtData={courtData} isSaved={isSaved}/>
                </InfoWindow>            
            }
        </Marker>      
    )
    
}


export function HoopseekInfoWindow({courtData, isSaved}){
    //gets court feature options from global context
    const courtFeatures = useContext(CourtFeaturesContext);
    const [isEditing, setIsEditing] = useState(false);
    //determines if the court has been saved and allows for unsaving and re-saving
    const [saved, setSaved] = useState(isSaved);
    // court data states
    const [courtCondition, setCourtCondition] = useState(courtData.court_condition);
    const [hasThreePointLine, setHasThreePointLine] = useState(courtData.three_point_line);
    const [backboardType, setBackboardType] = useState(courtData.backboard_type);
    const [meshType, setMeshType] = useState(courtData.mesh_type);
    const [lighting, setLighting] = useState(courtData.lighting);
    const [parking, setParking] = useState(courtData.parking);
    const getCourtImage = (courtName)=>{
        if(courtName.includes("Park"))
            return courtName.replaceAll(' ', '-') + '.PNG';
        return 'defaultCourt.png'
    }
    /**
     * Called on save court button click. 
     * Gets savedCourts from localStorage by parsing result to JSON. 
     * If the court is already saved filter it out of the array to remove it.
     * Spread and append court to the savedCourts array if the court has not been saved
     */
    const updateCourtStorage = ()=>{       
        var savedCourts = JSON.parse(localStorage.getItem('savedCourts'))??[];
        var newCourtArray = saved === false ? [...savedCourts, courtData] : savedCourts.filter( savedCourt => savedCourt.court_id != courtData.court_id);
        localStorage.setItem('savedCourts', JSON.stringify(newCourtArray));
        //toggle the saved state
        setSaved(!saved);
    }
    //sends an ajax call to update the court if a feature has been modified. Invoked when 'Save Changes' button is clicked.
    const updateCourtFeatures = ()=>{
        //create court object with the states as values
        var updatedCourtFeatures = {
            court_id: courtData.court_id,
            court_condition: courtCondition,
            three_point_line: hasThreePointLine,
            backboard_type: backboardType,
            mesh_type: meshType,
            lighting: lighting,
            parking: parking
        }
        //compare new object to the object that was passed in
        var hasUpdated = Object.entries(updatedCourtFeatures).some(([key, value])=> value !== courtData[key]);
        //if it was updated then send ajax call to backend
        if(hasUpdated === true){
            $.get('/hoopseekAPI/updateCourt', updatedCourtFeatures, (response)=>{
                console.log('Getting Response')
                console.log(response);
                
            });
        }
        //toggle is editing state
        setIsEditing(!isEditing);
    }
    return(
        
        <Container className='m-0 p-3 hoopseek-map-info-window'>
            <h2>{courtData.park_name}</h2>
            <strong style={{fontSize:'1.2em'}} className='my-3'>{courtData.area}</strong>
            <Container className='court-image-container my-3 p-0'>
                <img src={`./courts/${getCourtImage(courtData.park_name)}`}/>
            </Container>
            <Row className='my-3 text-center'>
                <Col>
                    <CourtFeatureInput label={'Court Condition'} options={courtFeatures.courtConditions} initalValue={courtCondition} setState={setCourtCondition} showInput={isEditing}/>
                </Col>
                <Col>
                    <CourtFeatureInput label={'3pt Line'} options={courtFeatures.hasThreePointLine} initalValue={hasThreePointLine ? 'Yes': 'No'} setState={(value)=>{ 
                        // ternary operator to pass boolean values into the state instead of the string 'Yes' / 'No'
                        value === 'Yes' ? setHasThreePointLine(true) : setHasThreePointLine(false) 
                    }} showInput={isEditing}/>
                </Col>
            </Row>
            <Row className='mb-3 text-center'>
                <Col>
                    <CourtFeatureInput label={'Backboard Type'} options={courtFeatures.backboardTypes} initalValue={backboardType} setState={setBackboardType} showInput={isEditing}/>
                </Col>
                <Col>
                    <CourtFeatureInput label={'Mesh Type'} options={courtFeatures.meshTypes} initalValue={meshType} setState={setMeshType} showInput={isEditing}/>
                </Col>
            </Row>
            <Row className='mb-3 text-center'>
                <Col>
                    <CourtFeatureInput label={'Lighting'} options={courtFeatures.lighting} initalValue={lighting} setState={setLighting} showInput={isEditing}/>
                </Col>
                <Col>
                    <CourtFeatureInput label={'Parking'} options={courtFeatures.parking} initalValue={parking} setState={setParking} showInput={isEditing}/>
                </Col>
            </Row>
            <div className='w-100 d-flex flex-column justify-content-center mt-5'>
            {/* if editing is false then changle the isEditing state only, otherwise call update the court in the db */}
                <Button className='mb-4' onClick={()=>{isEditing === false ? setIsEditing(!isEditing) : updateCourtFeatures();}}>
                    {isEditing === false ? 'Edit Court Features' : 'Save Changes'}
                </Button>

                {isEditing === false &&
                    // change the style and text of the button based on the saved state
                    <Button variant={saved === false ? 'outline-primary' : 'secondary'} onClick={()=>{updateCourtStorage()}}>
                        {saved === false ? 'Save Court':'Saved'}
                    </Button>
                }                           
            </div>
        </Container>    
    )
}
export default GoogleMapWithApiKey;