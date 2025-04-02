
import { toast as sonnerToast } from "sonner";
import { useState, useCallback } from "react";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

// Define the toast object with helper methods
export const toast = {
  success: (title: string, options?: { description?: string }) => 
    sonnerToast.success(title, options),
  error: (title: string, options?: { description?: string }) => 
    sonnerToast.error(title, options),
  info: (title: string, options?: { description?: string }) => 
    sonnerToast.info(title, options),
  warning: (title: string, options?: { description?: string }) => 
    sonnerToast.warning(title, options),
  // Default toast method
  default: (props: ToastProps) => {
    if (props.variant === "destructive") {
      return sonnerToast.error(props.title, { description: props.description });
    }
    return sonnerToast(props.title, { description: props.description });
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
