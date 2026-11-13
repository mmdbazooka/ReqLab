"use client";
import { Plus, Trash2 } from "lucide-react";
import { usePreferences } from "@/components/preferences";
import type { Pair } from "./model";
export function KeyValueEditor({
  pairs,
  onChange,
  secret = false,
}: {
  pairs: Pair[];
  onChange: (pairs: Pair[]) => void;
  secret?: boolean;
}) {
  const { t } = usePreferences();
  const patch = (id: string, values: Partial<Pair>) =>
    onChange(pairs.map((p) => (p.id === id ? { ...p, ...values } : p)));
  return (
    <div>
      <div className="flex justify-between muted text-[9px] mb-3 px-1">
        <span>{t("KEY", "کلید")}</span>
        <span>{t("VALUE", "مقدار")}</span>
        <span />
      </div>
      {pairs.map((p, i) => (
        <div className="key-value-row" key={p.id}>
          <input
            type="checkbox"
            checked={p.enabled}
            onChange={(e) => patch(p.id, { enabled: e.target.checked })}
            aria-label={t(`Enable row ${i + 1}`, `فعال کردن ردیف ${i + 1}`)}
          />
          <input
            type="text"
            value={p.key}
            maxLength={500}
            onChange={(e) => patch(p.id, { key: e.target.value })}
            placeholder={t("Key", "کلید")}
            aria-label={t(`Key ${i + 1}`, `کلید ${i + 1}`)}
            dir="ltr"
          />
          <input
            type={
              secret && /token|secret|password|key|authorization/i.test(p.key)
                ? "password"
                : "text"
            }
            value={p.value}
            maxLength={10000}
            onChange={(e) => patch(p.id, { value: e.target.value })}
            placeholder={t("Value", "مقدار")}
            aria-label={t(`Value ${i + 1}`, `مقدار ${i + 1}`)}
            dir="ltr"
            autoComplete="off"
          />
          <button
            className="icon-button"
            onClick={() => onChange(pairs.filter((item) => item.id !== p.id))}
            aria-label={t(`Delete row ${i + 1}`, `حذف ردیف ${i + 1}`)}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        className="button small mt-4"
        disabled={pairs.length >= 100}
        onClick={() =>
          onChange([
            ...pairs,
            { id: crypto.randomUUID(), key: "", value: "", enabled: true },
          ])
        }
      >
        <Plus size={12} />
        {t("Add row", "افزودن ردیف")}
      </button>
    </div>
  );
}
