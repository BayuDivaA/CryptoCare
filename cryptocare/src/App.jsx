import Home from "./homepage/Home";
import Form from "./campaignForm/FormPage";
import DetailPage from "./detail_page/Detail";
import UserProfile from "./user_profile/UserProfile";
import AllCampaigns from "./all_campaigns/AllCampaigns";
import AdminPage from "./admin_page/AdminPage";
import React from "react";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home />} forceRefresh={true} />
        <Route path="/form" exact element={<Form />} />
        <Route path="/profile/:account_address" exact element={<UserProfile />} />
        <Route path="/campaign_details/:campaign_address" exact element={<DetailPage />} />
        <Route path="/campaigns" exact element={<AllCampaigns />} />
        <Route path="/admin" exact element={<AdminPage />} />
        {/* <Route component={Notfound} /> */}
      </Routes>
    </>
  );
}

export default App;
