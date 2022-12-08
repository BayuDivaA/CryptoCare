import Home from "./homepage/Home";
import Form from "./campaignForm/FormPage";
import About from "./aboutPage/about";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/about" exact element={<About />} />
          <Route path="/form" exact element={<Form />} />
          <Route path="/profil/:name" exact element={""} />
          {/* <Route component={Notfound} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
