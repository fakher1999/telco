
interface Permission {
  id: string;
  name: string;
}

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

const permissionsMapping: Permission[] = [
  { "id": "66693007e9b2b5672be9fcbf", "name": "TASKS" },
  { "id": "66693050e9b2b5672be9fcc1", "name": "USERS" },
  { "id": "66693082e9b2b5672be9fcc3", "name": "FINANCE" },
  { "id": "671025d272d5a499ec1ddb65", "name": "RAPPORTS" },
];

const allNavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Default',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'tasks',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Task',
        title: 'My Tasks',
        type: 'item',
        classes: 'nav-item',
        url: '/task',
        icon: 'profile',
        target: false,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'users',
    title: 'Users',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Users',
        title: 'Users',
        type: 'item',
        classes: 'nav-item',
        url: '/users',
        icon: 'ant-design',
        target: false,
        external: false
      }
    ]
  },
  {
    id: 'finance',
    title: 'Finance',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'finance',
        title: 'Finance',
        type: 'item',
        url: '/finance',
        classes: 'nav-item',
        icon: 'chrome'
      },
    ]
  },
  {
    id: 'users',
    title: 'Accounts',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'account',
        title: 'Accounts',
        type: 'item',
        url: '/agents',
        classes: 'nav-item',
        icon: 'user'
      },
    ]
  },
  {
    id: 'rapports',
    title: 'Rapports',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'rapports',
        title: 'Rapports',
        type: 'item',
        url: '/rapports',
        classes: 'nav-item',
        icon: 'profile'
      },
    ]
  }
];
const getFilteredNavigation = (): NavigationItem[] => {
  try {
    const storedPermissions = localStorage.getItem('permissions');
    const isAdmin = localStorage.getItem('isadmin') === 'true';
    
    // If user is admin, return all routes
    if (isAdmin) {
      return allNavigationItems;
    }

    // Parse permissions
    let permissionNames: string[] = [];
    if (storedPermissions) {
      const permissionIds = storedPermissions.split(',');
      permissionNames = permissionIds.map(id => {
        const permission = permissionsMapping.find(p => p.id === id);
        return permission ? permission.name : '';
      }).filter(Boolean); // Remove empty strings
    }

    // Always include dashboard
    permissionNames.push('dashboard');

    // Create permission check map for faster lookup
    const permissionMap = new Set(permissionNames.map(p => p.toLowerCase()));

    console.log('permissionMap' , permissionMap)
    // Filter navigation items
    return allNavigationItems.filter(item => {
      // Check if the item's id matches any permission name
      const hasPermission = permissionMap.has(item.id.toLowerCase());

      if (hasPermission) {
        return true;
      }

      // If item has children, filter them as well
      if (item.children && item.children.length > 0) {
        const filteredChildren = item.children.filter(child =>
          permissionMap.has(child.id.toLowerCase())
        );

        if (filteredChildren.length > 0) {
          return {
            ...item,
            children: filteredChildren
          };
        }
      }

      return false;
    });
  } catch (error) {
    console.error('Error filtering navigation:', error);
    // Return only dashboard in case of error
    return allNavigationItems.filter(item => item.id === 'dashboard');
  }
};

export const NavigationItems: NavigationItem[] = getFilteredNavigation();


