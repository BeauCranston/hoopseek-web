import React, {useState, useEffect, useContext } from 'react';
import $ from 'jquery';
import {Container, Row, Col, Button, Modal, Alert} from 'react-bootstrap';
import {Marker, Circle} from '@react-google-maps/api'
import {GoogleMapWithApiKey, HoopseekMarker, CourtFeatureInput} from '../components/Hoopseek-Map-Components/Hoopseek-Map-Components';
import FormControlWithLabel from '../components/FormControlWithLabel/FormControlWithLabel';
import { useInputWithTimeout, useMapCoordinateDistance} from '../components/hooks';
import {CourtFeaturesContext} from '../contexts/courtFeatures-context'
import {UserLocationContext} from '../contexts/userLocation-context'
import '../styles/map.scss';
import userLocationIcon from '../media/hoopseek/user-location.png'
function MapPage(props){
    var initalRadiusValue = 15;
    var inputTimeout = 1000;
    var radiusMin = 1;
    var radiusMax = 30;
    var zoomLevel = 11;
    //the user's location which was determined when the app opened.
    const userLocation = useContext(UserLocationContext);
    //radius of circle in KM. Update radius sets the radius state but with a specified timeout period to reduce unnecessary renders.
    const [radius, updateRadius] = useInputWithTimeout(inputTimeout, initalRadiusValue);
    //the courts that are obtained from an ajax call to the courts table in the postgres DB.
    const [courts, setCourts] = useState(null);
    //returns the center point state of the circle. Also returns a function to measure distance of a given coordinate to the center position
    const [center, setCenter, measureCoordinateDistance] = useMapCoordinateDistance(userLocation);
    //state for when user is adding a court
    const [isAdding, setIsAdding] = useState(false);
    //gets set when a user is adding a court and then clicks on a location which becomes the location of the new court
    const [lastClickedLocation, setLastClickedLocation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    //mapcuror changes to a pushpin win user is adding a new court
    const [mapCursor, setMapCursor] = useState();
    //alert for if location services are unavilable
    const [showLocationServicesAlert, setShowLocationServicesAlert] = useState(false);
    //keeps track of the court that is currently open so that only one court is open at a time
    const [openCourtId, setOpenCourtId] = useState(null); 
    //gets the courts that were saved from localStorage
    const checkSavedCourts = (court)=>{
        var savedCourts = JSON.parse(localStorage.getItem('savedCourts'));            
        if(savedCourts === null)
            return <HoopseekMarker key={court.court_id} courtData={court} isSaved={false} handleOpen={()=>{setOpenCourtId(court.court_id)}} openCourtId={openCourtId}/>
        //determine if the court being processed is included in the saved courts array and return a marker with the result being passed in as a prop
        var isSaved = savedCourts.some(savedCourt=> savedCourt.court_id === court.court_id);
        return <HoopseekMarker key={court.court_id} courtData={court} isSaved={isSaved} handleOpen={()=>{setOpenCourtId(court.court_id)}} openCourtId={openCourtId}/>
    }
    //a function that filters the courts that are out of range of the circle radius
    const filterOutOfRangeCourts = (courts)=>{
        //console.log(userLocation)
        return courts.filter(court=> measureCoordinateDistance({lat:court.latitude, lng:court.longitude}) < radius)
    }
    /**
     * when the map is clicked, check if the user is adding. 
     * If false then return, else setLastClickedLocation to the map event's latlng object
     * @param {*} event - event object passed in from map click
     */
    const tryAddMarker = (event)=>{
        console.log('is adding in tryaddmarker: ' + isAdding)
        if(isAdding === false){
            return;
        }
        console.log('about to set last clicked location')
        setLastClickedLocation(event.latLng);
        setShowModal(true);
    }
    //if center is null then location services are off and the alert needs to be shown
    const checkLocationServices = ()=>{
        var isLocationEnabled = center !== null
        //only show alert if location is NOT enabled
        setShowLocationServicesAlert(!isLocationEnabled);
        return isLocationEnabled;
    }
    //get the courts from the DB when the component mounts and if the query is successful
    useEffect(()=>{
        $.get('/hoopseekAPI/getCourts', (data)=>{
            if(data.success && checkLocationServices()){
                setCourts(filterOutOfRangeCourts(data.result));
            } 
        });  
    }, [radius, center])

    useEffect(()=>{
        isAdding ? setMapCursor('url(./push-pin.png), auto') : setMapCursor('default')
    },[isAdding])
    return(
        <Container fluid className='m-0 p-0'>
            <div className='d-flex justify-content-center'>
                <Alert className='text-center' show={showLocationServicesAlert} variant='danger'>Location Services are needed for the app to work!</Alert>
            </div>
            <GoogleMapWithApiKey containerStyle={{width:'100vw', height:'90vh'}} center={center} zoom={zoomLevel} onClick={tryAddMarker} cursor={mapCursor}>
                {isAdding === false &&
                    <Circle center={center} radius={radius * 1000} options={{strokeColor:'#E43F5A', fillColor:'#162447'}}/>
                }            
                <Marker position={center} icon={userLocationIcon}/>
                {courts !== null &&
                // render courts and return markers
                    courts.map((court)=>{      
                        return checkSavedCourts(court);
                    })                  
                }
            </GoogleMapWithApiKey>              
            <div className='navigation-info bg-secondary text-primary text-center'>
                <Container fluid className='navigation-info-items' >
                    <h3>Navigation Info</h3>
                    <Row>
                        <Col className='col-8 offset-2 col-md-12 offset-md-0 my-4'>
                            <FormControlWithLabel className='slider bg-primary mt-2 mx-auto w-100' type='range' min={radiusMin} max={radiusMax}label={'Search Radius'} onChange={updateRadius} />
                        </Col>
                    </Row>
                    <h4>{radius}km</h4>
                    <Row className='mt-2 mt-md-5'>
                        <Col>
                            <Button onClick={()=>{
                                setIsAdding(true); 
                                console.log('isAdding==true');
                            
                            }}>Add Court</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
            {lastClickedLocation !== null && showModal == true &&
                <AddCourtModal courts={courts} setCourts={setCourts} latLng={lastClickedLocation} showModal={showModal} setShowModal={setShowModal} setIsAdding={setIsAdding}/>
            }
            
        </Container>
        
    )
}

/**
 * A component modal that adds a new court to the map.
 * The modal is rendered if the user is adding a court and clicks the map
 * @param {*} courts - the list of courts
 * @param {*} setCourts - update the list of courts to account for the new court
 * @param {*} latlng - latlng object to display where the court is being added on the map 
 * @param {*} setIsAdding - change the isAdding boolean to false whe nthe user exits the modal or successfully adds a new court 
 */
function AddCourtModal({courts, setCourts, latLng, showModal,setShowModal,setIsAdding}){
    console.log(showModal);
    var inputChangeTimeout = 300;
    const courtFeatures = useContext(CourtFeaturesContext);
    const [name, updateName] = useInputWithTimeout(inputChangeTimeout, '');
    const [area, updateArea] = useInputWithTimeout(inputChangeTimeout, '');
    const [courtCondition, setCourtCondition] = useState(courtFeatures.courtConditions[0]);
    const [hasThreePointLine, setHasThreePointLine] = useState(false);
    const [backboardType, setBackboardType] = useState(courtFeatures.backboardTypes[0]);
    const [meshType, setMeshType] = useState(courtFeatures.meshTypes[0]);
    const [lighting, setLighting] = useState(courtFeatures.lighting[0]);
    const [parking, setParking] = useState(courtFeatures.parking[0]);
    const [showValidationAlert, setShowValidationAlert] = useState(false)
    const [inputValid, setInputValid] = useState(false)
    //a function to add a new court to the list of courts and push the new court to the database
    const addCourt = ()=>{
        if(latLng !== null){
            //create court object to pass to db
            var newCourt ={
                park_name: name,
                area:area,
                latitude:latLng.lat(),
                longitude:latLng.lng(),
                court_condition: courtCondition,
                three_point_line: hasThreePointLine,
                backboard_type: backboardType,
                mesh_type: meshType,
                lighting: lighting,
                parking: parking
            }
            $.get('/hoopseekAPI/addCourt', newCourt, (response)=>{
                //if the court has been successfully added to the db then add the result to the list of courts
                if(response.success === true){
                    setCourts([...courts, response.result[0]]);
                }
            })
        } 
        //hide the modal and set isAdding to false
        handleHide();    
    }
    //hides the modal and stops user from adding a court
    const handleHide = ()=>{
        setShowModal(false); 
        setIsAdding(false);
    }
    //display appropriate alert after the add court form has been validated
    const renderValidationAlert =()=>{
        return inputValid ? 
        //on success
        <Alert variant='success' show={showValidationAlert}>Court Added</Alert> 
        : 
        //on fail
        <Alert variant='danger' show={showValidationAlert}>Can't leave are or name empty!</Alert>
    }
    //an effect that validates the input
    useEffect(()=>{
        if(area.length === 0 || name.length === 0){
            setInputValid(false);
        }
        else{
            setInputValid(true);
        }
    })
    return(
        <Modal show={showModal} onHide={handleHide}>
            <Modal.Header>Adding Court At ({latLng.lat()}, {latLng.lng()})</Modal.Header>
            <Modal.Body>
                <Container className='m-0 p-3'>
                    <FormControlWithLabel label={'Name:'} type='text' placeholder='Mohawk Outdoor Courts' onChange={(event)=>{updateName(event)}}/>
                    <FormControlWithLabel label={'Area:'} type='text' placeholder='Hamilton' onChange={(event)=>{updateArea(event)}}/>
                    <Container className='court-image-container my-3 p-0'>
                        <img src={`./courts/defaultCourt.png`}/>
                    </Container>
                    <Row className='my-3 text-center'>
                        <Col>
                            <CourtFeatureInput label={'Court Condition'} options={courtFeatures.courtConditions} initalValue={courtCondition} setState={setCourtCondition}/>
                        </Col>
                        <Col>
                            <CourtFeatureInput label={'3pt Line'} options={courtFeatures.hasThreePointLine} initalValue={hasThreePointLine ? 'Yes': 'No'} setState={(value)=>{ 
                                // ternary operator to pass boolean values into the state instead of the string 'Yes' / 'No'
                                value === 'Yes' ? setHasThreePointLine(true) : setHasThreePointLine(false) 
                            }}/>
                        </Col>
                    </Row>
                    <Row className='mb-3 text-center'>
                        <Col>
                            <CourtFeatureInput label={'Backboard Type'} options={courtFeatures.backboardTypes} initalValue={backboardType} setState={setBackboardType}/>
                        </Col>
                        <Col>
                            <CourtFeatureInput label={'Mesh Type'} options={courtFeatures.meshTypes} initalValue={meshType} setState={setMeshType}/>
                        </Col>
                    </Row>
                    <Row className='mb-3 text-center'>
                        <Col>
                            <CourtFeatureInput label={'Lighting'} options={courtFeatures.lighting} initalValue={lighting} setState={setLighting}/>
                        </Col>
                        <Col>
                            <CourtFeatureInput label={'Parking'} options={courtFeatures.parking} initalValue={parking} setState={setParking}/>
                        </Col>
                    </Row>
                    {showValidationAlert &&
                        renderValidationAlert()
                    }
                    <Button onClick={()=>{ 
                        //if the input is valid add the court
                        if(inputValid){
                            addCourt();
                        }
                        //show alert for 2 seconds whether valid or not              
                        setShowValidationAlert(true);
                        clearTimeout(timeout);
                        var timeout = setTimeout(()=>{
                            setShowValidationAlert(false);
                        },2000)    
                    }}>Add Court</Button>
                    
                </Container>
            </Modal.Body>
        </Modal>
    );
}

export default MapPage;