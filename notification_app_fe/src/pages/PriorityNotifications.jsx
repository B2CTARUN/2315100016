import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNotifications } from '../context/NotificationContext';

const typeColorMap = {
  placement: '#4CAF50',
  result: '#2196F3',
  event: '#FF9800',
};

const weightMap = {
  placement: 3,
  result: 2,
  event: 1
};

export default function PriorityNotifications() {
  const { notifications, loading, error, markAsRead, isRead, fetchNotifications } = useNotifications();
  const [topCount, setTopCount] = useState('10');

  useEffect(() => {
    const count = Math.max(1, Math.min(100, parseInt(topCount) || 10));
    fetchNotifications(count, 0, null);
  }, [topCount, fetchNotifications]);

  const handleTopCountChange = (e) => {
    setTopCount(e.target.value);
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
          label="Number of Top Priorities"
          type="number"
          value={topCount}
          onChange={handleTopCountChange}
          inputProps={{ min: 1, max: 100 }}
          sx={{ width: 200 }}
        />
      </Box>

      <Stack spacing={2}>
        {notifications.map((notification, idx) => {
          const isReadState = isRead(notification.Id || idx);
          const weight = weightMap[notification.Type?.toLowerCase()] || 0;

          return (
            <Card
              key={notification.Id || idx}
              onClick={() => markAsRead(notification.Id || idx)}
              sx={{
                cursor: 'pointer',
                backgroundColor: isReadState ? '#fafafa' : '#fff',
                opacity: isReadState ? 0.7 : 1,
                transition: 'all 0.2s',
                borderLeft: `4px solid ${typeColorMap[notification.Type?.toLowerCase()] || '#999'}`,
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip
                        label={`#${idx + 1}`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={notification.Type || 'Unknown'}
                        size="small"
                        sx={{
                          backgroundColor: typeColorMap[notification.Type?.toLowerCase()] || '#999',
                          color: 'white'
                        }}
                      />
                      <Chip
                        label={`Weight: ${weight}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
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
        <Alert severity="info">No notifications available</Alert>
      )}
    </Box>
  );
}
