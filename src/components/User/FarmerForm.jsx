import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Avatar,
  IconButton,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { farmerAPI } from '../../services/api';

const FarmerForm = ({ open, onClose, farmer, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    village_name: '',
    mobile_number: '',
    bank_account: '',
    ifsc_code: '',
    bank_name: '',
    branch: '',
    aadhar_number: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (farmer) {
      setFormData({
        name: farmer.name || '',
        village_name: farmer.village_name || '',
        mobile_number: farmer.mobile_number || '',
        bank_account: farmer.bank_account || '',
        ifsc_code: farmer.ifsc_code || '',
        bank_name: farmer.bank_name || '',
        branch: farmer.branch || '',
        aadhar_number: farmer.aadhar_number || '',
      });
      if (farmer.farmer_image) {
        setImagePreview(`http://localhost:8000/storage/${farmer.farmer_image}`);
      }
    } else {
      resetForm();
    }
  }, [farmer]);

  const resetForm = () => {
    setFormData({
      name: '',
      village_name: '',
      mobile_number: '',
      bank_account: '',
      ifsc_code: '',
      bank_name: '',
      branch: '',
      aadhar_number: '',
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append image if exists
      if (imageFile) {
        submitData.append('farmer_image', imageFile);
      }

      if (farmer) {
        await farmerAPI.update(farmer.id, submitData);
        toast.success('Farmer updated successfully');
      } else {
        await farmerAPI.create(submitData);
        toast.success('Farmer added successfully');
      }

      onSuccess();
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {farmer ? 'Edit Farmer' : 'Add New Farmer'}
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Image Upload */}
            <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                src={imagePreview}
                sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="farmer-image"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="farmer-image">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Upload Photo (Optional)
                </Button>
              </label>
            </Grid>

            {/* Personal Details */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Farmer Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Village Name"
                name="village_name"
                value={formData.village_name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 10, pattern: '[0-9]{10}' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Aadhar Number"
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 12, pattern: '[0-9]{12}' }}
              />
            </Grid>

            {/* Bank Details */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: 'text.secondary' }}>
                Bank Details
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Account Number"
                name="bank_account"
                value={formData.bank_account}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="ifsc_code"
                value={formData.ifsc_code}
                onChange={handleChange}
                required
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : farmer ? 'Update' : 'Add Farmer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FarmerForm;