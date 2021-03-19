import React, { useState } from 'react';

const Login = () => {
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignedIn:false,
        name:'',
        email:'',
        password:''
    })
    return (
        <div style={{backgroundColor:'white',height:'90vh'}}>
            <h1>This is Login</h1>
        </div>
    );
};

export default Login;