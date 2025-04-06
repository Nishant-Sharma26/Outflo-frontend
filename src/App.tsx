import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  
import CampaignDashboard from "./Component/CampaignDashboard";
import MessageGenerator from "./Component/MessageGenerator";
import Navbar from "./Component/Navbar";
import GetCampaign from "./Component/GetCampaign";


function App() {
  return (
    <Router> 
      <Navbar />
      <Routes> 
        <Route path="/" element={<CampaignDashboard />} />
        <Route path="/get-campaigns" element={<GetCampaign/>}/>
        <Route path="/message-generator" element={<MessageGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
