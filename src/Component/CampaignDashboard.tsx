import React, { useState, useCallback, Suspense, lazy } from "react";
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
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Utils/constant";


const LazyToastContainer = lazy(() => import("react-toastify").then(module => ({ default: module.ToastContainer })));

interface Campaign {
  _id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  leads: string[];
  accountIDs: string[];
}

const CampaignDashboard: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [leads, setLeads] = useState("");
  const [loading, setLoading] = useState(false);

 
  const createCampaign = useCallback(async () => {
    if (!name || !description || !leads) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}campaigns`, {
        name,
        description,
        status: "ACTIVE",
        leads: leads.split(",").map((lead) => lead.trim()), 
        accountIDs: [],
      }, { timeout: 5000 }); 
      toast.success("Campaign created successfully!");
      setName("");
      setDescription("");
      setLeads("");
    } catch (error) {
      toast.error("Failed to create campaign");
    } finally {
      setLoading(false);
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
            disabled={loading}
            inputProps={{ maxLength: 50 }} // Limit input length
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
            inputProps={{ maxLength: 200 }}
          />
          <TextField 
            label="Leads (comma separated)" 
            variant="outlined" 
            value={leads} 
            onChange={(e) => setLeads(e.target.value)} 
            fullWidth 
            disabled={loading}
            inputProps={{ maxLength: 500 }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={createCampaign}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Creating..." : "Create Campaign"}
          </Button>
        </Stack>
      </Paper>
      <Suspense fallback={<div>Loading notifications...</div>}>
        <LazyToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          closeOnClick 
          pauseOnHover 
          draggable 
        />
      </Suspense>
    </Box>
  );
};

export default CampaignDashboard;