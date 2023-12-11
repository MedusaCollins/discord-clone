import { useState } from 'react';

import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

import { io } from "socket.io-client";

export default function Login(props) {
    const { setLogin, setUser } = props;

    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const socket = io(process.env.REACT_APP_SERVER);
        setSocket(socket);
        return () => {
            socket.disconnect();
        };
    }
    , []);
    return(
        <div>
            <img src={process.env.REACT_APP_IMG} alt="" />
            <h1 className='text-white font-bold text-2xl mb-6'>{`Welcome to ${process.env.REACT_APP_NAME}`}</h1>
        <GoogleLogin
        theme='filled_blue'
        shape='circle'
        onSuccess={response => {
            var responseDecoded = jwtDecode(response.credential);
            setLogin(true);
            socket.emit('login', responseDecoded);
            setUser({
                name: responseDecoded.name,
                email: responseDecoded.email,
                imageUrl: responseDecoded.picture
            });
        }}
        onFailure={response => {
            console.log('Login Failed');
            console.log(response);
        }}
        />
        </div>
    );
}