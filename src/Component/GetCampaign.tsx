import React, { useEffect, useState, useCallback, Suspense, lazy } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/constant";
import {
  TextField,
  Button,
  Switch,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";

const LazyCard = lazy(() => import("@mui/material/Card"));
const LazyCardContent = lazy(() => import("@mui/material/CardContent"));

interface Campaign {
  _id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  leads: string[];
  accountIDs: string[];
}

const GetCampaign: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editData, setEditData] = useState<Record<string, { leads: string; accountIDs: string }>>({});
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}campaigns`, { timeout: 5000 }); // Add timeout
      setCampaigns(response.data);

      const initialEditData: Record<string, { leads: string; accountIDs: string }> = {};
      response.data.forEach((campaign: Campaign) => {
        initialEditData[campaign._id] = {
          leads: campaign.leads.join(", "),
          accountIDs: campaign.accountIDs.join(", "),
        };
      });
      setEditData(initialEditData);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);


  const deleteCampaign = useCallback(async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}campaigns/${id}`);
      fetchCampaigns();
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  }, [fetchCampaigns]);


  const toggleStatus = useCallback(async (id: string, currentStatus: "ACTIVE" | "INACTIVE" | "DELETED") => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await axios.put(`${BASE_URL}campaigns/${id}`, { status: newStatus });
      fetchCampaigns();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }, [fetchCampaigns]);

 
  const updateCampaign = useCallback(async (id: string) => {
    const data = editData[id];
    try {
      await axios.put(`${BASE_URL}campaigns/${id}`, {
        leads: data.leads.split(",").map((lead) => lead.trim()),
        accountIDs: data.accountIDs.split(",").map((acc) => acc.trim()),
      });
      fetchCampaigns();
    } catch (error) {
      console.error("Error updating campaign:", error);
    }
  }, [editData, fetchCampaigns]);


  const handleInputChange = useCallback(
    (id: string, field: "leads" | "accountIDs", value: string) => {
      setEditData((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value,
        },
      }));
    },
    []
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#F2EFE7", padding: "20px", minHeight: "100vh" }}>
      <Suspense fallback={<CircularProgress />}>
        <Box display="flex" flexWrap="wrap" gap="20px" justifyContent="start">
          {campaigns.map((campaign) => (
            <LazyCard
              key={campaign._id}
              sx={{
                width: "340px",
                boxShadow: 3,
                borderRadius: "8px",
                backgroundColor: "#fff8e1",
                p: 2,
              }}
            >
              <LazyCardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {campaign.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {campaign.description}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  Status: {campaign.status}
                </Typography>

                <Stack spacing={2} mt={2}>
                  <TextField
                    label="Leads (comma separated)"
                    value={editData[campaign._id]?.leads || ""}
                    onChange={(e) => handleInputChange(campaign._id, "leads", e.target.value)}
                    fullWidth
                    inputProps={{ maxLength: 500 }} // Limit input length
                  />
                  <TextField
                    label="Account IDs (comma separated)"
                    value={editData[campaign._id]?.accountIDs || ""}
                    onChange={(e) => handleInputChange(campaign._id, "accountIDs", e.target.value)}
                    fullWidth
                    inputProps={{ maxLength: 500 }}
                  />

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Switch
                      checked={campaign.status === "ACTIVE"}
                      onChange={() => toggleStatus(campaign._id, campaign.status)}
                    />
                    <Button variant="contained" color="error" onClick={() => deleteCampaign(campaign._id)}>
                      Delete
                    </Button>
                  </Box>

                  <Button variant="contained" color="primary" onClick={() => updateCampaign(campaign._id)}>
                    Update
                  </Button>
                </Stack>
              </LazyCardContent>
            </LazyCard>
          ))}
        </Box>
      </Suspense>
    </Box>
  );
};

export default GetCampaign;