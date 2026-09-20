export type IErrorPageKind =
  | 'not-found'
  | 'unauthorized'
  | 'forbidden'
  | 'server-error'
  | 'service-unavailable'
  | 'application-access-denied'
  | 'timeout'
  | 'custom';

export type IErrorPageMode = 'contained' | 'fullpage';
export type IErrorPageAction = 'home' | 'logout' | 'retry';

export const I_ERROR_PAGE_PRESETS: Record<
  IErrorPageKind,
  { title: string; description: string; icon: string; code: string }
> = {
  'not-found': {
    title: 'Page Not Found',
    description: 'Sorry, the page you are looking for does not exist.',
    icon: 'fa-solid fa-bug',
    code: '404',
  },
  unauthorized: {
    title: 'Unauthorized Access',
    description: 'Sorry, you do not have access to this page.',
    icon: 'fa-solid fa-ban',
    code: '401',
  },
  forbidden: {
    title: 'Unauthorized Access',
    description: 'You do not have access to this page. Please contact your administrator.',
    icon: 'fa-solid fa-user-lock',
    code: '403',
  },
  'server-error': {
    title: 'Something Went Wrong',
    description: 'We could not complete your request. Please try again.',
    icon: 'fa-solid fa-triangle-exclamation',
    code: '500',
  },
  'service-unavailable': {
    title: 'Service Unavailable',
    description: 'The service is temporarily unavailable. Please try again later.',
    icon: 'fa-solid fa-server',
    code: '503',
  },
  timeout: {
    title: 'Request Timed Out',
    description: 'The request took too long to complete. Please try again.',
    icon: 'fa-solid fa-clock',
    code: '',
  },
  'application-access-denied': {
    title: 'Unauthorized Access',
    description:
      'Sorry, your account does not have the required access or role assigned for this application.',
    icon: 'fa-solid fa-user-lock',
    code: '',
  },
  custom: {
    title: 'Unable to Display This Page',
    description: 'Please try again or contact your administrator.',
    icon: 'fa-solid fa-circle-exclamation',
    code: '',
  },
};

export const I_ERROR_PAGE_ACTIONS = {
  home: { label: 'Back to Home', icon: 'fa-solid fa-house', variant: 'primary' },
  logout: { label: 'Logout', icon: 'fa-solid fa-right-from-bracket', variant: 'danger' },
  retry: { label: 'Retry', icon: 'sync', variant: 'primary' },
} as const;

export const I_ERROR_PAGE_SUPPORT_EMAIL = 'it.helpdesk@paramountenterprise.co.id';
