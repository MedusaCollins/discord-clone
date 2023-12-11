import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function Chat(props) {
    const user = props.props.user;
    const chatAreaRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_SERVER);
        setSocket(socket);
        socket.on("message", (data) => {
            console.log(data);
            setMessages((messages) => [...messages, data]);
        });
        // socket.on("login", (data) => {
        //     console.log(data);
        //     setMessages((messages) => [...messages, data]);
        // });
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (chatAreaRef.current) {
            const chatArea = chatAreaRef.current;
            const isScrolledToBottom =
                chatArea.scrollHeight - chatArea.clientHeight <= chatArea.scrollTop + 1;
            chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight;
            console.log(isScrolledToBottom);
            if (!isScrolledToBottom) {
                chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight;
            }
        }
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();

        if (message !== "" && socket) {
            socket.emit("chat message", { text: message, user });
            setMessage("");
        }
    };

    return (
        <div className="bottom-0 p-5 w-full fixed bg-primary transition-all">
            <ul className="overflow-auto mb-3 max-h-36" ref={chatAreaRef}>
                {messages.map((message, index) => (
                    <div key={index} className="text-white my-1 p-1 flex">
                        <img src={message.user.imageUrl} className="rounded-full w-8" alt="User" />
                        <div className="flex gap-2 my-auto mx-2">
                            <h2 className={`${message.user.name === user.name?'text-green-500':'text-yellow-500'}`}>{message.user.name}:</h2>
                            <p>{message.text}</p>
                        </div>
                    </div>
                ))}
            </ul>
            <form onSubmit={sendMessage} className="flex gap-2 truncate">
                <p className="text-white">&gt;</p>
                <input
                    type="text"
                    value={message}
                    className="bg-primary border-0 focus:ring-0 focus:outline-none overflow-auto w-full text-white truncate"
                    onChange={(event) => setMessage(event.target.value)}
                />
            </form>
        </div>
    );
}