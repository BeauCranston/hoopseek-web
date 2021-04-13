import React, {useState, useEffect, useContext } from 'react';
import $ from 'jquery';
import {Container, Button, Row, Col, Alert} from 'react-bootstrap';
import GoogleMapWithApiKey from '../components/MapContainer/MapContainer';
import FormControlWithLabel from '../components/FormControlWithLabel/FormControlWithLabel';
import { useInputWithTimeout, useNavigator, useReverseGeocoding} from '../components/hooks';
import {UserLocationContext} from '../contexts/userLocation-context'
import {Marker} from '@react-google-maps/api'
import '../styles/map.scss';
function MapPage(props){
    const [courts, setCourts] = useState(null);
    const [radius, updateRadius] = useInputWithTimeout(2000, 15);
    const userLocation = useContext(UserLocationContext);
    console.log(userLocation)
    useEffect(()=>{
        if(courts === null){
            $.get('/hoopseekAPI/getCourts', (data)=>{
                console.log(data)
            });
        }
    }, [courts])
    return(
        <Container fluid className='m-0 p-0'>
            <GoogleMapWithApiKey containerStyle={{width:'100vw', height:'90vh'}} center={userLocation} zoom={10}>
                <Marker position={userLocation}/>
            </GoogleMapWithApiKey>    
            
            <div className='navigation-info bg-secondary text-primary'>
                <Container fluid className='navigation-info-items'>
                    <h2>Navigation Info</h2>
                    <Row>
                        <Col className='col-4 col-md-12 '>
                            <FormControlWithLabel className='mb-3' type='range' label={'Search Radius'} onChange={updateRadius} />
                        </Col>

                    </Row>
                                            
                    
                    <h2>{radius}km</h2>
                </Container>
                
            </div>
            
        </Container>
        
    )
}


export default MapPage;