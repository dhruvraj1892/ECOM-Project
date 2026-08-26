import { Navigate } from "react-router-dom";
function AdminRoute({children}){
    const token=localStorage.getItem("token");
    const userData=localStorage.getItem("user");
    if(!token){
        return <Navigate to="/login" replace/>;
    }
   if(!userData){
        return <Navigate to="/login" replace/>;
    }
    const user=JSON.parse(userData);
    if(user?.role!=='ADMIN'){
        return <Navigate to="/" replace/>
    }

    return children;
}
export default AdminRoute;