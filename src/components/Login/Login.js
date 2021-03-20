import './Login.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from '../Login/Firebase.Config';
import { FcGoogle } from 'react-icons/fc';
import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

function Login() {
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        success: false
    });
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    // Sign in section
    const handleSignIn = () => {
        firebase
            .auth()
            .signInWithPopup(googleProvider)
            .then(res => {
                const user = res.user;
                const { displayName, email, photoURL } = user;
                const signIn = {
                    isSignedIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL
                };
                setUser(signIn);
                setLoggedInUser(signIn);
                history.replace(from);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
                console.log(errorCode, errorMessage, email, credential);
            });
    }
    // Sign out section
    const handleSignOut = () => {
        firebase.auth().signOut().then(res => {
            const signOut = {
                isSignedIn: false,
                name: '',
                email: '',
                photo: '',
                error: ''
            };
            setUser(signOut);
        }).catch(error => {
            // An error happened.
        });
    }

    // Submit section
    const handleBlur = (e) => {
        let isFeildValid = true;
        if (e.target.name === 'email') {
            isFeildValid = /\S+@\S+\.\S+/.test(e.target.value);
        }
        if (e.target.name === 'password') {
            const isPasswordValid = e.target.value.length > 6;
            const passwordHasNumber = /\d{1}/.test(e.target.value);
            isFeildValid = isPasswordValid && passwordHasNumber;
        }
        if (isFeildValid) {
            const newUserInfo = { ...user };
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo);
        }
    }
    const handleSubmit = (e) => {
        // console.log(user.email, user.password);
        // for old user
        if (newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    updateUserName(user.name);
                })
                .catch((error) => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUser(newUserInfo);
                    // ..
                });
        }
        // for new user
        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    setLoggedInUser(newUserInfo);
                    history.replace(from);
                    console.log('sign in user info', res.user);
                })
                .catch((error) => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUser(newUserInfo);
                });
        }

        e.preventDefault();//for stop reload
    }
    // updated a user's profile
    const updateUserName = name => {
        var user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name
        }).then(function () {
            console.log('user name updated successfully');
        }).catch(function (error) {
            console.log(error);
        });
    }

    return (
        <div className="Login">
            {
                !user.isSignedIn ? <button onClick={handleSignIn} className="btn btn-light"><FcGoogle /> Sign in</button>
                    : <button onClick={handleSignOut} className="btn btn-light"><FcGoogle /> Sign Out</button>
            }
            {
                user.isSignedIn && <div>
                    <p>Welcome, {user.name}</p>
                    <p>Your email: {user.email}</p>
                    <img src={user.photo} alt="" />
                </div>
            }

            <h1>Our own Authentication</h1>
            <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" />
            <label htmlFor="newUser">New User Sign up</label>
            <form onSubmit={handleSubmit}>
                {
                    newUser && <input type="text" onBlur={handleBlur} name="name" placeholder="Your name" required/>
                }
                <br />
                <input type="email" onBlur={handleBlur} name="email" placeholder="Your Email address" required />
                <br />
                <input type="password" onBlur={handleBlur} name="password" placeholder="Your Password" required />
                <br />
                <input type="submit" value={newUser ? 'Sign up' : 'Sign in'} className="btn btn-primary" />
            </form>
            <p style={{ color: 'red' }}>{user.error}</p>
            {
                user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'Logged In'} successfully</p>
            }
        </div>
    );
}

export default Login;