import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Switch,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
} from '@mui/material';

interface Campaign {
  _id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  leads: string[];
  accountIDs: string[];
}

const GetCampaign: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editData, setEditData] = useState<Record<string, { leads: string; accountIDs: string }>>({});

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const response = await axios.get('http://localhost:3000/campaigns');
    setCampaigns(response.data);

    // Set up initial editable values
    const initialEditData: Record<string, { leads: string; accountIDs: string }> = {};
    response.data.forEach((campaign: Campaign) => {
      initialEditData[campaign._id] = {
        leads: campaign.leads.join(', '),
        accountIDs: campaign.accountIDs.join(', '),
      };
    });
    setEditData(initialEditData);
  };

  const deleteCampaign = async (id: string) => {
    await axios.delete(`http://localhost:3000/campaigns/${id}`);
    fetchCampaigns();
  };

  const toggleStatus = async (id: string, currentStatus: 'ACTIVE' | 'INACTIVE' | 'DELETED') => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await axios.put(`http://localhost:3000/campaigns/${id}`, { status: newStatus });
      fetchCampaigns();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updateCampaign = async (id: string) => {
    const data = editData[id];
    await axios.put(`http://localhost:3000/campaigns/${id}`, {
      leads: data.leads.split(',').map((lead) => lead.trim()),
      accountIDs: data.accountIDs.split(',').map((acc) => acc.trim()),
    });
    fetchCampaigns();
  };

  const handleInputChange = (id: string, field: 'leads' | 'accountIDs', value: string) => {
    setEditData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  return (
    <div style={{ backgroundColor: '#F2EFE7', padding: '20px', minHeight: '100vh' }}>
      <Box display="flex" flexWrap="wrap" gap="20px" justifyContent="start">
        {campaigns.map((campaign) => (
          <Card
            key={campaign._id}
            sx={{
              width: '340px',
              boxShadow: 3,
              borderRadius: '8px',
              backgroundColor: '#fff8e1',
              p: 2,
            }}
          >
            <CardContent>
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
                  value={editData[campaign._id]?.leads || ''}
                  onChange={(e) => handleInputChange(campaign._id, 'leads', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Account IDs (comma separated)"
                  value={editData[campaign._id]?.accountIDs || ''}
                  onChange={(e) => handleInputChange(campaign._id, 'accountIDs', e.target.value)}
                  fullWidth
                />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Switch
                    checked={campaign.status === 'ACTIVE'}
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
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export default GetCampaign;
