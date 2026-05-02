import axios from 'axios';
import { Logger } from '../../../logging_middleware/logger';
import { Notification, NotificationType } from '@/types/notification';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchNotifications(
  limit?: number,
  page?: number,
  type?: NotificationType
): Promise<Notification[]> {
  await Logger.debug('frontend', 'api', `Fetching notifications`);
  
  try {
    const params: Record<string, any> = {};
    if (limit) params.limit = limit;
    if (page) params.page = page;
    if (type) params.notification_type = type;
    
    const response = await axios.get(`${API_BASE_URL}/notifications`, { params });
    
    const viewedIds = getViewedNotifications();
    const notifications = (response.data.notifications || []).map((n: Notification) => ({
      ...n,
      isViewed: viewedIds.includes(n.ID)
    }));
    
    await Logger.info('frontend', 'api', `Fetched ${notifications.length} notifications`);
    return notifications;
  } catch (error: any) {
    await Logger.error('frontend', 'api', `Failed to fetch: ${error.message}`);
    throw error;
  }
}

export function getViewedNotifications(): string[] {
  if (typeof window === 'undefined') return [];
  const viewed = localStorage.getItem('viewed_notifications');
  return viewed ? JSON.parse(viewed) : [];
}

export function markAsViewed(notificationId: string): void {
  if (typeof window === 'undefined') return;
  
  const viewed = getViewedNotifications();
  if (!viewed.includes(notificationId)) {
    viewed.push(notificationId);
    localStorage.setItem('viewed_notifications', JSON.stringify(viewed));
    Logger.debug('frontend', 'state', `Marked as viewed: ${notificationId}`);
  }
}
