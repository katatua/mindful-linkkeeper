
import { useState } from "react";
import {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

// This is an improved implementation of the toast functionality
export function useToast() {
  const [toasts, setToasts] = useState<ToasterToast[]>([]);

  const toast = (props: Omit<ToasterToast, "id">) => {
    const id = genId();
    const newToast = { id, ...props };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    // Auto dismiss toast after delay
    if (newToast.variant !== "destructive") {
      setTimeout(() => {
        dismiss(id);
      }, 5000);
    }
    
    return id;
  };

  const dismiss = (toastId?: string) => {
    setToasts((prevToasts) => 
      prevToasts.filter((toast) => {
        if (toastId) {
          return toast.id !== toastId;
        }
        return false;
      })
    );
  };

  return {
    toast,
    dismiss,
    toasts,
  };
}

// Export the toast function for direct use
export const toast = (props: Omit<ToasterToast, "id">) => {
  console.log("Toast notification:", props);
  // This is a fallback for when the hook isn't available
  // In a real implementation this would be connected to the hook's state
};
