import { useState, useCallback } from "react";

type ToastOptions = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

export const useToast = () => {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
    setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
  }, []);

  const toastComponent = toast ? (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg transition-opacity ${
        toast.variant === "destructive" ? "bg-red-500 text-white" : "bg-green-500 text-white"
      }`}
    >
      <strong>{toast.title}</strong>
      <p>{toast.description}</p>
    </div>
  ) : null;

  return { showToast, toastComponent };
};
