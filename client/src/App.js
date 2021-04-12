

import {Switch, Route, Link} from 'react-router-dom'
import React, {useState, useEffect } from 'react';
import { Container, Col, Row, Navbar,Nav, Alert } from 'react-bootstrap'
import {UserLocationContext} from './contexts/userLocation-context'
import { useInputWithTimeout, useNavigator, useReverseGeocoding} from './components/hooks';
import AboutPage from './pages/AboutPage'
import MapPage from './pages/MapPage'
import SavedPage from './pages/SavedPage'
import logo from './media/hoopseek/hoopseek-logo.png'
import fb from './media/company-logos/facebook-logo.png'
import insta from './media/company-logos/instagram.png'
import twitter from './media/company-logos/twitter.png'
function App() {
    const [userLocation, feedback, allowed] = useNavigator();
    const [alertShow, setAlertShow] = useState(false);
    useEffect(()=>{
        var alertTime = 2000;
        if(allowed !== null){
            clearTimeout(timeout)
            setAlertShow(true);
            var timeout = setTimeout(()=>{
                setAlertShow(false)
            }, alertTime)
        }
        
    }, [allowed])
  return (
    <div className="App">
        <UserLocationContext.Provider value={userLocation}>
            <Navbar bg='secondary' expand="lg">
                <Navbar.Brand><Link to='/about'><img src={logo} height='50px'/></Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Link className='navbar-item' to='/about'>about</Link>
                        <Link className='navbar-item' to='/hoopseekmap'>map</Link>
                        <Link className='navbar-item' to='/saved'>saved</Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Alert show={alertShow} className='w-25 mx-auto text-center' variant={allowed ? 'success' : 'danger'}>{feedback}</Alert>
            <Switch>          
                <Route path="/" exact render={props=> <AboutPage {...props} />}/>
                <Route path="/about" render={props=> <AboutPage {...props} />}/>
                <Route path="/hoopseekmap" render={props=> <MapPage {...props} />}/>
                <Route path="/saved" render={props=> <SavedPage {...props} />}/>
            </Switch>
            <footer className='footer'>
                <Container fluid className='bg-dark text-white p-4'>
                    <Row className='py-4'>
                        <Col md={{span:2, offset:1}}>
                            <h2 className='text-center mb-4'>Contact us</h2>
                            <Container className='d-flex flex-row justify-content-center'>
                                <img className='mr-4' src={fb} height='48px'/>
                                <img className='mr-4' src={insta} height='48px'/>
                                <img src={twitter} height='48px'/>
                            </Container>
                        </Col>
                        <Col md={{span:4, offset:4}} className='d-flex flex-column text-center'>
                            <h2>Navigate</h2>
                            <Link className='mb-2 text-white' to='/about'>About</Link>
                            <Link className='mb-2 text-white' to='/hoopseekmap'>Map</Link>
                            <Link  className='text-white' to='/saved'>Saved</Link>
                        </Col>

                    </Row>
                    <Row>
                        <Col className='text-center'>
                            <small>hoopseek™ Copyright 2021 All Rights Reserved</small>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </UserLocationContext.Provider>

            
    </div>
  );
}

export default App;
