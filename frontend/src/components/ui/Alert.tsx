/**
 * Alert component for displaying notifications and messages
 */

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import React from 'react';
import { cn } from '../../utils/cn';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant = 'info', 
    title, 
    message, 
    dismissible = false,
    onDismiss,
    children,
    ...props 
  }, ref) => {
    const variants = {
      success: {
        container: 'bg-success-50 border-success-200 text-success-800',
        icon: 'text-success-600',
        IconComponent: CheckCircle,
      },
      error: {
        container: 'bg-error-50 border-error-200 text-error-800',
        icon: 'text-error-600',
        IconComponent: AlertCircle,
      },
      warning: {
        container: 'bg-warning-50 border-warning-200 text-warning-800',
        icon: 'text-warning-600',
        IconComponent: AlertTriangle,
      },
      info: {
        container: 'bg-primary-50 border-primary-200 text-primary-800',
        icon: 'text-primary-600',
        IconComponent: Info,
      },
    };

    const { container, icon, IconComponent } = variants[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-md border p-4',
          container,
          className
        )}
        {...props}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <IconComponent className={cn('h-5 w-5', icon)} />
          </div>
          <div className="ml-3 flex-1">
            {title && (
              <h3 className="text-sm font-medium mb-1">
                {title}
              </h3>
            )}
            {message && (
              <div className="text-sm">
                {message}
              </div>
            )}
            {children}
          </div>
          {dismissible && (
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className={cn(
                    'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    icon,
                    'hover:bg-opacity-75'
                  )}
                  onClick={onDismiss}
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };

