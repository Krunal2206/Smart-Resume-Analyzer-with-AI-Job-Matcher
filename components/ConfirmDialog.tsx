"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "info",
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getColorsByType = () => {
    switch (type) {
      case "danger":
        return {
          button: "bg-red-600 hover:bg-red-700",
          icon: "text-red-600",
        };
      case "warning":
        return {
          button: "bg-yellow-600 hover:bg-yellow-700",
          icon: "text-yellow-600",
        };
      default:
        return {
          button: "bg-blue-600 hover:bg-blue-700",
          icon: "text-blue-600",
        };
    }
  };

  const colors = getColorsByType();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        ref={dialogRef}
        className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-800 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-gray-800 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-300">{message}</p>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition ${colors.button} cursor-pointer`}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
