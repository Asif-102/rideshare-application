import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import fakeData from '../FakeData/FakeData.json';
import GoogleMap from '../Destination/GoogleMap/GoogleMap'


const Destination = () => {
    const {vehicleId} = useParams();
    const [vehicles, setVehicles] = useState([]);
    useEffect(()=>{
        setVehicles(fakeData.vehicles);
    },[])
    const data = vehicles.filter(info => info.id == vehicleId);
    return (
        <div style={{backgroundColor:'white',height:'90vh'}}>
            {/* <h1>This is Destination {data[0]?.name}</h1>
            <img src={data[0]?.image} alt=""/> */}
            <Container>
                <Row>
                    <Col xs={12} md={4}>
                        xs=12 md=8
                    </Col>
                    <Col style={{height:'500px'}} xs={12} md={8} >
                            <GoogleMap/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default Destination;