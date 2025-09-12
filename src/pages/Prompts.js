import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Container,
} from "@mui/material";

const Prompts = () => {
  const [prompts, setPrompts] = useState([
    {
      id: 1,
      title: "Customer Loan Issue",
      text: "You are acting as a banking customer inquiring about loan rejection.",
    },
    {
      id: 2,
      title: "Payment Dispute",
      text: "Customer is angry about double charge on their credit card.",
    },
    {
      id: 3,
      title: "Sales Inquiry",
      text: "Customer is curious about new savings account benefits.",
    },
  ]);

  const handleCreatePrompt = () => {
    const newPrompt = {
      id: prompts.length + 1,
      title: "New Prompt",
      text: "This is a newly created mock prompt.",
    };
    setPrompts([...prompts, newPrompt]);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Prompt Library
      </Typography>
      <Grid container spacing={3}>
        {prompts.map((prompt) => (
          <Grid item xs={12} sm={6} md={4} key={prompt.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {prompt.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {prompt.text}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined">
                  Edit
                </Button>
                <Button size="small" color="error">
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        onClick={handleCreatePrompt}
      >
        Create Prompt
      </Button>
    </Container>
  );
};

export default Prompts;