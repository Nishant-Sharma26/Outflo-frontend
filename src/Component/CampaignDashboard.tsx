import React, { useState, useCallback } from "react";
import axios from "axios";
import { 
  Button, 
  TextField, 
  Paper, 
  Typography, 
  Box, 
  Stack,
  CircularProgress
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
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
  const [loading, setLoading] = useState(false); // Loading state

  // Memoize fetchCampaigns (optional, only if you plan to use it)
  const fetchCampaigns = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}campaigns`);
      setCampaigns(response.data);
    } catch (error) {
      toast.error("Failed to fetch campaigns");
    }
  }, []);

  // Memoize createCampaign for performance
  const createCampaign = useCallback(async () => {
    if (!name || !description || !leads) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true); // Start loading
    try {
      await axios.post(`${BASE_URL}campaigns`, {
        name,
        description,
        status: "ACTIVE",
        leads: leads.split(",").map((lead) => lead.trim()), 
        accountIDs: [],
      });
      toast.success("Campaign created successfully!"); // Success toast
      // Clear fields only on success
      setName("");
      setDescription("");
      setLeads("");
      // Optionally fetch updated campaigns
      // fetchCampaigns();
    } catch (error) {
      toast.error("Failed to create campaign"); // Error toast
    } finally {
      setLoading(false); // Stop loading
    }
  }, [name, description, leads]);

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      bgcolor="#F2EFE7"
    >
      <Paper 
        elevation={4} 
        sx={{ 
          padding: 4, 
          width: 400, 
          bgcolor: "#FFF7F3",
          borderRadius: 2 
        }}
      >
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
            disabled={loading} // Disable during loading
          />
          <TextField 
            label="Description" 
            variant="outlined" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            fullWidth 
            multiline 
            rows={3}
            disabled={loading}
          />
          <TextField 
            label="Leads (comma separated)" 
            variant="outlined" 
            value={leads} 
            onChange={(e) => setLeads(e.target.value)} 
            fullWidth 
            disabled={loading}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={createCampaign}
            disabled={loading} // Disable button while loading
            startIcon={loading ? <CircularProgress size={20} /> : null} // Show spinner
          >
            {loading ? "Creating..." : "Create Campaign"}
          </Button>
        </Stack>
      </Paper>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover 
        draggable 
      />
    </Box>
  );
};

export default CampaignDashboard;