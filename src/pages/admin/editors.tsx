import type { Section, SectionDataMap, SiteSettings } from '@/cms/types';
import { clampStat, STAT_MAX, STAT_MIN } from '@/cms/resolve';
import { AreaField, Field, LinesField, ListEditor, NumberField, TextField, ToggleField } from './fields';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { CMS_BUCKET, useFileUrl } from '@/cms/api';
import { toast } from 'sonner';
import { useState } from 'react';

type Props<K extends keyof SectionDataMap> = { data: SectionDataMap[K]; set: (patch: Partial<SectionDataMap[K]>) => void };

function HeroEditor({ data, set }: Props<'hero'>) {
  return <>
    <AreaField label="Intro text" value={data.bio} onChange={bio => set({ bio })} />
    <TextField label="Avatar image URL" value={data.profileImage} onChange={profileImage => set({ profileImage })} />
    <LinesField label="Taglines (one is picked at random on each visit)" value={data.taglines} onChange={taglines => set({ taglines })} />
    <TextField label="Main button label" value={data.primaryButtonLabel} onChange={v => set({ primaryButtonLabel: v })} />
    <TextField label="CV button label" value={data.cvButtonLabel} onChange={v => set({ cvButtonLabel: v })} />
  </>;
}

function StatsEditor({ data, set }: Props<'stats'>) {
  return <>
    <TextField label="Heading" value={data.heading} onChange={heading => set({ heading })} />
    <ListEditor label="Categories" items={data.categories} onChange={categories => set({ categories })}
      make={() => ({ key: crypto.randomUUID().slice(0, 8), label: 'NEW CATEGORY', color: '#99CCFF' })}
      title={c => c.label}
      render={(c, s) => <>
        <TextField label="Name" value={c.label} onChange={label => s({ label })} />
        <Field label="Color"><div className="flex gap-2"><input type="color" value={c.color} onChange={e => s({ color: e.target.value })} className="h-10 w-12 rounded border border-border bg-transparent" /><Input value={c.color} onChange={e => s({ color: e.target.value })} /></div></Field>
      </>} />
    <ListEditor label="Stats" items={data.stats} onChange={stats => set({ stats })}
      make={() => ({ label: 'New skill', value: 50, category: data.categories[0]?.key ?? '' })}
      title={st => `${st.label} · ${st.value}`}
      render={(st, s) => <>
        <TextField label="Label" value={st.label} onChange={label => s({ label })} />
        <NumberField label={`Value (${STAT_MIN}-${STAT_MAX})`} min={STAT_MIN} max={STAT_MAX} value={st.value} onChange={v => s({ value: clampStat(v) })} />
        <Field label="Category">
          <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={st.category} onChange={e => s({ category: e.target.value })}>
            {data.categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </Field>
      </>} />
    <ListEditor label="Languages" items={data.languages} onChange={languages => set({ languages })}
      make={() => ({ flag: '🏳️', name: 'Language' })} title={l => `${l.flag} ${l.name}`}
      render={(l, s) => <><TextField label="Flag emoji" value={l.flag} onChange={flag => s({ flag })} /><TextField label="Name" value={l.name} onChange={name => s({ name })} /></>} />
    <ListEditor label="Off-duty interests" items={data.interests} onChange={interests => set({ interests })}
      make={() => ({ emoji: '⭐', label: 'Interest', detail: '' })} title={i => `${i.emoji} ${i.label}`}
      render={(i, s) => <>
        <TextField label="Emoji" value={i.emoji} onChange={emoji => s({ emoji })} />
        <TextField label="Label" value={i.label} onChange={label => s({ label })} />
        <TextField label="Detail" value={i.detail} onChange={detail => s({ detail })} />
        <TextField label="Link (optional)" value={i.link ?? ''} onChange={link => s({ link: link || undefined })} />
      </>} />
  </>;
}

function PublicationsEditor({ data, set }: Props<'publications'>) {
  return <>
    <TextField label="Heading" value={data.heading} onChange={heading => set({ heading })} />
    <ToggleField label="Show Medium articles" value={data.showMedium} onChange={showMedium => set({ showMedium })} />
    <TextField label="Medium username" value={data.mediumUsername} onChange={mediumUsername => set({ mediumUsername })} />
    <ToggleField label="Show YouTube videos" value={data.showYouTube} onChange={showYouTube => set({ showYouTube })} />
    <TextField label="YouTube channel ID" value={data.youtubeChannelId} onChange={youtubeChannelId => set({ youtubeChannelId })} />
    <NumberField label="Max items in carousel" min={1} value={data.maxItems} onChange={maxItems => set({ maxItems })} />
    <ToggleField label="Show LinkedIn posts" value={data.showLinkedIn} onChange={showLinkedIn => set({ showLinkedIn })} />
    <TextField label="LinkedIn heading" value={data.linkedInHeading} onChange={linkedInHeading => set({ linkedInHeading })} />
  </>;
}

function ContactEditor({ data, set }: Props<'contact'>) {
  return <>
    <TextField label="Heading" value={data.heading} onChange={heading => set({ heading })} />
    <AreaField label="Text" value={data.text} onChange={text => set({ text })} rows={2} />
    <TextField label="Email" type="email" value={data.email} onChange={email => set({ email })} />
    <TextField label="Button label" value={data.buttonLabel} onChange={buttonLabel => set({ buttonLabel })} />
  </>;
}

function ProjectsEditor({ data, set }: Props<'projects'>) {
  const titles = Object.entries(data.titles).map(([repo, title]) => ({ repo, title }));
  return <>
    <TextField label="Heading" value={data.heading} onChange={heading => set({ heading })} />
    <TextField label="GitHub username" value={data.githubUsername} onChange={githubUsername => set({ githubUsername })} />
    <LinesField label="Featured repos (in order)" hint="Repo names, one per line. Descriptions always come from GitHub." value={data.featured} onChange={featured => set({ featured })} />
    <LinesField label="Hidden repos" value={data.hidden} onChange={hidden => set({ hidden })} />
    <ListEditor label="Custom titles" items={titles}
      onChange={list => set({ titles: Object.fromEntries(list.map(t => [t.repo, t.title])) })}
      make={() => ({ repo: '', title: '' })} title={t => t.repo || 'New title'}
      render={(t, s) => <><TextField label="Repo name" value={t.repo} onChange={repo => s({ repo })} /><TextField label="Title" value={t.title} onChange={title => s({ title })} /></>} />
    <NumberField label="Max repos shown" min={1} value={data.maxShown} onChange={maxShown => set({ maxShown })} />
    <ToggleField label="Show contribution graph" value={data.showGraph} onChange={showGraph => set({ showGraph })} />
  </>;
}

function ExperienceEditor({ data, set }: Props<'experience'>) {
  return <>
    <TextField label="Heading" value={data.heading} onChange={heading => set({ heading })} />
    <ListEditor label="Jobs" items={data.jobs} onChange={jobs => set({ jobs })}
      make={() => ({ company: 'Company', role: 'Role', period: '', description: '', tags: [] })}
      title={j => `${j.company} · ${j.role}`}
      render={(j, s) => <>
        <TextField label="Company" value={j.company} onChange={company => s({ company })} />
        <TextField label="Role" value={j.role} onChange={role => s({ role })} />
        <TextField label="Period" value={j.period} onChange={period => s({ period })} />
        <AreaField label="Description" value={j.description} onChange={description => s({ description })} />
        <TextField label="Tags (comma separated)" value={(j.tags ?? []).join(', ')} onChange={v => s({ tags: v.split(',').map(t => t.trim()).filter(Boolean) })} />
      </>} />
    <ListEditor label="Education" items={data.education} onChange={education => set({ education })}
      make={() => ({ institution: 'Institution', degree: '', period: '' })}
      title={e => `${e.institution} · ${e.degree}`}
      render={(e, s) => <>
        <TextField label="Institution" value={e.institution} onChange={institution => s({ institution })} />
        <TextField label="Degree" value={e.degree} onChange={degree => s({ degree })} />
        <TextField label="Period" value={e.period} onChange={period => s({ period })} />
        <AreaField label="Details" value={e.details ?? ''} onChange={details => s({ details })} rows={2} />
      </>} />
    <ListEditor label="Certifications" items={data.certifications} onChange={certifications => set({ certifications })}
      make={() => ({ name: 'Certification', date: '' })} title={c => c.name}
      render={(c, s) => <><TextField label="Name" value={c.name} onChange={name => s({ name })} /><TextField label="Date" value={c.date} onChange={date => s({ date })} /></>} />
  </>;
}

function TextEditor({ data, set }: Props<'text'>) {
  return <>
    <TextField label="Heading" value={data.heading} onChange={heading => set({ heading })} />
    <AreaField label="Body" rows={10} hint="Supports **bold**, *italic*, [links](https://…) and - lists." value={data.body} onChange={body => set({ body })} />
  </>;
}

export function SectionEditor({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
  const set = (patch: object) => onChange({ ...section, data: { ...section.data, ...patch } } as Section);
  switch (section.type) {
    case 'hero': return <HeroEditor data={section.data} set={set} />;
    case 'stats': return <StatsEditor data={section.data} set={set} />;
    case 'publications': return <PublicationsEditor data={section.data} set={set} />;
    case 'contact': return <ContactEditor data={section.data} set={set} />;
    case 'projects': return <ProjectsEditor data={section.data} set={set} />;
    case 'experience': return <ExperienceEditor data={section.data} set={set} />;
    case 'text': return <TextEditor data={section.data} set={set} />;
  }
}

const SOCIALS = ['github', 'linkedin', 'medium', 'bluesky', 'instagram'];

export function SettingsEditor({ settings, onChange }: { settings: SiteSettings; onChange: (s: SiteSettings) => void }) {
  const [uploading, setUploading] = useState(false);
  const { data: uploadedUrl } = useFileUrl(settings.resumePath);
  const upload = async (file: File) => {
    setUploading(true);
    const path = `cv/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;
    const { error } = await supabase.storage.from(CMS_BUCKET).upload(path, file, { contentType: file.type || 'application/pdf' });
    setUploading(false);
    if (error) return toast.error(`Upload failed: ${error.message}`);
    onChange({ ...settings, resumePath: path });
    toast.success('CV uploaded. Publish to make it live.');
  };
  return <div className="space-y-4">
    <TextField label="Name" value={settings.name} onChange={name => onChange({ ...settings, name })} />
    {SOCIALS.map(k => (
      <TextField key={k} label={`${k} URL`} value={settings.socials[k] ?? ''} onChange={v => onChange({ ...settings, socials: { ...settings.socials, [k]: v } })} />
    ))}
    <Field label="CV file" hint={settings.resumePath ? 'Using uploaded file.' : `Using built-in file: ${settings.resumeUrl}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Input type="file" accept="application/pdf" disabled={uploading} onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
        {uploadedUrl && <a className="text-sm text-primary underline" href={uploadedUrl} target="_blank" rel="noreferrer">Open uploaded</a>}
        {settings.resumePath && <Button type="button" size="sm" variant="ghost" onClick={() => onChange({ ...settings, resumePath: undefined })}>Use built-in file</Button>}
      </div>
    </Field>
    <div className="grid grid-cols-[5rem_1fr] gap-3">
      <TextField label="Status emoji" value={settings.status.emoji} onChange={emoji => onChange({ ...settings, status: { ...settings.status, emoji } })} />
      <TextField label="Status label" value={settings.status.label} onChange={label => onChange({ ...settings, status: { ...settings.status, label } })} />
    </div>
    <TextField label="Status value" value={settings.status.value} onChange={value => onChange({ ...settings, status: { ...settings.status, value } })} />
    <TextField label="Status link" value={settings.status.url ?? ''} onChange={url => onChange({ ...settings, status: { ...settings.status, url: url || undefined } })} />
  </div>;
}
