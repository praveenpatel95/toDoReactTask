import {Route, Routes} from "react-router-dom";
import WebLayout from "../Container/WebLayout";
import TaskList from '../Container/Task/TaskList'
import Login from "../Container/Auth/Login.tsx";
import Register from "../Container/Auth/Register.tsx";
import ProtectedRoute from '../Container/Private/ProtectedRoute.tsx';


export default function MainRouter() {
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route element={<WebLayout/>}>
                <Route path="/todo-list"  element={
                    <ProtectedRoute>
                        <TaskList />
                    </ProtectedRoute>
                } />
            </Route>
        </Routes>
    )
}