'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Slider,
  Paper,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';
import { fetchNotifications } from '@/services/api';
import { getTopPriorityNotifications } from '@/services/priorityService';
import NotificationList from '@/components/NotificationList';
import { Notification } from '@/types/notification';
import { Logger } from '../../../../logging_middleware/logger';

export default function PriorityPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [priorityList, setPriorityList] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const top = getTopPriorityNotifications(notifications, limit);
      setPriorityList(top);
    }
  }, [notifications, limit]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications(100);
      setNotifications(data);
    } catch (err: any) {
      console.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleViewNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.ID === id ? { ...n, isViewed: true } : n)
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" onClick={() => router.back()} edge="start">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Priority Inbox
          </Typography>
          <IconButton color="inherit" onClick={loadNotifications}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Toolbar />
      
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography gutterBottom>Show top {limit} notifications</Typography>
          <Slider
            value={limit}
            onChange={(_, v) => setLimit(v as number)}
            min={5}
            max={50}
            step={5}
            valueLabelDisplay="auto"
          />
        </Paper>
        
        <NotificationList 
          notifications={priorityList}
          onViewNotification={handleViewNotification}
        />
      </Container>
    </>
  );
}
