export enum routes {
  DASHBOARD = '/dashboard',
  LOGIN = '/login'
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
    id: 'notifications',
    title: 'Notifications',
    type: 'basic',
    icon: 'notifications',
    link: '/notifications',
  },

];