import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Pagination,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNotifications } from '../context/NotificationContext';

const ITEMS_PER_PAGE = 10;
const AVAILABLE_TYPES = ['Placement', 'Result', 'Event'];

const typeColorMap = {
  placement: '#4CAF50',
  result: '#2196F3',
  event: '#FF9800',
};

export default function AllNotifications() {
  const { notifications, readNotifications, loading, error, markAsRead, isRead, fetchNotifications } = useNotifications();
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    fetchNotifications(ITEMS_PER_PAGE, offset, typeFilter || null);
  }, [page, typeFilter, fetchNotifications]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Filter by Type"
          value={typeFilter}
          onChange={handleTypeFilterChange}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Types</MenuItem>
          {AVAILABLE_TYPES.map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Stack spacing={2}>
        {notifications.map((notification, idx) => {
          const isReadState = isRead(notification.Id || idx);
          return (
            <Card
              key={notification.Id || idx}
              onClick={() => markAsRead(notification.Id || idx)}
              sx={{
                cursor: 'pointer',
                backgroundColor: isReadState ? '#fafafa' : '#fff',
                opacity: isReadState ? 0.7 : 1,
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Chip
                      label={notification.Type || 'Unknown'}
                      size="small"
                      sx={{
                        backgroundColor: typeColorMap[notification.Type?.toLowerCase()] || '#999',
                        color: 'white',
                        mb: 1
                      }}
                    />
                    <Typography variant="h6" component="div">
                      {notification.Message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(notification.Timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  {isReadState && (
                    <Chip label="Read" size="small" variant="outlined" />
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {notifications.length === 0 && (
        <Alert severity="info">No notifications found</Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={100}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}
