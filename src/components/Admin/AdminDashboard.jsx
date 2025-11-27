// src/components/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import {
  People,
  Agriculture,
  Person,
  TrendingUp,
} from '@mui/icons-material';
import Navbar from '../Layout/Navbar';
import AllFarmersList from './AllFarmersList';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    avgFarmersPerUser: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, farmersResponse] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllFarmers(),
      ]);

      const usersData = usersResponse.data.users || [];
      const farmersData = farmersResponse.data.farmers || [];

      setUsers(usersData);
      setFarmers(farmersData);

      // Calculate statistics
      const totalUsers = usersData.filter(user => user.role === 'user').length;
      const totalFarmers = farmersData.length;
      const avgFarmers = totalUsers > 0 ? (totalFarmers / totalUsers).toFixed(1) : 0;

      setStats({
        totalUsers,
        totalFarmers,
        avgFarmersPerUser: avgFarmers,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Group farmers by user
  const farmersByUser = users.map(user => ({
    ...user,
    farmersCount: farmers.filter(f => f.user_id === user.id).length,
  }));

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of all users and farmers in the system
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.totalUsers}
                    </Typography>
                  </Box>
                  <Person sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Total Farmers
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {stats.totalFarmers}
                    </Typography>
                  </Box>
                  <Agriculture sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Avg Farmers/User
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="secondary.main">
                      {stats.avgFarmersPerUser}
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 48, color: 'secondary.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Total Accounts
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      {users.length}
                    </Typography>
                  </Box>
                  <People sx={{ fontSize: 48, color: 'info.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="All Farmers" icon={<Agriculture />} iconPosition="start" />
            <Tab label="All Users" icon={<People />} iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Paper sx={{ p: 3 }}>
          {tabValue === 0 && (
            <AllFarmersList farmers={farmers} users={users} loading={loading} />
          )}
          {tabValue === 1 && (
            <UsersTable users={farmersByUser} loading={loading} />
          )}
        </Paper>
      </Container>
    </>
  );
};

// Users Table Component
const UsersTable = ({ users, loading }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Registered Users
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {users.filter(user => user.role === 'user').map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Person sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="500">
                    {user.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  📧 {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  📱 {user.mobile_number}
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" color="primary" fontWeight="bold">
                    {user.farmersCount} Farmer(s) Added
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;