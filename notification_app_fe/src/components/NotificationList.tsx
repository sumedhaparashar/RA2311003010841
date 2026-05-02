'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import NotificationCard from './NotificationCard';
import { Notification } from '@/types/notification';

interface NotificationListProps {
  notifications: Notification[];
  onViewNotification: (id: string) => void;
}

export default function NotificationList({ notifications, onViewNotification }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography color="text.secondary">
          No notifications to display
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.ID}
          notification={notification}
          onView={onViewNotification}
        />
      ))}
    </Box>
  );
}
