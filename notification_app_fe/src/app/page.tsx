'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { fetchNotifications, markAsViewed } from '@/services/api';
import { getTopPriorityNotifications } from '@/services/priorityService';
import NotificationList from '@/components/NotificationList';
import FilterButtons from '@/components/FilterButtons';
import { Notification, NotificationType } from '@/types/notification';
import { register, Logger } from '../../../logging_middleware/logger';

export default function HomePage() {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [priorityNotifications, setPriorityNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [typeFilter, setTypeFilter] = useState<NotificationType | undefined>();
  const [priorityLimit, setPriorityLimit] = useState(10);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const initialize = async () => {
      await Logger.info('frontend', 'page', 'Initializing application');
      
      await register({
        email: process.env.NEXT_PUBLIC_REGISTRATION_EMAIL!,
        name: process.env.NEXT_PUBLIC_REGISTRATION_NAME!,
        mobileNo: process.env.NEXT_PUBLIC_REGISTRATION_MOBILE!,
        githubUsername: process.env.NEXT_PUBLIC_REGISTRATION_GITHUB!,
        rollNo: process.env.NEXT_PUBLIC_REGISTRATION_ROLLNO!,
        accessCode: process.env.NEXT_PUBLIC_REGISTRATION_ACCESSCODE!
      });
      
      await loadNotifications();
    };
    
    initialize();
  }, []);

  useEffect(() => {
    if (allNotifications.length > 0) {
      const topPriority = getTopPriorityNotifications(
        allNotifications,
        priorityLimit,
        typeFilter
      );
      setPriorityNotifications(topPriority);
    }
  }, [allNotifications, priorityLimit, typeFilter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const notifications = await fetchNotifications();
      setAllNotifications(notifications);
    } catch (err: any) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewNotification = (id: string) => {
    markAsViewed(id);
    setAllNotifications(prev =>
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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
          {!isMobile && <FilterButtons onFilterChange={setTypeFilter} onLimitChange={setPriorityLimit} />}
        </Toolbar>
      </AppBar>
      
      <Toolbar />
      
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)} sx={{ mb: 3 }}>
          <Tab label="All Notifications" />
          <Tab label={`Priority Inbox (Top ${priorityLimit})`} />
        </Tabs>
        
        {selectedTab === 0 ? (
          <NotificationList 
            notifications={allNotifications}
            onViewNotification={handleViewNotification}
          />
        ) : (
          <NotificationList 
            notifications={priorityNotifications}
            onViewNotification={handleViewNotification}
          />
        )}
      </Container>
    </>
  );
}
