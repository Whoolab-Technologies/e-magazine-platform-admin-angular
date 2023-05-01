export enum routes {
  DASHBOARD = '/dashboard',
  LOGIN = '/'
}
export const menu = [
  {
    id: 'dashboards',
    title: 'Dashboard',
    type: 'basic',
    icon: 'home',
    link: '/dashboard',
  }, {
    id: 'students',
    title: 'Students',
    type: 'basic',
    icon: 'people',
    link: '/students',
  },
  {
    id: 'edition',
    title: 'Editions',
    type: 'basic',
    icon: 'feeds',
    link: '/editions',
  },
  {
    id: 'notification',
    title: 'Notification',
    type: 'basic',
    icon: 'notifications_none',
    link: '/notification',
  },
];