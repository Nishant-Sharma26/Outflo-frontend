import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Stack } from "@mui/material";
import { BASE_URL } from "../Utils/constant";

const MessageGenerator: React.FC = () => {
  const [form, setForm] = useState({
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

   
      const response = await axios.post(BASE_URL+"personalized-message", form);

      
      setForm({
        name: response.data.name,
        job_title: response.data.job_title,
        company: response.data.company,
        location: response.data.location,
        summary: response.data.summary,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error generating message:", error);
      setMessage("Something went wrong.");
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
          Enter your details manually:
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
