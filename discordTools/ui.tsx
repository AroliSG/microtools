import React from 'react';

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ToolShell: React.FC<DivProps> = ({ className = '', ...props }) => (
  <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${className}`.trim()} {...props} />
);

export const ToolHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <header>
    <h2 className="text-3xl font-extrabold text-white mb-2">{title}</h2>
    <p className="text-[#B5BAC1]">{description}</p>
  </header>
);

export const ToolCard: React.FC<DivProps> = ({ className = '', ...props }) => (
  <section className={`bg-[#2B2D31] p-6 rounded-2xl border border-[#3F4147] shadow-xl ${className}`.trim()} {...props} />
);

export const FieldLabel: React.FC<LabelProps> = ({ className = '', ...props }) => (
  <label className={`block text-xs font-bold text-[#B5BAC1] uppercase tracking-wider mb-2 ${className}`.trim()} {...props} />
);

export const PrimaryButton: React.FC<ButtonProps> = ({ className = '', ...props }) => (
  <button
    className={`w-full py-3 bg-[#5865F2] hover:bg-[#4752C4] disabled:bg-[#4E5058] text-white rounded-lg font-bold transition-all ${className}`.trim()}
    {...props}
  />
);
