import {Container, Button, Row, Col} from 'react-bootstrap'
import '../styles/about.scss'
import playingBaketballVideo from '../media/hoopseek/about-video.mp4'
function AboutPage(){
    
    return(
        <Container fluid className='page m-0'>
            <video className='fullscreen-video' autoPlay loop muted>
                <source src={playingBaketballVideo} type="video/mp4"/>
                
            </video>
            <Container fluid className='p-0'>
                <Row>
                    <Col className='bg-light text-secondary mt-5 p-5 ml-5' md={{span:6}}>
                        <header>
                        <h1 className='title mb-4'>About</h1>
                        
                        <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                            Cum molestiae ad modi eaque corporis debitis quidem ipsam dolorum quam! 
                            Consequuntur deleniti cumque iusto eum adipisci sed similique ipsam quasi voluptas!
                        </p>
                        <br/>
                        <p> 
                            Nostrum, similique error fugiat odit minima doloremque cum, quidem debitis voluptas consequatur rem autem consectetur dolores, maiores provident quae laborum sit quisquam.
                            Obcaecati atque sed vero, ut quaerat laudantium reiciendis quo aspernatur.
                            Dolores pariatur voluptates vitae et aliquid eum aliquam deleniti, vel nisi aperiam eius iure. 
                            Laboriosam impedit expedita aperiam ullam alias deserunt iste sit et nemo nostrum exercitationem ut at amet aut quos facilis similique nihil fugiat, 
                            ad vitae natus quis porro temporibus saepe! Consequatur, ad necessitatibus autem sint aliquam quia rem ullam.
                        </p>
                        <div className='w-100 d-flex justify-content-between'>
                            <Button className='p-3 mt-4' variant='primary'>Start seeking!</Button>
                        </div>
                        
                        

                        
                        
                        
                    </header>
                    </Col>
                </Row>
                
            </Container>
           
        </Container>
    )
}

export default AboutPage;