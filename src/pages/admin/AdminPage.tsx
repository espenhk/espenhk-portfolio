import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Copy, Download, Eye, EyeOff, History, LogOut, Plus, Trash2, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { fetchDoc, saveDoc } from '@/cms/api';
import { makeDefaultDoc, newSectionData, sectionTypeLabels } from '@/cms/defaults';
import { moveSection, normalizeDoc } from '@/cms/resolve';
import type { CmsDoc, Section, SectionType } from '@/cms/types';
import { PortfolioView } from '@/pages/Index';
import { useAdmin } from './useAdmin';
import AdminLogin from './AdminLogin';
import { SectionEditor, SettingsEditor } from './editors';

type Revision = { id: string; created_at: string; note: string | null };

function Editor() {
  const [doc, setDoc] = useState<CmsDoc | null>(null);
  const [selected, setSelected] = useState<string>('settings');
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [preview, setPreview] = useState(false);
  const [history, setHistory] = useState<Revision[] | null>(null);
  const [addType, setAddType] = useState<SectionType>('text');
  const loaded = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const d = (await fetchDoc('draft')) ?? (await fetchDoc('published')) ?? makeDefaultDoc();
      setDoc(d); setSelected(d.sections[0]?.id ?? 'settings');
    })();
  }, []);

  // Autosave the draft
  useEffect(() => {
    if (!doc) return;
    if (!loaded.current) { loaded.current = true; return; }
    setSaving('saving');
    const t = setTimeout(async () => {
      try { await saveDoc('draft', doc); setSaving('saved'); }
      catch (e: any) { setSaving('idle'); toast.error(`Could not save draft: ${e.message}`); }
    }, 700);
    return () => clearTimeout(t);
  }, [doc]);

  if (!doc) return <p className="p-8 text-muted-foreground">Loading…</p>;

  const sections = doc.sections;
  const setSections = (s: Section[]) => setDoc({ ...doc, sections: s });
  const current = sections.find(s => s.id === selected);
  const updateSection = (s: Section) => setSections(sections.map(x => (x.id === s.id ? s : x)));

  const publish = async () => {
    try {
      await saveDoc('draft', doc);
      await saveDoc('published', doc);
      await supabase.from('cms_revisions').insert({ doc: doc as any, note: 'Published' });
      toast.success('Published. The live site now shows these changes.');
    } catch (e: any) { toast.error(`Publish failed: ${e.message}`); }
  };

  const loadHistory = async () => {
    const { data } = await supabase.from('cms_revisions').select('id, created_at, note').order('created_at', { ascending: false }).limit(30);
    setHistory(data ?? []);
  };
  const restore = async (id: string) => {
    const { data } = await supabase.from('cms_revisions').select('doc').eq('id', id).maybeSingle();
    if (!data) return;
    setDoc(normalizeDoc(data.doc)); setHistory(null);
    toast.success('Version restored to draft. Publish to make it live.');
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `portfolio-content-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  };
  const importJson = async (file: File) => {
    try { setDoc(normalizeDoc(JSON.parse(await file.text()))); toast.success('Imported into draft.'); }
    catch { toast.error('That file is not valid JSON.'); }
  };

  const addSection = () => {
    const s = { id: crypto.randomUUID(), type: addType, visible: true, data: newSectionData(addType) } as Section;
    setSections([...sections, s]); setSelected(s.id);
  };
  const duplicate = (s: Section) => {
    const i = sections.findIndex(x => x.id === s.id);
    const copy = { ...JSON.parse(JSON.stringify(s)), id: crypto.randomUUID() } as Section;
    setSections([...sections.slice(0, i + 1), copy, ...sections.slice(i + 1)]); setSelected(copy.id);
  };
  const remove = (s: Section) => {
    if (!confirm(`Delete "${sectionTypeLabels[s.type]}" section?`)) return;
    setSections(sections.filter(x => x.id !== s.id)); setSelected('settings');
  };

  if (preview) {
    return (
      <div className="relative">
        <Button className="fixed bottom-4 right-4 z-[100]" onClick={() => setPreview(false)}><X className="h-4 w-4" /> Close preview</Button>
        <PortfolioView doc={doc} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-2xl uppercase tracking-widest">Content console</h1>
        <span className="text-xs text-muted-foreground">{saving === 'saving' ? 'Saving draft…' : saving === 'saved' ? 'Draft saved' : ''}</span>
        <Button variant="outline" size="sm" onClick={() => setPreview(true)}><Eye className="h-4 w-4" /> Preview</Button>
        <Button variant="outline" size="sm" onClick={loadHistory}><History className="h-4 w-4" /> History</Button>
        <Button variant="outline" size="sm" onClick={exportJson}><Download className="h-4 w-4" /> Export</Button>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Import</Button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={e => e.target.files?.[0] && importJson(e.target.files[0])} />
        <Button size="sm" onClick={publish}>Publish</Button>
        <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => supabase.auth.signOut()}><LogOut className="h-4 w-4" /></Button>
      </header>

      {history && (
        <div className="mb-6 rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between"><h2 className="uppercase tracking-wider">Published versions</h2><Button variant="ghost" size="icon" onClick={() => setHistory(null)}><X className="h-4 w-4" /></Button></div>
          {history.length === 0 && <p className="text-sm text-muted-foreground">Nothing published yet.</p>}
          <ul className="space-y-1">
            {history.map(r => (
              <li key={r.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{new Date(r.created_at).toLocaleString()}</span>
                <Button size="sm" variant="outline" onClick={() => restore(r.id)}>Restore</Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <aside className="space-y-2">
          <button onClick={() => setSelected('settings')} className={`w-full rounded-md border px-3 py-2 text-left text-sm ${selected === 'settings' ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
            Site settings
          </button>
          {sections.map((s, i) => (
            <div key={s.id} className={`flex items-center gap-1 rounded-md border px-2 py-1 ${selected === s.id ? 'border-primary bg-primary/10' : 'border-border bg-card'} ${s.visible ? '' : 'opacity-50'}`}>
              <button className="flex-1 truncate py-1 text-left text-sm" onClick={() => setSelected(s.id)}>
                {sectionTypeLabels[s.type]}
                {'heading' in s.data && s.data.heading ? <span className="block truncate text-xs text-muted-foreground">{s.data.heading}</span> : null}
              </button>
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Move up" onClick={() => setSections(moveSection(sections, i, -1))}><ArrowUp className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Move down" onClick={() => setSections(moveSection(sections, i, 1))}><ArrowDown className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label={s.visible ? 'Hide' : 'Show'} onClick={() => updateSection({ ...s, visible: !s.visible })}>
                {s.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <select className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm" value={addType} onChange={e => setAddType(e.target.value as SectionType)}>
              {(Object.keys(sectionTypeLabels) as SectionType[]).map(t => <option key={t} value={t}>{sectionTypeLabels[t]}</option>)}
            </select>
            <Button size="sm" variant="outline" onClick={addSection}><Plus className="h-4 w-4" /> Add</Button>
          </div>
        </aside>

        <section className="space-y-4 rounded-lg border border-border bg-card p-4">
          {selected === 'settings' || !current ? (
            <>
              <h2 className="uppercase tracking-wider">Site settings</h2>
              <SettingsEditor settings={doc.settings} onChange={settings => setDoc({ ...doc, settings })} />
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="mr-auto uppercase tracking-wider">{sectionTypeLabels[current.type]}</h2>
                <Button size="sm" variant="outline" onClick={() => duplicate(current)}><Copy className="h-4 w-4" /> Duplicate</Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => remove(current)}><Trash2 className="h-4 w-4" /> Delete</Button>
              </div>
              <SectionEditor section={current} onChange={updateSection} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const state = useAdmin();
  return (
    <>
      <Helmet><title>Console</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      {state.status === 'loading' && <main className="dark min-h-screen bg-background" />}
      {state.status === 'signed-out' && <AdminLogin />}
      {state.status === 'not-admin' && (
        <main className="dark flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
          <p>Signed in as {state.user.email}, but this account has no editor access.</p>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </main>
      )}
      {state.status === 'admin' && <main className="dark min-h-screen bg-background text-foreground"><Editor /></main>}
    </>
  );
}
