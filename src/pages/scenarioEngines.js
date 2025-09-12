import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Container,
  Chip,
} from "@mui/material";

const ScenarioEngines = () => {
  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      name: "Loan Application Denial",
      personaPrompt: "You are a frustrated customer whose loan got rejected.",
      evaluatorPrompt:
        "Evaluate CSR's empathy, resolution steps, and compliance knowledge.",
      domain: "Loans",
      summary: "Customer angry due to rejected loan despite good credit history.",
      difficulty: "Hard",
    },
    {
      id: 2,
      name: "Payment Dispute",
      personaPrompt: "You are an angry customer facing a duplicate charge.",
      evaluatorPrompt:
        "Check CSR’s tone handling, escalation process, and refund clarity.",
      domain: "Payments",
      summary:
        "Customer frustrated after noticing a double charge on their credit card.",
      difficulty: "Medium",
    },
    {
      id: 3,
      name: "Product Inquiry",
      personaPrompt:
        "You are a curious customer casually asking about a new savings product.",
      evaluatorPrompt:
        "Evaluate CSR's product knowledge, upselling ability, and professionalism.",
      domain: "Sales",
      summary:
        "Customer showing interest in new savings account benefits casually.",
      difficulty: "Easy",
    },
  ]);

  const handleCreateScenario = () => {
    const newScenario = {
      id: scenarios.length + 1,
      name: "New Scenario",
      personaPrompt: "This is a sample persona prompt.",
      evaluatorPrompt: "This is a sample evaluator prompt.",
      domain: "General Inquiry",
      summary: "This is a sample summary for the new scenario.",
      difficulty: "Medium",
    };
    setScenarios([...scenarios, newScenario]);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Scenario Engines
      </Typography>
      <Grid container spacing={3}>
        {scenarios.map((scenario) => (
          <Grid item xs={12} sm={6} md={4} key={scenario.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {scenario.name}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Persona Prompt:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {scenario.personaPrompt}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Evaluator Prompt:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {scenario.evaluatorPrompt}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Domain:
                </Typography>
                <Chip label={scenario.domain} color="primary" size="small" />

                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Summary:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {scenario.summary}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Difficulty:
                </Typography>
                <Chip
                  label={scenario.difficulty}
                  color={
                    scenario.difficulty === "Hard"
                      ? "error"
                      : scenario.difficulty === "Medium"
                      ? "warning"
                      : "success"
                  }
                  size="small"
                />
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
        onClick={handleCreateScenario}
      >
        Create Scenario
      </Button>
    </Container>
  );
};

export default ScenarioEngines;