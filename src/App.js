import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom"
// import logo from './logo.svg';
// import './App.css';


import IndexPage from "./pages/IndexPage";
import AStarPage from "./pages/AStarPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<IndexPage />}/>
                <Route path='/a-star' element={<AStarPage />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;