"use client";

import { AlertTriangle, Network, ShieldOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type ErrorType = "default" | "network" | "permission";

type Props = {
  message?: string;
  type?: ErrorType;
  statusCode?: number;
};

export default function ErrorMessage({
  message = "Bir hata oluştu.",
  type = "default",
  statusCode,
}: Props) {
  const getIcon = () => {
    switch (type) {
      case "network":
        return <Network className="mx-auto w-8 h-8 text-blue-500" />;
      case "permission":
        return <ShieldOff className="mx-auto w-8 h-8 text-orange-500" />;
      default:
        return <AlertTriangle className="mx-auto w-8 h-8 text-red-500" />;
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <motion.div
      className="text-center space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {getIcon()}
      {statusCode && (
        <p className="text-xs text-gray-400">Hata kodu: {statusCode}</p>
      )}
      <p className="font-semibold text-red-600">{message}</p>

      <Button onClick={handleReload} variant="outline" className="text-sm">
        Tekrar Dene
      </Button>
    </motion.div>
  );
}
