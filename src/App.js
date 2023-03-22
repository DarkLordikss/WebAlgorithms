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

// <div className="App">
//     <div className="Index-header">
//         <div><code>Algorithms</code></div>
//         <div><code>One</code></div>
//         <div><code>Three</code></div>
//     </div>
//     <body className="App-header">
//     <img src={logo} className="App-logo" alt="logo" />
//     <p>
//         Edit <code>src/App.js</code> and save to reload.
//     </p>
//     <a
//         className="App-link"
//         href="https://reactjs.org"
//         target="_blank"
//         rel="noopener noreferrer"
//     >
//         Learn React
//     </a>
//     </body>
// </div>