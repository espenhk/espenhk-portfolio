# espenhk.lovable.app

Personal portfolio & CV site for **Espen H. Kristensen** — Data Engineer & Manager at PwC Norway.

🔗 **Live:** [espenhk.lovable.app](https://espenhk.lovable.app)

---

## ✨ Features

- **Hero section** with animated profile card, social links, and downloadable CV
- **Character Sheet** — RPG-inspired skills & interests breakdown with expandable categories
- **Transmissions** — horizontally scrollable publication cards (Medium articles, YouTube videos) with desktop navigation arrows
- **Experience Timeline** — career history, education (Academy), and certifications
- **Repositories** — live GitHub repos fetched via the GitHub API, with language badges, star/fork counts, and expandable details
- **Activity Log** — GitHub contribution graph (via `react-github-calendar`)
- **Contact CTA** — call-to-action section with social links
- **Beyond the Code** — personal interests including cocktails, flag football, and more
- **Dark/light mode** toggle with smooth transitions
- **Starfleet theme** — custom design system with VT323 display font, Outfit body font, and a warm amber/violet/blue palette

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + custom CSS design tokens |
| UI Components | shadcn/ui (Radix primitives) |
| Animations | Framer Motion |
| Data Fetching | TanStack React Query |
| 3D | Three.js + React Three Fiber (section avatars) |
| Routing | React Router v6 |
| Testing | Vitest + Testing Library |

## 📁 Project Structure

```
src/
├── components/
│   ├── mwe/              # Main layout components (Hero, Footer, ThemeToggle)
│   ├── sections/          # Page sections (CharacterSheet, Publications, etc.)
│   ├── 3d/                # Three.js avatar components
│   └── ui/                # shadcn/ui primitives
├── config/themes/         # Theme definitions (Starfleet theme, types)
├── context/               # React context (ThemeContext)
├── data/                  # Static data (experience, character sheet, site config)
├── hooks/                 # Custom hooks
├── lib/                   # Utilities (GitHub API, project resolution)
├── pages/                 # Route pages (Index, NotFound)
└── index.css              # Design tokens & global styles
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Production build
npm run build
```

## 🎨 Theming

The site uses a custom **Starfleet** theme defined in `src/config/themes/starfleet.ts` with:

- **Accent:** `#FF9F1C` (warm amber)
- **Secondary:** `#CC99FF` (soft violet)
- **Tertiary:** `#99CCFF` (ice blue)
- **Fonts:** VT323 (display), Outfit (body), JetBrains Mono (code)

Dark and light mode colors are defined per-token, toggled via `ThemeContext`.

## 📡 Data Sources

- **GitHub API** — repos and contribution graph fetched live for `espenhk`
- **Static data** — experience, education, certifications, and publications defined in `src/data/`
- **Project overrides** — custom titles/descriptions for select repos via `src/data/projectOverrides.ts`

## 📄 License

Personal portfolio — not intended for redistribution.
