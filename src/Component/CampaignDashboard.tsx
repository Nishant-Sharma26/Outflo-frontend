import React, { useState } from "react";
import axios from "axios";
import { 
  Button, 
  TextField, 
  Paper, 
  Typography, 
  Box, 
  Stack 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Utils/constant";

interface Campaign {
  _id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  leads: string[];
  accountIDs: string[];
}

const CampaignDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [leads, setLeads] = useState("");
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    const response = await axios.get(BASE_URL+"campaigns");
    setCampaigns(response.data);
  };

  const createCampaign = async () => {
    await axios.post(BASE_URL+"campaigns", {
      name,
      description,
      status: "ACTIVE",
      leads: leads.split(",").map((lead) => lead.trim()), // converts comma-separated leads to array
      accountIDs: []
    });
    setName("");
    setDescription("");
    setLeads("");
    navigate("/get-campaigns");
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      bgcolor="#F2EFE7"
    >
      <Paper elevation={4} sx={{ padding: 4, width: 400 ,    bgcolor: "#FFF7F3",
    borderRadius: 2
}}>
        <Typography variant="h5" gutterBottom align="center">
          Create a New Campaign
        </Typography>
        <Stack spacing={2}>
          <TextField 
            label="Campaign Name" 
            variant="outlined" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            fullWidth 
          />
          <TextField 
            label="Description" 
            variant="outlined" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            fullWidth 
            multiline 
            rows={3}
          />
          <TextField 
            label="Leads (comma separated)" 
            variant="outlined" 
            value={leads} 
            onChange={(e) => setLeads(e.target.value)} 
            fullWidth 
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={createCampaign}
          >
            Create Campaign
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CampaignDashboard;
