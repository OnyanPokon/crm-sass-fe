import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import { DashboardOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

export const landingLink = [
  {
    label: 'Beranda',
    key: '/',
    element: Landing.Home
  }
];

/**
 * @type {{
 *  label: string;
 *  permissions: [Action, import('@/models/Model').ModelChildren][];
 *  roles: Role[];
 *  children: {
 *   path: string;
 *   label: string;
 *   icon: import('react').ReactNode;
 *   element: import('react').ReactNode;
 *   roles?: Role[];
 *   permissions?: [Action, import('@/models/Model').ModelChildren][];
 *  }[];
 * }[]}
 */
export const dashboardLink = [
  {
    label: 'Overview',
    icon: DashboardOutlined,
    children: [{ path: '/tenant/dashboard', label: 'Dashboard', element: Dashboard.TenantDashboard }]
  },
  {
    label: 'Campaign',
    icon: UserOutlined,
    children: [
      { path: '/tenant/dashboard/recipient_types', label: 'Recipient Types', element: Dashboard.RecipientTypes },
      { path: '/tenant/dashboard/recipients', label: 'Recipient', element: Dashboard.Recipients },
      { path: '/tenant/dashboard/statuses', label: 'Status', element: Dashboard.Statuses },
      { path: '/tenant/dashboard/template_messages', label: 'Template', element: Dashboard.TemplateMessages }
    ]
  },
  {
    label: 'Phones',
    icon: PhoneOutlined,
    children: [
      { path: '/tenant/dashboard/messages', label: 'Messages', element: Dashboard.Messages },
      { path: '/tenant/dashboard/phones', label: 'Phones', element: Dashboard.Phones }
    ]
  }
].map((item) => ({
  ...item,
  permissions: item.children.flatMap((child) => child.permissions).filter((permission) => permission),
  roles: item.children.flatMap((child) => child.roles).filter((role) => role)
}));

export const authLink = [
  {
    path: '/auth/login',
    element: Auth.Login
  }
];
