import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const initialData = {
  currentStep: 1,
  notes: '',
  steps: {
    1: {
      title: 'Select Realtor',
      description: 'Talk to realtor first to get real numbers for repair budget, timeline, and funding needs.',
      targetDate: '',
      items: [
        { id: '1-1', text: 'Research realtors experienced with remote/vacant home sales', done: false },
        { id: '1-2', text: 'Interview candidates', done: false },
        { id: '1-3', text: 'Verify they will use their inspector before listing', done: false },
        { id: '1-4', text: 'Confirm their strategy for maximizing home value', done: false },
        { id: '1-5', text: 'Get realistic sale price estimate', done: false },
        { id: '1-6', text: 'Get repair recommendations and cost estimates', done: false },
        { id: '1-7', text: 'Sign listing agreement', done: false },
      ]
    },
    2: {
      title: 'Secure Funding',
      description: 'Now that you have real numbers from the realtor, determine how much you need.',
      targetDate: '',
      items: [
        { id: '2-1', text: 'Calculate total needed (repairs + temp housing + moving + buffer)', done: false },
        { id: '2-2', text: 'Decide on 401k loan amount (or Compass Concierge)', done: false },
        { id: '2-3', text: 'Apply for and secure the loan', done: false },
        { id: '2-4', text: 'Open separate account to manage these funds', done: false },
      ]
    },
    3: {
      title: 'House Prep - Repairs',
      description: 'Complete necessary repairs to maximize sale price.',
      targetDate: '',
      items: [
        { id: '3-1', text: 'Fix garage exterior light (electrical issue)', done: false, category: 'must' },
        { id: '3-2', text: 'Install GFCI outlet in bathroom', done: false, category: 'must' },
        { id: '3-3', text: 'Unclog primary bathroom sink', done: false, category: 'must' },
        { id: '3-4', text: 'Sealant around toilet', done: false, category: 'must' },
        { id: '3-5', text: 'Reseal primary shower tile', done: false, category: 'must' },
        { id: '3-6', text: 'Secure side gate/fence corner', done: false, category: 'must' },
        { id: '3-7', text: 'Pressure wash concrete, exterior, windows', done: false, category: 'high' },
        { id: '3-8', text: 'Professional carpet cleaning', done: false, category: 'high' },
        { id: '3-9', text: 'Professional move-out cleaning', done: false, category: 'high' },
        { id: '3-10', text: 'Replace bathroom light fixtures x3', done: false, category: 'high' },
        { id: '3-11', text: 'Replace mirrors (primary + guest)', done: false, category: 'high' },
        { id: '3-12', text: 'Patch and paint walls/baseboards', done: false, category: 'high' },
        { id: '3-13', text: 'Reface guest bathtub', done: false, category: 'high' },
        { id: '3-14', text: 'Weeds - spray/remove all', done: false, category: 'high' },
        { id: '3-15', text: 'Clean and deodorize turf', done: false, category: 'high' },
      ]
    },
    4: {
      title: 'Sort & Reduce',
      description: 'Decide what to keep, sell, donate, or discard.',
      targetDate: '',
      items: [
        { id: '4-1', text: 'Decide what goes to Seattle (storage unit)', done: false },
        { id: '4-2', text: 'Sell items (Marketplace, OfferUp, etc.)', done: false },
        { id: '4-3', text: 'Donate items', done: false },
        { id: '4-4', text: 'Discard/junk removal for bulky items', done: false },
        { id: '4-5', text: 'Move items for Seattle to storage unit', done: false },
      ]
    },
    5: {
      title: 'Temp Housing',
      description: 'Find pet-friendly short-term rental in San Diego area.',
      targetDate: '',
      items: [
        { id: '5-1', text: 'Research pet-friendly short-term rentals in San Diego area', done: false },
        { id: '5-2', text: 'Confirm availability and pricing (2 dogs + senior cat)', done: false },
        { id: '5-3', text: 'Secure the temporary rental', done: false },
        { id: '5-4', text: 'Coordinate move-in date with house vacate date', done: false },
      ]
    },
    6: {
      title: 'Vacate House',
      description: 'Leave the house empty and ready for showings.',
      targetDate: '',
      items: [
        { id: '6-1', text: 'Schedule professional carpet cleaning', done: false },
        { id: '6-2', text: 'Schedule professional move-out cleaning', done: false },
        { id: '6-3', text: 'Final walkthrough with realtor', done: false },
        { id: '6-4', text: 'Hand over keys / lockbox setup', done: false },
        { id: '6-5', text: 'Move into temporary San Diego rental', done: false },
      ]
    },
    7: {
      title: 'List & Sell',
      description: 'Get the house on the market and close the sale.',
      targetDate: '',
      items: [
        { id: '7-1', text: 'Pre-listing inspection (realtor\'s inspector)', done: false },
        { id: '7-2', text: 'Address any inspection surprises', done: false },
        { id: '7-3', text: 'Professional photos / staging consultation', done: false },
        { id: '7-4', text: 'List the house', done: false },
        { id: '7-5', text: 'Open houses / showings', done: false },
        { id: '7-6', text: 'Review offers', done: false },
        { id: '7-7', text: 'Accept offer / enter escrow', done: false },
        { id: '7-8', text: 'Complete sale / close', done: false },
      ]
    },
    8: {
      title: 'Move to Seattle',
      description: 'Make the big move to your new city!',
      targetDate: '',
      items: [
        { id: '8-1', text: 'Research Seattle neighborhoods for long-term rental', done: false },
        { id: '8-2', text: 'Find pet-friendly rental in Seattle', done: false },
        { id: '8-3', text: 'Hire movers (storage unit → Seattle)', done: false },
        { id: '8-4', text: 'Travel to Seattle (with pets)', done: false },
        { id: '8-5', text: 'Move into Seattle rental', done: false },
        { id: '8-6', text: 'Set up mail forwarding to Seattle', done: false },
        { id: '8-7', text: 'Set up utilities at new place', done: false },
        { id: '8-8', text: 'Update address with important accounts', done: false },
      ]
    },
    9: {
      title: 'Post-Closing',
      description: 'Wrap up financial matters after the sale.',
      targetDate: '',
      items: [
        { id: '9-1', text: 'Pay off all debts from proceeds', done: false },
        { id: '9-2', text: 'Repay 401k loan (if taken)', done: false },
        { id: '9-3', text: 'Cancel utilities at San Diego house', done: false },
        { id: '9-4', text: 'Set up new bank accounts if needed', done: false },
        { id: '9-5', text: 'Establish emergency fund', done: false },
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
        <p>Loading your move plan...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🏠 Seattle Move Planner</h1>
        <p style={styles.subtitle}>San Diego → Seattle</p>
        <div style={styles.overallProgress}>
          <div style={styles.progressLabel}>
            <span>Overall Progress</span>
            <span style={styles.progressPercent}>{getOverallProgress()}%</span>
          </div>
          <div style={styles.progressBarOuter}>
            <div style={{...styles.progressBarInner, width: `${getOverallProgress()}%`, background: getOverallProgress() === 100 ? '#27ae60' : 'linear-gradient(90deg, #667eea, #764ba2)'}}></div>
          </div>
        </div>
        <div style={styles.saveStatus}>
          {saving ? '💾 Saving...' : lastSaved ? `✓ Saved ${lastSaved.toLocaleTimeString()}` : ''}
        </div>
      </header>

      <nav style={styles.tabNav}>
        {['checklist', 'budget', 'timeline', 'notes'].map(tab => (
          <button key={tab} style={activeTab === tab ? {...styles.tabBtn, ...styles.tabBtnActive} : styles.tabBtn} onClick={() => setActiveTab(tab)}>
            {tab === 'checklist' && '✓ Checklist'}
            {tab === 'budget' && '💰 Budget'}
            {tab === 'timeline' && '📅 Timeline'}
            {tab === 'notes' && '📝 Notes'}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {activeTab === 'checklist' && (
          <div>
            {Object.entries(data.steps).map(([stepId, step]) => (
              <div key={stepId} style={styles.stepCard}>
                <div style={styles.stepHeader}>
                  <div style={styles.stepNumber}>{stepId}</div>
                  <div style={styles.stepInfo}>
                    <h2 style={styles.stepTitle}>{step.title}</h2>
                    <p style={styles.stepDesc}>{step.description}</p>
                  </div>
                  <div style={styles.stepProgress}><span style={styles.stepProgressText}>{getStepProgress(stepId)}%</span></div>
                </div>
                <div style={styles.stepProgressBar}>
                  <div style={{...styles.stepProgressFill, width: `${getStepProgress(stepId)}%`, background: getStepProgress(stepId) === 100 ? '#27ae60' : '#667eea'}}></div>
                </div>
                <ul style={styles.checklist}>
                  {step.items.map(item => (
                    <li key={item.id} style={{...styles.checklistItem, ...(item.done ? styles.checklistItemDone : {})}} onClick={() => toggleItem(stepId, item.id)}>
                      <span style={item.done ? styles.checkboxDone : styles.checkbox}>{item.done ? '✓' : ''}</span>
                      <span style={item.done ? styles.checklistTextDone : styles.checklistText}>{item.text}</span>
                      {item.category && <span style={{...styles.categoryBadge, background: item.category === 'must' ? '#e74c3c' : '#f39c12'}}>{item.category === 'must' ? 'MUST' : 'HIGH'}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'budget' && (
          <div>
            {[{ key: 'must', title: 'Must Do (Safety/Inspection)', color: '#e74c3c' }, { key: 'high', title: 'High Impact (Buyers Notice)', color: '#f39c12' }, { key: 'nice', title: 'Nice to Have', color: '#3498db' }, { key: 'other', title: 'Moving & Housing Costs', color: '#9b59b6' }].map(({ key, title, color }) => (
              <div key={key} style={{...styles.budgetSection, borderColor: color}}>
                <h3 style={{...styles.budgetTitle, background: color}}>{title}</h3>
                <table style={styles.budgetTable}>
                  <thead><tr><th style={styles.budgetTh}>Item</th><th style={{...styles.budgetTh, width: '120px', textAlign: 'right'}}>Cost</th></tr></thead>
                  <tbody>
                    {data.budget[key].map(item => (
                      <tr key={item.id}>
                        <td style={styles.budgetTd}>{item.item}</td>
                        <td style={{...styles.budgetTd, textAlign: 'right'}}>
                          <div style={styles.costInput}>
                            <span style={styles.dollarSign}>$</span>
                            <input type="number" value={item.cost} onChange={(e) => updateBudgetCost(key, item.id, e.target.value)} placeholder="0" style={styles.costField} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr style={styles.subtotalRow}><td style={styles.budgetTd}><strong>Subtotal</strong></td><td style={{...styles.budgetTd, textAlign: 'right'}}><strong>${getBudgetTotal(key).toLocaleString()}</strong></td></tr>
                  </tbody>
                </table>
              </div>
            ))}
            <div style={styles.grandTotal}><span>GRAND TOTAL</span><span style={styles.grandTotalAmount}>${getGrandTotal().toLocaleString()}</span></div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div>
            <div style={styles.timelineContainer}>
              {Object.entries(data.steps).map(([stepId, step]) => (
                <div key={stepId} style={styles.timelineItem}>
                  <div style={styles.timelineDot}>{getStepProgress(stepId) === 100 ? '✓' : stepId}</div>
                  <div style={styles.timelineContent}>
                    <h3 style={styles.timelineTitle}>{step.title}</h3>
                    <div style={styles.timelineDateRow}>
                      <label style={styles.timelineLabel}>Target Date:</label>
                      <input type="date" value={step.targetDate || ''} onChange={(e) => updateTargetDate(stepId, e.target.value)} style={styles.dateInput} />
                    </div>
                    <div style={styles.timelineProgress}>
                      <div style={styles.timelineProgressBar}><div style={{...styles.timelineProgressFill, width: `${getStepProgress(stepId)}%`, background: getStepProgress(stepId) === 100 ? '#27ae60' : '#667eea'}}></div></div>
                      <span style={styles.timelineProgressText}>{step.items.filter(i => i.done).length}/{step.items.length} tasks</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div style={styles.notesContainer}>
            <h2 style={styles.notesTitle}>📝 Notes & Reminders</h2>
            <div style={styles.reminderBox}>
              <h3 style={styles.reminderTitle}>Key Reminders</h3>
              <ul style={styles.reminderList}>
                <li>🐕 Two extremely fluffy dogs + senior cat need pet-friendly accommodations</li>
                <li>🏠 House will be empty during showings = less stress, better presentation</li>
                <li>📍 You're nearby in San Diego if any issues arise during sale</li>
              </ul>
            </div>
            <div style={styles.realtorBox}>
              <h3 style={styles.realtorTitle}>Recommended Realtor</h3>
              <p style={styles.realtorName}>Caitlin Thill - O'Byrne Team / Compass</p>
              <p style={styles.realtorInfo}>$95M+ sales | Compass Concierge available</p>
            </div>
            <textarea value={data.notes} onChange={(e) => updateNotes(e.target.value)} placeholder="Add your notes, thoughts, and reminders here..." style={styles.notesTextarea} />
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px', minHeight: '100vh' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'white' },
  loadingSpinner: { width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  header: { background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
  title: { fontSize: '1.8rem', color: '#2c3e50', marginBottom: '4px' },
  subtitle: { color: '#7f8c8d', marginBottom: '20px' },
  overallProgress: { marginBottom: '10px' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#555' },
  progressPercent: { fontWeight: 'bold', color: '#667eea' },
  progressBarOuter: { height: '12px', background: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' },
  progressBarInner: { height: '100%', borderRadius: '6px', transition: 'width 0.3s ease' },
  saveStatus: { textAlign: 'right', fontSize: '0.8rem', color: '#888', marginTop: '10px' },
  tabNav: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  tabBtn: { flex: 1, minWidth: '80px', padding: '12px 16px', border: 'none', borderRadius: '12px', background: 'rgba(255,255,255,0.9)', color: '#555', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' },
  tabBtnActive: { background: 'white', color: '#667eea', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' },
  main: { background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
  stepCard: { background: '#f8f9fa', borderRadius: '12px', padding: '16px', marginBottom: '16px' },
  stepHeader: { display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' },
  stepNumber: { width: '36px', height: '36px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: '1.1rem', color: '#2c3e50', marginBottom: '4px' },
  stepDesc: { fontSize: '0.85rem', color: '#7f8c8d' },
  stepProgress: { flexShrink: 0 },
  stepProgressText: { fontSize: '0.9rem', fontWeight: 'bold', color: '#667eea' },
  stepProgressBar: { height: '4px', background: '#e0e0e0', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' },
  stepProgressFill: { height: '100%', transition: 'width 0.3s ease' },
  checklist: { listStyle: 'none', padding: 0, margin: 0 },
  checklistItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' },
  checklistItemDone: { opacity: 0.6 },
  checkbox: { width: '24px', height: '24px', border: '2px solid #ccc', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' },
  checkboxDone: { width: '24px', height: '24px', border: '2px solid #27ae60', background: '#27ae60', color: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' },
  checklistText: { flex: 1, color: '#333' },
  checklistTextDone: { flex: 1, color: '#888', textDecoration: 'line-through' },
  categoryBadge: { fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', color: 'white', fontWeight: 'bold' },
  budgetSection: { marginBottom: '24px', borderRadius: '12px', border: '2px solid', overflow: 'hidden' },
  budgetTitle: { color: 'white', padding: '12px 16px', margin: 0, fontSize: '1rem' },
  budgetTable: { width: '100%', borderCollapse: 'collapse' },
  budgetTh: { textAlign: 'left', padding: '12px 16px', background: '#f8f9fa', fontWeight: '600', fontSize: '0.85rem', color: '#555' },
  budgetTd: { padding: '10px 16px', borderBottom: '1px solid #eee', fontSize: '0.9rem' },
  costInput: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
  dollarSign: { color: '#888', marginRight: '4px' },
  costField: { width: '80px', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', textAlign: 'right' },
  subtotalRow: { background: '#f8f9fa' },
  grandTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '20px 24px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' },
  grandTotalAmount: { fontSize: '1.5rem' },
  timelineContainer: { position: 'relative', paddingLeft: '30px' },
  timelineItem: { position: 'relative', paddingBottom: '30px', borderLeft: '2px solid #e0e0e0', paddingLeft: '30px', marginLeft: '15px' },
  timelineDot: { position: 'absolute', left: '-15px', width: '30px', height: '30px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' },
  timelineContent: { background: '#f8f9fa', borderRadius: '12px', padding: '16px' },
  timelineTitle: { fontSize: '1rem', color: '#2c3e50', marginBottom: '12px' },
  timelineDateRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  timelineLabel: { fontSize: '0.85rem', color: '#666' },
  dateInput: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem' },
  timelineProgress: { display: 'flex', alignItems: 'center', gap: '12px' },
  timelineProgressBar: { flex: 1, height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' },
  timelineProgressFill: { height: '100%', transition: 'width 0.3s ease' },
  timelineProgressText: { fontSize: '0.8rem', color: '#888', whiteSpace: 'nowrap' },
  notesContainer: { padding: '10px' },
  notesTitle: { fontSize: '1.3rem', color: '#2c3e50', marginBottom: '20px' },
  reminderBox: { background: '#e8f8f5', border: '2px solid #27ae60', borderRadius: '12px', padding: '16px', marginBottom: '20px' },
  reminderTitle: { color: '#27ae60', marginBottom: '12px', fontSize: '1rem' },
  reminderList: { listStyle: 'none', padding: 0, margin: 0 },
  realtorBox: { background: '#f0f9ff', border: '2px solid #3498db', borderRadius: '12px', padding: '16px', marginBottom: '20px' },
  realtorTitle: { color: '#3498db', marginBottom: '8px', fontSize: '1rem' },
  realtorName: { fontWeight: 'bold', color: '#2c3e50', marginBottom: '4px' },
  realtorInfo: { fontSize: '0.85rem', color: '#666' },
  notesTextarea: { width: '100%', minHeight: '200px', padding: '16px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none' },
};

export default App;
