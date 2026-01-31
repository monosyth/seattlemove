const colors = {
  // Primary ocean blues
  pacificBlue: '#1e5a8e',
  pugetSound: '#2968a3',
  skyBlue: '#4a90e2',
  seafoam: '#6ba8c9',

  // Deep water tones
  deepOcean: '#154163',
  midnight: '#0d2d44',

  // Accent colors
  teal: '#2b9298',
  aqua: '#52b5bf',
  coral: '#ff8c69',
  sunrise: '#ffa366',

  // NEW VIBRANT COLORS - Ocean & Tropical (Toned Down)
  turquoise: '#1abc9c',
  cyan: '#00d4ff',
  aquamarine: '#7fffd4',
  coralPink: '#e8a5a5',      // Toned down from #ff6b9d
  starfish: '#ff7f50',
  golden: '#e8d4a5',         // Toned down from #ffd700
  bioluminescent: '#00ffff',
  neonBlue: '#1e90ff',
  glowGreen: '#39ff14',
  seaweed: '#2ecc71',
  emerald: '#27ae60',
  jade: '#00a86b',

  // Neutrals - sand and stone
  charcoal: '#2c3e50',
  slate: '#5f6c7b',
  driftwood: '#8b9ba8',
  sand: '#e8eff5',
  cloud: '#f0f4f8',
  fog: '#f8fafb',
  mist: '#e5edf3',

  // Status
  complete: '#2da771',

  // Legacy compatibility mappings
  evergreen: '#1e5a8e',      // → pacificBlue
  forest: '#154163',         // → deepOcean
  sage: '#6ba8c9',           // → seafoam
  moss: '#52b5bf',           // → aqua
  mountain: '#2c3e50',       // → charcoal
  salmon: '#ff8c69',         // → coral
  sunset: '#ffa366',         // → sunrise
  deepBlue: '#0d2d44',       // → midnight
  duskBlue: '#1a4d6f',       // Dusk over water
  paleBlue: '#d4e6f5',       // Pale water
  goldenHour: '#ffd89b',     // Sunset reflection
  rain: '#94c5d9',           // Rain over water
  bark: '#8b9ba8',           // → driftwood
  cedar: '#b8c5d1',          // Cedar tone
  wheat: '#e8d4b8',          // Wheat/sand
  honey: '#d4aa6a',          // Honey
  cream: '#faf7f2',          // Cream
  white: '#ffffff'           // Pure white
};

