import { Helmet } from 'react-helmet-async';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import KonamiOverlay from '@/components/KonamiOverlay';
import FooterSection from '@/components/mwe/FooterSection';
import NavBar from '@/components/sections/NavBar';
import SectionRenderer from '@/cms/SectionRenderer';
import { SettingsContext, usePublishedDoc } from '@/cms/api';
import { visibleSections } from '@/cms/resolve';
import { makeDefaultDoc } from '@/cms/defaults';
import type { CmsDoc } from '@/cms/types';

function PageContent({ doc, loading }: { doc: CmsDoc; loading?: boolean }) {
  const { theme, palette: p } = useTheme();
  const { activated } = useKonamiCode();
  const mainBg = p.pageBg;

  return (
    <SettingsContext.Provider value={doc.settings}>
      <div style={{
        background: p.flourish ? undefined : mainBg,
        backgroundImage: p.flourish ? mainBg : undefined,
        minHeight: '100vh',
        transition: `background ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}>
        <Helmet>
          <title>Espen H. Kristensen — Data Engineer Portfolio</title>
          <meta name="description" content="Portfolio of Espen H. Kristensen, Data Engineer at TRY. Data engineering, LLMs, responsible AI, projects, and writing." />
          <link rel="canonical" href="https://espenhk.lovable.app/" />
          <meta property="og:title" content="Espen H. Kristensen — Data Engineer Portfolio" />
          <meta property="og:description" content="Data engineering, LLMs and responsible AI — projects, writing, and experience from a Data Engineer at TRY." />
          <meta property="og:url" content="https://espenhk.lovable.app/" />
        </Helmet>
        <KonamiOverlay active={activated} />
        <NavBar />
        <main>
          {!loading && visibleSections(doc).map(s => (
            <SectionRenderer key={s.id} section={s} anchorId={s.anchorId} />
          ))}
        </main>
        {!loading && <FooterSection />}
      </div>
    </SettingsContext.Provider>
  );
}

/** Renders a given doc (used by the editor's draft preview). */
export function PortfolioView({ doc }: { doc: CmsDoc }) {
  return (
    <ThemeProvider>
      <PageContent doc={doc} />
    </ThemeProvider>
  );
}

export default function Index() {
  const { data, isLoading } = usePublishedDoc();
  return (
    <ThemeProvider>
      <PageContent doc={data ?? makeDefaultDoc()} loading={isLoading} />
    </ThemeProvider>
  );
}
