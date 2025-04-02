
import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (title: string, options?: { description?: string }) => 
    sonnerToast.success(title, options),
  error: (title: string, options?: { description?: string }) => 
    sonnerToast.error(title, options),
  info: (title: string, options?: { description?: string }) => 
    sonnerToast.info(title, options),
  warning: (title: string, options?: { description?: string }) => 
    sonnerToast.warning(title, options)
};
