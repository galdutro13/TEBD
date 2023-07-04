import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/index";
import SongsList from "./pages/list";

function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="" element={<Home/>}/>
                <Route path="/list" element={<SongsList/>}/>
            </Routes>
        </BrowserRouter>
    )
}


export default RoutesApp;