import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useUserData from "../hooks/useLoggedInDetails";

// Fake API service using JSONPlaceholder for demo
const apiService = {
  fetchSalesData: async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const data = await response.json();
      // Transform API response to sales data format
      return [
        { name: "Jan", value: 4000 },
        { name: "Feb", value: 3000 },
        { name: "Mar", value: 2000 },
        { name: "Apr", value: 2780 },
        { name: "May", value: 1890 },
        { name: "Jun", value: 2390 },
        { name: "Jul", value: 3490 },
      ];
    } catch (error) {
      throw new Error("Failed to fetch sales data");
    }
  },

  fetchTrafficData: async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/comments"
      );
      const data = await response.json();
      return [
        { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
        { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
        { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
        { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
        { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
        { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
        { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
      ];
    } catch (error) {
      throw new Error("Failed to fetch traffic data");
    }
  },

  fetchPieData: async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = await response.json();
      return [
        { name: "Group A", value: 400 },
        { name: "Group B", value: 300 },
        { name: "Group C", value: 300 },
        { name: "Group D", value: 200 },
      ];
    } catch (error) {
      throw new Error("Failed to fetch pie data");
    }
  },

  fetchStats: async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      return [
        { title: "Total Revenue", value: "$23,500", change: "+12%" },
        { title: "Total Users", value: "1,245", change: "+15%" },
        { title: "New Visitors", value: "4,128", change: "+8%" },
        { title: "Bounce Rate", value: "32%", change: "-3%" },
      ];
    } catch (error) {
      throw new Error("Failed to fetch stats");
    }
  },

  fetchSampleData: async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      return await response.json();
    } catch (error) {
      throw new Error("Failed to fetch sample data");
    }
  },
};

const Dashboard = () => {
  const userData = useUserData();
  console.log("🚀 ~ Dashboard ~ userData:", userData);

  const [salesData, setSalesData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sampleData, setSampleData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [chartVisibility, setChartVisibility] = useState(() => {
    // Initialize from localStorage or use defaults
    try {
      const saved = localStorage.getItem("dashboardChartPrefs");
      return saved
        ? JSON.parse(saved)
        : {
            showLineChart: true,
            showPieChart: true,
            showBarChart: true,
          };
    } catch (e) {
      console.error("Error reading localStorage:", e);
      return {
        showLineChart: true,
        showPieChart: true,
        showBarChart: true,
      };
    }
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "dashboardChartPrefs",
        JSON.stringify(chartVisibility)
      );
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }, [chartVisibility]);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sales, traffic, pie, statsData] = await Promise.all([
          apiService.fetchSalesData(),
          apiService.fetchTrafficData(),
          apiService.fetchPieData(),
          apiService.fetchStats(),
        ]);

        setSalesData(sales);
        setTrafficData(traffic);
        setPieData(pie);
        setStats(statsData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChartToggle = (chartName) => {
    setChartVisibility((prev) => ({
      ...prev,
      [chartName]: !prev[chartName],
    }));
  };

  const handleSampleApiCall = async () => {
    try {
      const data = await apiService.fetchSampleData();
      setSampleData(data);
      setDialogOpen(true);
    } catch (error) {
      setError("Failed to fetch sample API data");
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSampleData(null);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Overview{" "}
        {userData?.user_category ? `of ${userData?.user_category}` : ""}
      </Typography>

      {/* Chart Visibility Controls and API Demo */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" gutterBottom>
              Chart Visibility
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={chartVisibility.showLineChart}
                      onChange={() => handleChartToggle("showLineChart")}
                    />
                  }
                  label="Monthly Sales"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={chartVisibility.showPieChart}
                      onChange={() => handleChartToggle("showPieChart")}
                    />
                  }
                  label="Revenue by Category"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={chartVisibility.showBarChart}
                      onChange={() => handleChartToggle("showBarChart")}
                    />
                  }
                  label="Website Traffic"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              onClick={handleSampleApiCall}
              sx={{ mt: 2 }}
            >
              Test API Call
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" color="text.secondary">
                  {stat.title}
                </Typography>
                <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: stat.change.startsWith("+")
                      ? "success.main"
                      : "error.main",
                    mt: 1,
                  }}
                >
                  {stat.change} from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Line Chart */}
        {chartVisibility.showLineChart && (
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 340,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Monthly Sales
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}

        {/* Pie Chart */}
        {chartVisibility.showPieChart && (
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 340,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Revenue by Category
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}

        {/* Bar Chart */}
        {chartVisibility.showBarChart && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 400,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Website Traffic
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trafficData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pv" fill="#8884d8" />
                  <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Sample API Response Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Sample API Response</DialogTitle>
        <DialogContent>
          {sampleData ? (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Post #{sampleData.id}</Typography>
              <Typography variant="subtitle1" gutterBottom>
                Title: {sampleData.title}
              </Typography>
              <Typography variant="body2">Body: {sampleData.body}</Typography>
            </Paper>
          ) : (
            <Typography>No data available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
