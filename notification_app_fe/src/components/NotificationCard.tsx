'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box
} from '@mui/material';
import { Notification } from '@/types/notification';

interface NotificationCardProps {
  notification: Notification;
  onView?: (id: string) => void;
}

const getTypeColor = (type: string): 'primary' | 'success' | 'warning' => {
  switch (type) {
    case 'Placement': return 'primary';
    case 'Result': return 'success';
    default: return 'warning';
  }
};

export default function NotificationCard({ notification, onView }: NotificationCardProps) {
  const handleClick = () => {
    if (!notification.isViewed && onView) {
      onView(notification.ID);
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        opacity: notification.isViewed ? 0.6 : 1,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateX(5px)',
          boxShadow: 3
        }
      }}
      onClick={handleClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Chip 
            label={notification.Type}
            color={getTypeColor(notification.Type)}
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(notification.Timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
}
