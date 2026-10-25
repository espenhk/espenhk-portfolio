import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextField({ label, value, onChange, hint, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; hint?: string; type?: string }) {
  return <Field label={label} hint={hint}><Input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} /></Field>;
}

export function AreaField({ label, value, onChange, rows = 4, hint }: { label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string }) {
  return <Field label={label} hint={hint}><Textarea rows={rows} value={value ?? ''} onChange={e => onChange(e.target.value)} /></Field>;
}

export function NumberField({ label, value, onChange, min, max, hint }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <Input type="number" inputMode="numeric" pattern="[0-9]*" min={min} max={max} value={Number.isFinite(value) ? value : ''} onChange={e => onChange(Number(e.target.value))} />
    </Field>
  );
}

export function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
      <span className="text-sm">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </label>
  );
}

/** One string per line */
export function LinesField({ label, value, onChange, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; hint?: string }) {
  return (
    <AreaField
      label={label}
      hint={hint ?? 'One per line'}
      rows={Math.min(10, Math.max(3, value.length + 1))}
      value={value.join('\n')}
      onChange={v => onChange(v.split('\n'))}
    />
  );
}

export function ListEditor<T>({ label, items, onChange, make, render, title }: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  make: () => T;
  render: (item: T, set: (patch: Partial<T>) => void, index: number) => ReactNode;
  title?: (item: T) => string;
}) {
  const update = (i: number, patch: Partial<T>) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i: number, d: number) => {
    const to = i + d; if (to < 0 || to >= items.length) return;
    const c = [...items]; [c[i], c[to]] = [c[to], c[i]]; onChange(c);
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
        <Button type="button" size="sm" variant="outline" onClick={() => onChange([...items, make()])}><Plus className="h-4 w-4" /> Add</Button>
      </div>
      {items.map((item, i) => (
        <details key={i} className="rounded-md border border-border bg-card/50">
          <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm">
            <span className="flex-1 truncate">{title?.(item) || `Item ${i + 1}`}</span>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" aria-label="Move up" onClick={e => { e.preventDefault(); move(i, -1); }}><ArrowUp className="h-4 w-4" /></Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" aria-label="Move down" onClick={e => { e.preventDefault(); move(i, 1); }}><ArrowDown className="h-4 w-4" /></Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-destructive" aria-label="Remove" onClick={e => { e.preventDefault(); onChange(items.filter((_, j) => j !== i)); }}><Trash2 className="h-4 w-4" /></Button>
          </summary>
          <div className="space-y-3 border-t border-border p-3">{render(item, p => update(i, p), i)}</div>
        </details>
      ))}
    </div>
  );
}
