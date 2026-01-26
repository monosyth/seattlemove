import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, setDoc, onSnapshot, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';

const initialData = {
  currentStep: 1,
  notes: '',
  stepNotes: {},
  realtors: [
    {
      id: 'r1',
      name: 'Caitlin Thill',
      team: "O'Byrne Team",
      brokerage: 'Compass',
      phone: '',
      email: '',
      website: '',
      notes: '',
      recommended: false
    }
  ],
  realtorQuestions: [
    {
      id: 'q1',
      question: 'How many homes in the $1.5M+ range have you sold in the last 12 months?',
      idealAnswer: '5+ sales, bonus if they can show before/after pricing strategies',
      answer: ''
    },
    {
      id: 'q2',
      question: 'What is your pricing strategy for homes at our value?',
      idealAnswer: 'Data-backed comps, search-band psychology discussion, clear stance on under-pricing vs precision pricing',
      answer: ''
    },
    {
      id: 'q3',
      question: 'What do you personally handle vs delegate?',
      idealAnswer: 'Hands-on involvement at our price range, not just a brand name passing us off to assistants',
      answer: ''
    },
    {
      id: 'q4',
      question: 'Does your firm offer a concierge program? What\'s included?',
      idealAnswer: 'Budget/priority list options, realistic repair timeline (~1 month max), experience with concierge packages, won\'t exceed budget or eat into sale proceeds',
      answer: ''
    },
    {
      id: 'q5',
      question: 'What experience do you have with remote/hands-off sales?',
      idealAnswer: 'Weekly update cadence, digital signing capability, comfort managing without us present, could enable faster transition to Seattle',
      answer: ''
    },
    {
      id: 'q6',
      question: 'What is your commission rate and is it negotiable?',
      idealAnswer: 'Transparency, willingness to discuss - good realtors expect negotiation',
      answer: ''
    }
  ],
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
      { id: 'b28', item: 'Handrail installation (lower stairs)', cost: '' },
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
      { id: 'b29', item: 'Patch and paint above living room TV', cost: '' },
      { id: 'b30', item: 'Sand & paint wooden handrail (upper stairs)', cost: '' },
    ],
    nice: [
      { id: 'b16', item: 'Replace primary bathroom faucet', cost: '' },
      { id: 'b17', item: 'Match bathroom hardware', cost: '' },
      { id: 'b18', item: 'Kitchen cabinet replacement', cost: '' },
      { id: 'b19', item: 'Repair/paint retaining walls', cost: '' },
      { id: 'b20', item: 'Sand and paint pergola', cost: '' },
      { id: 'b21', item: 'Replace window screens (4)', cost: '' },
      { id: 'b22', item: 'Install stairwell hand railing', cost: '' },
      { id: 'b31', item: 'Professional landscaping', cost: '' },
      { id: 'b32', item: 'Painting gazebo and pergola', cost: '' },
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
  const [changelog, setChangelog] = useState([]);
  const [changelogLoading, setChangelogLoading] = useState(false);
  // Checklist item editing/reordering state
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemText, setEditItemText] = useState('');
  const [confirmDeleteItemId, setConfirmDeleteItemId] = useState(null);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [dragOverItemId, setDragOverItemId] = useState(null);
  const [newItemStepId, setNewItemStepId] = useState(null);
  const [newItemText, setNewItemText] = useState('');
  // Budget item editing/reordering state
  const [editingBudgetItemId, setEditingBudgetItemId] = useState(null);
  const [editBudgetItemText, setEditBudgetItemText] = useState('');
  const [confirmDeleteBudgetItemId, setConfirmDeleteBudgetItemId] = useState(null);
  const [draggedBudgetItemId, setDraggedBudgetItemId] = useState(null);
  const [dragOverBudgetItemId, setDragOverBudgetItemId] = useState(null);
  const [newBudgetItemCategory, setNewBudgetItemCategory] = useState(null);
  const [newBudgetItemText, setNewBudgetItemText] = useState('');
  // Realtor management state
  const [editingRealtorId, setEditingRealtorId] = useState(null);
  const [editingRealtorData, setEditingRealtorData] = useState({});
  const [addingRealtor, setAddingRealtor] = useState(false);
  const [newRealtorData, setNewRealtorData] = useState({ name: '', team: '', brokerage: '', phone: '', email: '', website: '', notes: '' });
  const [confirmDeleteRealtorId, setConfirmDeleteRealtorId] = useState(null);
  // Realtor questions state
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuestionData, setEditingQuestionData] = useState({});
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [newQuestionData, setNewQuestionData] = useState({ question: '', idealAnswer: '', answer: '' });
  const [confirmDeleteQuestionId, setConfirmDeleteQuestionId] = useState(null);

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

  // Load changelog entries
  const loadChangelog = async () => {
    setChangelogLoading(true);
    try {
      const changelogRef = collection(db, 'seattle-move', DOCUMENT_ID, 'changelog');
      const q = query(changelogRef, orderBy('timestamp', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChangelog(entries);
    } catch (error) {
      console.error('Error loading changelog:', error);
    }
    setChangelogLoading(false);
  };

  // Add a changelog entry
  const addChangelogEntry = async (type, description, oldValue = null, newValue = null) => {
    try {
      const changelogRef = collection(db, 'seattle-move', DOCUMENT_ID, 'changelog');
      await addDoc(changelogRef, {
        type,
        description,
        oldValue,
        newValue,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding changelog entry:', error);
    }
  };

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
      const oldValue = item.done;
      item.done = !item.done;
      setData(newData);
      saveData(newData);
      addChangelogEntry(
        'task_toggle',
        `${item.done ? 'Completed' : 'Uncompleted'}: "${item.text}" in Step ${stepId}`,
        oldValue,
        item.done
      );
    }
  };

  // Update checklist item text
  const updateItemText = (stepId, itemId) => {
    if (!editItemText.trim()) return;
    const newData = { ...data };
    const item = newData.steps[stepId].items.find(i => i.id === itemId);
    if (item && item.text !== editItemText.trim()) {
      const oldText = item.text;
      item.text = editItemText.trim();
      setData(newData);
      saveData(newData);
      addChangelogEntry(
        'item_edited',
        `Edited task in "${newData.steps[stepId].title}"`,
        oldText,
        editItemText.trim()
      );
    }
    setEditingItemId(null);
    setEditItemText('');
  };

  // Add new checklist item
  const addNewItem = (stepId) => {
    if (!newItemText.trim()) return;
    const newData = { ...data };
    const newId = `${stepId}-${Date.now()}`;
    newData.steps[stepId].items.push({
      id: newId,
      text: newItemText.trim(),
      done: false
    });
    setData(newData);
    saveData(newData);
    addChangelogEntry(
      'item_added',
      `Added task to "${newData.steps[stepId].title}"`,
      null,
      newItemText.trim()
    );
    setNewItemStepId(null);
    setNewItemText('');
  };

  // Delete checklist item
  const deleteItem = (stepId, itemId) => {
    const newData = { ...data };
    const item = newData.steps[stepId].items.find(i => i.id === itemId);
    const deletedText = item?.text || '';
    newData.steps[stepId].items = newData.steps[stepId].items.filter(i => i.id !== itemId);
    setData(newData);
    saveData(newData);
    addChangelogEntry(
      'item_deleted',
      `Deleted task from "${newData.steps[stepId].title}"`,
      deletedText,
      null
    );
    setConfirmDeleteItemId(null);
  };

  // Reorder checklist items via drag and drop
  const handleDragStart = (e, itemId) => {
    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, itemId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (itemId !== dragOverItemId) {
      setDragOverItemId(itemId);
    }
  };

  const handleDragLeave = () => {
    setDragOverItemId(null);
  };

  const handleDrop = (e, stepId, targetItemId) => {
    e.preventDefault();
    if (!draggedItemId || draggedItemId === targetItemId) {
      setDraggedItemId(null);
      return;
    }

    const newData = { ...data };
    const items = newData.steps[stepId].items;
    const draggedIndex = items.findIndex(i => i.id === draggedItemId);
    const targetIndex = items.findIndex(i => i.id === targetItemId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItemId(null);
      return;
    }

    // Remove dragged item and insert at target position
    const [draggedItem] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);

    setData(newData);
    saveData(newData);
    addChangelogEntry(
      'item_reordered',
      `Reordered task "${draggedItem.text}" in "${newData.steps[stepId].title}"`,
      `Position ${draggedIndex + 1}`,
      `Position ${targetIndex + 1}`
    );
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverItemId(null);
  };


  const updateTargetDate = (stepId, date) => {
    const newData = { ...data };
    const oldDate = newData.steps[stepId].targetDate;
    newData.steps[stepId].targetDate = date;
    setData(newData);
    saveData(newData);
    addChangelogEntry(
      'date_change',
      `Updated target date for "${newData.steps[stepId].title}"`,
      oldDate || 'Not set',
      date || 'Cleared'
    );
  };

  const updateBudgetCost = (category, itemId, cost) => {
    const newData = { ...data };
    const item = newData.budget[category].find(i => i.id === itemId);
    if (item) {
      const oldCost = item.cost;
      item.cost = cost;
      setData(newData);
      saveData(newData);
      // Only log significant changes (not every keystroke)
      if (oldCost !== cost && cost !== '') {
        addChangelogEntry(
          'budget_change',
          `Updated budget for "${item.item}"`,
          oldCost ? `$${oldCost}` : 'Not set',
          `$${cost}`
        );
      }
    }
  };

  // Toggle budget item completion
  const toggleBudgetItem = (category, itemId) => {
    const newData = { ...data };
    const item = newData.budget[category].find(i => i.id === itemId);
    if (item) {
      const oldValue = item.done || false;
      item.done = !oldValue;
      setData(newData);
      saveData(newData);
      addChangelogEntry(
        'budget_toggle',
        `${item.done ? 'Completed' : 'Uncompleted'}: "${item.item}"`,
        oldValue,
        item.done
      );
    }
  };

  // Update budget item text
  const updateBudgetItemText = (category, itemId) => {
    if (!editBudgetItemText.trim()) return;
    const newData = { ...data };
    const item = newData.budget[category].find(i => i.id === itemId);
    if (item && item.item !== editBudgetItemText.trim()) {
      const oldText = item.item;
      item.item = editBudgetItemText.trim();
      setData(newData);
      saveData(newData);
      addChangelogEntry(
        'budget_item_edited',
        `Edited budget item`,
        oldText,
        editBudgetItemText.trim()
      );
    }
    setEditingBudgetItemId(null);
    setEditBudgetItemText('');
  };

  // Add new budget item
  const addNewBudgetItem = (category) => {
    if (!newBudgetItemText.trim()) return;
    const newData = { ...data };
    const newId = `b-${Date.now()}`;
    newData.budget[category].push({
      id: newId,
      item: newBudgetItemText.trim(),
      cost: '',
      done: false
    });
    setData(newData);
    saveData(newData);
    addChangelogEntry(
      'budget_item_added',
      `Added budget item to ${category}`,
      null,
      newBudgetItemText.trim()
    );
    setNewBudgetItemCategory(null);
    setNewBudgetItemText('');
  };

  // Delete budget item
  const deleteBudgetItem = (category, itemId) => {
    const newData = { ...data };
    const item = newData.budget[category].find(i => i.id === itemId);
    const deletedText = item?.item || '';
    newData.budget[category] = newData.budget[category].filter(i => i.id !== itemId);
    setData(newData);
    saveData(newData);
    addChangelogEntry(
      'budget_item_deleted',
      `Deleted budget item`,
      deletedText,
      null
    );
    setConfirmDeleteBudgetItemId(null);
  };

  // Drag and drop for budget items
  const handleBudgetDragStart = (e, itemId) => {
    setDraggedBudgetItemId(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleBudgetDragOver = (e, itemId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (itemId !== dragOverBudgetItemId) {
      setDragOverBudgetItemId(itemId);
    }
  };

  const handleBudgetDragLeave = () => {
    setDragOverBudgetItemId(null);
  };

  const handleBudgetDrop = (e, category, targetItemId) => {
    e.preventDefault();
    if (!draggedBudgetItemId || draggedBudgetItemId === targetItemId) {
      setDraggedBudgetItemId(null);
      setDragOverBudgetItemId(null);
      return;
    }

    const newData = { ...data };
    const items = newData.budget[category];
    const draggedIndex = items.findIndex(i => i.id === draggedBudgetItemId);
    const targetIndex = items.findIndex(i => i.id === targetItemId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedBudgetItemId(null);
      setDragOverBudgetItemId(null);
      return;
    }

    const [draggedItem] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);

    setData(newData);
    saveData(newData);
    addChangelogEntry(
      'budget_item_reordered',
      `Reordered "${draggedItem.item}"`,
      `Position ${draggedIndex + 1}`,
      `Position ${targetIndex + 1}`
    );
    setDraggedBudgetItemId(null);
    setDragOverBudgetItemId(null);
  };

  const handleBudgetDragEnd = () => {
    setDraggedBudgetItemId(null);
    setDragOverBudgetItemId(null);
  };

  // Move budget item to a different category
  const moveBudgetItem = (fromCategory, toCategory, itemId) => {
    if (fromCategory === toCategory) return;

    const newData = { ...data };
    const fromItems = newData.budget[fromCategory];
    const itemIndex = fromItems.findIndex(i => i.id === itemId);

    if (itemIndex === -1) return;

    // Remove from source category
    const [movedItem] = fromItems.splice(itemIndex, 1);

    // Add to destination category
    newData.budget[toCategory].push(movedItem);

    setData(newData);
    saveData(newData);

    const categoryNames = {
      must: 'Must Do',
      high: 'High Impact',
      nice: 'Nice to Have',
      other: 'Moving & Housing'
    };

    addChangelogEntry(
      'budget_item_moved',
      `Moved "${movedItem.item}" from ${categoryNames[fromCategory]} to ${categoryNames[toCategory]}`,
      categoryNames[fromCategory],
      categoryNames[toCategory]
    );
  };

  // Get budget category completion stats
  const getBudgetCategoryProgress = (category) => {
    const items = data.budget[category];
    if (!items || items.length === 0) return { done: 0, total: 0 };
    const done = items.filter(i => i.done).length;
    return { done, total: items.length };
  };

  // Realtor management functions
  const addRealtor = () => {
    if (!newRealtorData.name.trim()) return;
    const newData = { ...data };
    if (!newData.realtors) newData.realtors = [];
    const newId = `r-${Date.now()}`;
    newData.realtors.push({
      id: newId,
      name: newRealtorData.name.trim(),
      team: newRealtorData.team.trim(),
      brokerage: newRealtorData.brokerage.trim(),
      phone: newRealtorData.phone.trim(),
      email: newRealtorData.email.trim(),
      website: newRealtorData.website.trim(),
      notes: newRealtorData.notes.trim(),
      recommended: false
    });
    setData(newData);
    saveData(newData);
    addChangelogEntry('realtor_added', `Added realtor: ${newRealtorData.name.trim()}`, null, newRealtorData.name.trim());
    setAddingRealtor(false);
    setNewRealtorData({ name: '', team: '', brokerage: '', phone: '', email: '', website: '', notes: '' });
  };

  const updateRealtor = (realtorId) => {
    const newData = { ...data };
    const realtor = newData.realtors?.find(r => r.id === realtorId);
    if (realtor) {
      const oldName = realtor.name;
      realtor.name = editingRealtorData.name?.trim() || realtor.name;
      realtor.team = editingRealtorData.team?.trim() || '';
      realtor.brokerage = editingRealtorData.brokerage?.trim() || '';
      realtor.phone = editingRealtorData.phone?.trim() || '';
      realtor.email = editingRealtorData.email?.trim() || '';
      realtor.website = editingRealtorData.website?.trim() || '';
      realtor.notes = editingRealtorData.notes?.trim() || '';
      setData(newData);
      saveData(newData);
      addChangelogEntry('realtor_updated', `Updated realtor: ${realtor.name}`, oldName, realtor.name);
    }
    setEditingRealtorId(null);
    setEditingRealtorData({});
  };

  const deleteRealtor = (realtorId) => {
    const newData = { ...data };
    const realtor = newData.realtors?.find(r => r.id === realtorId);
    const deletedName = realtor?.name || '';
    newData.realtors = newData.realtors?.filter(r => r.id !== realtorId) || [];
    setData(newData);
    saveData(newData);
    addChangelogEntry('realtor_deleted', `Removed realtor: ${deletedName}`, deletedName, null);
    setConfirmDeleteRealtorId(null);
  };

  const toggleRealtorRecommended = (realtorId) => {
    const newData = { ...data };
    const realtor = newData.realtors?.find(r => r.id === realtorId);
    if (realtor) {
      realtor.recommended = !realtor.recommended;
      setData(newData);
      saveData(newData);
      addChangelogEntry(
        'realtor_recommendation',
        `${realtor.recommended ? 'Marked' : 'Unmarked'} "${realtor.name}" as recommended`,
        !realtor.recommended,
        realtor.recommended
      );
    }
  };

  // Realtor questions management functions
  const addQuestion = () => {
    if (!newQuestionData.question.trim()) return;
    const newData = { ...data };
    if (!newData.realtorQuestions) newData.realtorQuestions = [];
    const newId = `q-${Date.now()}`;
    newData.realtorQuestions.push({
      id: newId,
      question: newQuestionData.question.trim(),
      idealAnswer: newQuestionData.idealAnswer.trim(),
      answer: newQuestionData.answer.trim()
    });
    setData(newData);
    saveData(newData);
    addChangelogEntry('question_added', `Added realtor question`, null, newQuestionData.question.trim());
    setAddingQuestion(false);
    setNewQuestionData({ question: '', idealAnswer: '', answer: '' });
  };

  const updateQuestion = (questionId) => {
    const newData = { ...data };
    const question = newData.realtorQuestions?.find(q => q.id === questionId);
    if (question) {
      question.question = editingQuestionData.question?.trim() || question.question;
      question.idealAnswer = editingQuestionData.idealAnswer?.trim() || '';
      question.answer = editingQuestionData.answer?.trim() || '';
      setData(newData);
      saveData(newData);
      addChangelogEntry('question_updated', `Updated realtor question`, null, question.question);
    }
    setEditingQuestionId(null);
    setEditingQuestionData({});
  };

  const deleteQuestion = (questionId) => {
    const newData = { ...data };
    const question = newData.realtorQuestions?.find(q => q.id === questionId);
    const deletedText = question?.question || '';
    newData.realtorQuestions = newData.realtorQuestions?.filter(q => q.id !== questionId) || [];
    setData(newData);
    saveData(newData);
    addChangelogEntry('question_deleted', `Removed realtor question`, deletedText, null);
    setConfirmDeleteQuestionId(null);
  };

  const updateNotes = (notes) => {
    const oldNotes = data.notes;
    const newData = { ...data, notes };
    setData(newData);
    saveData(newData);
    // Only log if notes actually changed significantly
    if (oldNotes !== notes && notes.length > 0 && Math.abs(notes.length - oldNotes.length) > 10) {
      addChangelogEntry(
        'notes_edit',
        'Updated general notes',
        oldNotes.substring(0, 100) + (oldNotes.length > 100 ? '...' : ''),
        notes.substring(0, 100) + (notes.length > 100 ? '...' : '')
      );
    }
  };

  const addStepNote = (stepId) => {
    if (!newNoteText.trim()) return;
    const newData = { ...data };
    if (!newData.stepNotes) newData.stepNotes = {};
    if (!newData.stepNotes[stepId]) newData.stepNotes[stepId] = [];
    const noteText = newNoteText.trim();
    newData.stepNotes[stepId].push({
      id: Date.now().toString(),
      text: noteText,
      createdAt: new Date().toISOString()
    });
    setData(newData);
    saveData(newData);
    setNewNoteText('');
    addChangelogEntry(
      'note_added',
      `Added note to "${data.steps[stepId].title}"`,
      null,
      noteText
    );
  };

  const updateStepNote = (stepId, noteId) => {
    if (!editNoteText.trim()) return;
    const newData = { ...data };
    const note = newData.stepNotes[stepId]?.find(n => n.id === noteId);
    if (note) {
      const oldText = note.text;
      note.text = editNoteText.trim();
      setData(newData);
      saveData(newData);
      addChangelogEntry(
        'note_edited',
        `Edited note in "${data.steps[stepId].title}"`,
        oldText,
        editNoteText.trim()
      );
    }
    setEditingNoteId(null);
    setEditNoteText('');
  };

  const deleteStepNote = (stepId, noteId) => {
    const newData = { ...data };
    const note = newData.stepNotes[stepId]?.find(n => n.id === noteId);
    const deletedText = note?.text || '';
    newData.stepNotes[stepId] = newData.stepNotes[stepId].filter(n => n.id !== noteId);
    setData(newData);
    saveData(newData);
    addChangelogEntry(
      'note_deleted',
      `Deleted note from "${data.steps[stepId].title}"`,
      deletedText,
      null
    );
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
          { id: 'notes', icon: '📝', label: 'Notes' },
          { id: 'history', icon: '📜', label: 'History' }
        ].map(tab => (
          <button
            key={tab.id}
            className="tab-btn"
            style={activeTab === tab.id ? {...styles.tabBtn, ...styles.tabBtnActive} : styles.tabBtn}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'history') loadChangelog();
            }}
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
                  {activeStep !== '3' && (
                    <span style={{
                      ...styles.stepContentProgress,
                      color: getStepProgress(activeStep) === 100 ? colors.complete : colors.evergreen
                    }}>
                      {data.steps[activeStep].items.filter(i => i.done).length}/{data.steps[activeStep].items.length} tasks
                    </span>
                  )}
                </div>
                <p style={styles.stepContentDesc}>{data.steps[activeStep].description}</p>

                {/* Realtors Section for Step 1 */}
                {activeStep === '1' && (
                  <div style={styles.realtorsSection}>
                    <h3 style={styles.realtorsSectionTitle}>👤 Realtor Candidates</h3>

                    {/* Realtor Cards */}
                    <div style={styles.realtorCards}>
                      {(data.realtors || []).map(realtor => (
                        <div
                          key={realtor.id}
                          style={{
                            ...styles.realtorCard,
                            ...(realtor.recommended ? styles.realtorCardRecommended : {})
                          }}
                        >
                          {editingRealtorId === realtor.id ? (
                            // Edit Mode
                            <div style={styles.realtorEditForm}>
                              <input
                                type="text"
                                value={editingRealtorData.name || ''}
                                onChange={(e) => setEditingRealtorData({...editingRealtorData, name: e.target.value})}
                                placeholder="Name *"
                                style={styles.realtorInput}
                              />
                              <input
                                type="text"
                                value={editingRealtorData.team || ''}
                                onChange={(e) => setEditingRealtorData({...editingRealtorData, team: e.target.value})}
                                placeholder="Team"
                                style={styles.realtorInput}
                              />
                              <input
                                type="text"
                                value={editingRealtorData.brokerage || ''}
                                onChange={(e) => setEditingRealtorData({...editingRealtorData, brokerage: e.target.value})}
                                placeholder="Brokerage"
                                style={styles.realtorInput}
                              />
                              <input
                                type="text"
                                value={editingRealtorData.phone || ''}
                                onChange={(e) => setEditingRealtorData({...editingRealtorData, phone: e.target.value})}
                                placeholder="Phone"
                                style={styles.realtorInput}
                              />
                              <input
                                type="text"
                                value={editingRealtorData.email || ''}
                                onChange={(e) => setEditingRealtorData({...editingRealtorData, email: e.target.value})}
                                placeholder="Email"
                                style={styles.realtorInput}
                              />
                              <input
                                type="text"
                                value={editingRealtorData.website || ''}
                                onChange={(e) => setEditingRealtorData({...editingRealtorData, website: e.target.value})}
                                placeholder="Website (e.g. https://...)"
                                style={styles.realtorInput}
                              />
                              <textarea
                                value={editingRealtorData.notes || ''}
                                onChange={(e) => setEditingRealtorData({...editingRealtorData, notes: e.target.value})}
                                placeholder="Notes"
                                style={styles.realtorTextarea}
                                rows={2}
                              />
                              <div style={styles.realtorEditActions}>
                                <button style={styles.realtorSaveBtn} onClick={() => updateRealtor(realtor.id)}>Save</button>
                                <button style={styles.realtorCancelBtn} onClick={() => { setEditingRealtorId(null); setEditingRealtorData({}); }}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <>
                              <div style={styles.realtorCardHeader}>
                                <h4 style={styles.realtorName}>{realtor.name}</h4>
                                {realtor.recommended && <span style={styles.recommendedBadge}>★ Recommended</span>}
                              </div>
                              {realtor.team && <p style={styles.realtorDetail}><strong>Team:</strong> {realtor.team}</p>}
                              {realtor.brokerage && <p style={styles.realtorDetail}><strong>Brokerage:</strong> {realtor.brokerage}</p>}
                              {realtor.phone && <p style={styles.realtorDetail}><strong>Phone:</strong> {realtor.phone}</p>}
                              {realtor.email && <p style={styles.realtorDetail}><strong>Email:</strong> {realtor.email}</p>}
                              {realtor.website && (
                                <p style={styles.realtorDetail}>
                                  <strong>Website:</strong>{' '}
                                  <a
                                    href={realtor.website.startsWith('http') ? realtor.website : `https://${realtor.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.realtorWebsiteLink}
                                  >
                                    {realtor.website}
                                  </a>
                                </p>
                              )}
                              {realtor.notes && <p style={styles.realtorNotes}>{realtor.notes}</p>}

                              <div style={styles.realtorActions}>
                                {confirmDeleteRealtorId === realtor.id ? (
                                  <>
                                    <span style={styles.confirmDeleteText}>Delete?</span>
                                    <button style={styles.confirmYesBtn} onClick={() => deleteRealtor(realtor.id)}>Yes</button>
                                    <button style={styles.confirmNoBtn} onClick={() => setConfirmDeleteRealtorId(null)}>No</button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      style={realtor.recommended ? styles.realtorUnstarBtn : styles.realtorStarBtn}
                                      onClick={() => toggleRealtorRecommended(realtor.id)}
                                      title={realtor.recommended ? 'Remove recommendation' : 'Mark as recommended'}
                                    >
                                      {realtor.recommended ? '★' : '☆'}
                                    </button>
                                    <button
                                      style={styles.realtorEditBtn}
                                      onClick={() => { setEditingRealtorId(realtor.id); setEditingRealtorData({...realtor}); }}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      style={styles.realtorDeleteBtn}
                                      onClick={() => setConfirmDeleteRealtorId(realtor.id)}
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

                    {/* Add New Realtor */}
                    {addingRealtor ? (
                      <div style={styles.addRealtorForm}>
                        <h4 style={styles.addRealtorTitle}>Add New Realtor</h4>
                        <input
                          type="text"
                          value={newRealtorData.name}
                          onChange={(e) => setNewRealtorData({...newRealtorData, name: e.target.value})}
                          placeholder="Name *"
                          style={styles.realtorInput}
                          autoFocus
                        />
                        <input
                          type="text"
                          value={newRealtorData.team}
                          onChange={(e) => setNewRealtorData({...newRealtorData, team: e.target.value})}
                          placeholder="Team"
                          style={styles.realtorInput}
                        />
                        <input
                          type="text"
                          value={newRealtorData.brokerage}
                          onChange={(e) => setNewRealtorData({...newRealtorData, brokerage: e.target.value})}
                          placeholder="Brokerage"
                          style={styles.realtorInput}
                        />
                        <input
                          type="text"
                          value={newRealtorData.phone}
                          onChange={(e) => setNewRealtorData({...newRealtorData, phone: e.target.value})}
                          placeholder="Phone"
                          style={styles.realtorInput}
                        />
                        <input
                          type="text"
                          value={newRealtorData.email}
                          onChange={(e) => setNewRealtorData({...newRealtorData, email: e.target.value})}
                          placeholder="Email"
                          style={styles.realtorInput}
                        />
                        <input
                          type="text"
                          value={newRealtorData.website}
                          onChange={(e) => setNewRealtorData({...newRealtorData, website: e.target.value})}
                          placeholder="Website (e.g. https://...)"
                          style={styles.realtorInput}
                        />
                        <textarea
                          value={newRealtorData.notes}
                          onChange={(e) => setNewRealtorData({...newRealtorData, notes: e.target.value})}
                          placeholder="Notes"
                          style={styles.realtorTextarea}
                          rows={2}
                        />
                        <div style={styles.realtorEditActions}>
                          <button
                            style={styles.realtorSaveBtn}
                            onClick={addRealtor}
                            disabled={!newRealtorData.name.trim()}
                          >
                            Add Realtor
                          </button>
                          <button
                            style={styles.realtorCancelBtn}
                            onClick={() => { setAddingRealtor(false); setNewRealtorData({ name: '', team: '', brokerage: '', phone: '', email: '', website: '', notes: '' }); }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button style={styles.addRealtorBtn} onClick={() => setAddingRealtor(true)}>
                        + Add Realtor
                      </button>
                    )}
                  </div>
                )}

                {/* Special Repairs View for Step 3 */}
                {activeStep === '3' ? (
                  <div style={styles.repairsContainer}>
                    {[
                      { key: 'must', title: 'Must Do (Safety/Inspection)', color: colors.salmon },
                      { key: 'high', title: 'High Impact (Buyers Notice)', color: colors.goldenHour },
                      { key: 'nice', title: 'Nice to Have', color: colors.duskBlue }
                    ].map(({ key, title, color }) => {
                      const progress = getBudgetCategoryProgress(key);
                      return (
                        <div key={key} style={{...styles.repairSection, borderColor: color}}>
                          <div style={{...styles.repairSectionHeader, background: color}}>
                            <h4 style={styles.repairSectionTitle}>{title}</h4>
                            <span style={styles.repairSectionProgress}>{progress.done}/{progress.total}</span>
                          </div>

                          <div style={styles.repairItemsList}>
                            {data.budget[key].map(item => (
                              <div
                                key={item.id}
                                draggable={editingBudgetItemId !== item.id}
                                onDragStart={(e) => handleBudgetDragStart(e, item.id)}
                                onDragOver={(e) => handleBudgetDragOver(e, item.id)}
                                onDragLeave={handleBudgetDragLeave}
                                onDrop={(e) => handleBudgetDrop(e, key, item.id)}
                                onDragEnd={handleBudgetDragEnd}
                                style={{
                                  ...styles.repairItem,
                                  ...(item.done ? styles.repairItemDone : {}),
                                  ...(draggedBudgetItemId === item.id ? styles.repairItemDragging : {}),
                                  ...(dragOverBudgetItemId === item.id && draggedBudgetItemId !== item.id ? styles.repairItemDropTarget : {})
                                }}
                              >
                                <span style={styles.dragHandle} title="Drag to reorder">⋮⋮</span>

                                <span
                                  style={item.done ? styles.checkboxDone : styles.checkbox}
                                  onClick={() => toggleBudgetItem(key, item.id)}
                                >
                                  {item.done ? '✓' : ''}
                                </span>

                                {editingBudgetItemId === item.id ? (
                                  <div style={styles.itemEditForm}>
                                    <input
                                      type="text"
                                      value={editBudgetItemText}
                                      onChange={(e) => setEditBudgetItemText(e.target.value)}
                                      onKeyPress={(e) => e.key === 'Enter' && updateBudgetItemText(key, item.id)}
                                      onBlur={() => updateBudgetItemText(key, item.id)}
                                      style={styles.itemEditInput}
                                      autoFocus
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                ) : (
                                  <span
                                    style={item.done ? styles.repairItemTextDone : styles.repairItemText}
                                    onClick={() => toggleBudgetItem(key, item.id)}
                                  >
                                    {item.item}
                                  </span>
                                )}

                                {editingBudgetItemId !== item.id && (
                                  <div style={styles.itemActions}>
                                    {confirmDeleteBudgetItemId === item.id ? (
                                      <>
                                        <span style={styles.confirmDeleteText}>Delete?</span>
                                        <button
                                          style={styles.confirmYesBtn}
                                          onClick={(e) => { e.stopPropagation(); deleteBudgetItem(key, item.id); }}
                                        >
                                          Yes
                                        </button>
                                        <button
                                          style={styles.confirmNoBtn}
                                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteBudgetItemId(null); }}
                                        >
                                          No
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        {/* Move to higher priority (Must < High < Nice) */}
                                        {key !== 'must' && (
                                          <button
                                            style={styles.moveBtn}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const targetCategory = key === 'high' ? 'must' : 'high';
                                              moveBudgetItem(key, targetCategory, item.id);
                                            }}
                                            title={key === 'high' ? 'Move to Must Do' : 'Move to High Impact'}
                                          >
                                            ⬆️
                                          </button>
                                        )}
                                        {/* Move to lower priority */}
                                        {key !== 'nice' && (
                                          <button
                                            style={styles.moveBtn}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const targetCategory = key === 'must' ? 'high' : 'nice';
                                              moveBudgetItem(key, targetCategory, item.id);
                                            }}
                                            title={key === 'must' ? 'Move to High Impact' : 'Move to Nice to Have'}
                                          >
                                            ⬇️
                                          </button>
                                        )}
                                        <button
                                          style={styles.itemActionBtn}
                                          onClick={(e) => { e.stopPropagation(); setEditingBudgetItemId(item.id); setEditBudgetItemText(item.item); }}
                                          title="Edit"
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          style={styles.itemActionBtn}
                                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteBudgetItemId(item.id); }}
                                          title="Delete"
                                        >
                                          🗑️
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {newBudgetItemCategory === key ? (
                            <div style={styles.addRepairItemForm}>
                              <input
                                type="text"
                                value={newBudgetItemText}
                                onChange={(e) => setNewBudgetItemText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addNewBudgetItem(key)}
                                placeholder="Enter new repair item..."
                                style={styles.addItemInput}
                                autoFocus
                              />
                              <button
                                style={styles.addItemSaveBtn}
                                onClick={() => addNewBudgetItem(key)}
                                disabled={!newBudgetItemText.trim()}
                              >
                                Add
                              </button>
                              <button
                                style={styles.addItemCancelBtn}
                                onClick={() => { setNewBudgetItemCategory(null); setNewBudgetItemText(''); }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              style={styles.addRepairItemBtn}
                              onClick={() => setNewBudgetItemCategory(key)}
                            >
                              + Add repair
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    <div style={styles.stepProgressBar}>
                      <div style={{
                        ...styles.stepProgressFill,
                        width: `${getStepProgress(activeStep)}%`,
                        background: getStepProgress(activeStep) === 100 ? colors.complete : colors.sage
                      }}></div>
                    </div>

                    <ul style={styles.checklist}>
                  {data.steps[activeStep].items.map((item, index) => (
                    <li
                      key={item.id}
                      className="checklist-item"
                      draggable={editingItemId !== item.id}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragOver={(e) => handleDragOver(e, item.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, activeStep, item.id)}
                      onDragEnd={handleDragEnd}
                      style={{
                        ...styles.checklistItem,
                        ...(item.done ? styles.checklistItemDone : {}),
                        ...(draggedItemId === item.id ? styles.checklistItemDragging : {}),
                        ...(dragOverItemId === item.id && draggedItemId !== item.id ? styles.checklistItemDropTarget : {})
                      }}
                    >
                      {/* Drag Handle */}
                      <span style={styles.dragHandle} title="Drag to reorder">⋮⋮</span>

                      {/* Checkbox */}
                      <span
                        className="checkbox"
                        style={item.done ? styles.checkboxDone : styles.checkbox}
                        onClick={() => toggleItem(activeStep, item.id)}
                      >
                        {item.done ? '✓' : ''}
                      </span>

                      {/* Item Text or Edit Input */}
                      {editingItemId === item.id ? (
                        <div style={styles.itemEditForm}>
                          <input
                            type="text"
                            value={editItemText}
                            onChange={(e) => setEditItemText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && updateItemText(activeStep, item.id)}
                            onBlur={() => updateItemText(activeStep, item.id)}
                            style={styles.itemEditInput}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ) : (
                        <span
                          className="checklist-text"
                          style={item.done ? styles.checklistTextDone : styles.checklistText}
                          onClick={() => toggleItem(activeStep, item.id)}
                        >
                          {item.text}
                        </span>
                      )}

                      {/* Category Badge */}
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

                      {/* Action Buttons */}
                      {editingItemId !== item.id && (
                        <div style={styles.itemActions}>
                          {confirmDeleteItemId === item.id ? (
                            <>
                              <span style={styles.confirmDeleteText}>Delete?</span>
                              <button
                                style={styles.confirmYesBtn}
                                onClick={(e) => { e.stopPropagation(); deleteItem(activeStep, item.id); }}
                              >
                                Yes
                              </button>
                              <button
                                style={styles.confirmNoBtn}
                                onClick={(e) => { e.stopPropagation(); setConfirmDeleteItemId(null); }}
                              >
                                No
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                style={styles.itemActionBtn}
                                onClick={(e) => { e.stopPropagation(); setEditingItemId(item.id); setEditItemText(item.text); }}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                style={styles.itemActionBtn}
                                onClick={(e) => { e.stopPropagation(); setConfirmDeleteItemId(item.id); }}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Add New Item */}
                {newItemStepId === activeStep ? (
                  <div style={styles.addItemForm}>
                    <input
                      type="text"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNewItem(activeStep)}
                      placeholder="Enter new task..."
                      style={styles.addItemInput}
                      autoFocus
                    />
                    <button
                      style={styles.addItemSaveBtn}
                      onClick={() => addNewItem(activeStep)}
                      disabled={!newItemText.trim()}
                    >
                      Add
                    </button>
                    <button
                      style={styles.addItemCancelBtn}
                      onClick={() => { setNewItemStepId(null); setNewItemText(''); }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    style={styles.addItemBtn}
                    onClick={() => setNewItemStepId(activeStep)}
                  >
                    + Add task
                  </button>
                )}
                  </>
                )}

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

                {/* Realtor Questions Section - Only for Step 1 */}
                {activeStep === '1' && (
                  <div style={styles.questionsSection}>
                    <h3 style={styles.questionsSectionTitle}>❓ Questions to Ask</h3>

                    <div style={styles.questionsList}>
                      {(data.realtorQuestions || []).map((q, index) => (
                        <div key={q.id} style={styles.questionCard}>
                          {editingQuestionId === q.id ? (
                            // Edit Mode
                            <div style={styles.questionEditForm}>
                              <label style={styles.questionLabel}>Question:</label>
                              <textarea
                                value={editingQuestionData.question || ''}
                                onChange={(e) => setEditingQuestionData({...editingQuestionData, question: e.target.value})}
                                style={styles.questionTextarea}
                                rows={2}
                              />
                              <label style={styles.questionLabel}>Ideal Answer / What to look for:</label>
                              <textarea
                                value={editingQuestionData.idealAnswer || ''}
                                onChange={(e) => setEditingQuestionData({...editingQuestionData, idealAnswer: e.target.value})}
                                style={styles.questionTextarea}
                                rows={2}
                              />
                              <label style={styles.questionLabel}>Notes / Their Answer:</label>
                              <textarea
                                value={editingQuestionData.answer || ''}
                                onChange={(e) => setEditingQuestionData({...editingQuestionData, answer: e.target.value})}
                                style={styles.questionTextarea}
                                rows={2}
                              />
                              <div style={styles.questionEditActions}>
                                <button style={styles.questionSaveBtn} onClick={() => updateQuestion(q.id)}>Save</button>
                                <button style={styles.questionCancelBtn} onClick={() => { setEditingQuestionId(null); setEditingQuestionData({}); }}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <>
                              <div style={styles.questionHeader}>
                                <span style={styles.questionNumber}>{index + 1}</span>
                                <p style={styles.questionText}>{q.question}</p>
                              </div>
                              {q.idealAnswer && (
                                <div style={styles.idealAnswerBox}>
                                  <span style={styles.idealAnswerLabel}>Look for:</span>
                                  <p style={styles.idealAnswerText}>{q.idealAnswer}</p>
                                </div>
                              )}
                              {q.answer && (
                                <div style={styles.answerBox}>
                                  <span style={styles.answerLabel}>Notes:</span>
                                  <p style={styles.answerText}>{q.answer}</p>
                                </div>
                              )}
                              <div style={styles.questionActions}>
                                {confirmDeleteQuestionId === q.id ? (
                                  <>
                                    <span style={styles.confirmDeleteText}>Delete?</span>
                                    <button style={styles.confirmYesBtn} onClick={() => deleteQuestion(q.id)}>Yes</button>
                                    <button style={styles.confirmNoBtn} onClick={() => setConfirmDeleteQuestionId(null)}>No</button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      style={styles.questionEditBtn}
                                      onClick={() => { setEditingQuestionId(q.id); setEditingQuestionData({...q}); }}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      style={styles.questionDeleteBtn}
                                      onClick={() => setConfirmDeleteQuestionId(q.id)}
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

                    {/* Add New Question */}
                    {addingQuestion ? (
                      <div style={styles.addQuestionForm}>
                        <h4 style={styles.addQuestionTitle}>Add New Question</h4>
                        <label style={styles.questionLabel}>Question:</label>
                        <textarea
                          value={newQuestionData.question}
                          onChange={(e) => setNewQuestionData({...newQuestionData, question: e.target.value})}
                          placeholder="What do you want to ask?"
                          style={styles.questionTextarea}
                          rows={2}
                          autoFocus
                        />
                        <label style={styles.questionLabel}>Ideal Answer / What to look for:</label>
                        <textarea
                          value={newQuestionData.idealAnswer}
                          onChange={(e) => setNewQuestionData({...newQuestionData, idealAnswer: e.target.value})}
                          placeholder="What should a good answer include?"
                          style={styles.questionTextarea}
                          rows={2}
                        />
                        <div style={styles.questionEditActions}>
                          <button
                            style={styles.questionSaveBtn}
                            onClick={addQuestion}
                            disabled={!newQuestionData.question.trim()}
                          >
                            Add Question
                          </button>
                          <button
                            style={styles.questionCancelBtn}
                            onClick={() => { setAddingQuestion(false); setNewQuestionData({ question: '', idealAnswer: '', answer: '' }); }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button style={styles.addQuestionBtn} onClick={() => setAddingQuestion(true)}>
                        + Add Question
                      </button>
                    )}
                  </div>
                )}

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
              <h3 style={styles.budgetSummaryTitle}>💰 Project Budget</h3>

              {/* Budget Line Items */}
              <div style={styles.budgetLineItems}>
                <div style={styles.budgetLineItem}>
                  <span style={styles.budgetLineItemName}>🔧 Repairs</span>
                  <span style={styles.budgetLineItemValue}>${(getBudgetTotal('must') + getBudgetTotal('high') + getBudgetTotal('nice')).toLocaleString()}</span>
                </div>
                <div style={styles.budgetLineItem}>
                  <span style={styles.budgetLineItemName}>🚚 Moving & Housing</span>
                  <span style={styles.budgetLineItemValue}>${getBudgetTotal('other').toLocaleString()}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div style={styles.budgetGrandTotal}>
                <span style={styles.budgetGrandTotalLabel}>Total Project Budget</span>
                <span style={styles.budgetGrandTotalValue}>${getGrandTotal().toLocaleString()}</span>
              </div>
            </div>

            {/* Moving & Housing Section (Editable) */}
            <div className="budget-section" style={{...styles.budgetSection, borderColor: colors.deepBlue}}>
              <div style={{...styles.budgetTitle, background: colors.deepBlue}}>
                <div>
                  <h3 style={styles.budgetTitleText}>🚚 Moving & Housing Costs</h3>
                  <p style={styles.budgetTitleDesc}>Temporary housing, movers, storage, travel, etc.</p>
                </div>
                <span style={styles.budgetTitleTotal}>${getBudgetTotal('other').toLocaleString()}</span>
              </div>

              <table style={styles.budgetTable}>
                <thead>
                  <tr>
                    <th style={styles.budgetTh}>Item</th>
                    <th style={{...styles.budgetTh, width: '120px', textAlign: 'right'}}>Cost</th>
                    <th style={{...styles.budgetTh, width: '80px', textAlign: 'center'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.budget.other.map(item => (
                    <tr key={item.id} style={item.done ? styles.budgetRowDone : {}}>
                      <td style={styles.budgetTd}>
                        {editingBudgetItemId === item.id ? (
                          <input
                            type="text"
                            value={editBudgetItemText}
                            onChange={(e) => setEditBudgetItemText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && updateBudgetItemText('other', item.id)}
                            onBlur={() => updateBudgetItemText('other', item.id)}
                            style={styles.budgetTableInput}
                            autoFocus
                          />
                        ) : (
                          <span style={item.done ? styles.budgetItemNameDone : styles.budgetItemName}>
                            {item.done && <span style={styles.budgetDoneCheck}>✓</span>}
                            {item.item}
                          </span>
                        )}
                      </td>
                      <td style={{...styles.budgetTd, textAlign: 'right'}}>
                        <div style={styles.costInputWrapper}>
                          <span style={styles.dollarSign}>$</span>
                          <input
                            type="number"
                            value={item.cost}
                            onChange={(e) => updateBudgetCost('other', item.id, e.target.value)}
                            placeholder="0"
                            style={styles.costField}
                          />
                        </div>
                      </td>
                      <td style={{...styles.budgetTd, textAlign: 'center'}}>
                        {confirmDeleteBudgetItemId === item.id ? (
                          <div style={styles.budgetTableActions}>
                            <button style={styles.confirmYesBtn} onClick={() => deleteBudgetItem('other', item.id)}>Yes</button>
                            <button style={styles.confirmNoBtn} onClick={() => setConfirmDeleteBudgetItemId(null)}>No</button>
                          </div>
                        ) : (
                          <div style={styles.budgetTableActions}>
                            <button
                              style={styles.budgetTableBtn}
                              onClick={() => { setEditingBudgetItemId(item.id); setEditBudgetItemText(item.item); }}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              style={styles.budgetTableBtn}
                              onClick={() => setConfirmDeleteBudgetItemId(item.id)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Add New Item */}
              {newBudgetItemCategory === 'other' ? (
                <div style={styles.addBudgetRowForm}>
                  <input
                    type="text"
                    value={newBudgetItemText}
                    onChange={(e) => setNewBudgetItemText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addNewBudgetItem('other')}
                    placeholder="Enter item name..."
                    style={styles.addBudgetInput}
                    autoFocus
                  />
                  <button
                    style={styles.addItemSaveBtn}
                    onClick={() => addNewBudgetItem('other')}
                    disabled={!newBudgetItemText.trim()}
                  >
                    Add
                  </button>
                  <button
                    style={styles.addItemCancelBtn}
                    onClick={() => { setNewBudgetItemCategory(null); setNewBudgetItemText(''); }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  style={styles.addBudgetItemBtn}
                  onClick={() => setNewBudgetItemCategory('other')}
                >
                  + Add expense
                </button>
              )}
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

        {/* History Tab */}
        {activeTab === 'history' && (
          <div style={styles.historyContainer}>
            <div style={styles.historyHeader}>
              <h2 style={styles.historyTitle}>📜 Change History</h2>
              <button
                style={styles.refreshBtn}
                onClick={loadChangelog}
                disabled={changelogLoading}
              >
                {changelogLoading ? '⏳ Loading...' : '🔄 Refresh'}
              </button>
            </div>
            <p style={styles.historySubtitle}>All changes are automatically saved so you never lose information</p>

            {changelogLoading ? (
              <div style={styles.historyLoading}>Loading change history...</div>
            ) : changelog.length === 0 ? (
              <div style={styles.historyEmpty}>
                <p>📝 No changes recorded yet.</p>
                <p style={styles.historyEmptyHint}>Changes to tasks, notes, budget, and dates will appear here.</p>
              </div>
            ) : (
              <div style={styles.historyList}>
                {changelog.map((entry) => {
                  const date = new Date(entry.timestamp);
                  const typeIcons = {
                    task_toggle: '✓',
                    date_change: '📅',
                    budget_change: '💰',
                    budget_toggle: '✓',
                    budget_item_added: '➕',
                    budget_item_edited: '✏️',
                    budget_item_deleted: '🗑️',
                    budget_item_reordered: '↕️',
                    notes_edit: '📝',
                    note_added: '➕',
                    note_edited: '✏️',
                    note_deleted: '🗑️',
                    item_added: '➕',
                    item_edited: '✏️',
                    item_deleted: '🗑️',
                    item_reordered: '↕️'
                  };
                  const typeColors = {
                    task_toggle: colors.complete,
                    date_change: colors.skyBlue,
                    budget_change: colors.goldenHour,
                    budget_toggle: colors.complete,
                    budget_item_added: colors.goldenHour,
                    budget_item_edited: colors.honey,
                    budget_item_deleted: colors.salmon,
                    budget_item_reordered: colors.cedar,
                    notes_edit: colors.sage,
                    note_added: colors.forest,
                    note_edited: colors.duskBlue,
                    note_deleted: colors.salmon,
                    item_added: colors.forest,
                    item_edited: colors.duskBlue,
                    item_deleted: colors.salmon,
                    item_reordered: colors.mountain
                  };

                  return (
                    <div key={entry.id} style={styles.historyItem}>
                      <div style={styles.historyItemHeader}>
                        <span style={{
                          ...styles.historyIcon,
                          background: typeColors[entry.type] || colors.slate
                        }}>
                          {typeIcons[entry.type] || '📋'}
                        </span>
                        <span style={styles.historyDescription}>{entry.description}</span>
                        <span style={styles.historyTime}>
                          {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {(entry.oldValue || entry.newValue) && (
                        <div style={styles.historyDetails}>
                          {entry.oldValue && (
                            <div style={styles.historyOldValue}>
                              <span style={styles.historyValueLabel}>Before:</span> {entry.oldValue}
                            </div>
                          )}
                          {entry.newValue && (
                            <div style={styles.historyNewValue}>
                              <span style={styles.historyValueLabel}>After:</span> {entry.newValue}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
    background: `linear-gradient(135deg, ${colors.evergreen}, ${colors.forest})`,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer'
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
    background: 'white',
    border: `1px solid ${colors.mist}`,
    borderRadius: '10px',
    padding: '14px',
    position: 'relative'
  },
  realtorCardRecommended: {
    border: `2px solid ${colors.evergreen}`,
    background: `linear-gradient(135deg, white 0%, ${colors.fog} 100%)`
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
    background: colors.evergreen,
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '10px'
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
    borderRadius: '6px'
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
    color: colors.goldenHour,
    transition: 'all 0.2s'
  },
  realtorEditBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '4px 8px',
    borderRadius: '4px',
    opacity: 0.6,
    transition: 'all 0.2s'
  },
  realtorDeleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '4px 8px',
    borderRadius: '4px',
    opacity: 0.6,
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
    padding: '8px 16px',
    background: colors.evergreen,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  realtorCancelBtn: {
    padding: '8px 16px',
    background: colors.mist,
    color: colors.charcoal,
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  addRealtorBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '12px',
    background: 'transparent',
    border: `2px dashed ${colors.mist}`,
    borderRadius: '8px',
    color: colors.slate,
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
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
    position: 'relative'
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
    lineHeight: '1.4'
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
    lineHeight: '1.4'
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
    lineHeight: '1.4'
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
    fontSize: '0.8rem',
    fontWeight: '600',
    color: colors.slate,
    marginTop: '4px'
  },
  questionTextarea: {
    padding: '10px 12px',
    border: `1px solid ${colors.mist}`,
    borderRadius: '6px',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  questionEditActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px'
  },
  questionSaveBtn: {
    padding: '8px 16px',
    background: colors.evergreen,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  questionCancelBtn: {
    padding: '8px 16px',
    background: colors.mist,
    color: colors.charcoal,
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  addQuestionBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '12px',
    background: 'transparent',
    border: `2px dashed ${colors.mist}`,
    borderRadius: '8px',
    color: colors.slate,
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer'
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
    background: 'white'
  },
  repairSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    color: 'white'
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
  repairItemsList: {
    padding: '10px'
  },
  repairItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: '6px',
    transition: 'all 0.2s',
    background: colors.fog,
    marginBottom: '6px',
    border: `1px solid ${colors.mist}`
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
    background: 'transparent',
    border: `2px dashed ${colors.mist}`,
    borderRadius: '6px',
    color: colors.slate,
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
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
    background: `linear-gradient(135deg, ${colors.evergreen}, ${colors.forest})`,
    borderRadius: '10px',
    marginTop: '4px'
  },
  budgetGrandTotalLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white'
  },
  budgetGrandTotalValue: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'white'
  },
  budgetSection: {
    marginBottom: '20px',
    borderRadius: '12px',
    border: '2px solid',
    overflow: 'hidden',
    background: 'white'
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
    justifyContent: 'flex-end'
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
    borderTop: `3px solid ${colors.evergreen}`,
    background: `linear-gradient(180deg, ${colors.mist}40 0%, ${colors.fog} 20%)`,
    transform: 'translateY(2px)'
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
    width: '100%',
    padding: '10px',
    margin: '0 12px 12px 12px',
    background: 'transparent',
    border: `2px dashed ${colors.mist}`,
    borderRadius: '8px',
    color: colors.slate,
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    width: 'calc(100% - 24px)'
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
    color: colors.evergreen,
    fontSize: '1rem'
  },
  dollarSign: {
    color: colors.slate,
    marginRight: '4px',
    fontSize: '0.85rem'
  },
  costField: {
    width: '70px',
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

export default App;
