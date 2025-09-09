// PerformancePageWithImages.jsx
import React, { useMemo } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";

/**
 * Utility: truncate long names for bar labels
 */
const truncate = (s, n = 12) =>
  s.length > n ? s.slice(0, n - 1) + "…" : s;

/**
 * Generate a basic bar-chart SVG as string from attempts data.
 * attempts: [{id, scenario, score}]
 */
function generateBarSVG(attempts, width = 700, height = 260) {
  if (!attempts || attempts.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="#666">No data</text>
    </svg>`;
  }

  const padding = 36;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;
  const colors = ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0", "#00bcd4"];
  const maxScore = Math.max(100, ...attempts.map((a) => a.score));
  const gap = 12;
  const barWidth = (chartW - gap * (attempts.length - 1)) / attempts.length;

  let bars = "";
  attempts.forEach((a, i) => {
    const x = padding + i * (barWidth + gap);
    const barH = (a.score / maxScore) * chartH;
    const y = padding + (chartH - barH);
    const color = colors[i % colors.length];

    bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" fill="${color}" />`;
    bars += `<text x="${x + barWidth / 2}" y="${y - 8}" font-size="12" text-anchor="middle" fill="#222">${a.score}%</text>`;
    bars += `<text x="${x + barWidth / 2}" y="${height - padding / 6}" font-size="11" text-anchor="middle" fill="#333">${truncate(a.scenario, 14)}</text>`;
  });

  // axes lines
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" style="font-family:Arial,Helvetica,sans-serif">
    <rect width="100%" height="100%" fill="#fff"/>
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + chartH}" stroke="#ddd" />
    <line x1="${padding}" y1="${padding + chartH}" x2="${padding + chartW}" y2="${padding + chartH}" stroke="#ddd" />
    ${bars}
  </svg>`;
  return svg;
}

/**
 * Generate a simple pie-chart SVG as string from attempts data.
 */
function generatePieSVG(attempts, size = 260) {
  if (!attempts || attempts.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <text x="${size / 2}" y="${size / 2}" text-anchor="middle" fill="#666">No data</text>
    </svg>`;
  }
  const colors = ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0", "#00bcd4"];
  const total = attempts.reduce((s, a) => s + a.score, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 12;

  let angle = -Math.PI / 2; // start at 12 o'clock
  let slices = "";
  attempts.forEach((a, i) => {
    const slice = (a.score / total) * (Math.PI * 2);
    const startX = cx + r * Math.cos(angle);
    const startY = cy + r * Math.sin(angle);
    const endAngle = angle + slice;
    const endX = cx + r * Math.cos(endAngle);
    const endY = cy + r * Math.sin(endAngle);
    const largeArc = slice > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} Z`;
    slices += `<path d="${d}" fill="${colors[i % colors.length]}" stroke="#fff" stroke-width="1"/>`;
    angle = endAngle;
  });

  // legend: small boxes + labels below the pie
  let legend = "";
  const legendX = 10;
  let ly = size - 8 - attempts.length * 18;
  attempts.forEach((a, i) => {
    const color = colors[i % colors.length];
    legend += `<rect x="${legendX}" y="${ly}" width="12" height="12" fill="${color}" />`;
    legend += `<text x="${legendX + 18}" y="${ly + 11}" font-size="12" fill="#222">${truncate(a.scenario, 18)} (${Math.round((a.score/total)*100)}%)</text>`;
    ly += 18;
  });

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="font-family:Arial,Helvetica,sans-serif">
    <rect width="100%" height="100%" fill="#fff"/>
    ${slices}
    ${legend}
  </svg>`;
  return svg;
}

export default function Performance() {
  // mocked attempts (you can feed real data here)
  const attempts = useMemo(
    () => [
      {
        id: 1,
        scenario: "Loan Application Denial",
        score: 72,
        review: "Good empathy shown but lacked detailed explanation.",
      },
      {
        id: 2,
        scenario: "Payment Dispute",
        score: 85,
        review: "Handled frustration well, offered a clear refund process.",
      },
      {
        id: 3,
        scenario: "Product Inquiry",
        score: 92,
        review: "Excellent product knowledge and upselling.",
      },
      {
        id: 4,
        scenario: "Refund Request",
        score: 68,
        review: "Resolution provided but tone was slightly impatient.",
      },
    ],
    []
  );

  const avgScore =
    attempts.reduce((acc, item) => acc + item.score, 0) / (attempts.length || 1);

  // create data URL images
  const barSvg = generateBarSVG(attempts, 700, 260);
  const pieSvg = generatePieSVG(attempts, 260);
  const barSrc = "data:image/svg+xml;utf8," + encodeURIComponent(barSvg);
  const pieSrc = "data:image/svg+xml;utf8," + encodeURIComponent(pieSvg);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Trainee Performance (Image Charts)
      </Typography>

      <Grid container spacing={3}>
        {/* Summary */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">Average Score</Typography>
              <Typography variant="h4" color="primary">
                {avgScore.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">Scenarios Attempted</Typography>
              <Typography variant="h4" color="secondary">
                {attempts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Image Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scores per Scenario
              </Typography>
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <img
                  src={barSrc}
                  alt="Bar chart"
                  style={{ width: "100%", maxWidth: 900, height: "auto", display: "block" }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Image Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Score Distribution
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img src={pieSrc} alt="Pie chart" style={{ width: 260, height: "auto" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Reviews */}
        <Grid item xs={12}>
          <Paper sx={{ borderRadius: 3 }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Detailed Reviews
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Scenario</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Review</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attempts.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.scenario}</TableCell>
                    <TableCell>{a.score}%</TableCell>
                    <TableCell>{a.review}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}