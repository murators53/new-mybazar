// components/DeleteDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";

interface DeleteDialogProps {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteDialog({ open, isLoading, onClose, onConfirm }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Ürünü Sil</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
        </p>
        <DialogFooter className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
          >
            {isLoading ? "Siliniyor..." : "Evet, Sil"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
