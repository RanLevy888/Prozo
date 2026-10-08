import { createFileRoute } from "@tanstack/react-router";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/portal/documents")({
  component: Documents,
});

const DOCS = [
  { key: "id", title: "תעודה מזהה", desc: "תעודת זהות או דרכון (שני הצדדים)" },
  { key: "cert", title: "תעודה מקצועית / רישיון", desc: "רישיון או הסמכה בתחום שלכם" },
  { key: "firstaid", title: "רענון עזרה ראשונה", desc: "בתוקף מ-24 החודשים האחרונים" },
];

const badge = {
  missing: "bg-secondary text-muted-foreground",
  pending: "bg-warning/15 text-warning",
  approved: "bg-success/15 text-success",
};
const label = { missing: "לא הועלה", pending: "ממתין לבדיקה", approved: "מאושר" };

function Documents() {
  const { account, updateAccount } = useStore();
  if (!account) return null;
  const upload = (key: string) => {
    updateAccount({ docs: { ...account.docs, [key]: "pending" } });
    toast.success("הקובץ הועלה. הצוות שלנו יבדוק אותו תוך 24 שעות");
  };
  return (
    <div>
      <h1 className="text-2xl font-bold">אימות מסמכים</h1>
      <p className="mt-1 text-sm text-muted-foreground">לקוחות רואים רק אנשי מקצוע שהמסמכים שלהם אושרו.</p>
      <div className="mt-6 space-y-3">
        {DOCS.map((d) => {
          const st = account.docs[d.key] ?? "missing";
          return (
            <div key={d.key} className="card-surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{d.title}</p>
                <p className="text-xs text-muted-foreground">{d.desc}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs ${badge[st]}`}>{label[st]}</span>
              <label className="btn-ghost cursor-pointer py-1.5 text-sm">
                <Upload className="h-4 w-4" />{st === "missing" ? "העלאה" : "החלפה"}
                <input type="file" className="hidden" accept="image/*,.pdf" onChange={() => upload(d.key)} />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
