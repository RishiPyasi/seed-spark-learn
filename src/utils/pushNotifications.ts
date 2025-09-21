// Push notification utility for EcoLogic app
export class PushNotificationService {
  private static instance: PushNotificationService;
  private registration: ServiceWorkerRegistration | null = null;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.permission = Notification.permission;
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  // Register service worker and request notification permission
  public async initialize(): Promise<boolean> {
    try {
      // Check if service workers are supported
      if (!('serviceWorker' in navigator) || !('Notification' in window)) {
        console.warn('Service Workers or Notifications not supported');
        return false;
      }

      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', this.registration);

      // Request notification permission
      const permission = await this.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  // Request notification permission
  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      this.permission = 'granted';
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      this.permission = 'denied';
      return 'denied';
    }

    // Request permission
    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission;
  }

  // Send a local notification
  public async sendNotification(title: string, options: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
    requireInteraction?: boolean;
    silent?: boolean;
  } = {}): Promise<boolean> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return false;
    }

    try {
      const defaultOptions = {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      };

      if (this.registration) {
        await this.registration.showNotification(title, defaultOptions);
      } else {
        new Notification(title, defaultOptions);
      }
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  // Predefined eco-friendly notifications
  public async sendEcoReminder(type: 'water' | 'energy' | 'recycling' | 'challenge' | 'streak'): Promise<void> {
    const notifications: Record<string, {
      title: string;
      body: string;
      tag: string;
      requireInteraction?: boolean;
    }> = {
      water: {
        title: '💧 Water Conservation Reminder',
        body: "Don't forget to turn off the tap while brushing your teeth! Every drop counts.",
        tag: 'eco-water'
      },
      energy: {
        title: '⚡ Energy Saving Tip',
        body: 'Remember to unplug devices when not in use. Small actions, big impact!',
        tag: 'eco-energy'
      },
      recycling: {
        title: '♻️ Recycling Reminder',
        body: 'Check if those containers are clean before recycling. Great job caring for our planet!',
        tag: 'eco-recycling'
      },
      challenge: {
        title: '🏆 New Eco Challenge Available!',
        body: 'A new environmental challenge is waiting for you. Ready to make a difference?',
        tag: 'eco-challenge',
        requireInteraction: true
      },
      streak: {
        title: '🔥 Eco Streak Alert!',
        body: "You're on fire! Don't break your environmental action streak. Log in now!",
        tag: 'eco-streak',
        requireInteraction: true
      }
    };

    const notification = notifications[type];
    await this.sendNotification(notification.title, {
      body: notification.body,
      tag: notification.tag,
      requireInteraction: notification.requireInteraction || false,
      data: { type, timestamp: Date.now() }
    });
  }

  // Schedule daily reminders
  public scheduleDailyReminders(): void {
    // Morning reminder (9 AM)
    this.scheduleNotification(
      '🌅 Good Morning, Eco Warrior!',
      "Start your day with an eco-friendly action. Check your challenges!",
      { hour: 9, minute: 0 }
    );

    // Evening reminder (7 PM)
    this.scheduleNotification(
      '🌙 Evening Eco Check-in',
      "How did your environmental actions go today? Log your progress!",
      { hour: 19, minute: 0 }
    );
  }

  // Schedule a notification for a specific time
  private scheduleNotification(title: string, body: string, time: { hour: number; minute: number }): void {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(time.hour, time.minute, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeout = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      this.sendNotification(title, { body });
      // Reschedule for next day
      this.scheduleNotification(title, body, time);
    }, timeout);
  }

  // Get notification permission status
  public getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  // Clear all notifications with a specific tag
  public async clearNotifications(tag?: string): Promise<void> {
    if (!this.registration) return;

    const notifications = await this.registration.getNotifications({ tag });
    notifications.forEach(notification => notification.close());
  }
}