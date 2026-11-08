/**
 * Neutral values used by the non-Starfleet themes (cupertino, arcadia, nightcity,
 * foxglen) for slots their Theme object does not define. These are the values the
 * components used to hard-code, kept here so those themes keep their look.
 * Starfleet never reads these – it gets every slot from the design-system tokens.
 */
export const legacyNeutrals = {
  hairline: { light: 'rgba(0,0,0,0.06)', dark: 'rgba(255,255,255,0.06)' },
  controlEdge: { light: 'rgba(0,0,0,0.12)', dark: 'rgba(255,255,255,0.12)' },
  hoverEdgeLight: 'rgba(0,0,0,0.15)',
  navInk: { light: 'rgba(0,0,0,0.5)', dark: 'rgba(208,208,208,0.7)' },
  onAccent: { light: '#ffffff', dark: '#000000' },
  /** stat panel is dark in every theme */
  statLabel: '#D0D0D0',
  statTrack: 'rgba(255,255,255,0.06)',
  softShadow: '0 1px 4px rgba(0,0,0,0.06)',
  scrim: 'rgba(0,0,0,0.4)',
  onScrim: '#ffffff',
  linkedin: '#0A66C2',
};
