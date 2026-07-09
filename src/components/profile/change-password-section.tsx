"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChangePasswordForm } from "./change-password-form";
import { KeyIcon, X } from "lucide-react";

export function ChangePasswordSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <KeyIcon className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Change Password</h3>
          </div>
          <Button variant="default" size="sm" className="cursor-pointer" onClick={() => setIsOpen(true)}>
            Change Password
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Update your password to keep your account secure.
        </p>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-card border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <KeyIcon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Change Password</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full" 
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6">
              <ChangePasswordForm onCancel={() => setIsOpen(false)} />
            </div>
          </div>
          <div 
            className="fixed inset-0 -z-10" 
            onClick={() => setIsOpen(false)} 
          />
        </div>
      )}
    </>
  );
}
