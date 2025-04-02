
import { toast as sonnerToast } from "sonner";
import { useState, useCallback } from "react";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;  // Adding the duration property
};

// Define the toast object with helper methods
export const toast = {
  success: (title: string, options?: { description?: string; duration?: number }) => 
    sonnerToast.success(title, options),
  error: (title: string, options?: { description?: string; duration?: number }) => 
    sonnerToast.error(title, options),
  info: (title: string, options?: { description?: string; duration?: number }) => 
    sonnerToast.info(title, options),
  warning: (title: string, options?: { description?: string; duration?: number }) => 
    sonnerToast.warning(title, options),
  // Default toast method
  default: (props: ToastProps) => {
    if (props.variant === "destructive") {
      return sonnerToast.error(props.title, { 
        description: props.description,
        duration: props.duration 
      });
    }
    return sonnerToast(props.title, { 
      description: props.description,
      duration: props.duration 
    });
  }
};

// Create a custom hook that provides toast functionality
export const useToast = () => {
  const [toasts, setToasts] = useState<any[]>([]);

  // Just a dummy function to maintain compatibility
  const dismiss = useCallback((toastId?: string) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);

  return {
    toast: (props: ToastProps) => {
      toast.default(props);
    },
    dismiss,
    toasts
  };
};
