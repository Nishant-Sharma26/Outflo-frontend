import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Stack, Divider } from "@mui/material";
import { BASE_URL } from "../Utils/constant";

const MessageGenerator: React.FC = () => {
  const [form, setForm] = useState({
    linkedin_url: "",
    name: "",
    job_title: "",
    company: "",
    location: "",
    summary: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateMessage = async () => {
    try {
      setLoading(true);
      setMessage("");

      // Prepare the payload based on what's filled
      const payload = {
        ...(form.linkedin_url && { linkedin_url: form.linkedin_url }),
        ...(form.name && { name: form.name }),
        ...(form.job_title && { job_title: form.job_title }),
        ...(form.company && { company: form.company }),
        ...(form.location && { location: form.location }),
        ...(form.summary && { summary: form.summary }),
      };

      const response = await axios.post(BASE_URL + "messages/personalized-message", payload);

      // Update form with response data (useful when using LinkedIn URL)
      setForm({
        linkedin_url: form.linkedin_url, // Preserve the URL input
        name: response.data.name,
        job_title: response.data.job_title,
        company: response.data.company,
        location: response.data.location,
        summary: response.data.summary,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error generating message:", error);
      setMessage("Something went wrong. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 4, backgroundColor: "#fff8e1", borderRadius: 2, boxShadow: 3, mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Generate Personalized Message
      </Typography>

      <Stack spacing={2}>
        <Typography variant="body2" color="textSecondary">
          Option 1: Enter LinkedIn Profile URL
        </Typography>
        <TextField
          label="LinkedIn URL"
          value={form.linkedin_url}
          onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
          fullWidth
          placeholder="https://linkedin.com/in/username"
        />

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Typography variant="body2" color="textSecondary">
          Option 2: Enter details manually
        </Typography>

        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Job Title"
          value={form.job_title}
          onChange={(e) => setForm({ ...form, job_title: e.target.value })}
          fullWidth
        />
        <TextField
          label="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          fullWidth
        />
        <TextField
          label="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          fullWidth
        />
        <TextField
          label="Summary"
          multiline
          minRows={3}
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          fullWidth
        />

        <Button variant="contained" onClick={generateMessage} disabled={loading}>
          {loading ? "Generating..." : "Generate Message"}
        </Button>

        {message && (
          <Box mt={2} p={2} bgcolor="#f1f8e9" borderRadius={1}>
            <Typography variant="subtitle1" gutterBottom>
              Personalized Message:
            </Typography>
            <Typography>{message}</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default MessageGenerator;