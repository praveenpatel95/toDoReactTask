import Header from "./Header";
import {Outlet} from "react-router";

function WebLayout() {
    return (
        <>
            <Header/>
            <Outlet/>
        </>
    )
}

export default WebLayout;