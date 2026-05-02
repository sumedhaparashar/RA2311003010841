import { Notification, NotificationType, TypeWeights } from '@/types/notification';
import { Logger } from '../../../logging_middleware/logger';

function calculatePriorityScore(notification: Notification): number {
  const weight = TypeWeights[notification.Type];
  const timestamp = new Date(notification.Timestamp);
  const now = new Date();
  const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
  const recencyBonus = Math.max(0, 100 - hoursDiff);
  return (weight * 100) + recencyBonus;
}

export function getTopPriorityNotifications(
  notifications: Notification[],
  limit: number = 10,
  typeFilter?: NotificationType
): Notification[] {
  const unreadNotifications = notifications.filter(n => !n.isViewed);
  
  let filtered = unreadNotifications;
  if (typeFilter) {
    filtered = filtered.filter(n => n.Type === typeFilter);
  }
  
  if (filtered.length === 0) return [];
  
  const withScores = filtered.map(notification => ({
    notification,
    score: calculatePriorityScore(notification)
  }));
  
  withScores.sort((a, b) => b.score - a.score);
  return withScores.slice(0, limit).map(item => item.notification);
}
