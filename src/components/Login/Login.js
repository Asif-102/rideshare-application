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
    const [user, setUser] = useContext(UserContext);
    const [userInfo, setUserInfo] = useState({
        isSignedIn: false,
        displayName: '',
        emial: '',
        password: '',
        error: '',
        success: false
    });
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

    const handleBlur = (e) => {
        let isFieldValid = true;
        if (e.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
        }
        if (e.target.name === 'password') {
            const isPasswordValid = e.target.value.length > 6;
            const passwordHasNumber = /\d{1}/.test(e.target.value);
            isFieldValid = isPasswordValid && passwordHasNumber;
        }
        if (isFieldValid) {
            const newUserInfo = { ...userInfo };
            newUserInfo[e.target.name] = e.target.value;
            setUserInfo(newUserInfo);
        }
    }

    const handleSubmit = (e) => {
        if (newUser && userInfo.email && userInfo.password) {
            firebase.auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password)
                .then(res => {
                    const newUserInfo = { ...userInfo };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUserInfo(newUserInfo);
                   
                })
                .catch((error) => {
                    const newUserInfo = { ...userInfo };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUserInfo(newUserInfo);
                    // ..
                });
        }

        if (!newUser && userInfo.email && userInfo.password) {
            firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password)
                .then(res=> {
                    const newUserInfo = { ...userInfo };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUserInfo(newUserInfo);
                    setUser(res.user);
                    history.replace(from);
                })
                .catch((error) => {
                    const newUserInfo = { ...userInfo };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUserInfo(newUserInfo);
                });
        }

        e.preventDefault();
    }


    return (
        <div style={{ backgroundColor: 'white', height: '200vh' }}>
            <br />
            <form onSubmit={handleSubmit} style={formStyle}>
                {
                    !newUser ? <h3>Login</h3>
                        : <h3>Create an account</h3>
                }
                {
                    newUser && <TextField type="text" onBlur={handleBlur} id="standard-basic" label="Name" name="displayName" required />
                }
                <p><TextField type="email" onBlur={handleBlur} id="standard-basic" label="Email" name="email" required /></p>
                <p><TextField type="password" onBlur={handleBlur} id="standard-basic" label="Password" name="password" required /></p>
                {/* {
                    !newUser && <p><TextField type="password" onBlur={handleBlur} id="standard-basic" label="Confirm Password" name="confirmPassword" required /></p>
                } */}
                {
                    newUser ? <Button type="Submit">Create an account</Button>
                        : <Button type="Submit">Login</Button>
                }
                <br />
                {
                    newUser ? <p style={{ textAlign: 'center' }}>Already have an account?<span onClick={() => setNewUser(!newUser)} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>Login</span></p>
                        : <p style={{ textAlign: 'center' }}>Don't have an account?<span onClick={() => setNewUser(!newUser)} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>Create an account</span></p>
                }
            </form>
            <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'red' }}>{userInfo.error}</p>
                {
                    userInfo.success && <p style={{ color: 'green' }}>User {newUser?'created':'Logged In'} successfully</p>
                }
                <p style={{ color: 'orange' }}>Or</p><hr />
                <Button onClick={handleGoogleSignIn} variant="light" size="lg"><FcGoogle /> Continue with Google</Button>
            </div>
        </div>
    );
};

export default Login;