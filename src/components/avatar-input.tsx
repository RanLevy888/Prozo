import { useState } from "react";
import { Upload } from "lucide-react";

/** Avatar picker: upload a file (≤1.5MB, stored as data URL) or paste an https image URL. */
export function AvatarInput({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string | undefined }) {
  const [localErr, setLocalErr] = useState("");
  const onFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setLocalErr("יש לבחור קובץ תמונה");
    if (file.size > 1.5 * 1024 * 1024) return setLocalErr("התמונה גדולה מדי (עד 1.5MB)");
    setLocalErr("");
    const r = new FileReader();
    r.onload = () => onChange(String(r.result));
    r.readAsDataURL(file);
  };
  const err = localErr || error;
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border bg-secondary">
        {value ? <img src={value} alt="תמונת פרופיל" className="h-full w-full object-cover" /> : <span className="text-xs text-muted-foreground">אין תמונה</span>}
      </div>
      <div className="flex-1 space-y-2">
        <label className="btn-ghost w-fit cursor-pointer py-1.5 text-sm">
          <Upload className="h-4 w-4" />העלאת תמונה
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        <input dir="ltr" className="field text-end" placeholder="או הדביקו קישור לתמונה (https://…)" maxLength={500}
          value={value.startsWith("data:") ? "" : value} onChange={(e) => onChange(e.target.value.trim())} />
        {err && <span role="alert" className="block text-xs text-destructive">{err}</span>}
      </div>
    </div>
  );
}

export const avatarError = (v: string) => {
  if (!v) return "יש להוסיף תמונת פרופיל";
  if (!v.startsWith("data:image/") && !/^https:\/\/\S+$/.test(v)) return "הקישור צריך להתחיל ב-https://";
  return undefined;
};
