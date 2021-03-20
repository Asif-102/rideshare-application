import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import fakeData from '../FakeData/FakeData.json';
import GoogleMap from '../Destination/GoogleMap/GoogleMap'
import { Button } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { BsFillPersonFill } from 'react-icons/bs';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const Destination = () => {
    const { vehicleId } = useParams();
    const [vehicles, setVehicles] = useState([]);
    useEffect(() => {
        setVehicles(fakeData.vehicles);
    }, [])
    const data = vehicles.filter(info => info.id == vehicleId);
    const [ready, setReady] = useState(false);
    const [pick, setPick] = useState({
        from:'',
        to:''
    })
    console.log(pick);
    const handleBlur = (e) =>{
        let getInfo = true;
        if(getInfo){
            const newPick = {...pick};
            newPick[e.target.name] = e.target.value;
            setPick(newPick);
        }
    }
    const handleSubmit = () =>{
        setReady(!ready);
    }

    return (
        <div style={{ backgroundColor: 'white', height: '90vh' }}>
            {/* <h1>This is Destination {data[0]?.name}</h1>
            <img src={data[0]?.image} alt=""/> */}
            <Container>
                <Row>
                    <Col xs={12} md={4}>
                        {
                            !ready && <div>
                            <form onSubmit={handleSubmit}>
                                
                                <TextField type="text" id="standard-basic" onBlur={handleBlur} label="Pick From" name="from" required />
                                
                                <p><TextField type="text"  id="standard-basic" onBlur={handleBlur} label="Pick To" name="to" required /></p>
                                    <Button type="Submit">Search</Button>   
                            </form>
                        </div>
                        }{
                            ready && <div style={{backgroundColor:'lightgray'}}>
                                <div style={{backgroundColor:'skyblue'}}>
                                    <h3>{pick.from}</h3>
                                    <h4 style={{color:'white'}}>To</h4>
                                    <h3>{pick.to}</h3>
                                </div>
                                <p><img src={data[0]?.image} height="60px" alt=""/>
                                {' '}<span>{data[0]?.name}</span>{' '}<BsFillPersonFill/>4 {' '}${data[0]?.fare}</p><hr/>
                                <p><img src={data[0]?.image} height="60px" alt=""/>
                                {' '}<span>{data[0]?.name}</span>{' '}<BsFillPersonFill/>4 {' '}${data[0]?.fare}</p><hr/>
                                <p><img src={data[0]?.image} height="60px" alt=""/>
                                {' '}<span>{data[0]?.name}</span>{' '}<BsFillPersonFill/>4 {' '}${data[0]?.fare}</p>
                            </div>
                        }
                    </Col>
                    <Col style={{ height: '500px' }} xs={12} md={8} >
                        <GoogleMap />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default Destination;