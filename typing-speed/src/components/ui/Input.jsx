import { twMerge } from "tailwind-merge";

export function Input({ label, error, icon: Icon, className, ...props }) {
  return (
    <div className={twMerge("w-full space-y-1.5", className)}>
      {label && <label className="text-sm font-medium text-text-muted ml-1 uppercase text-[10px] tracking-widest">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          className={twMerge(
            "w-full bg-bg-main/50 border border-border-subtle rounded-xl py-3 px-4 outline-none transition-all text-text-main",
            "focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
            Icon && "pl-12",
            error && "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/10",
            "placeholder:text-text-muted/50"
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}
