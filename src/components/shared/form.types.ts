export type IFormControlErrorMessage = {
  required?: string;
  requiredTrue?: string;
  minlength?: string;
  maxlength?: string;
  pattern?: string;
  email?: string;
  min?: string;
  max?: string;
  [key: string]: string | undefined; // custom validators welcome (e.g., usernameTaken)
};

export type IUISize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IUIVariant = 'primary' | 'info' | 'warning' | 'danger' | 'success' | 'outline';

export type IErrorContext = {
  label: string;
  error: unknown;
  control?: unknown;
};

export type IErrors = Record<string, unknown>;
