import {useState} from "react";


const useLocalStorage = (key,defaultValue) =>{
    //creates a state variable to store localStorage value in state
    const [localStorageValue,setLocalStorageValue] = useState(()=>{
        try{
            const value = localStorage.getItem(key);
            //If value is already present in localStorage then return it

            //else set default value in localStorage and then return it
            if(value){
                return JSON.parse(value);
            }else{
                localStorage.setItem(key,JSON.stringify(defaultValue));
                return defaultValue;
            }
        }catch (e) {
            localStorage.setItem(key,JSON.stringify(defaultValue));
            return defaultValue;
        }
    });

    //this method is used to update the local state variable and it can get a fun or a number

    const setLocalStorageStateValue = (valueOfFun)=>{
        let newValue;
        if(typeof valueOfFun === 'function' ){
            const fun = valueOfFun;
            newValue = fun(valueOfFun);
        }else{
            newValue=valueOfFun;
        }
        localStorage.setItem(key,JSON.stringify(newValue));
        setLocalStorageValue(newValue);

    };

    return [localStorageValue,setLocalStorageStateValue];

}



export default useLocalStorage;