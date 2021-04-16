import {Container, Button, Row, Col, ListGroup,ListGroupItem} from 'react-bootstrap'

function SavedPage(props){
    var savedCourts = JSON.parse(localStorage.getItem('savedCourts'));
    return(
        <Container fluid className='page bg-secondary text-white p-5'>
            <h1 className='title text-center mb-5'>Saved Courts</h1>
            <ListGroup className='container'>
                {savedCourts !== null &&
                    savedCourts.map((court)=>{
                        return <SavedCourtListItem courtData={court}/>
                    })
                }
                
            </ListGroup>
        </Container>

    )
}

function SavedCourtListItem({courtData}){
    return(
        <ListGroupItem className='saved-court border border-primary bg-secondary p-3'>
            <Container>
                <Row className='d-flex flex-row align-items-center'>
                    <Col md={{span:3}}>
                        <h3 className='text-primary'>{courtData.park_name}</h3>
                        <strong>{courtData.area}</strong>
                    </Col>
                    <Col md={{span:7}}>
                        <Row>
                            <Col>
                                <label className='text-primary'>Court Condition:</label>
                                <p>{courtData.court_condition}</p>
                            </Col>
                            <Col>
                                <label className='text-primary'>Backboard Type:</label>
                                <p>{courtData.backboard_type}</p>
                            </Col>
                            <Col>
                                <label className='text-primary'>Lighting:</label>
                                <p>{courtData.lighting}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <label className='text-primary'>3PT Line:</label>
                                <p>{courtData.three_point_line ? 'Yes' : 'No'}</p>
                            </Col>
                            <Col>
                                <label className='text-primary'>Mesh Type:</label>
                                <p>{courtData.mesh_type}</p>
                            </Col>
                            <Col >
                                <label className='text-primary'>Parking:</label>
                                <p>{courtData.parking}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col className='d-flex justify-content-center' md={{span:2}}>
                        <Button variant="primary" size="lg">Go To Court</Button>
                    </Col>
                </Row>
            </Container>
        </ListGroupItem>
    );
}

export default SavedPage;