import React, {useState, useEffect, useContext } from 'react';
import $ from 'jquery';
import {Container, Row, Col} from 'react-bootstrap';
import {GoogleMapWithApiKey, HoopseekMarker} from '../components/MapContainer/MapContainer';
import FormControlWithLabel from '../components/FormControlWithLabel/FormControlWithLabel';
import { useInputWithTimeout} from '../components/hooks';
import {UserLocationContext} from '../contexts/userLocation-context'
import {Marker} from '@react-google-maps/api'
import '../styles/map.scss';
import userLocationIcon from '../media/hoopseek/user-location.png'

function MapPage(props){
    const [radius, updateRadius] = useInputWithTimeout(2000, 10);
    const [courtData, setCourtData] = useState(null);
    const userLocation = useContext(UserLocationContext);
    useEffect(()=>{
        $.get('/hoopseekAPI/getCourts', (data)=>{
            if(data.success) setCourtData(data.result); 
            console.log(data);
        });
        
    }, [])
    return(
        <Container fluid className='m-0 p-0'>
            <GoogleMapWithApiKey containerStyle={{width:'100vw', height:'90vh'}} center={userLocation} zoom={10}>
                <Marker position={userLocation} icon={userLocationIcon}/>
                {courtData !== null &&
                    courtData.map((court)=>{
                        return <HoopseekMarker key={court.court_id} courtData={court}/>
                    })
                    
                }
                
            </GoogleMapWithApiKey>    
            
            <div className='navigation-info bg-secondary text-primary'>
                <Container fluid className='navigation-info-items'>
                    <h2>Navigation Info</h2>
                    <Row>
                        <Col className='col-4 col-md-12 '>
                            <FormControlWithLabel className='mb-3' type='range' min={1} max={20}label={'Search Radius'} onChange={updateRadius} />
                        </Col>

                    </Row>
                                            
                    
                    <h2>{radius}km</h2>
                </Container>
                
            </div>
            
        </Container>
        
    )
}


export default MapPage;