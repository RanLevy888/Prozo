import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { AvatarInput, avatarError } from "@/components/avatar-input";

export const Route = createFileRoute("/portal/profile")({
  component: Profile,
});

function Profile() {
  const { account, updateAccount } = useStore();
  const [name, setName] = useState(account?.name ?? "");
  const [avatar, setAvatar] = useState(account?.avatar ?? "");
  const [errs, setErrs] = useState<{ name?: string | undefined; avatar?: string | undefined }>({});
  if (!account) return null;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const next = {
      name: !n ? "יש להזין שם מלא" : n.length < 2 || n.length > 80 || n.includes("@") ? "יש להזין שם מלא תקין (לא כתובת אימייל)" : undefined,
      avatar: avatarError(avatar),
    };
    setErrs(next);
    if (next.name || next.avatar) return;
    updateAccount({ name: n, avatar });
    toast.success("הפרופיל עודכן");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">הפרופיל שלי</h1>
      <p className="mt-1 text-sm text-muted-foreground">כך לקוחות יראו אתכם בחיפוש.</p>
      <form noValidate onSubmit={save} className="card-surface mt-6 max-w-xl space-y-5 p-6">
        <label className="block text-sm">שם מלא
          <input className={`field mt-1 ${errs.name ? "border-destructive" : ""}`} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
          {errs.name && <span role="alert" className="mt-1 block text-xs text-destructive">{errs.name}</span>}
        </label>
        <div className="text-sm">תמונת פרופיל<div className="mt-2"><AvatarInput value={avatar} onChange={setAvatar} error={errs.avatar} /></div></div>
        <button className="btn-primary">שמירה</button>
      </form>
    </div>
  );
}
