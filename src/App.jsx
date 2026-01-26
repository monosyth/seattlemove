import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const initialData = {
  currentStep: 1,
  notes: '',
  stepNotes: {},
  steps: {
    1: {
      title: 'Select Realtor',
      description: 'Talk to realtor first to get real numbers for repair budget, timeline, and funding needs.',
      targetDate: '',
      items: [
        { id: '1-1', text: '🔍 Research realtors experienced with remote/vacant home sales', done: false },
        { id: '1-2', text: '🗣️ Interview candidates', done: false },
        { id: '1-3', text: '🔎 Verify they will use their inspector before listing', done: false },
        { id: '1-4', text: '📈 Confirm their strategy for maximizing home value', done: false },
        { id: '1-5', text: '💵 Get realistic sale price estimate', done: false },
        { id: '1-6', text: '🔧 Get repair recommendations and cost estimates', done: false },
        { id: '1-7', text: '✍️ Sign listing agreement', done: false },
      ]
    },
    2: {
      title: 'Secure Funding',
      description: 'Now that you have real numbers from the realtor, determine how much you need.',
      targetDate: '',
      items: [
        { id: '2-1', text: '🧮 Calculate total needed (repairs + temp housing + moving + buffer)', done: false },
        { id: '2-2', text: '💰 Decide on 401k loan amount (or Compass Concierge)', done: false },
        { id: '2-3', text: '📝 Apply for and secure the loan', done: false },
        { id: '2-4', text: '🏦 Open separate account to manage these funds', done: false },
      ]
    },
    3: {
      title: 'House Prep - Repairs',
      description: 'Complete necessary repairs to maximize sale price.',
      targetDate: '',
      items: [
        { id: '3-1', text: '💡 Fix garage exterior light (electrical issue)', done: false, category: 'must' },
        { id: '3-2', text: '🔌 Install GFCI outlet in bathroom', done: false, category: 'must' },
        { id: '3-3', text: '🚰 Unclog primary bathroom sink', done: false, category: 'must' },
        { id: '3-4', text: '🚽 Sealant around toilet', done: false, category: 'must' },
        { id: '3-5', text: '🚿 Reseal primary shower tile', done: false, category: 'must' },
        { id: '3-6', text: '🚪 Secure side gate/fence corner', done: false, category: 'must' },
        { id: '3-7', text: '💦 Pressure wash concrete, exterior, windows', done: false, category: 'high' },
        { id: '3-8', text: '🧹 Professional carpet cleaning', done: false, category: 'high' },
        { id: '3-9', text: '✨ Professional move-out cleaning', done: false, category: 'high' },
        { id: '3-10', text: '💡 Replace bathroom light fixtures x3', done: false, category: 'high' },
        { id: '3-11', text: '🪞 Replace mirrors (primary + guest)', done: false, category: 'high' },
        { id: '3-12', text: '🎨 Patch and paint walls/baseboards', done: false, category: 'high' },
        { id: '3-13', text: '🛁 Reface guest bathtub', done: false, category: 'high' },
        { id: '3-14', text: '🌿 Weeds - spray/remove all', done: false, category: 'high' },
        { id: '3-15', text: '🌱 Clean and deodorize turf', done: false, category: 'high' },
      ]
    },
    4: {
      title: 'Sort & Reduce',
      description: 'Decide what to keep, sell, donate, or discard.',
      targetDate: '',
      items: [
        { id: '4-1', text: '📦 Decide what goes to Seattle (storage unit)', done: false },
        { id: '4-2', text: '🏷️ Sell items (Marketplace, OfferUp, etc.)', done: false },
        { id: '4-3', text: '🎁 Donate items', done: false },
        { id: '4-4', text: '🗑️ Discard/junk removal for bulky items', done: false },
        { id: '4-5', text: '🚚 Move items for Seattle to storage unit', done: false },
      ]
    },
    5: {
      title: 'Temp Housing',
      description: 'Find pet-friendly short-term rental in San Diego area.',
      targetDate: '',
      items: [
        { id: '5-1', text: '🔍 Research pet-friendly short-term rentals in San Diego area', done: false },
        { id: '5-2', text: '🐕 Confirm availability and pricing (2 dogs + senior cat)', done: false },
        { id: '5-3', text: '🏡 Secure the temporary rental', done: false },
        { id: '5-4', text: '📅 Coordinate move-in date with house vacate date', done: false },
      ]
    },
    6: {
      title: 'Vacate House',
      description: 'Leave the house empty and ready for showings.',
      targetDate: '',
      items: [
        { id: '6-1', text: '🧹 Schedule professional carpet cleaning', done: false },
        { id: '6-2', text: '✨ Schedule professional move-out cleaning', done: false },
        { id: '6-3', text: '👀 Final walkthrough with realtor', done: false },
        { id: '6-4', text: '🔑 Hand over keys / lockbox setup', done: false },
        { id: '6-5', text: '🏠 Move into temporary San Diego rental', done: false },
      ]
    },
    7: {
      title: 'List & Sell',
      description: 'Get the house on the market and close the sale.',
      targetDate: '',
      items: [
        { id: '7-1', text: '🔎 Pre-listing inspection (realtor\'s inspector)', done: false },
        { id: '7-2', text: '⚠️ Address any inspection surprises', done: false },
        { id: '7-3', text: '📸 Professional photos / staging consultation', done: false },
        { id: '7-4', text: '📋 List the house', done: false },
        { id: '7-5', text: '🏠 Open houses / showings', done: false },
        { id: '7-6', text: '📄 Review offers', done: false },
        { id: '7-7', text: '🤝 Accept offer / enter escrow', done: false },
        { id: '7-8', text: '🎉 Complete sale / close', done: false },
      ]
    },
    8: {
      title: 'Move to Seattle',
      description: 'Make the big move to your new city!',
      targetDate: '',
      items: [
        { id: '8-1', text: '🗺️ Research Seattle neighborhoods for long-term rental', done: false },
        { id: '8-2', text: '🐾 Find pet-friendly rental in Seattle', done: false },
        { id: '8-3', text: '🚛 Hire movers (storage unit → Seattle)', done: false },
        { id: '8-4', text: '✈️ Travel to Seattle (with pets)', done: false },
        { id: '8-5', text: '🏡 Move into Seattle rental', done: false },
        { id: '8-6', text: '📬 Set up mail forwarding to Seattle', done: false },
        { id: '8-7', text: '⚡ Set up utilities at new place', done: false },
        { id: '8-8', text: '📝 Update address with important accounts', done: false },
      ]
    },
    9: {
      title: 'Post-Closing',
      description: 'Wrap up financial matters after the sale.',
      targetDate: '',
      items: [
        { id: '9-1', text: '💳 Pay off all debts from proceeds', done: false },
        { id: '9-2', text: '🔄 Repay 401k loan (if taken)', done: false },
        { id: '9-3', text: '🔌 Cancel utilities at San Diego house', done: false },
        { id: '9-4', text: '🏦 Set up new bank accounts if needed', done: false },
        { id: '9-5', text: '🛡️ Establish emergency fund', done: false },
      ]
    }
  },
  budget: {
    must: [
      { id: 'b1', item: 'Fix garage exterior light', cost: '' },
      { id: 'b2', item: 'Install GFCI outlet in bathroom', cost: '' },
      { id: 'b3', item: 'Unclog primary bathroom sink', cost: '' },
      { id: 'b4', item: 'Sealant around toilet', cost: '' },
      { id: 'b5', item: 'Reseal primary shower tile', cost: '' },
      { id: 'b6', item: 'Secure side gate/fence corner', cost: '' },
    ],
    high: [
      { id: 'b7', item: 'Pressure wash concrete, exterior, windows', cost: '' },
      { id: 'b8', item: 'Professional carpet cleaning', cost: '' },
      { id: 'b9', item: 'Professional move-out cleaning', cost: '' },
      { id: 'b10', item: 'Replace bathroom light fixtures x3', cost: '' },
      { id: 'b11', item: 'Replace mirrors (primary + guest)', cost: '' },
      { id: 'b12', item: 'Patch and paint walls/baseboards', cost: '' },
      { id: 'b13', item: 'Reface guest bathtub', cost: '' },
      { id: 'b14', item: 'Weeds - spray/remove all', cost: '' },
      { id: 'b15', item: 'Clean and deodorize turf', cost: '' },
    ],
    nice: [
      { id: 'b16', item: 'Replace primary bathroom faucet', cost: '' },
      { id: 'b17', item: 'Match bathroom hardware', cost: '' },
      { id: 'b18', item: 'Kitchen cabinet replacement', cost: '' },
      { id: 'b19', item: 'Repair/paint retaining walls', cost: '' },
      { id: 'b20', item: 'Sand and paint pergola', cost: '' },
      { id: 'b21', item: 'Replace window screens (4)', cost: '' },
      { id: 'b22', item: 'Install stairwell hand railing', cost: '' },
    ],
    other: [
      { id: 'b23', item: 'Temporary housing (est. 4-6 weeks)', cost: '' },
      { id: 'b24', item: 'Storage unit', cost: '' },
      { id: 'b25', item: 'Moving company to Seattle', cost: '' },
      { id: 'b26', item: 'Travel to Seattle (with pets)', cost: '' },
      { id: 'b27', item: 'Buffer/contingency', cost: '' },
    ]
  }
};

