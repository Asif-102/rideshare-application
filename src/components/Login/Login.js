import { Button } from 'react-bootstrap';
import React, { useContext, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './Firebase.Config';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const Login = () => {
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    const classes = useStyles();

    const [newUser, setNewUser] = useState(false);
    const [user,setUser] = useContext(UserContext);
    const formStyle = {
        width: '40%',
        border: '1px solid gray',
        margin: 'auto',
        padding: '10px'
    }

    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const handleGoogleSignIn = () => {
        firebase.auth()
            .signInWithPopup(googleProvider)
            .then((result) => {
                setUser(result.user);
                history.replace(from);
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
    }

    const handleSubmit = () =>{
        
    }


    return (
        <div style={{ backgroundColor: 'white', height: '200vh' }}>
            <br />
            <form onSubmit={handleSubmit} style={formStyle}>
                {
                    !newUser ? <h3>Create an account</h3>
                        : <h3>Login</h3>
                }
                {
                    !newUser && <TextField type="text" id="standard-basic" label="Name" name="name" required />
                }
                <p><TextField type="text" id="standard-basic" label="Email" name="email" required /></p>
                <p><TextField type="password" id="standard-basic" label="Password" name="password" required /></p>
                {
                    !newUser && <p><TextField type="password" id="standard-basic" label="Confirm Password" name="confirmPassword" required /></p>
                }
                {
                    !newUser ? <Button type="Submit">Create an account</Button>
                        : <Button type="Submit">Login</Button>
                }
                <br />
                {
                    !newUser ? <p style={{ textAlign: 'center' }}>Already have an account?<span onClick={() => setNewUser(!newUser)} style={{ color: 'blue', cursor: 'pointer' }}>Login</span></p>
                        : <p style={{ textAlign: 'center' }}>Don't have an account?<span onClick={() => setNewUser(!newUser)} style={{ color: 'blue', cursor: 'pointer' }}>Create an account</span></p>
                }
            </form>
            <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'orange' }}>Or</p><hr />
                <Button onClick={handleGoogleSignIn} variant="light" size="lg"><FcGoogle /> Continue with Google</Button>
            </div>
        </div>
    );
};

export default Login;