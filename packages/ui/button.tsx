// packages/ui/button.tsx
import React from "react";

export const Button = ({ children }: { children: React.ReactNode }) => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded">{children}</button>
);
