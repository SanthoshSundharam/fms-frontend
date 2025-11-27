// src/components/User/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Add, People } from '@mui/icons-material';
import Navbar from '../Layout/Navbar';
import FarmerForm from './FarmerForm';
import FarmerList from './FarmerList';
import { farmerAPI } from '../../services/api';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const [openForm, setOpenForm] = useState(false);
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const response = await farmerAPI.getAll();
      setFarmers(response.data.farmers || []);
    } catch (error) {
      console.error('Error fetching farmers:', error);
      toast.error('Failed to fetch farmers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarmer = () => {
    setSelectedFarmer(null);
    setOpenForm(true);
  };

  const handleEditFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setOpenForm(true);
  };

  const handleDeleteFarmer = async (farmerId) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      try {
        await farmerAPI.delete(farmerId);
        toast.success('Farmer deleted successfully');
        fetchFarmers();
      } catch (error) {
        console.error('Error deleting farmer:', error);
        toast.error('Failed to delete farmer');
      }
    }
  };

  const handleFormSuccess = () => {
    fetchFarmers();
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Farmers Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your farmer records
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={handleAddFarmer}
              >
                Add New Farmer
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Statistics Card */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Total Farmers
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {farmers.length}
                    </Typography>
                  </Box>
                  <People sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Farmers List */}
        <Paper sx={{ p: 3 }}>
          <FarmerList
            farmers={farmers}
            loading={loading}
            onEdit={handleEditFarmer}
            onDelete={handleDeleteFarmer}
          />
        </Paper>

        {/* Farmer Form Dialog */}
        <FarmerForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          farmer={selectedFarmer}
          onSuccess={handleFormSuccess}
        />
      </Container>
    </>
  );
};

export default UserDashboard;