const DOCUMENT_ID = 'seattle-move-data';

function App() {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('checklist');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [activeStep, setActiveStep] = useState('1');
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');
  const [confirmDeleteNoteId, setConfirmDeleteNoteId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'seattle-move', DOCUMENT_ID), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
      setLoading(false);
    }, (error) => {
      console.error('Error loading data:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveData = async (newData) => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'seattle-move', DOCUMENT_ID), newData);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving:', error);
    }
    setSaving(false);
  };

  const toggleItem = (stepId, itemId) => {
    const newData = { ...data };
    const item = newData.steps[stepId].items.find(i => i.id === itemId);
    if (item) {
      item.done = !item.done;
      setData(newData);
      saveData(newData);
    }
  };


  const updateTargetDate = (stepId, date) => {
    const newData = { ...data };
    newData.steps[stepId].targetDate = date;
    setData(newData);
    saveData(newData);
  };

  const updateBudgetCost = (category, itemId, cost) => {
    const newData = { ...data };
    const item = newData.budget[category].find(i => i.id === itemId);
    if (item) {
      item.cost = cost;
      setData(newData);
      saveData(newData);
    }
  };

  const updateNotes = (notes) => {
    const newData = { ...data, notes };
    setData(newData);
    saveData(newData);
  };

  const addStepNote = (stepId) => {
    if (!newNoteText.trim()) return;
    const newData = { ...data };
    if (!newData.stepNotes) newData.stepNotes = {};
    if (!newData.stepNotes[stepId]) newData.stepNotes[stepId] = [];
    newData.stepNotes[stepId].push({
      id: Date.now().toString(),
      text: newNoteText.trim(),
      createdAt: new Date().toISOString()
    });
    setData(newData);
    saveData(newData);
    setNewNoteText('');
  };

  const updateStepNote = (stepId, noteId) => {
    if (!editNoteText.trim()) return;
    const newData = { ...data };
    const note = newData.stepNotes[stepId]?.find(n => n.id === noteId);
    if (note) {
      note.text = editNoteText.trim();
      setData(newData);
      saveData(newData);
    }
    setEditingNoteId(null);
    setEditNoteText('');
  };

  const deleteStepNote = (stepId, noteId) => {
    const newData = { ...data };
    newData.stepNotes[stepId] = newData.stepNotes[stepId].filter(n => n.id !== noteId);
    setData(newData);
    saveData(newData);
  };

  const getAllNotes = () => {
    const allNotes = [];
    if (data.stepNotes) {
      Object.entries(data.stepNotes).forEach(([stepId, notes]) => {
        notes.forEach(note => {
          allNotes.push({
            ...note,
            stepId,
            stepTitle: data.steps[stepId]?.title || `Step ${stepId}`
          });
        });
      });
    }
    return allNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getStepProgress = (stepId) => {
    const step = data.steps[stepId];
    if (!step || !step.items.length) return 0;
    const done = step.items.filter(i => i.done).length;
    return Math.round((done / step.items.length) * 100);
  };

  const getOverallProgress = () => {
    let total = 0;
    let done = 0;
    Object.values(data.steps).forEach(step => {
      total += step.items.length;
      done += step.items.filter(i => i.done).length;
    });
    return total ? Math.round((done / total) * 100) : 0;
  };

  const getTotalTasks = () => {
    return Object.values(data.steps).reduce((sum, step) => sum + step.items.length, 0);
  };

  const getCompletedTasks = () => {
    return Object.values(data.steps).reduce((sum, step) => sum + step.items.filter(i => i.done).length, 0);
  };

  const getBudgetTotal = (category) => {
    return data.budget[category].reduce((sum, item) => {
      const cost = parseFloat(item.cost) || 0;
      return sum + cost;
    }, 0);
  };

  const getGrandTotal = () => {
    return ['must', 'high', 'nice', 'other'].reduce((sum, cat) => sum + getBudgetTotal(cat), 0);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading your move plan...</p>
      </div>
    );
  }

  return (
    <div className="app-container" style={styles.container}>
      {/* Header Section */}
      <header className="app-header" style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.headerLeft}>
            <h1 className="app-title" style={styles.title}>🏠 Seattle Move Planner</h1>
            <p className="app-subtitle" style={styles.subtitle}>San Diego → Seattle</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.statsBox}>
              <span style={styles.statNumber}>{getCompletedTasks()}</span>
              <span style={styles.statLabel}>of {getTotalTasks()} tasks</span>
            </div>
          </div>
        </div>

        <div style={styles.overallProgress}>
          <div className="progress-label" style={styles.progressLabel}>
            <span style={styles.progressTitle}>Overall Progress</span>
            <span style={styles.progressPercent}>{getOverallProgress()}%</span>
          </div>
          <div style={styles.progressBarOuter}>
            <div style={{
              ...styles.progressBarInner,
              width: `${getOverallProgress()}%`,
              background: getOverallProgress() === 100 ? colors.complete : `linear-gradient(90deg, ${colors.evergreen}, ${colors.sage})`
            }}></div>
          </div>
        </div>

        <div style={styles.saveStatus}>
          {saving ? (
            <span style={styles.savingIndicator}>💾 Saving...</span>
          ) : lastSaved ? (
            <span style={styles.savedIndicator}>✓ Saved {lastSaved.toLocaleTimeString()}</span>
          ) : null}
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-nav" style={styles.tabNav}>
        {[
          { id: 'checklist', icon: '✓', label: 'Checklist' },
          { id: 'budget', icon: '💰', label: 'Budget' },
          { id: 'timeline', icon: '📅', label: 'Timeline' },
          { id: 'notes', icon: '📝', label: 'Notes' }
        ].map(tab => (
          <button
            key={tab.id}
            className="tab-btn"
            style={activeTab === tab.id ? {...styles.tabBtn, ...styles.tabBtnActive} : styles.tabBtn}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
            <span style={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="main-content" style={styles.main}>

        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <div style={styles.checklistContainer}>
            {/* Step Tabs */}
            <div className="step-tabs" style={styles.stepTabs}>
              {Object.entries(data.steps).map(([stepId, step]) => {
                const progress = getStepProgress(stepId);
                const isComplete = progress === 100;
                const isActive = activeStep === stepId;
                const shortLabels = {
                  '1': '👤 Realtor',
                  '2': '💰 Funding',
                  '3': '🔧 Repairs',
                  '4': '📦 Sort',
                  '5': '🏡 Temp Home',
                  '6': '🚪 Vacate',
                  '7': '🏷️ Sell',
                  '8': '🚚 Move',
                  '9': '✅ Closing'
                };

                return (
                  <button
                    key={stepId}
                    className="step-tab"
                    style={{
                      ...styles.stepTab,
                      ...(isActive ? styles.stepTabActive : {}),
                      ...(isComplete && !isActive ? styles.stepTabComplete : {})
                    }}
                    onClick={() => setActiveStep(stepId)}
                    title={step.title}
                  >
                    {isComplete && <span style={styles.stepTabCheck}>✓</span>}
                    <span className="step-tab-label" style={styles.stepTabLabel}>{shortLabels[stepId]}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Step Content */}
            {data.steps[activeStep] && (
              <div className="step-content" style={styles.stepContent}>
                <div style={styles.stepContentHeader}>
                  <h2 style={styles.stepContentTitle}>
                    <span style={{
                      ...styles.stepContentNumber,
                      background: getStepProgress(activeStep) === 100 ? colors.complete : `linear-gradient(135deg, ${colors.evergreen}, ${colors.forest})`
                    }}>
                      {getStepProgress(activeStep) === 100 ? '✓' : activeStep}
                    </span>
                    {data.steps[activeStep].title}
                  </h2>
                  <span style={{
                    ...styles.stepContentProgress,
                    color: getStepProgress(activeStep) === 100 ? colors.complete : colors.evergreen
                  }}>
                    {data.steps[activeStep].items.filter(i => i.done).length}/{data.steps[activeStep].items.length} tasks
                  </span>
                </div>
                <p style={styles.stepContentDesc}>{data.steps[activeStep].description}</p>

                <div style={styles.stepProgressBar}>
                  <div style={{
                    ...styles.stepProgressFill,
                    width: `${getStepProgress(activeStep)}%`,
                    background: getStepProgress(activeStep) === 100 ? colors.complete : colors.sage
                  }}></div>
                </div>

                <ul style={styles.checklist}>
                  {data.steps[activeStep].items.map(item => (
                    <li
                      key={item.id}
                      className="checklist-item"
                      style={{
                        ...styles.checklistItem,
                        ...(item.done ? styles.checklistItemDone : {})
                      }}
                      onClick={() => toggleItem(activeStep, item.id)}
                    >
                      <span
                        className="checkbox"
                        style={item.done ? styles.checkboxDone : styles.checkbox}
                      >
                        {item.done ? '✓' : ''}
                      </span>
                      <span
                        className="checklist-text"
                        style={item.done ? styles.checklistTextDone : styles.checklistText}
                      >
                        {item.text}
                      </span>
                      {item.category && (
                        <span
                          className="category-badge"
                          style={{
                            ...styles.categoryBadge,
                            background: item.category === 'must' ? colors.salmon : colors.goldenHour
                          }}
                        >
                          {item.category === 'must' ? 'MUST' : 'HIGH'}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Step Notes */}
                <div style={styles.stepNotesSection}>
                  <h4 style={styles.stepNotesTitle}>📝 Notes for this step</h4>

                  {/* Existing Notes */}
                  {data.stepNotes?.[activeStep]?.length > 0 && (
                    <div style={styles.stepNotesList}>
                      {data.stepNotes[activeStep].map(note => (
                        <div key={note.id} style={styles.stepNoteItem}>
                          {editingNoteId === note.id ? (
                            <div style={styles.noteEditForm}>
                              <input
                                type="text"
                                value={editNoteText}
                                onChange={(e) => setEditNoteText(e.target.value)}
                                style={styles.noteInput}
                                autoFocus
                              />
                              <div style={styles.noteEditActions}>
                                <button
                                  style={styles.noteSaveBtn}
                                  onClick={() => updateStepNote(activeStep, note.id)}
                                >
                                  Save
                                </button>
                                <button
                                  style={styles.noteCancelBtn}
                                  onClick={() => { setEditingNoteId(null); setEditNoteText(''); }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span style={styles.noteText}>{note.text}</span>
                              <div style={styles.noteActions}>
                                {confirmDeleteNoteId === note.id ? (
                                  <>
                                    <span style={styles.confirmDeleteText}>Delete?</span>
                                    <button
                                      style={styles.confirmYesBtn}
                                      onClick={() => { deleteStepNote(activeStep, note.id); setConfirmDeleteNoteId(null); }}
                                    >
                                      Yes
                                    </button>
                                    <button
                                      style={styles.confirmNoBtn}
                                      onClick={() => setConfirmDeleteNoteId(null)}
                                    >
                                      No
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      style={styles.noteActionBtn}
                                      onClick={() => { setEditingNoteId(note.id); setEditNoteText(note.text); }}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      style={styles.noteActionBtn}
                                      onClick={() => setConfirmDeleteNoteId(note.id)}
                                      title="Delete"
                                    >
                                      🗑️
                                    </button>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Note */}
                  <div style={styles.addNoteForm}>
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add a note..."
                      style={styles.noteInput}
                      onKeyPress={(e) => e.key === 'Enter' && addStepNote(activeStep)}
                    />
                    <button
                      style={styles.addNoteBtn}
                      onClick={() => addStepNote(activeStep)}
                      disabled={!newNoteText.trim()}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Step Navigation */}
                <div style={styles.stepNavigation}>
                  <button
                    style={{
                      ...styles.stepNavBtn,
                      ...(activeStep === '1' ? styles.stepNavBtnDisabled : {})
                    }}
                    onClick={() => setActiveStep(String(Number(activeStep) - 1))}
                    disabled={activeStep === '1'}
                  >
                    ← Previous
                  </button>
                  <button
                    style={{
                      ...styles.stepNavBtn,
                      ...styles.stepNavBtnPrimary,
                      ...(activeStep === '9' ? styles.stepNavBtnDisabled : {})
                    }}
                    onClick={() => setActiveStep(String(Number(activeStep) + 1))}
                    disabled={activeStep === '9'}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <div style={styles.budgetContainer}>
            {/* Budget Summary Card */}
            <div style={styles.budgetSummary}>
              <h3 style={styles.budgetSummaryTitle}>Budget Summary</h3>
              <div style={styles.budgetSummaryGrid}>
                {[
                  { key: 'must', label: 'Must Do', color: colors.salmon },
                  { key: 'high', label: 'High Impact', color: colors.goldenHour },
                  { key: 'nice', label: 'Nice to Have', color: colors.duskBlue },
                  { key: 'other', label: 'Moving & Housing', color: colors.deepBlue }
                ].map(({ key, label, color }) => (
                  <div key={key} style={styles.summaryItem}>
                    <div style={{ ...styles.summaryDot, background: color }}></div>
                    <span style={styles.summaryLabel}>{label}</span>
                    <span style={styles.summaryValue}>${getBudgetTotal(key).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Sections */}
            {[
              { key: 'must', title: 'Must Do (Safety/Inspection)', color: colors.salmon },
              { key: 'high', title: 'High Impact (Buyers Notice)', color: colors.goldenHour },
              { key: 'nice', title: 'Nice to Have', color: colors.duskBlue },
              { key: 'other', title: 'Moving & Housing Costs', color: colors.deepBlue }
            ].map(({ key, title, color }) => (
              <div key={key} className="budget-section" style={{...styles.budgetSection, borderColor: color}}>
                <h3 className="budget-title" style={{...styles.budgetTitle, background: color}}>{title}</h3>
                <table className="budget-table" style={styles.budgetTable}>
                  <thead>
                    <tr>
                      <th style={styles.budgetTh}>Item</th>
                      <th style={{...styles.budgetTh, width: '120px', textAlign: 'right'}}>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.budget[key].map(item => (
                      <tr key={item.id}>
                        <td style={styles.budgetTd}>{item.item}</td>
                        <td style={{...styles.budgetTd, textAlign: 'right'}}>
                          <div style={styles.costInput}>
                            <span style={styles.dollarSign}>$</span>
                            <input
                              type="number"
                              className="cost-field"
                              value={item.cost}
                              onChange={(e) => updateBudgetCost(key, item.id, e.target.value)}
                              placeholder="0"
                              style={styles.costField}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr style={styles.subtotalRow}>
                      <td style={styles.budgetTd}><strong>Subtotal</strong></td>
                      <td style={{...styles.budgetTd, textAlign: 'right'}}>
                        <strong>${getBudgetTotal(key).toLocaleString()}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}

            <div className="grand-total" style={styles.grandTotal}>
              <span>GRAND TOTAL</span>
              <span className="grand-total-amount" style={styles.grandTotalAmount}>
                ${getGrandTotal().toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div style={styles.timelineWrapper}>
            <div className="timeline-container" style={styles.timelineContainer}>
              {Object.entries(data.steps).map(([stepId, step], index) => {
                const progress = getStepProgress(stepId);
                const isComplete = progress === 100;
                const isLast = index === Object.keys(data.steps).length - 1;

                return (
                  <div
                    key={stepId}
                    className="timeline-item"
                    style={{
                      ...styles.timelineItem,
                      borderLeft: isLast ? 'none' : '2px solid #e0e0e0'
                    }}
                  >
                    <div
                      className="timeline-dot"
                      style={{
                        ...styles.timelineDot,
                        background: isComplete ? colors.complete : `linear-gradient(135deg, ${colors.evergreen}, ${colors.forest})`
                      }}
                    >
                      {isComplete ? '✓' : stepId}
                    </div>
                    <div className="timeline-content" style={styles.timelineContent}>
                      <div style={styles.timelineHeader}>
                        <h3 className="timeline-title" style={styles.timelineTitle}>{step.title}</h3>
                        {step.targetDate && (
                          <span style={styles.timelineDateBadge}>
                            {new Date(step.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <div className="timeline-date-row" style={styles.timelineDateRow}>
                        <label style={styles.timelineLabel}>Target Date:</label>
                        <input
                          type="date"
                          className="date-input"
                          value={step.targetDate || ''}
                          onChange={(e) => updateTargetDate(stepId, e.target.value)}
                          style={styles.dateInput}
                        />
                      </div>
                      <div style={styles.timelineProgress}>
                        <div style={styles.timelineProgressBar}>
                          <div style={{
                            ...styles.timelineProgressFill,
                            width: `${progress}%`,
                            background: isComplete ? colors.complete : colors.sage
                          }}></div>
                        </div>
                        <span className="timeline-progress-text" style={styles.timelineProgressText}>
                          {step.items.filter(i => i.done).length}/{step.items.length} tasks
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="notes-container" style={styles.notesContainer}>
            <h2 className="notes-title" style={styles.notesTitle}>📝 Notes & Reminders</h2>

            <div style={styles.notesGrid}>
              <div className="reminder-box" style={styles.reminderBox}>
                <h3 className="reminder-title" style={styles.reminderTitle}>🐾 Key Reminders</h3>
                <ul className="reminder-list" style={styles.reminderList}>
                  <li style={styles.reminderItem}>🐕 Two extremely fluffy dogs + senior cat need pet-friendly accommodations</li>
                  <li style={styles.reminderItem}>🏠 House will be empty during showings = less stress, better presentation</li>
                  <li style={styles.reminderItem}>📍 You're nearby in San Diego if any issues arise during sale</li>
                </ul>
              </div>

              <div className="realtor-box" style={styles.realtorBox}>
                <h3 className="realtor-title" style={styles.realtorTitle}>👤 Recommended Realtor</h3>
                <p style={styles.realtorName}>Caitlin Thill - O'Byrne Team / Compass</p>
                <p style={styles.realtorInfo}>$95M+ sales | Compass Concierge available</p>
              </div>
            </div>

            {/* All Step Notes */}
            {getAllNotes().length > 0 && (
              <div style={styles.allNotesSection}>
                <h3 style={styles.allNotesTitle}>📋 All Step Notes</h3>
                {Object.entries(data.steps).map(([stepId, step]) => {
                  const stepNotes = data.stepNotes?.[stepId] || [];
                  if (stepNotes.length === 0) return null;
                  return (
                    <div key={stepId} style={styles.allNotesStepGroup}>
                      <h4 style={styles.allNotesStepTitle}>
                        <span style={styles.allNotesStepBadge}>{stepId}</span>
                        {step.title}
                      </h4>
                      <div style={styles.allNotesList}>
                        {stepNotes.map(note => (
                          <div key={note.id} style={styles.allNotesItem}>
                            {editingNoteId === note.id ? (
                              <div style={styles.noteEditForm}>
                                <input
                                  type="text"
                                  value={editNoteText}
                                  onChange={(e) => setEditNoteText(e.target.value)}
                                  style={styles.noteInput}
                                  autoFocus
                                />
                                <div style={styles.noteEditActions}>
                                  <button
                                    style={styles.noteSaveBtn}
                                    onClick={() => updateStepNote(stepId, note.id)}
                                  >
                                    Save
                                  </button>
                                  <button
                                    style={styles.noteCancelBtn}
                                    onClick={() => { setEditingNoteId(null); setEditNoteText(''); }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span style={styles.noteText}>{note.text}</span>
                                <div style={styles.noteActions}>
                                  {confirmDeleteNoteId === note.id ? (
                                    <>
                                      <span style={styles.confirmDeleteText}>Delete?</span>
                                      <button
                                        style={styles.confirmYesBtn}
                                        onClick={() => { deleteStepNote(stepId, note.id); setConfirmDeleteNoteId(null); }}
                                      >
                                        Yes
                                      </button>
                                      <button
                                        style={styles.confirmNoBtn}
                                        onClick={() => setConfirmDeleteNoteId(null)}
                                      >
                                        No
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        style={styles.noteActionBtn}
                                        onClick={() => { setEditingNoteId(note.id); setEditNoteText(note.text); }}
                                        title="Edit"
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        style={styles.noteActionBtn}
                                        onClick={() => setConfirmDeleteNoteId(note.id)}
                                        title="Delete"
                                      >
                                        🗑️
                                      </button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={styles.notesInputSection}>
              <label style={styles.notesLabel}>General Notes</label>
              <textarea
                className="notes-textarea"
                value={data.notes}
                onChange={(e) => updateNotes(e.target.value)}
                placeholder="Add your general notes, thoughts, and reminders here..."
                style={styles.notesTextarea}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>Data syncs automatically to cloud ☁️</p>
      </footer>
    </div>
  );
}

// PNW Color Palette - brighter and more cheerful
const colors = {
  evergreen: '#3a7a6a',
  forest: '#4a9a7a',
  sage: '#7eb8a5',
  mist: '#b5d9c8',
  fog: '#e8f5ef',
  mountain: '#5a8090',
  slate: '#6a95a5',
  rain: '#8ab5c5',
  cloud: '#f5faf8',
  bark: '#7a6555',
  cedar: '#a08565',
  salmon: '#e8956a',
  sunset: '#f5b88a',
  complete: '#5ab88a',
  // Bright blues
  skyBlue: '#7ab5d5',
  deepBlue: '#5a95b8',
  duskBlue: '#6aa5c5',
  paleBlue: '#c5e0f0',
  // Bright yellows
  goldenHour: '#e5c878',
  wheat: '#ebd898',
  honey: '#dab555',
  cream: '#faf5e5'
};

const styles = {
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
    background: `linear-gradient(135deg, ${colors.cloud} 0%, #fff 100%)`,
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 4px 20px rgba(45,90,74,0.15)',
    borderTop: `4px solid ${colors.evergreen}`
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  headerLeft: {},
  headerRight: {},
  title: {
    fontSize: '1.8rem',
    color: colors.evergreen,
    marginBottom: '4px',
    fontWeight: '700'
  },
  subtitle: {
    color: colors.slate,
    fontSize: '0.95rem'
  },
  statsBox: {
    background: `linear-gradient(135deg, ${colors.evergreen}, ${colors.forest})`,
    color: 'white',
    padding: '12px 20px',
    borderRadius: '12px',
    textAlign: 'center'
  },
  statNumber: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  statLabel: {
    fontSize: '0.75rem',
    opacity: 0.9
  },
  overallProgress: {
    marginBottom: '12px'
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  progressTitle: {
    fontSize: '0.9rem',
    color: '#555',
    fontWeight: '500'
  },
  progressPercent: {
    fontWeight: 'bold',
    color: colors.evergreen,
    fontSize: '0.9rem'
  },
  progressBarOuter: {
    height: '10px',
    background: colors.fog,
    borderRadius: '5px',
    overflow: 'hidden'
  },
  progressBarInner: {
    height: '100%',
    borderRadius: '5px',
    transition: 'width 0.4s ease',
    background: `linear-gradient(90deg, ${colors.evergreen}, ${colors.sage})`
  },
  saveStatus: {
    textAlign: 'right',
    minHeight: '20px',
    marginTop: '8px'
  },
  savingIndicator: {
    fontSize: '0.8rem',
    color: colors.salmon
  },
  savedIndicator: {
    fontSize: '0.8rem',
    color: colors.complete
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
    background: `linear-gradient(180deg, #fff 0%, ${colors.cloud} 100%)`,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(45,90,74,0.12)',
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
    background: 'white',
    color: colors.evergreen,
    boxShadow: '0 2px 8px rgba(45,90,74,0.15)'
  },
  stepTabComplete: {
    color: colors.complete
  },
  stepTabCheck: {
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  stepTabLabel: {},
  stepContent: {
    background: colors.fog,
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${colors.mist}`
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
    height: '6px',
    background: colors.mist,
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '16px'
  },
  stepProgressFill: {
    height: '100%',
    transition: 'width 0.3s ease'
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
    background: `linear-gradient(135deg, ${colors.evergreen}, ${colors.forest})`,
    color: 'white',
    border: 'none'
  },
  stepNavBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed'
  },

  // Step Notes
  stepNotesSection: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: `1px solid ${colors.mist}`
  },
  stepNotesTitle: {
    fontSize: '0.95rem',
    color: colors.forest,
    marginBottom: '12px',
    fontWeight: '600'
  },
  stepNotesList: {
    marginBottom: '12px'
  },
  stepNoteItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    background: 'white',
    borderRadius: '8px',
    marginBottom: '8px',
    border: `1px solid ${colors.mist}`
  },
  noteText: {
    flex: 1,
    fontSize: '0.9rem',
    color: colors.mountain
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
    gap: '8px'
  },
  noteInput: {
    flex: 1,
    padding: '10px 12px',
    border: `1px solid ${colors.mist}`,
    borderRadius: '8px',
    fontSize: '0.9rem',
    outline: 'none'
  },
  addNoteBtn: {
    padding: '10px 16px',
    background: `linear-gradient(135deg, ${colors.evergreen}, ${colors.forest})`,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
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
    background: colors.complete,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer'
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
    gap: '12px',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  checklistItemDone: {
    opacity: 0.6
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

  // Budget
  budgetContainer: {},
  budgetSummary: {
    background: `linear-gradient(135deg, ${colors.fog}, #fff)`,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    border: `1px solid ${colors.mist}`
  },
  budgetSummaryTitle: {
    fontSize: '1rem',
    color: colors.forest,
    marginBottom: '16px',
    fontWeight: '600'
  },
  budgetSummaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px'
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: 'white',
    borderRadius: '8px'
  },
  summaryDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0
  },
  summaryLabel: {
    flex: 1,
    fontSize: '0.8rem',
    color: colors.slate
  },
  summaryValue: {
    fontWeight: 'bold',
    color: colors.evergreen,
    fontSize: '0.9rem'
  },
  budgetSection: {
    marginBottom: '20px',
    borderRadius: '12px',
    border: '2px solid',
    overflow: 'hidden'
  },
  budgetTitle: {
    color: 'white',
    padding: '12px 16px',
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '600'
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
    fontSize: '0.85rem',
    color: colors.forest
  },
  budgetTd: {
    padding: '10px 16px',
    borderBottom: `1px solid ${colors.fog}`,
    fontSize: '0.9rem'
  },
  costInput: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  dollarSign: {
    color: colors.slate,
    marginRight: '4px'
  },
  costField: {
    width: '80px',
    padding: '8px 10px',
    border: `1px solid ${colors.mist}`,
    borderRadius: '6px',
    fontSize: '0.9rem',
    textAlign: 'right'
  },
  subtotalRow: {
    background: colors.fog
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
    marginLeft: '15px'
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
  notesContainer: {},
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
    background: `linear-gradient(135deg, ${colors.paleBlue}22, ${colors.fog})`,
    border: `2px solid ${colors.skyBlue}`,
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
  realtorBox: {
    background: `linear-gradient(135deg, ${colors.cream}44, ${colors.fog})`,
    border: `2px solid ${colors.goldenHour}`,
    borderRadius: '12px',
    padding: '16px'
  },
  realtorTitle: {
    color: colors.honey,
    marginBottom: '8px',
    fontSize: '1rem',
    fontWeight: '600'
  },
  realtorName: {
    fontWeight: 'bold',
    color: colors.evergreen,
    marginBottom: '4px',
    fontSize: '0.95rem'
  },
  realtorInfo: {
    fontSize: '0.85rem',
    color: colors.slate
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
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s'
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

export default App;
