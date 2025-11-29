import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  TablePagination,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search,
  AccountBalance,
  Phone,
  LocationOn,
  Person,
} from '@mui/icons-material';

const AllFarmersList = ({ farmers, users, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Filter farmers
  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.village_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.mobile_number.includes(searchTerm) ||
      getUserName(farmer.user_id).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUser =
      selectedUser === 'all' || farmer.user_id === parseInt(selectedUser);

    return matchesSearch && matchesUser;
  });

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
          No Farmers in System
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Users haven't added any farmers yet
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        All Farmers ({farmers.length})
      </Typography>

      {/* Filters */}
      <Box mb={3} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by farmer name, village, mobile, or user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by User</InputLabel>
          <Select
            value={selectedUser}
            label="Filter by User"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <MenuItem value="all">All Users</MenuItem>
            {users
              .filter((user) => user.role === 'user')
              .map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Photo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Farmer Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Added By</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Village</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mobile</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Bank Details</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Aadhar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedFarmers.map((farmer) => (
              <TableRow key={farmer.id} hover>
                <TableCell>
                  <Avatar
                    src={farmer.farmer_image_url || undefined}
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
                  <Chip
                    icon={<Person />}
                    label={getUserName(farmer.user_id)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
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
                  <Tooltip
                    title={`Bank: ${farmer.bank_name}, Branch: ${farmer.branch}`}
                  >
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
                      <Typography variant="caption" display="block" color="text.secondary">
                        {farmer.bank_name}
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
                      color="success"
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Not provided
                    </Typography>
                  )}
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

export default AllFarmersList;