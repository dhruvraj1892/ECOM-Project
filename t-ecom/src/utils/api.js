export const apifetch= async(url,options={})=>{
const token=localStorage.getItem("token");
   const headers = {
        ...options.headers,
        "Content-Type": "application/json"
    };
    if(token){
        headers.Authorization=`Bearer ${token}`;
    }
    return fetch(`${import.meta.env.VITE_API_URL}${url}`,{
        ...options,
        headers
    });
};