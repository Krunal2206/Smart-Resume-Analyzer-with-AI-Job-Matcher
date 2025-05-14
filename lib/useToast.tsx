"use client";

import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "@radix-ui/react-toast";
import { create } from "zustand";

type ToastStore = {
  open: boolean;
  title: string;
  description: string;
  trigger: (title: string, description?: string) => void;
  close: () => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  open: false,
  title: "",
  description: "",
  trigger: (title, description = "") => set({ open: true, title, description }),
  close: () => set({ open: false }),
}));

export function GlobalToaster() {
  const { open, title, description, close } = useToastStore();

  return (
    <ToastProvider>
      <Toast
        open={open}
        onOpenChange={close}
        className="bg-blue-700 text-white px-4 py-3 rounded-lg shadow-lg"
      >
        <ToastTitle className="font-bold">{title}</ToastTitle>
        {description && <ToastDescription>{description}</ToastDescription>}
      </Toast>
      <ToastViewport className="fixed bottom-4 right-4 z-[100]" />
    </ToastProvider>
  );
}
