import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
    if (!socket) {
        socket = io('http://localhost:3000', {
            autoConnect: false, // you control when to connect
        });
    }
    return socket;
};
