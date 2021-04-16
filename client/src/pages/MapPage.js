import React, {useState, useEffect, useContext } from 'react';
import $ from 'jquery';
import {Container, Row, Col, Button, Modal} from 'react-bootstrap';
import {Marker, Circle} from '@react-google-maps/api'
import {GoogleMapWithApiKey, HoopseekMarker, CourtFeatureInput} from '../components/Hoopseek-Map-Components/Hoopseek-Map-Components';
import FormControlWithLabel from '../components/FormControlWithLabel/FormControlWithLabel';
import { useInputWithTimeout, useMapCoordinateDistance} from '../components/hooks';
import {CourtFeaturesContext} from '../contexts/courtFeatures-context'
import {UserLocationContext} from '../contexts/userLocation-context'
import '../styles/map.scss';
import userLocationIcon from '../media/hoopseek/user-location.png'

function MapPage(props){
    var initalRadiusValue = 10;
    var inputTimeout = 1000;
    //the user's location which was determined when the app opened.
    const userLocation = useContext(UserLocationContext);
    //radius of circle in KM. Update radius sets the radius state but with a specified timeout period to reduce unnecessary renders.
    const [radius, updateRadius] = useInputWithTimeout(inputTimeout, initalRadiusValue);
    //the courts that are obtained from an ajax call to the courts table in the postgres DB.
    const [courts, setCourts] = useState(null);
    //returns the center point state of the circle. Also returns a function to measure distance of a given coordinate to the center position
    const [center, setCenter, measureCoordinateDistance] = useMapCoordinateDistance(userLocation);
    //gets the courts that were saved from localStorage
    const [isAdding, setIsAdding] = useState(false)
    const [lastClickedLocation, setLastClickedLocation] = useState(null)
    
    const checkSavedCourts = (court)=>{
        var savedCourts = JSON.parse(localStorage.getItem('savedCourts'));            
        if(savedCourts === null)
            return <HoopseekMarker key={court.court_id} courtData={court} isSaved={false}/>
        //determine if the court being processed is included in the saved courts array and return a marker with the result being passed in as a prop
        var isSaved = savedCourts.some(savedCourt=> savedCourt.court_id === court.court_id);
        return <HoopseekMarker key={court.court_id} courtData={court} isSaved={isSaved}/>
    }
    const filterOutOfRangeCourts = (courts)=>{
        //console.log(userLocation)
        return courts.filter(court=> measureCoordinateDistance({lat:court.latitude, lng:court.longitude}) < radius)
    }
    const tryAddMarker = (event)=>{
        console.log('is adding in tryaddmarker: ' + isAdding)
        if(isAdding === false){
            return;
        }
        console.log('about to set last clicked location')
        setLastClickedLocation(event.latLng);
    }
    //get the courts from the DB when the component mounts and if the query is successful
    useEffect(()=>{
        $.get('/hoopseekAPI/getCourts', (data)=>{
            if(center === null) return;
            if(data.success){
                setCourts(filterOutOfRangeCourts(data.result));
            } 
                 
            //console.log(data);
        });  
    }, [radius, center])
    useEffect(()=>{console.log(lastClickedLocation)}, [lastClickedLocation])

    return(
        <Container fluid className='m-0 p-0'>
            <GoogleMapWithApiKey containerStyle={{width:'100vw', height:'90vh'}} center={center} zoom={10} onClick={tryAddMarker}>
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
                <Container fluid className='navigation-info-items'>
                    <h3>Navigation Info</h3>
                    <Row>
                        <Col className='col-4 col-md-12 my-4'>
                            <FormControlWithLabel className='slider bg-primary mt-2' type='range' min={1} max={20}label={'Search Radius'} onChange={updateRadius} />
                        </Col>
                    </Row>
                    <h4>{radius}km</h4>
                    <Row>
                        <Col>
                            <Button onClick={()=>{setIsAdding(true); console.log('isAdding==true')}}>Add Court</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
            {lastClickedLocation !== null &&
                <AddCourtModal courts={courts} setCourts={setCourts} latLng={lastClickedLocation}/>
            }
            
        </Container>
        
    )
}

function AddCourtModal({courts, setCourts, latLng}){
    console.log(latLng);
    var inputChangeTimeout = 300;
    const courtFeatures = useContext(CourtFeaturesContext);
    const [name, updateName] = useInputWithTimeout(inputChangeTimeout, '');
    const [area, updateArea] = useInputWithTimeout(inputChangeTimeout, '');
    const [courtCondition, setCourtCondition] = useState(courtFeatures.courtConditions[0]);
    const [hasThreePointLine, setHasThreePointLine] = useState(courtFeatures.hasThreePointLine[0]);
    const [backboardType, setBackboardType] = useState(courtFeatures.backboardTypes[0]);
    const [meshType, setMeshType] = useState(courtFeatures.meshTypes[0]);
    const [lighting, setLighting] = useState(courtFeatures.lighting[0]);
    const [parking, setParking] = useState(courtFeatures.parking[0]);
    const [show, setShow] = useState(true)
    const addCourt = ()=>{
        console.log(latLng)
        if(latLng !== null){
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
                if(response.success === true){
                    setCourts([...courts, response.result[0]]);
                }
            })
        }     
    }
    return(
        <Modal show={show}>
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

                    <Button onClick={()=>{addCourt();}}>Add Court</Button>
                </Container>
            </Modal.Body>
        </Modal>
    );
}

export default MapPage;