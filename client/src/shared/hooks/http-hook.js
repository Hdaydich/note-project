import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient=()=>{

 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState();

 const activeHttpRequesets= useRef([]);
 
 const sendRequest= useCallback(async(url,method='GET',body=null, headers={})=>{
    
    setIsLoading(true);
    
    const httpAbortCtrl= new AbortController();
    
    activeHttpRequesets.current.push(httpAbortCtrl);

    try 
    {
        const response = await fetch(url,{
        method,
        body,
        headers,
        signal:httpAbortCtrl.signal
        });

        const responseData =await response.json();
        
        activeHttpRequesets.current=activeHttpRequesets.current.filter(
            reqCtrl =>reqCtrl!==httpAbortCtrl
        );

        if (!response.ok) {
            throw new Error(responseData.message);
        }
    
        setIsLoading(false);
        return responseData;

    } catch (err){

        setError(err.message);
        setIsLoading(false);
        throw err;
    }

    },[]);

    const clearError =() =>{
        setError(null);
    };

    useEffect(()=>{
        return()=>{
        activeHttpRequesets.current.forEach(abortCtrl =>abortCtrl.abort());
    };},[]);
    return {isLoading,error,sendRequest,clearError} ;
 };