'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/Card";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  onSave?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  footerText?: string;
  maxWidth?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  loading = false,
  onSave,
  saveLabel = 'Simpan',
  cancelLabel = 'Batal',
  footerText,
  maxWidth = 'max-w-xl'
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full ${maxWidth} rounded-[32px] border bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl transition-all duration-300 border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-primary/5 dark:bg-primary/10 px-6 py-5 border-b border-primary/10 dark:border-slate-800 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {icon && (
                    <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-2xl text-primary">
                      {icon}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold">
                      {title}
                    </h2>
                    {description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Action Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onSave}
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl py-3 px-6 text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {saveLabel}
                    </>
                  )}
                </button>

                <button
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  className="flex-1 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-6 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold transition-all disabled:opacity-50"
                >
                  {cancelLabel}
                </button>
              </div>
              
              {footerText && (
                <p className="text-[10px] text-slate-400 text-center mt-4 uppercase tracking-widest font-bold">
                  {footerText}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