export const styles = {
  // Container
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1
  },

  // Loading
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: 'white'
  },
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTop: `4px solid ${colors.mist}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '1.1rem'
  },

  // Header
  header: {
    background: `linear-gradient(135deg, ${colors.pacificBlue} 0%, ${colors.teal} 100%)`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 15s ease infinite',
    borderRadius: '20px',
    padding: '32px 40px',
    marginBottom: '24px',
    boxShadow: '0 4px 16px rgba(30, 90, 142, 0.2)',
    position: 'relative',
    overflow: 'hidden'
  },
  headerContent: {
    position: 'relative',
    zIndex: 1
  },
  headerMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
  },
  titleSection: {
    flex: 1,
    minWidth: '250px'
  },
  title: {
    fontSize: '2.2rem',
    color: 'white',
    marginBottom: '8px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  titleIcon: {
    fontSize: '2.4rem'
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '1.05rem',
    fontWeight: '500',
    letterSpacing: '0.5px'
  },
  saveStatus: {
    textAlign: 'right',
    minHeight: '20px'
  },
  savingIndicator: {
    fontSize: '0.85rem',
    color: 'white',
    padding: '6px 12px',
    background: `linear-gradient(135deg, ${colors.turquoise}, ${colors.teal})`,
    borderRadius: '6px',
    backdropFilter: 'blur(10px)',
    fontWeight: '600',
    animation: 'pulseGlow 1s ease-in-out infinite',
    boxShadow: '0 2px 8px rgba(26, 188, 156, 0.3)'
  },
  savedIndicator: {
    fontSize: '0.85rem',
    color: 'white',
    padding: '6px 12px',
    background: `linear-gradient(135deg, ${colors.seaweed}, ${colors.emerald})`,
    borderRadius: '6px',
    backdropFilter: 'blur(10px)',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(46, 204, 113, 0.25)'
  },

  // Tab Navigation
  tabNav: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap'
  },
  tabBtn: {
    flex: 1,
    minWidth: '80px',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.85)',
    color: colors.slate,
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  tabBtnActive: {
    background: 'white',
    color: colors.evergreen,
    boxShadow: '0 4px 15px rgba(45,90,74,0.15)'
  },
  tabIcon: {
    fontSize: '1rem'
  },
  tabLabel: {},

  // Main Content
  main: {
    background: colors.fog,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.08)',
    flex: 1
  },

  // Checklist
  checklistContainer: {},
  stepTabs: {
    display: 'flex',
    gap: '6px',
    marginBottom: '20px',
    padding: '6px',
    background: colors.fog,
    borderRadius: '12px',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  stepTab: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '8px',
    background: 'transparent',
    color: colors.slate,
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  stepTabActive: {
    background: `linear-gradient(135deg, ${colors.pacificBlue}, ${colors.teal})`,
    color: 'white',
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.3)',
    transform: 'translateY(-2px)',
    fontWeight: 700
  },
  stepTabComplete: {
    color: colors.seaweed,
    fontWeight: '700'
  },
  stepTabCheck: {
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  stepTabLabel: {},
  stepContent: {
    background: colors.paleBlue,
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${colors.mist}`,
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.08)',
    transition: 'all 0.3s ease'
  },
  stepContentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  stepContentTitle: {
    fontSize: '1.25rem',
    color: colors.evergreen,
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0
  },
  stepContentNumber: {
    width: '36px',
    height: '36px',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  stepContentProgress: {
    fontSize: '0.95rem',
    fontWeight: 'bold'
  },
  stepContentDesc: {
    fontSize: '0.9rem',
    color: colors.slate,
    marginBottom: '16px'
  },
  stepProgressBar: {
    height: '8px',
    background: colors.mist,
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(26, 188, 156, 0.1)'
  },
  stepProgressFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${colors.pacificBlue}, ${colors.teal})`,
    transition: 'width 0.4s ease',
    boxShadow: '0 0 8px rgba(30, 90, 142, 0.15)'
  },
  stepNavigation: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: `1px solid ${colors.mist}`
  },
  stepNavBtn: {
    padding: '10px 20px',
    border: `2px solid ${colors.mist}`,
    borderRadius: '8px',
    background: 'white',
    color: colors.slate,
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  stepNavBtnPrimary: {
    background: `linear-gradient(135deg, ${colors.pacificBlue}, ${colors.teal})`,
    color: 'white',
    border: 'none',
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.2)',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(30, 90, 142, 0.3)',
      transform: 'translateY(-2px)'
    }
  },
  stepNavBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed'
  },

  // Step Notes
  stepNotesSection: {
    marginTop: '0',
    paddingTop: '0',
    marginBottom: '32px'
  },
  stepNotesTitle: {
    fontSize: '1.1rem',
    color: colors.charcoal,
    marginBottom: '20px',
    fontWeight: '600'
  },
  stepNotesList: {
    marginBottom: '20px'
  },
  stepNoteItem: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '14px 16px',
    background: 'white',
    borderRadius: '8px',
    marginBottom: '10px',
    border: `2px solid ${colors.mist}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  noteText: {
    flex: 1,
    fontSize: '0.95rem',
    color: colors.charcoal,
    whiteSpace: 'pre-wrap',
    lineHeight: '1.5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
  },
  noteActions: {
    display: 'flex',
    gap: '4px',
    marginLeft: '12px'
  },
  noteActionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background 0.2s'
  },
  addNoteForm: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start'
  },
  noteInput: {
    flex: 1,
    padding: '12px 14px',
    border: `2px solid ${colors.mist}`,
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    lineHeight: '1.5',
    resize: 'vertical',
    transition: 'border-color 0.2s',
    backgroundColor: 'white'
  },
  addNoteBtn: {
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #1e5a8e 0%, #2b9298 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(30, 90, 142, 0.2)',
    flexShrink: 0
  },
  noteEditForm: {
    display: 'flex',
    flex: 1,
    gap: '8px',
    alignItems: 'center'
  },
  noteEditActions: {
    display: 'flex',
    gap: '6px'
  },
  noteSaveBtn: {
    padding: '6px 12px',
    background: 'linear-gradient(135deg, #1e5a8e 0%, #2b9298 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 6px rgba(30, 90, 142, 0.15)'
  },
  noteCancelBtn: {
    padding: '6px 12px',
    background: colors.mist,
    color: colors.slate,
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  confirmDeleteText: {
    fontSize: '0.8rem',
    color: colors.salmon,
    fontWeight: '600',
    marginRight: '4px'
  },
  confirmYesBtn: {
    padding: '4px 10px',
    background: colors.salmon,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  confirmNoBtn: {
    padding: '4px 10px',
    background: colors.mist,
    color: colors.slate,
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // All Notes Section (in Notes tab)
  allNotesSection: {
    marginTop: '32px',
    marginBottom: '24px',
    padding: '20px',
    background: colors.fog,
    borderRadius: '12px',
    border: `1px solid ${colors.mist}`
  },
  allNotesTitle: {
    fontSize: '1.1rem',
    color: colors.evergreen,
    marginBottom: '16px',
    fontWeight: '600'
  },
  allNotesStepGroup: {
    marginBottom: '16px'
  },
  allNotesStepTitle: {
    fontSize: '0.95rem',
    color: colors.forest,
    marginBottom: '8px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  allNotesStepBadge: {
    width: '24px',
    height: '24px',
    background: `linear-gradient(135deg, ${colors.evergreen}, ${colors.forest})`,
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  allNotesList: {},
  allNotesItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    background: 'white',
    borderRadius: '8px',
    marginBottom: '6px',
    border: `1px solid ${colors.mist}`
  },

  checklist: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  checklistItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    background: 'white',
    marginBottom: '6px',
    border: `1px solid ${colors.mist}`
  },
  checklistItemDone: {
    opacity: 0.6
  },
  checklistItemDragging: {
    opacity: 0.4,
    background: colors.fog,
    border: `2px dashed ${colors.slate}`,
    transform: 'scale(0.98)'
  },
  checklistItemDropTarget: {
    borderTop: `3px solid ${colors.evergreen}`,
    background: `linear-gradient(180deg, ${colors.mist}40 0%, white 20%)`,
    transform: 'translateY(2px)'
  },
  dragHandle: {
    cursor: 'grab',
    color: colors.slate,
    fontSize: '1rem',
    padding: '4px 2px',
    userSelect: 'none',
    fontWeight: 'bold',
    letterSpacing: '-2px',
    transition: 'all 0.2s'
  },
  checkbox: {
    width: '22px',
    height: '22px',
    border: `2px solid ${colors.mist}`,
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s'
  },
  checkboxDone: {
    width: '22px',
    height: '22px',
    border: `2px solid ${colors.complete}`,
    background: colors.complete,
    color: 'white',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontWeight: 'bold',
    fontSize: '0.8rem'
  },
  checklistText: {
    flex: 1,
    color: colors.mountain,
    fontSize: '0.9rem'
  },
  checklistTextDone: {
    flex: 1,
    color: colors.rain,
    textDecoration: 'line-through',
    fontSize: '0.9rem'
  },
  categoryBadge: {
    fontSize: '0.65rem',
    padding: '3px 8px',
    borderRadius: '4px',
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  itemActions: {
    display: 'flex',
    gap: '4px',
    marginLeft: 'auto',
    flexShrink: 0
  },
  itemActionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background 0.2s',
    opacity: 0.6
  },
  moveBtn: {
    background: colors.fog,
    border: `1px solid ${colors.mist}`,
    cursor: 'pointer',
    fontSize: '0.75rem',
    padding: '2px 4px',
    borderRadius: '4px',
    transition: 'all 0.2s',
    opacity: 0.7
  },
  itemEditForm: {
    flex: 1,
    display: 'flex'
  },
  itemEditInput: {
    flex: 1,
    padding: '8px 12px',
    border: `2px solid ${colors.skyBlue}`,
    borderRadius: '6px',
    fontSize: '0.9rem',
    outline: 'none'
  },
  addItemBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '8px',
    background: 'transparent',
    border: `2px dashed ${colors.mist}`,
    borderRadius: '8px',
    color: colors.slate,
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  addItemForm: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
    padding: '12px',
    background: colors.fog,
    borderRadius: '8px',
    border: `1px solid ${colors.mist}`
  },
  addItemInput: {
    flex: 1,
    padding: '10px 12px',
    border: `1px solid ${colors.mist}`,
    borderRadius: '6px',
    fontSize: '0.9rem',
    outline: 'none'
  },
  addItemSaveBtn: {
    padding: '10px 16px',
    background: `linear-gradient(135deg, ${colors.pacificBlue}, ${colors.teal})`,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.15)',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(30, 90, 142, 0.25)',
      transform: 'translateY(-2px)'
    }
  },
  addItemCancelBtn: {
    padding: '10px 16px',
    background: colors.mist,
    color: colors.slate,
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // Realtors Section (Step 1)
  realtorsSection: {
    marginTop: '16px',
    marginBottom: '20px'
  },
  realtorsSectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: colors.charcoal,
    marginBottom: '12px'
  },
  realtorCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  realtorCard: {
    background: colors.fog,
    border: `2px solid ${colors.mist}`,
    borderLeft: `4px solid ${colors.turquoise}`,
    borderRadius: '10px',
    padding: '14px',
    position: 'relative',
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.08)',
    transition: 'all 0.3s ease'
  },
  realtorCardRecommended: {
    border: `3px solid ${colors.turquoise}`,
    borderLeft: `4px solid ${colors.teal}`,
    background: colors.paleBlue,
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.12)'
  },
  realtorCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px'
  },
  realtorName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '600',
    color: colors.charcoal
  },
  recommendedBadge: {
    background: `linear-gradient(135deg, ${colors.turquoise}, ${colors.teal})`,
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(26, 188, 156, 0.25)'
  },
  realtorDetail: {
    margin: '4px 0',
    fontSize: '0.85rem',
    color: colors.slate
  },
  realtorNotes: {
    margin: '8px 0 0 0',
    fontSize: '0.85rem',
    color: colors.slate,
    fontStyle: 'italic',
    padding: '8px',
    background: colors.fog,
    borderRadius: '6px',
    whiteSpace: 'pre-wrap'
  },
  realtorWebsiteLink: {
    color: colors.evergreen,
    textDecoration: 'none',
    fontWeight: '500'
  },
  realtorActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: `1px solid ${colors.mist}`
  },
  realtorStarBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: '4px 8px',
    borderRadius: '4px',
    color: colors.slate,
    transition: 'all 0.2s'
  },
  realtorUnstarBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: '4px 8px',
    borderRadius: '4px',
    color: colors.golden,
    transition: 'all 0.2s'
  },
  realtorEditBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '4px 8px',
    borderRadius: '4px',
    opacity: 0.8,
    color: '#4a90e2',
    transition: 'all 0.2s'
  },
  realtorDeleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '4px 8px',
    borderRadius: '4px',
    opacity: 0.8,
    color: colors.coralPink,
    transition: 'all 0.2s'
  },
  realtorEditForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  realtorInput: {
    padding: '10px 12px',
    border: `1px solid ${colors.mist}`,
    borderRadius: '6px',
    fontSize: '0.9rem',
    outline: 'none'
  },
  realtorTextarea: {
    padding: '10px 12px',
    border: `1px solid ${colors.mist}`,
    borderRadius: '6px',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  realtorEditActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '4px'
  },
  realtorSaveBtn: {
    padding: '10px 20px',
    background: `linear-gradient(135deg, ${colors.seaweed}, ${colors.emerald})`,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(46, 204, 113, 0.2)',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)',
      transform: 'translateY(-2px)'
    }
  },
  realtorCancelBtn: {
    padding: '10px 20px',
    background: 'white',
    color: colors.charcoal,
    border: `2px solid ${colors.mist}`,
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  addRealtorBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '12px',
    background: `linear-gradient(135deg, ${colors.pacificBlue}, ${colors.teal})`,
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.15)',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(30, 90, 142, 0.25)',
      transform: 'translateY(-2px)'
    }
  },
  addRealtorForm: {
    marginTop: '12px',
    padding: '16px',
    background: colors.fog,
    borderRadius: '10px',
    border: `1px solid ${colors.mist}`
  },
  addRealtorTitle: {
    margin: '0 0 12px 0',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: colors.charcoal
  },
  realtorFormRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '12px'
  },
  realtorFormLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: colors.mountain,
    letterSpacing: '0.2px'
  },
  realtorFormInput: {
    padding: '10px 14px',
    border: `2px solid ${colors.mist}`,
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    backgroundColor: 'white'
  },
  realtorFormTextarea: {
    padding: '10px 14px',
    border: `2px solid ${colors.mist}`,
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    transition: 'all 0.2s',
    backgroundColor: 'white',
    lineHeight: '1.5',
    minHeight: '80px'
  },
  realtorFormActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: `1px solid ${colors.mist}`
  },
  addRealtorActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: `1px solid ${colors.mist}`
  },
  addRealtorSaveBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #1e5a8e 0%, #2b9298 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(30, 90, 142, 0.2)'
  },
  addRealtorCancelBtn: {
    padding: '10px 20px',
    background: 'white',
    color: colors.charcoal,
    border: `2px solid ${colors.mist}`,
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },

  // Realtor Questions Section
  questionsSection: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: `2px solid ${colors.mist}`
  },
  questionsSectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: colors.charcoal,
    marginBottom: '12px'
  },
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  questionCard: {
    background: 'white',
    border: `1px solid ${colors.mist}`,
    borderRadius: '10px',
    padding: '14px',
    position: 'relative',
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.08)',
    transition: 'all 0.3s ease'
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px'
  },
  questionNumber: {
    background: colors.evergreen,
    color: 'white',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: '600',
    flexShrink: 0
  },
  questionText: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '600',
    color: colors.charcoal,
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap'
  },
  idealAnswerBox: {
    marginTop: '10px',
    marginLeft: '34px',
    padding: '10px',
    background: colors.fog,
    borderRadius: '6px',
    borderLeft: `3px solid ${colors.sage}`
  },
  idealAnswerLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: colors.evergreen,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  idealAnswerText: {
    margin: '4px 0 0 0',
    fontSize: '0.85rem',
    color: colors.slate,
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap'
  },
  answerBox: {
    marginTop: '10px',
    marginLeft: '34px',
    padding: '10px',
    background: `${colors.skyBlue}22`,
    borderRadius: '6px',
    borderLeft: `3px solid ${colors.skyBlue}`
  },
  answerLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: colors.deepBlue,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  answerText: {
    margin: '4px 0 0 0',
    fontSize: '0.85rem',
    color: colors.charcoal,
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap'
  },
  questionActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
    marginLeft: '34px'
  },
  questionEditBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '4px 8px',
    borderRadius: '4px',
    opacity: 0.6
  },
  questionDeleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '4px 8px',
    borderRadius: '4px',
    opacity: 0.6
  },
  questionEditForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  questionLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: colors.mountain,
    letterSpacing: '0.2px',
    marginTop: '12px',
    marginBottom: '6px',
    display: 'block'
  },
  questionTextarea: {
    padding: '10px 14px',
    border: `2px solid ${colors.mist}`,
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    transition: 'all 0.2s',
    backgroundColor: 'white',
    lineHeight: '1.5',
    minHeight: '80px'
  },
  questionEditActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: `1px solid ${colors.mist}`
  },
  questionSaveBtn: {
    padding: '10px 20px',
    background: colors.evergreen,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  questionCancelBtn: {
    padding: '10px 20px',
    background: 'white',
    color: colors.charcoal,
    border: `2px solid ${colors.mist}`,
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  addQuestionBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '12px',
    background: 'linear-gradient(135deg, #1e5a8e 0%, #2b9298 100%)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(30, 90, 142, 0.2)'
  },
  addQuestionForm: {
    marginTop: '12px',
    padding: '16px',
    background: colors.fog,
    borderRadius: '10px',
    border: `1px solid ${colors.mist}`
  },
  addQuestionTitle: {
    margin: '0 0 12px 0',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: colors.charcoal
  },

  // Repairs Section (Step 3)
  repairsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  repairSection: {
    borderRadius: '10px',
    border: '2px solid',
    overflow: 'hidden',
    background: colors.fog,
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.08)',
    transition: 'all 0.3s ease'
  },
  repairSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    color: 'white'
  },
  repairSectionHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  repairSectionTitle: {
    margin: 0,
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  repairSectionProgress: {
    fontSize: '0.8rem',
    opacity: 0.9
  },
  repairSectionTotal: {
    fontSize: '0.95rem',
    fontWeight: '600'
  },
  repairItemsList: {
    padding: '10px'
  },
  repairItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    background: colors.fog,
    marginBottom: '6px',
    border: `1px solid ${colors.mist}`,
    boxShadow: '0 1px 4px rgba(30, 90, 142, 0.05)'
  },
  repairItemDone: {
    opacity: 0.6
  },
  repairItemDragging: {
    opacity: 0.4,
    background: colors.paleBlue,
    border: `2px dashed ${colors.slate}`,
    transform: 'scale(0.98)'
  },
  repairItemDropTarget: {
    borderTop: `3px solid ${colors.evergreen}`,
    background: `linear-gradient(180deg, ${colors.mist}40 0%, ${colors.fog} 20%)`,
    transform: 'translateY(2px)'
  },
  repairItemText: {
    flex: 1,
    color: colors.mountain,
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  repairItemTextDone: {
    flex: 1,
    color: colors.rain,
    textDecoration: 'line-through',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  repairCostInput: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '8px',
    marginRight: '8px',
    flexShrink: 0
  },
  repairCostPrefix: {
    color: colors.slate,
    fontSize: '0.8rem',
    marginRight: '2px'
  },
  repairCostField: {
    width: '70px',
    padding: '4px 6px',
    border: `1px solid ${colors.mist}`,
    borderRadius: '4px',
    fontSize: '0.8rem',
    textAlign: 'right',
    color: colors.mountain,
    background: colors.white
  },
  addRepairItemForm: {
    display: 'flex',
    gap: '8px',
    padding: '10px',
    background: colors.fog,
    borderTop: `1px solid ${colors.mist}`
  },
  addRepairItemBtn: {
    margin: '0 10px 10px 10px',
    padding: '8px',
    background: 'linear-gradient(135deg, #1e5a8e 0%, #2b9298 100%)',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.15)'
  },

  // Budget
  budgetContainer: {
    backgroundColor: colors.sand
  },
  budgetSummary: {
    background: colors.fog,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    border: `1px solid ${colors.mist}`,
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.08)',
    transition: 'all 0.3s ease'
  },
  budgetSummaryTitle: {
    fontSize: '1.1rem',
    color: colors.forest,
    marginBottom: '16px',
    fontWeight: '600'
  },
  budgetLineItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px'
  },
  budgetLineItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    background: 'white',
    borderRadius: '10px'
  },
  budgetLineItemName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: colors.charcoal
  },
  budgetLineItemValue: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: colors.evergreen
  },
  budgetGrandTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: `linear-gradient(135deg, ${colors.pacificBlue}, ${colors.teal})`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 10s ease infinite',
    borderRadius: '10px',
    marginTop: '4px',
    boxShadow: '0 4px 12px rgba(30, 90, 142, 0.2)'
  },
  budgetGrandTotalLabel: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'white',
    letterSpacing: '0.5px'
  },
  budgetGrandTotalValue: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'white',
    letterSpacing: '1px'
  },
  budgetSection: {
    marginBottom: '20px',
    borderRadius: '12px',
    border: '2px solid',
    borderLeft: '6px solid',
    overflow: 'hidden',
    background: 'white',
    boxShadow: '0 4px 20px rgba(26, 188, 156, 0.12)',
    transition: 'all 0.3s ease'
  },
  budgetTitle: {
    color: 'white',
    padding: '12px 16px',
    margin: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  budgetTitleText: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '600'
  },
  budgetTitleDesc: {
    margin: '4px 0 0 0',
    fontSize: '0.75rem',
    opacity: 0.85
  },
  budgetTitleTotal: {
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  budgetTable: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  budgetTh: {
    textAlign: 'left',
    padding: '12px 16px',
    background: colors.fog,
    fontWeight: '600',
    fontSize: '0.8rem',
    color: colors.forest,
    borderBottom: `1px solid ${colors.mist}`
  },
  budgetTd: {
    padding: '10px 16px',
    borderBottom: `1px solid ${colors.fog}`,
    fontSize: '0.9rem',
    verticalAlign: 'middle'
  },
  budgetRowDone: {
    background: colors.fog,
    opacity: 0.7
  },
  budgetItemName: {
    color: colors.mountain
  },
  budgetItemNameDone: {
    color: colors.rain,
    textDecoration: 'line-through'
  },
  budgetDoneCheck: {
    color: colors.complete,
    marginRight: '6px',
    fontWeight: 'bold'
  },
  budgetTableInput: {
    width: '100%',
    padding: '8px 10px',
    border: `2px solid ${colors.skyBlue}`,
    borderRadius: '6px',
    fontSize: '0.9rem',
    outline: 'none'
  },
  costInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: '180px'
  },
  budgetTableActions: {
    display: 'flex',
    gap: '4px',
    justifyContent: 'center'
  },
  budgetTableBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '4px',
    borderRadius: '4px',
    opacity: 0.6,
    transition: 'opacity 0.2s'
  },
  addBudgetRowForm: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    background: colors.fog,
    borderTop: `1px solid ${colors.mist}`
  },
  addBudgetInput: {
    flex: 1,
    padding: '10px 12px',
    border: `1px solid ${colors.mist}`,
    borderRadius: '6px',
    fontSize: '0.9rem',
    outline: 'none'
  },
  budgetItemsList: {
    padding: '12px'
  },
  budgetItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    background: colors.fog,
    marginBottom: '8px',
    border: `1px solid ${colors.mist}`
  },
  budgetItemDone: {
    opacity: 0.6
  },
  budgetItemDragging: {
    opacity: 0.4,
    background: colors.paleBlue,
    border: `2px dashed ${colors.slate}`,
    transform: 'scale(0.98)'
  },
  budgetItemDropTarget: {
    borderTop: `4px solid ${colors.turquoise}`,
    background: `linear-gradient(180deg, rgba(26, 188, 156, 0.1) 0%, ${colors.fog} 20%)`,
    transform: 'translateY(2px)',
    boxShadow: '0 0 15px rgba(26, 188, 156, 0.2)'
  },
  budgetItemText: {
    flex: 1,
    color: colors.mountain,
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  budgetItemTextDone: {
    flex: 1,
    color: colors.rain,
    textDecoration: 'line-through',
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  budgetItemEditForm: {
    flex: 1,
    display: 'flex'
  },
  budgetCostWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '8px'
  },
  budgetItemActions: {
    display: 'flex',
    gap: '4px',
    marginLeft: '8px',
    flexShrink: 0
  },
  addBudgetItemBtn: {
    width: 'calc(100% - 24px)',
    padding: '10px',
    margin: '0 12px 12px 12px',
    background: `linear-gradient(135deg, ${colors.pacificBlue}, ${colors.teal})`,
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    boxShadow: '0 2px 8px rgba(30, 90, 142, 0.15)',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(30, 90, 142, 0.25)',
      transform: 'translateY(-2px)'
    }
  },
  budgetSubtotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: colors.fog,
    borderTop: `1px solid ${colors.mist}`,
    fontSize: '0.9rem',
    fontWeight: '600',
    color: colors.mountain
  },
  budgetSubtotalAmount: {
    color: colors.turquoise,
    fontSize: '1rem',
    fontWeight: '700'
  },
  dollarSign: {
    color: colors.slate,
    marginRight: '4px',
    fontSize: '0.85rem'
  },
  costField: {
    width: '70px',
    minWidth: '150px',
    padding: '6px 8px',
    border: `1px solid ${colors.mist}`,
    borderRadius: '6px',
    fontSize: '0.85rem',
    textAlign: 'right',
    background: 'white'
  },
  grandTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: `linear-gradient(135deg, ${colors.evergreen}, ${colors.forest})`,
    color: 'white',
    padding: '20px 24px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  grandTotalAmount: {
    fontSize: '1.5rem'
  },

  // Timeline
  timelineWrapper: {},
  timelineContainer: {
    position: 'relative',
    paddingLeft: '30px'
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: '24px',
    paddingLeft: '30px',
    marginLeft: '15px',
    backgroundColor: colors.cloud,
    padding: '12px 14px 12px 30px',
    borderRadius: '6px',
    marginBottom: '8px'
  },
  timelineDot: {
    position: 'absolute',
    left: '-15px',
    width: '30px',
    height: '30px',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.85rem'
  },
  timelineContent: {
    background: colors.fog,
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${colors.mist}`
  },
  timelineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '8px'
  },
  timelineTitle: {
    fontSize: '1rem',
    color: colors.evergreen,
    fontWeight: '600',
    margin: 0
  },
  timelineDateBadge: {
    background: colors.skyBlue,
    color: 'white',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  timelineDateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  timelineLabel: {
    fontSize: '0.85rem',
    color: colors.slate
  },
  dateInput: {
    padding: '8px 12px',
    border: `1px solid ${colors.mist}`,
    borderRadius: '8px',
    fontSize: '0.9rem'
  },
  timelineProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  timelineProgressBar: {
    flex: 1,
    height: '6px',
    background: colors.mist,
    borderRadius: '3px',
    overflow: 'hidden'
  },
  timelineProgressFill: {
    height: '100%',
    transition: 'width 0.3s ease'
  },
  timelineProgressText: {
    fontSize: '0.8rem',
    color: colors.slate,
    whiteSpace: 'nowrap'
  },

  // Notes
  notesContainer: {
    backgroundColor: colors.cloud,
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  notesTitle: {
    fontSize: '1.3rem',
    color: colors.evergreen,
    marginBottom: '20px',
    fontWeight: '600'
  },
  notesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  reminderBox: {
    background: colors.paleBlue,
    border: `2px solid ${colors.mist}`,
    borderRadius: '12px',
    padding: '16px'
  },
  reminderTitle: {
    color: colors.deepBlue,
    marginBottom: '12px',
    fontSize: '1rem',
    fontWeight: '600'
  },
  reminderList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  reminderItem: {
    marginBottom: '10px',
    fontSize: '0.9rem',
    color: colors.mountain,
    lineHeight: '1.5'
  },
  notesInputSection: {},
  notesLabel: {
    display: 'block',
    fontSize: '0.9rem',
    color: colors.forest,
    marginBottom: '8px',
    fontWeight: '500'
  },
  notesTextarea: {
    width: '100%',
    minHeight: '180px',
    padding: '16px',
    border: `2px solid ${colors.mist}`,
    borderRadius: '12px',
    fontSize: '1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s',
    lineHeight: '1.5'
  },

  // History
  historyContainer: {},
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  historyTitle: {
    fontSize: '1.3rem',
    color: colors.evergreen,
    fontWeight: '600',
    margin: 0
  },
  historySubtitle: {
    fontSize: '0.9rem',
    color: colors.slate,
    marginBottom: '20px'
  },
  refreshBtn: {
    padding: '8px 16px',
    background: `linear-gradient(135deg, ${colors.skyBlue}, ${colors.duskBlue})`,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  historyLoading: {
    textAlign: 'center',
    padding: '40px',
    color: colors.slate,
    fontSize: '1rem'
  },
  historyEmpty: {
    textAlign: 'center',
    padding: '40px',
    background: colors.fog,
    borderRadius: '12px',
    color: colors.mountain
  },
  historyEmptyHint: {
    fontSize: '0.85rem',
    color: colors.slate,
    marginTop: '8px'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  historyItem: {
    background: colors.fog,
    borderRadius: '10px',
    padding: '14px',
    border: `1px solid ${colors.mist}`
  },
  historyItemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  },
  historyIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '0.85rem',
    flexShrink: 0
  },
  historyDescription: {
    flex: 1,
    fontSize: '0.9rem',
    color: colors.mountain,
    fontWeight: '500'
  },
  historyTime: {
    fontSize: '0.75rem',
    color: colors.slate,
    whiteSpace: 'nowrap'
  },
  historyDetails: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: `1px solid ${colors.mist}`,
    fontSize: '0.85rem'
  },
  historyOldValue: {
    color: colors.salmon,
    marginBottom: '4px',
    padding: '6px 10px',
    background: `${colors.salmon}15`,
    borderRadius: '6px'
  },
  historyNewValue: {
    color: colors.forest,
    padding: '6px 10px',
    background: `${colors.forest}15`,
    borderRadius: '6px'
  },
  historyValueLabel: {
    fontWeight: '600',
    marginRight: '6px'
  },

  // Footer
  footer: {
    textAlign: 'center',
    padding: '16px',
    marginTop: '16px'
  },
  footerText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.85rem'
  }
};
