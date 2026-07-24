import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {io} from 'socket.io-client';

export const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = ()=>{
    return useContext(SocketContext);
}

// eslint-disable-next-line react/prop-types
export const SocketProvider = ({ children }) => {
    const [socket,setSocket]=useState(null);
    const {user}=useSelector(store=>store.user);
    const {employee}=useSelector(store=>store.employee);
    useEffect(()=>{
        if(user || employee){
            const socket = io('https://speed-service.onrender.com',{
                query:{
                    userId:user?.id,
                    employeeId:employee?.id,
                }
            });
            setSocket(socket);
            return ()=>socket.close();
        } 
        else{
            if(socket){
                socket.close();
                setSocket(null);
            }
        }
    },[user,employee])
    return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
}