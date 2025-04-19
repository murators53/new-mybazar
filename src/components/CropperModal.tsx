"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getCroppedImg } from "@/lib/cropImage";
import { toast } from "sonner";

interface CropperModalProps {
  imageUrl: string;
  originalName: string;
  originalType: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export default function CropperModal({
  imageUrl,
  originalName,
  originalType,
  onClose,
  onCropComplete,
}: CropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleConfirmCrop = async () => {
    try {
      if (!croppedAreaPixels) return;

      const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);

      const extension = originalType.includes("png") ? "png" : "jpg";
      const nameWithoutExtension = originalName.split(".").slice(0, -1).join(".");
      const newFileName = `${nameWithoutExtension}_cropped.${extension}`;

      const croppedFile = new File([croppedBlob], newFileName, {
        type: originalType,
      });

      onCropComplete(croppedFile);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Kırpma başarısız oldu!");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-2xl">
        <DialogTitle>Görseli Kırp</DialogTitle>

        <div className="relative w-full h-[400px] bg-black">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
          />
        </div>

        {/* Zoom + Kırp */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-3/4"
          />

          <button
            type="button"
            onClick={handleConfirmCrop}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
          >
            Kırpmayı Bitir
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
