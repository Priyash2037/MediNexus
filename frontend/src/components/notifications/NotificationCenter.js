import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Box,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Divider,
  CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
  const { t } = useTranslation();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead,
    requestNotificationPermission 
  } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Request notification permission when component mounts
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.link) {
      window.location.href = notification.link;
    }
    
    handleClose();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <EventIcon color="primary" />;
      case 'chat':
        return <ChatIcon color="info" />;
      case 'alert':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label={t('notifications')}
        onClick={handleClick}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 320, maxHeight: 500 }}>
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
          }}>
            <Typography variant="h6">{t('notifications')}</Typography>
            <Box>
              {unreadCount > 0 && (
                <Button 
                  size="small" 
                  onClick={markAllAsRead}
                  sx={{ mr: 1 }}
                >
                  {t('markAllRead')}
                </Button>
              )}
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                {t('noNotifications')}
              </Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem 
                    button 
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      backgroundColor: notification.is_read ? 'inherit' : 'rgba(25, 118, 210, 0.08)',
                    }}
                  >
                    <Box sx={{ mr: 2 }}>
                      {getNotificationIcon(notification.type)}
                    </Box>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: notification.is_read ? 'normal' : 'bold',
                            mb: 0.5
                          }}
                        >
                          {notification.message}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="textSecondary">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationCenter;