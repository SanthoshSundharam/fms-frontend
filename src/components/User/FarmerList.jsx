// src/components/User/FarmerList.jsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Typography,
  Box,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  TablePagination,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  AccountBalance,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const FarmerList = ({ farmers, loading, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.village_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.mobile_number.includes(searchTerm)
  );

  const paginatedFarmers = filteredFarmers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (farmers.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Farmers Added Yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click "Add New Farmer" button to add your first farmer
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search by name, village, or mobile number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Photo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Village</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mobile</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Bank Details</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Aadhar</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedFarmers.map((farmer) => (
              <TableRow key={farmer.id} hover>
                <TableCell>
                  <Avatar
                    src={
                      farmer.farmer_image
                        ? `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${farmer.farmer_image}`
                        : undefined
                    }
                    alt={farmer.name}
                  >
                    {farmer.name.charAt(0)}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="500">
                    {farmer.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{farmer.village_name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{farmer.mobile_number}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title={`Bank: ${farmer.bank_name}, Branch: ${farmer.branch}`}>
                    <Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <AccountBalance fontSize="small" color="action" />
                        <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                          {farmer.bank_account}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        IFSC: {farmer.ifsc_code}
                      </Typography>
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {farmer.aadhar_number ? (
                    <Chip
                      label={farmer.aadhar_number}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Not provided
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => onEdit(farmer)}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => onDelete(farmer.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredFarmers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </>
  );
};

export default FarmerList;