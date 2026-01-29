import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, setDoc, onSnapshot, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Paper,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Stack,
  Divider,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  Tooltip,
  Badge,
  Fade,
  Grow,
  Slide,
  Collapse,
  Alert
} from '@mui/material';
import {
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Info as InfoIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';

// Seattle photos
import seattleSkyline from './assets/IMG_2953.jpeg';
import mtRainierMarina from './assets/IMG_2975.jpeg';
import mtRainierView from './assets/IMG_2981.jpeg';
import spaceNeedleBuildings from './assets/IMG_3041.jpeg';

const initialData = {
  currentStep: 1,
  notes: '',
  generalNotes: [],
  stepNotes: {},
  realtors: [
    {
      id: 'r1',
      name: 'Emma Lefkowitz',
      team: '',
      brokerage: '',
      phone: '',
      email: '',
      website: '',
      notes: 'Rank #1 - Top Dollar + Speed. Primary neighborhoods: San Carlos, Allied Gardens, Del Cerro. Price range: $1.0M-$1.8M. Homes sold: ~40-60 (12mo). Avg days on market: 10-15 days. Sale-to-list ratio: 101-105%. Over-asking frequency: Very High. Pricing strategy: Data-driven + Aggressive. Remote seller experience: 5/5. Full coordination, included staging & ROI-focused updates. Marketing: High (Digital + Local). Negotiation: Exceptional. Concern: Large team; ensure lead agent involvement clearly defined.',
      recommended: true
    },
    {
      id: 'r2',
      name: 'Joel Blumenfeld',
      team: '',
      brokerage: 'Compass',
      phone: '',
      email: '',
      website: '',
      notes: 'Rank #2 - White-Glove Prep. Primary neighborhoods: San Carlos, Del Cerro, La Mesa. Price range: $1.1M-$2.0M. Homes sold: ~10-15 (12mo). Avg days on market: 12-20 days. Sale-to-list ratio: 100-104%. Pricing strategy: Precision + Prep. Remote seller experience: 5/5. Compass Concierge available - fronts costs for staging, paint, flooring, landscaping, minor renovations. Marketing: Very High (Luxury Polish). Negotiation: Very Strong. Concern: Lower volume; upside depends on prep execution.',
      recommended: true
    },
    {
      id: 'r3',
      name: 'Caitlin Thill',
      team: "O'Byrne Team",
      brokerage: 'Compass',
      phone: '',
      email: '',
      website: '',
      notes: 'Rank #3 - Prep + Pricing Balance. Primary neighborhoods: San Carlos, Allied Gardens, Del Cerro, La Mesa. Price range: $1.0M-$1.8M+. Homes sold: ~20-35 team (12mo). Avg days on market: 10-18 days. Sale-to-list ratio: ~100-104%. Pricing strategy: Team-driven, Data-informed. Remote seller experience: 4/5. Compass Concierge conditional, team-supported staging. Marketing: High (Compass + Team Reach). Negotiation: Very Strong. Concern: Team structure; confirm primary point of contact.',
      recommended: true
    },
    {
      id: 'r4',
      name: 'Mark Pattison',
      team: '',
      brokerage: '',
      phone: '',
      email: '',
      website: '',
      notes: 'Rank #4 - Operational Efficiency. Primary neighborhoods: La Mesa, San Carlos, Allied Gardens. Price range: $900K-$1.6M. Homes sold: ~25-35 (12mo). Avg days on market: 12-18 days. Sale-to-list ratio: ~99-102%. Pricing strategy: Volume-driven Comps. Remote seller experience: 4/5. Full team coordination for prep. Marketing: High (Systemized). Negotiation: Strong. Concern: Pricing may skew conservative vs peak upside.',
      recommended: false
    },
    {
      id: 'r5',
      name: 'Renee Casteel',
      team: '',
      brokerage: '',
      phone: '',
      email: '',
      website: '',
      notes: 'Rank #5 - Calm, Methodical. Primary neighborhoods: La Mesa, Allied Gardens. Price range: $950K-$1.6M. Homes sold: ~8-12 (12mo). Avg days on market: 18-25 days. Sale-to-list ratio: ~98-101%. Pricing strategy: Conservative, Market-safe. Remote seller experience: 4/5. Strong local vendors. Marketing: Solid, Traditional. Negotiation: Strong. Personal attention: Very Personal. Concern: Less aggressive pricing; may leave upside on table.',
      recommended: false
    },
    {
      id: 'r6',
      name: 'Justin Brennan',
      team: '',
      brokerage: '',
      phone: '',
      email: '',
      website: '',
      notes: 'Rank #6 - Pricing Accuracy. Primary neighborhoods: San Carlos, Allied Gardens. Price range: $1.0M-$1.7M. Homes sold: ~12-18 (12mo). Avg days on market: 14-22 days. Sale-to-list ratio: ~99-103%. Pricing strategy: Analytical, Tight Comps. Remote seller experience: 4/5. Strong vendor network, guided prep with ROI lens. Marketing: Clean, Data-forward. Negotiation: Very Strong. Personal attention: Personal. Concern: Marketing less flashy; buyer excitement relies on pricing.',
      recommended: false
    },
    {
      id: 'r7',
      name: 'Michael A. Willis',
      team: '',
      brokerage: '',
      phone: '',
      email: '',
      website: '',
      notes: 'Rank #7 - Valuation Expert. Primary neighborhoods: San Carlos, Del Cerro, Allied Gardens. Price range: $800K-$2.3M+. Homes sold: ~15-30 (12mo). Avg days on market: ~10-20 days. Sale-to-list ratio: At/Above Asking. Pricing strategy: Appraiser-informed. Remote seller experience: 4/5. Locally guided prep, valuation-first mindset. Marketing: Traditional + Hyper-local. Negotiation: Strong. Personal attention: Very Personal, Owner-agent. Concern: Marketing reach may be narrower than large teams.',
      recommended: false
    },
    {
      id: 'r8',
      name: 'Paul Fan',
      team: '',
      brokerage: '',
      phone: '',
      email: '',
      website: '',
      notes: 'Rank #8 - Broad Market Exposure. Primary neighborhoods: Broader San Diego (Del Mar, Encinitas, Citywide). Price range: $297K-$4M. Homes sold: ~20 (12mo). Avg days on market: Not published. Sale-to-list ratio: ~99-103%. Pricing strategy: Experienced + Marketing Background. Remote seller experience: 4/5. Agent-guided staging. Marketing: Traditional + Agent-driven. Negotiation: Strong. Personal attention: Very Personal. Concern: Less concentrated focus in San Carlos / East County.',
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
  neighborhoods: [],
  rentalProperties: [],
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
  // General notes state
  const [newGeneralNoteText, setNewGeneralNoteText] = useState('');
  const [editingGeneralNoteId, setEditingGeneralNoteId] = useState(null);
  const [editGeneralNoteText, setEditGeneralNoteText] = useState('');
  const [confirmDeleteGeneralNoteId, setConfirmDeleteGeneralNoteId] = useState(null);
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
  // Neighborhood management state
  const [editingNeighborhoodId, setEditingNeighborhoodId] = useState(null);
  const [editingNeighborhoodData, setEditingNeighborhoodData] = useState({});
  const [addingNeighborhood, setAddingNeighborhood] = useState(false);
  const [newNeighborhoodData, setNewNeighborhoodData] = useState({ name: '', pros: '', cons: '', priceRange: '', notes: '', rating: 0 });
  const [confirmDeleteNeighborhoodId, setConfirmDeleteNeighborhoodId] = useState(null);
  // Rental property management state
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editingPropertyData, setEditingPropertyData] = useState({});
  const [addingProperty, setAddingProperty] = useState(false);
  const [newPropertyData, setNewPropertyData] = useState({ address: '', neighborhood: '', price: '', bedrooms: '', bathrooms: '', sqft: '', petFriendly: false, url: '', notes: '', interested: false });
  const [confirmDeletePropertyId, setConfirmDeletePropertyId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'seattle-move', DOCUMENT_ID), (docSnap) => {
      if (docSnap.exists()) {
        const firebaseData = docSnap.data();
        // Merge Firebase data with initialData to ensure all steps exist
        const mergedData = {
          ...initialData,
          ...firebaseData,
          steps: {
            ...initialData.steps,
            ...firebaseData.steps
          }
        };
        setData(mergedData);
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

  // Update budget item cost
  const updateBudgetItemCost = (category, itemId, newCost) => {
    const newData = { ...data };
    const item = newData.budget[category].find(i => i.id === itemId);
    if (item) {
      const numericCost = newCost.replace(/[^0-9]/g, '');
      item.cost = numericCost ? parseInt(numericCost, 10) : '';
      setData(newData);
      saveData(newData);
    }
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

  // Neighborhood management functions
  const addNeighborhood = () => {
    if (!newNeighborhoodData.name.trim()) return;
    const newData = { ...data };
    if (!newData.neighborhoods) newData.neighborhoods = [];
    const newId = `n-${Date.now()}`;
    newData.neighborhoods.push({
      id: newId,
      name: newNeighborhoodData.name.trim(),
      pros: newNeighborhoodData.pros.trim(),
      cons: newNeighborhoodData.cons.trim(),
      priceRange: newNeighborhoodData.priceRange.trim(),
      notes: newNeighborhoodData.notes.trim(),
      rating: newNeighborhoodData.rating
    });
    setData(newData);
    saveData(newData);
    addChangelogEntry('neighborhood_added', `Added neighborhood: ${newNeighborhoodData.name.trim()}`, null, newNeighborhoodData.name.trim());
    setAddingNeighborhood(false);
    setNewNeighborhoodData({ name: '', pros: '', cons: '', priceRange: '', notes: '', rating: 0 });
  };

  const updateNeighborhood = (neighborhoodId) => {
    const newData = { ...data };
    const neighborhood = newData.neighborhoods?.find(n => n.id === neighborhoodId);
    if (neighborhood) {
      const oldName = neighborhood.name;
      neighborhood.name = editingNeighborhoodData.name?.trim() || neighborhood.name;
      neighborhood.pros = editingNeighborhoodData.pros?.trim() || '';
      neighborhood.cons = editingNeighborhoodData.cons?.trim() || '';
      neighborhood.priceRange = editingNeighborhoodData.priceRange?.trim() || '';
      neighborhood.notes = editingNeighborhoodData.notes?.trim() || '';
      neighborhood.rating = editingNeighborhoodData.rating || 0;
      setData(newData);
      saveData(newData);
      addChangelogEntry('neighborhood_updated', `Updated neighborhood: ${neighborhood.name}`, oldName, neighborhood.name);
    }
    setEditingNeighborhoodId(null);
    setEditingNeighborhoodData({});
  };

  const deleteNeighborhood = (neighborhoodId) => {
    const newData = { ...data };
    const neighborhood = newData.neighborhoods?.find(n => n.id === neighborhoodId);
    const deletedName = neighborhood?.name || '';
    newData.neighborhoods = newData.neighborhoods?.filter(n => n.id !== neighborhoodId) || [];
    setData(newData);
    saveData(newData);
    addChangelogEntry('neighborhood_deleted', `Removed neighborhood: ${deletedName}`, deletedName, null);
    setConfirmDeleteNeighborhoodId(null);
  };

  // Rental property management functions
  const addProperty = () => {
    if (!newPropertyData.address.trim()) return;
    const newData = { ...data };
    if (!newData.rentalProperties) newData.rentalProperties = [];
    const newId = `p-${Date.now()}`;
    newData.rentalProperties.push({
      id: newId,
      address: newPropertyData.address.trim(),
      neighborhood: newPropertyData.neighborhood.trim(),
      price: newPropertyData.price.trim(),
      bedrooms: newPropertyData.bedrooms.trim(),
      bathrooms: newPropertyData.bathrooms.trim(),
      sqft: newPropertyData.sqft.trim(),
      petFriendly: newPropertyData.petFriendly,
      url: newPropertyData.url.trim(),
      notes: newPropertyData.notes.trim(),
      interested: false
    });
    setData(newData);
    saveData(newData);
    addChangelogEntry('property_added', `Added rental property: ${newPropertyData.address.trim()}`, null, newPropertyData.address.trim());
    setAddingProperty(false);
    setNewPropertyData({ address: '', neighborhood: '', price: '', bedrooms: '', bathrooms: '', sqft: '', petFriendly: false, url: '', notes: '', interested: false });
  };

  const updateProperty = (propertyId) => {
    const newData = { ...data };
    const property = newData.rentalProperties?.find(p => p.id === propertyId);
    if (property) {
      const oldAddress = property.address;
      property.address = editingPropertyData.address?.trim() || property.address;
      property.neighborhood = editingPropertyData.neighborhood?.trim() || '';
      property.price = editingPropertyData.price?.trim() || '';
      property.bedrooms = editingPropertyData.bedrooms?.trim() || '';
      property.bathrooms = editingPropertyData.bathrooms?.trim() || '';
      property.sqft = editingPropertyData.sqft?.trim() || '';
      property.petFriendly = editingPropertyData.petFriendly || false;
      property.url = editingPropertyData.url?.trim() || '';
      property.notes = editingPropertyData.notes?.trim() || '';
      setData(newData);
      saveData(newData);
      addChangelogEntry('property_updated', `Updated rental property: ${property.address}`, oldAddress, property.address);
    }
    setEditingPropertyId(null);
    setEditingPropertyData({});
  };

  const deleteProperty = (propertyId) => {
    const newData = { ...data };
    const property = newData.rentalProperties?.find(p => p.id === propertyId);
    const deletedAddress = property?.address || '';
    newData.rentalProperties = newData.rentalProperties?.filter(p => p.id !== propertyId) || [];
    setData(newData);
    saveData(newData);
    addChangelogEntry('property_deleted', `Removed rental property: ${deletedAddress}`, deletedAddress, null);
    setConfirmDeletePropertyId(null);
  };

  const togglePropertyInterested = (propertyId) => {
    const newData = { ...data };
    const property = newData.rentalProperties?.find(p => p.id === propertyId);
    if (property) {
      property.interested = !property.interested;
      setData(newData);
      saveData(newData);
      addChangelogEntry(
        'property_interest',
        `${property.interested ? 'Marked' : 'Unmarked'} "${property.address}" as interested`,
        !property.interested,
        property.interested
      );
    }
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

  // General notes management functions
  const addGeneralNote = () => {
    if (!newGeneralNoteText.trim()) return;
    const newData = { ...data };
    if (!newData.generalNotes) newData.generalNotes = [];
    const noteText = newGeneralNoteText.trim();
    newData.generalNotes.push({
      id: Date.now().toString(),
      text: noteText,
      createdAt: new Date().toISOString()
    });
    setData(newData);
    saveData(newData);
    setNewGeneralNoteText('');
    addChangelogEntry(
      'general_note_added',
      'Added general note',
      null,
      noteText
    );
  };

  const updateGeneralNote = (noteId) => {
    if (!editGeneralNoteText.trim()) return;
    const newData = { ...data };
    const note = newData.generalNotes?.find(n => n.id === noteId);
    if (note) {
      const oldText = note.text;
      note.text = editGeneralNoteText.trim();
      setData(newData);
      saveData(newData);
      addChangelogEntry(
        'general_note_edited',
        'Edited general note',
        oldText,
        note.text
      );
    }
    setEditingGeneralNoteId(null);
    setEditGeneralNoteText('');
  };

  const deleteGeneralNote = (noteId) => {
    const newData = { ...data };
    const note = newData.generalNotes?.find(n => n.id === noteId);
    const deletedText = note?.text || '';
    newData.generalNotes = newData.generalNotes?.filter(n => n.id !== noteId) || [];
    setData(newData);
    saveData(newData);
    addChangelogEntry(
      'general_note_deleted',
      'Deleted general note',
      deletedText,
      null
    );
    setConfirmDeleteGeneralNoteId(null);
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

  // One-time function to sync new realtor data to Firebase
  const syncRealtorsToFirebase = async () => {
    if (!confirm('This will update Firebase with all 8 realtors. Continue?')) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'seattle-move', DOCUMENT_ID), {
        ...data,
        realtors: initialData.realtors
      });
      alert('✅ Realtors synced to Firebase successfully!');
      setLastSaved(new Date());
      window.location.reload(); // Reload to see the changes
    } catch (error) {
      console.error('Error syncing realtors:', error);
      alert('❌ Error syncing realtors: ' + error.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, textAlign: 'center' }}>
        <LinearProgress color="primary" sx={{ mb: 3 }} />
        <Typography variant="body1" color="text.secondary">
          Loading your move plan...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1e5a8e 0%, #2b9298 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 15s ease infinite',
          borderRadius: 3,
          p: 4,
          mb: 3,
          boxShadow: '0 4px 16px rgba(30, 90, 142, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${seattleSkyline})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            opacity: 0.4,
            mixBlendMode: 'overlay'
          }
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: '2.2rem',
                fontWeight: 700,
                color: 'white',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              <HomeIcon sx={{ fontSize: '2.4rem', color: '#7fffd4', filter: 'drop-shadow(0 2px 4px rgba(127, 255, 212, 0.3))' }} />
              Seattle Move Planner
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}
            >
              San Diego → Seattle
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <button
              onClick={syncRealtorsToFirebase}
              style={{
                background: 'linear-gradient(135deg, #2b9298, #1abc9c)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(26, 188, 156, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              🔄 Sync Realtors to Firebase
            </button>
            <Box>
              {saving ? (
                <Chip label="💾 Saving..." color="default" sx={{ background: 'linear-gradient(135deg, #1abc9c, #00d4ff)', color: 'white', fontWeight: 600, animation: 'pulseGlow 1s ease-in-out infinite', boxShadow: '0 0 10px rgba(26, 188, 156, 0.5)' }} />
              ) : lastSaved ? (
                <Chip label={`✓ Saved ${lastSaved.toLocaleTimeString()}`} color="default" sx={{ background: 'linear-gradient(135deg, #2ecc71, #00a86b)', color: 'white', fontWeight: 600, boxShadow: '0 0 10px rgba(46, 204, 113, 0.4)' }} />
              ) : null}
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* Welcome Hero Section */}
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          height: '200px',
          borderRadius: 3,
          mb: 3,
          overflow: 'hidden',
          backgroundImage: `url(${spaceNeedleBuildings})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(30, 90, 142, 0.5), rgba(43, 146, 152, 0.45))',
            zIndex: 1
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>
          <Typography variant="h3" sx={{
            fontWeight: 700,
            mb: 1,
            textShadow: '0 3px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.8)',
            background: 'rgba(30, 90, 142, 0.2)',
            padding: '8px 24px',
            borderRadius: 2,
            backdropFilter: 'blur(4px)'
          }}>
            Welcome to Your Seattle Journey
          </Typography>
          <Typography variant="h6" sx={{
            textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.8)',
            background: 'rgba(30, 90, 142, 0.15)',
            padding: '4px 16px',
            borderRadius: 1,
            backdropFilter: 'blur(4px)',
            display: 'inline-block'
          }}>
            Your personalized move planner from San Diego to the Emerald City
          </Typography>
        </Box>
      </Paper>

      {/* Tab Navigation */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2, transition: 'all 0.3s ease', backgroundColor: 'background.paper' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => {
            setActiveTab(newValue);
            if (newValue === 'history') loadChangelog();
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 56,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'rgba(30, 90, 142, 0.04)'
              }
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(135deg, #1e5a8e 0%, #2b9298 100%)',
              height: 4,
              borderRadius: '4px 4px 0 0'
            }
          }}
        >
          <Tab value="checklist" label="Checklist" icon={<span>✓</span>} iconPosition="start" />
          <Tab value="budget" label="Budget" icon={<span>💰</span>} iconPosition="start" />
          <Tab value="timeline" label="Timeline" icon={<span>📅</span>} iconPosition="start" />
          <Tab value="notes" label="Notes" icon={<span>📝</span>} iconPosition="start" />
          <Tab value="history" label="History" icon={<span>📜</span>} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Main Content Area */}
      <Box>

        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <Box sx={{
            backgroundImage: `url(${mtRainierMarina})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(248, 250, 251, 0.92)',
              zIndex: 0
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1, ...styles.checklistContainer }}>
            {/* Step Tabs */}
            <Box className="step-tabs" sx={styles.stepTabs}>
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
            </Box>

            {/* Active Step Content */}
            {data.steps[activeStep] && (
              <Box className="step-content" sx={styles.stepContent}>
                <Box sx={styles.stepContentHeader}>
                  <Typography variant="h2" sx={styles.stepContentTitle}>
                    <span style={{
                      ...styles.stepContentNumber,
                      background: getStepProgress(activeStep) === 100 ? colors.complete : `linear-gradient(135deg, ${colors.evergreen}, ${colors.forest})`
                    }}>
                      {getStepProgress(activeStep) === 100 ? '✓' : activeStep}
                    </span>
                    {data.steps[activeStep].title}
                  </Typography>
                  {activeStep !== '3' && (
                    <span style={{
                      ...styles.stepContentProgress,
                      color: getStepProgress(activeStep) === 100 ? colors.complete : colors.evergreen
                    }}>
                      {data.steps[activeStep].items.filter(i => i.done).length}/{data.steps[activeStep].items.length} tasks
                    </span>
                  )}
                </Box>
                <Typography variant="body1" sx={styles.stepContentDesc}>{data.steps[activeStep].description}</Typography>

                {/* Special Repairs View for Step 3 */}
                {activeStep === '3' ? (
                  <Box sx={styles.repairsContainer}>
                    {[
                      { key: 'must', title: 'Must Do (Safety/Inspection)', color: colors.coralPink },
                      { key: 'high', title: 'High Impact (Buyers Notice)', color: colors.golden },
                      { key: 'nice', title: 'Nice to Have', color: '#a5d4e8' }
                    ].map(({ key, title, color }) => {
                      const progress = getBudgetCategoryProgress(key);
                      const categoryTotal = getBudgetTotal(key);
                      return (
                        <div key={key} style={{...styles.repairSection, borderColor: color}}>
                          <div style={{...styles.repairSectionHeader, background: color}}>
                            <div style={styles.repairSectionHeaderLeft}>
                              <h4 style={styles.repairSectionTitle}>{title}</h4>
                              <span style={styles.repairSectionProgress}>{progress.done}/{progress.total}</span>
                            </div>
                            <span style={styles.repairSectionTotal}>${categoryTotal.toLocaleString()}</span>
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
                                  <>
                                    <span
                                      style={item.done ? styles.repairItemTextDone : styles.repairItemText}
                                      onClick={() => toggleBudgetItem(key, item.id)}
                                    >
                                      {item.item}
                                    </span>
                                    <div style={styles.repairCostInput}>
                                      <span style={styles.repairCostPrefix}>$</span>
                                      <input
                                        type="text"
                                        value={item.cost || ''}
                                        onChange={(e) => updateBudgetItemCost(key, item.id, e.target.value)}
                                        placeholder="0"
                                        style={styles.repairCostField}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                  </>
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
                  </Box>
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

                {/* Realtor Candidates Section - Only for Step 1 */}
                {activeStep === '1' && (
                  <div style={styles.realtorsSection}>
                    <h3 style={styles.realtorsSectionTitle}>🏠 Realtor Candidates</h3>

                    {data.realtors.length === 0 && (
                      <Box sx={{
                        textAlign: 'center',
                        py: 6,
                        px: 3,
                        backgroundImage: `url(${mtRainierMarina})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(30, 90, 142, 0.75), rgba(43, 146, 152, 0.65))',
                          zIndex: 1
                        }
                      }}>
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                          <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                            Start Your Seattle Home Search
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
                            Add real estate agents to help find your perfect Seattle home
                          </Typography>
                        </Box>
                      </Box>
                    )}

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
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Name:</label>
                                <input
                                  type="text"
                                  value={editingRealtorData.name || ''}
                                  onChange={(e) => setEditingRealtorData({...editingRealtorData, name: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Team:</label>
                                <input
                                  type="text"
                                  value={editingRealtorData.team || ''}
                                  onChange={(e) => setEditingRealtorData({...editingRealtorData, team: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Brokerage:</label>
                                <input
                                  type="text"
                                  value={editingRealtorData.brokerage || ''}
                                  onChange={(e) => setEditingRealtorData({...editingRealtorData, brokerage: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Phone:</label>
                                <input
                                  type="text"
                                  value={editingRealtorData.phone || ''}
                                  onChange={(e) => setEditingRealtorData({...editingRealtorData, phone: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Email:</label>
                                <input
                                  type="text"
                                  value={editingRealtorData.email || ''}
                                  onChange={(e) => setEditingRealtorData({...editingRealtorData, email: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Website:</label>
                                <input
                                  type="text"
                                  value={editingRealtorData.website || ''}
                                  onChange={(e) => setEditingRealtorData({...editingRealtorData, website: e.target.value})}
                                  style={styles.realtorFormInput}
                                  placeholder="https://..."
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Notes:</label>
                                <textarea
                                  value={editingRealtorData.notes || ''}
                                  onChange={(e) => setEditingRealtorData({...editingRealtorData, notes: e.target.value})}
                                  style={styles.realtorFormTextarea}
                                  rows={5}
                                />
                              </div>
                              <div style={styles.realtorFormActions}>
                                <button style={styles.realtorSaveBtn} onClick={() => updateRealtor(realtor.id)}>Save</button>
                                <button style={styles.realtorCancelBtn} onClick={() => { setEditingRealtorId(null); setEditingRealtorData({}); }}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <>
                              <div style={styles.realtorCardHeader}>
                                <div>
                                  <h4 style={styles.realtorCardName}>{realtor.name}</h4>
                                  {(realtor.team || realtor.brokerage) && (
                                    <p style={styles.realtorCardTeam}>
                                      {realtor.team}{realtor.team && realtor.brokerage ? ' / ' : ''}{realtor.brokerage}
                                    </p>
                                  )}
                                </div>
                                {realtor.recommended && (
                                  <span style={styles.recommendedBadge}>★ Recommended</span>
                                )}
                              </div>

                              <div style={styles.realtorCardDetails}>
                                {realtor.phone && <p style={styles.realtorDetailLine}>📞 {realtor.phone}</p>}
                                {realtor.email && <p style={styles.realtorDetailLine}>✉️ {realtor.email}</p>}
                                {realtor.website && (
                                  <p style={styles.realtorDetailLine}>
                                    🌐 <a
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
                              </div>

                              <div style={styles.realtorCardActions}>
                                {confirmDeleteRealtorId === realtor.id ? (
                                  <>
                                    <span style={styles.confirmDeleteText}>Delete?</span>
                                    <button style={styles.confirmYesBtn} onClick={() => deleteRealtor(realtor.id)}>Yes</button>
                                    <button style={styles.confirmNoBtn} onClick={() => setConfirmDeleteRealtorId(null)}>No</button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      style={realtor.recommended ? styles.realtorRecommendedBtn : styles.realtorRecommendBtn}
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
                        <h4 style={styles.addRealtorTitle}>Add New Realtor Candidate</h4>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Name:</label>
                          <input
                            type="text"
                            value={newRealtorData.name}
                            onChange={(e) => setNewRealtorData({...newRealtorData, name: e.target.value})}
                            style={styles.realtorFormInput}
                            autoFocus
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Team:</label>
                          <input
                            type="text"
                            value={newRealtorData.team}
                            onChange={(e) => setNewRealtorData({...newRealtorData, team: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Brokerage:</label>
                          <input
                            type="text"
                            value={newRealtorData.brokerage}
                            onChange={(e) => setNewRealtorData({...newRealtorData, brokerage: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Phone:</label>
                          <input
                            type="text"
                            value={newRealtorData.phone}
                            onChange={(e) => setNewRealtorData({...newRealtorData, phone: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Email:</label>
                          <input
                            type="text"
                            value={newRealtorData.email}
                            onChange={(e) => setNewRealtorData({...newRealtorData, email: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Website:</label>
                          <input
                            type="text"
                            value={newRealtorData.website}
                            onChange={(e) => setNewRealtorData({...newRealtorData, website: e.target.value})}
                            style={styles.realtorFormInput}
                            placeholder="https://..."
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Notes:</label>
                          <textarea
                            value={newRealtorData.notes}
                            onChange={(e) => setNewRealtorData({...newRealtorData, notes: e.target.value})}
                            style={styles.realtorFormTextarea}
                            rows={5}
                          />
                        </div>
                        <div style={styles.realtorFormActions}>
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
                        + Add Realtor Candidate
                      </button>
                    )}
                  </div>
                )}

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
                                rows={4}
                              />
                              <label style={styles.questionLabel}>Ideal Answer / What to look for:</label>
                              <textarea
                                value={editingQuestionData.idealAnswer || ''}
                                onChange={(e) => setEditingQuestionData({...editingQuestionData, idealAnswer: e.target.value})}
                                style={styles.questionTextarea}
                                rows={4}
                              />
                              <label style={styles.questionLabel}>Notes / Their Answer:</label>
                              <textarea
                                value={editingQuestionData.answer || ''}
                                onChange={(e) => setEditingQuestionData({...editingQuestionData, answer: e.target.value})}
                                style={styles.questionTextarea}
                                rows={4}
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
                          rows={4}
                          autoFocus
                        />
                        <label style={styles.questionLabel}>Ideal Answer / What to look for:</label>
                        <textarea
                          value={newQuestionData.idealAnswer}
                          onChange={(e) => setNewQuestionData({...newQuestionData, idealAnswer: e.target.value})}
                          placeholder="What should a good answer include?"
                          style={styles.questionTextarea}
                          rows={4}
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

                {/* Seattle Neighborhoods Section - Only for Step 8 */}
                {activeStep === '8' && (
                  <div style={styles.realtorsSection}>
                    <h3 style={styles.realtorsSectionTitle}>🏘️ Seattle Neighborhoods</h3>

                    {data.neighborhoods.length === 0 && (
                      <Box sx={{
                        textAlign: 'center',
                        py: 6,
                        px: 3,
                        backgroundImage: `url(${spaceNeedleBuildings})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(30, 90, 142, 0.75), rgba(43, 146, 152, 0.65))',
                          zIndex: 1
                        }
                      }}>
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                          <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                            Explore Seattle Neighborhoods
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
                            Add neighborhoods you're considering for your move
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <div style={styles.realtorCards}>
                      {(data.neighborhoods || []).map(neighborhood => (
                        <div
                          key={neighborhood.id}
                          style={styles.realtorCard}
                        >
                          {editingNeighborhoodId === neighborhood.id ? (
                            // Edit Mode
                            <div style={styles.realtorEditForm}>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Neighborhood Name:</label>
                                <input
                                  type="text"
                                  value={editingNeighborhoodData.name || ''}
                                  onChange={(e) => setEditingNeighborhoodData({...editingNeighborhoodData, name: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Price Range:</label>
                                <input
                                  type="text"
                                  value={editingNeighborhoodData.priceRange || ''}
                                  onChange={(e) => setEditingNeighborhoodData({...editingNeighborhoodData, priceRange: e.target.value})}
                                  style={styles.realtorFormInput}
                                  placeholder="e.g. $2000-3000/mo"
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Rating (0-5):</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="5"
                                  value={editingNeighborhoodData.rating || 0}
                                  onChange={(e) => setEditingNeighborhoodData({...editingNeighborhoodData, rating: parseInt(e.target.value) || 0})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Pros:</label>
                                <textarea
                                  value={editingNeighborhoodData.pros || ''}
                                  onChange={(e) => setEditingNeighborhoodData({...editingNeighborhoodData, pros: e.target.value})}
                                  style={styles.realtorFormTextarea}
                                  rows={5}
                                  placeholder="What you like about this area"
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Cons:</label>
                                <textarea
                                  value={editingNeighborhoodData.cons || ''}
                                  onChange={(e) => setEditingNeighborhoodData({...editingNeighborhoodData, cons: e.target.value})}
                                  style={styles.realtorFormTextarea}
                                  rows={5}
                                  placeholder="Concerns or drawbacks"
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Notes:</label>
                                <textarea
                                  value={editingNeighborhoodData.notes || ''}
                                  onChange={(e) => setEditingNeighborhoodData({...editingNeighborhoodData, notes: e.target.value})}
                                  style={styles.realtorFormTextarea}
                                  rows={5}
                                />
                              </div>
                              <div style={styles.realtorFormActions}>
                                <button style={styles.realtorSaveBtn} onClick={() => updateNeighborhood(neighborhood.id)}>Save</button>
                                <button style={styles.realtorCancelBtn} onClick={() => { setEditingNeighborhoodId(null); setEditingNeighborhoodData({}); }}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <>
                              <div style={styles.realtorCardHeader}>
                                <div>
                                  <h4 style={styles.realtorCardName}>{neighborhood.name}</h4>
                                  {neighborhood.priceRange && (
                                    <p style={styles.realtorCardTeam}>
                                      💰 {neighborhood.priceRange}
                                    </p>
                                  )}
                                  {neighborhood.rating > 0 && (
                                    <p style={styles.realtorCardTeam}>
                                      {'⭐'.repeat(neighborhood.rating)}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div style={styles.realtorCardDetails}>
                                {neighborhood.pros && (
                                  <div style={{marginBottom: '8px'}}>
                                    <strong style={{color: '#059669'}}>Pros:</strong>
                                    <p style={styles.realtorNotes}>{neighborhood.pros}</p>
                                  </div>
                                )}
                                {neighborhood.cons && (
                                  <div style={{marginBottom: '8px'}}>
                                    <strong style={{color: '#dc2626'}}>Cons:</strong>
                                    <p style={styles.realtorNotes}>{neighborhood.cons}</p>
                                  </div>
                                )}
                                {neighborhood.notes && (
                                  <div>
                                    <strong>Notes:</strong>
                                    <p style={styles.realtorNotes}>{neighborhood.notes}</p>
                                  </div>
                                )}
                              </div>

                              <div style={styles.realtorCardActions}>
                                {confirmDeleteNeighborhoodId === neighborhood.id ? (
                                  <>
                                    <span style={styles.confirmDeleteText}>Delete?</span>
                                    <button style={styles.confirmYesBtn} onClick={() => deleteNeighborhood(neighborhood.id)}>Yes</button>
                                    <button style={styles.confirmNoBtn} onClick={() => setConfirmDeleteNeighborhoodId(null)}>No</button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      style={styles.realtorEditBtn}
                                      onClick={() => { setEditingNeighborhoodId(neighborhood.id); setEditingNeighborhoodData({...neighborhood}); }}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      style={styles.realtorDeleteBtn}
                                      onClick={() => setConfirmDeleteNeighborhoodId(neighborhood.id)}
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

                    {/* Add New Neighborhood */}
                    {addingNeighborhood ? (
                      <div style={styles.addRealtorForm}>
                        <h4 style={styles.addRealtorTitle}>Add New Neighborhood</h4>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Neighborhood Name:</label>
                          <input
                            type="text"
                            value={newNeighborhoodData.name}
                            onChange={(e) => setNewNeighborhoodData({...newNeighborhoodData, name: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Price Range:</label>
                          <input
                            type="text"
                            value={newNeighborhoodData.priceRange}
                            onChange={(e) => setNewNeighborhoodData({...newNeighborhoodData, priceRange: e.target.value})}
                            style={styles.realtorFormInput}
                            placeholder="e.g. $2000-3000/mo"
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Rating (0-5):</label>
                          <input
                            type="number"
                            min="0"
                            max="5"
                            value={newNeighborhoodData.rating}
                            onChange={(e) => setNewNeighborhoodData({...newNeighborhoodData, rating: parseInt(e.target.value) || 0})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Pros:</label>
                          <textarea
                            value={newNeighborhoodData.pros}
                            onChange={(e) => setNewNeighborhoodData({...newNeighborhoodData, pros: e.target.value})}
                            style={styles.realtorFormTextarea}
                            rows={5}
                            placeholder="What you like about this area"
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Cons:</label>
                          <textarea
                            value={newNeighborhoodData.cons}
                            onChange={(e) => setNewNeighborhoodData({...newNeighborhoodData, cons: e.target.value})}
                            style={styles.realtorFormTextarea}
                            rows={5}
                            placeholder="Concerns or drawbacks"
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Notes:</label>
                          <textarea
                            value={newNeighborhoodData.notes}
                            onChange={(e) => setNewNeighborhoodData({...newNeighborhoodData, notes: e.target.value})}
                            style={styles.realtorFormTextarea}
                            rows={5}
                          />
                        </div>
                        <div style={styles.addRealtorActions}>
                          <button style={styles.addRealtorSaveBtn} onClick={addNeighborhood}>
                            Add Neighborhood
                          </button>
                          <button style={styles.addRealtorCancelBtn} onClick={() => { setAddingNeighborhood(false); setNewNeighborhoodData({ name: '', pros: '', cons: '', priceRange: '', notes: '', rating: 0 }); }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button style={styles.addRealtorBtn} onClick={() => setAddingNeighborhood(true)}>
                        + Add Neighborhood
                      </button>
                    )}
                  </div>
                )}

                {/* Rental Properties Section - Only for Step 8 */}
                {activeStep === '8' && (
                  <div style={styles.realtorsSection}>
                    <h3 style={styles.realtorsSectionTitle}>🏠 Rental Properties</h3>

                    {data.rentalProperties.length === 0 && (
                      <Box sx={{
                        textAlign: 'center',
                        py: 6,
                        px: 3,
                        backgroundImage: `url(${mtRainierView})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(30, 90, 142, 0.75), rgba(43, 146, 152, 0.65))',
                          zIndex: 1
                        }
                      }}>
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                          <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                            Discover Seattle Properties
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
                            Start tracking properties you're interested in
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <div style={styles.realtorCards}>
                      {(data.rentalProperties || []).map(property => (
                        <div
                          key={property.id}
                          style={{
                            ...styles.realtorCard,
                            ...(property.interested ? styles.realtorCardRecommended : {})
                          }}
                        >
                          {editingPropertyId === property.id ? (
                            // Edit Mode
                            <div style={styles.realtorEditForm}>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Address:</label>
                                <input
                                  type="text"
                                  value={editingPropertyData.address || ''}
                                  onChange={(e) => setEditingPropertyData({...editingPropertyData, address: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Neighborhood:</label>
                                <input
                                  type="text"
                                  value={editingPropertyData.neighborhood || ''}
                                  onChange={(e) => setEditingPropertyData({...editingPropertyData, neighborhood: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Price:</label>
                                <input
                                  type="text"
                                  value={editingPropertyData.price || ''}
                                  onChange={(e) => setEditingPropertyData({...editingPropertyData, price: e.target.value})}
                                  style={styles.realtorFormInput}
                                  placeholder="e.g. $2500/mo"
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Bedrooms:</label>
                                <input
                                  type="text"
                                  value={editingPropertyData.bedrooms || ''}
                                  onChange={(e) => setEditingPropertyData({...editingPropertyData, bedrooms: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Bathrooms:</label>
                                <input
                                  type="text"
                                  value={editingPropertyData.bathrooms || ''}
                                  onChange={(e) => setEditingPropertyData({...editingPropertyData, bathrooms: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Square Feet:</label>
                                <input
                                  type="text"
                                  value={editingPropertyData.sqft || ''}
                                  onChange={(e) => setEditingPropertyData({...editingPropertyData, sqft: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>
                                  <input
                                    type="checkbox"
                                    checked={editingPropertyData.petFriendly || false}
                                    onChange={(e) => setEditingPropertyData({...editingPropertyData, petFriendly: e.target.checked})}
                                    style={{marginRight: '8px'}}
                                  />
                                  Pet Friendly
                                </label>
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Listing URL:</label>
                                <input
                                  type="text"
                                  value={editingPropertyData.url || ''}
                                  onChange={(e) => setEditingPropertyData({...editingPropertyData, url: e.target.value})}
                                  style={styles.realtorFormInput}
                                  placeholder="https://..."
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Notes:</label>
                                <textarea
                                  value={editingPropertyData.notes || ''}
                                  onChange={(e) => setEditingPropertyData({...editingPropertyData, notes: e.target.value})}
                                  style={styles.realtorFormTextarea}
                                  rows={5}
                                />
                              </div>
                              <div style={styles.realtorFormActions}>
                                <button style={styles.realtorSaveBtn} onClick={() => updateProperty(property.id)}>Save</button>
                                <button style={styles.realtorCancelBtn} onClick={() => { setEditingPropertyId(null); setEditingPropertyData({}); }}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <>
                              <div style={styles.realtorCardHeader}>
                                <div>
                                  <h4 style={styles.realtorCardName}>{property.address}</h4>
                                  {property.neighborhood && (
                                    <p style={styles.realtorCardTeam}>
                                      📍 {property.neighborhood}
                                    </p>
                                  )}
                                  {property.price && (
                                    <p style={styles.realtorCardTeam}>
                                      💰 {property.price}
                                    </p>
                                  )}
                                </div>
                                {property.interested && (
                                  <span style={styles.recommendedBadge}>★ Interested</span>
                                )}
                              </div>

                              <div style={styles.realtorCardDetails}>
                                {(property.bedrooms || property.bathrooms || property.sqft) && (
                                  <p style={styles.realtorDetailLine}>
                                    {property.bedrooms && `🛏️ ${property.bedrooms} bed`}
                                    {property.bedrooms && property.bathrooms && ' | '}
                                    {property.bathrooms && `🚿 ${property.bathrooms} bath`}
                                    {(property.bedrooms || property.bathrooms) && property.sqft && ' | '}
                                    {property.sqft && `📐 ${property.sqft} sqft`}
                                  </p>
                                )}
                                {property.petFriendly && <p style={styles.realtorDetailLine}>🐾 Pet Friendly</p>}
                                {property.url && (
                                  <p style={styles.realtorDetailLine}>
                                    🔗 <a
                                      href={property.url.startsWith('http') ? property.url : `https://${property.url}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={styles.realtorWebsiteLink}
                                    >
                                      View Listing
                                    </a>
                                  </p>
                                )}
                                {property.notes && <p style={styles.realtorNotes}>{property.notes}</p>}
                              </div>

                              <div style={styles.realtorCardActions}>
                                {confirmDeletePropertyId === property.id ? (
                                  <>
                                    <span style={styles.confirmDeleteText}>Delete?</span>
                                    <button style={styles.confirmYesBtn} onClick={() => deleteProperty(property.id)}>Yes</button>
                                    <button style={styles.confirmNoBtn} onClick={() => setConfirmDeletePropertyId(null)}>No</button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      style={property.interested ? styles.realtorRecommendedBtn : styles.realtorRecommendBtn}
                                      onClick={() => togglePropertyInterested(property.id)}
                                      title={property.interested ? 'Remove from interested' : 'Mark as interested'}
                                    >
                                      {property.interested ? '★' : '☆'}
                                    </button>
                                    <button
                                      style={styles.realtorEditBtn}
                                      onClick={() => { setEditingPropertyId(property.id); setEditingPropertyData({...property}); }}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      style={styles.realtorDeleteBtn}
                                      onClick={() => setConfirmDeletePropertyId(property.id)}
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

                    {/* Add New Property */}
                    {addingProperty ? (
                      <div style={styles.addRealtorForm}>
                        <h4 style={styles.addRealtorTitle}>Add New Rental Property</h4>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Address:</label>
                          <input
                            type="text"
                            value={newPropertyData.address}
                            onChange={(e) => setNewPropertyData({...newPropertyData, address: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Neighborhood:</label>
                          <input
                            type="text"
                            value={newPropertyData.neighborhood}
                            onChange={(e) => setNewPropertyData({...newPropertyData, neighborhood: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Price:</label>
                          <input
                            type="text"
                            value={newPropertyData.price}
                            onChange={(e) => setNewPropertyData({...newPropertyData, price: e.target.value})}
                            style={styles.realtorFormInput}
                            placeholder="e.g. $2500/mo"
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Bedrooms:</label>
                          <input
                            type="text"
                            value={newPropertyData.bedrooms}
                            onChange={(e) => setNewPropertyData({...newPropertyData, bedrooms: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Bathrooms:</label>
                          <input
                            type="text"
                            value={newPropertyData.bathrooms}
                            onChange={(e) => setNewPropertyData({...newPropertyData, bathrooms: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Square Feet:</label>
                          <input
                            type="text"
                            value={newPropertyData.sqft}
                            onChange={(e) => setNewPropertyData({...newPropertyData, sqft: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>
                            <input
                              type="checkbox"
                              checked={newPropertyData.petFriendly}
                              onChange={(e) => setNewPropertyData({...newPropertyData, petFriendly: e.target.checked})}
                              style={{marginRight: '8px'}}
                            />
                            Pet Friendly
                          </label>
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Listing URL:</label>
                          <input
                            type="text"
                            value={newPropertyData.url}
                            onChange={(e) => setNewPropertyData({...newPropertyData, url: e.target.value})}
                            style={styles.realtorFormInput}
                            placeholder="https://..."
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Notes:</label>
                          <textarea
                            value={newPropertyData.notes}
                            onChange={(e) => setNewPropertyData({...newPropertyData, notes: e.target.value})}
                            style={styles.realtorFormTextarea}
                            rows={5}
                          />
                        </div>
                        <div style={styles.addRealtorActions}>
                          <button style={styles.addRealtorSaveBtn} onClick={addProperty}>
                            Add Property
                          </button>
                          <button style={styles.addRealtorCancelBtn} onClick={() => { setAddingProperty(false); setNewPropertyData({ address: '', neighborhood: '', price: '', bedrooms: '', bathrooms: '', sqft: '', petFriendly: false, url: '', notes: '', interested: false }); }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button style={styles.addRealtorBtn} onClick={() => setAddingProperty(true)}>
                        + Add Rental Property
                      </button>
                    )}
                  </div>
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
                              <textarea
                                value={editNoteText}
                                onChange={(e) => setEditNoteText(e.target.value)}
                                style={styles.noteInput}
                                autoFocus
                                rows={3}
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
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add a note... (Ctrl+Enter to save quickly)"
                      style={styles.noteInput}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                          addStepNote(activeStep);
                        }
                      }}
                      rows={2}
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
                <Box sx={styles.stepNavigation}>
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
                </Box>
              </Box>
            )}
            </Box>
          </Box>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <Box sx={{
            backgroundImage: `url(${mtRainierView})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(232, 239, 245, 0.90)',
              zIndex: 0
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1, ...styles.budgetContainer }}>
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

            </Box>
          </Box>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <Box sx={{
            backgroundImage: `url(${seattleSkyline})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(240, 244, 248, 0.92)',
              zIndex: 0
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1, ...styles.timelineWrapper }}>
            <Box className="timeline-container" sx={styles.timelineContainer}>
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
            </Box>
            </Box>
          </Box>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <Box sx={{
            backgroundImage: `url(${spaceNeedleBuildings})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(240, 245, 248, 0.93)',
              zIndex: 0
            }
          }}>
            <Box className="notes-container" sx={{ position: 'relative', zIndex: 1, ...styles.notesContainer }}>
            <Typography variant="h2" className="notes-title" sx={styles.notesTitle}>📝 Notes & Reminders</Typography>

            <div style={styles.stepNotesSection}>
              <h4 style={styles.stepNotesTitle}>📝 General Notes</h4>

              {/* Existing General Notes */}
              {data.generalNotes?.length > 0 && (
                <div style={styles.stepNotesList}>
                  {data.generalNotes.map(note => (
                    <div key={note.id} style={styles.stepNoteItem}>
                      {editingGeneralNoteId === note.id ? (
                        <div style={styles.noteEditForm}>
                          <textarea
                            value={editGeneralNoteText}
                            onChange={(e) => setEditGeneralNoteText(e.target.value)}
                            style={styles.noteInput}
                            autoFocus
                            rows={3}
                          />
                          <div style={styles.noteEditActions}>
                            <button
                              style={styles.noteSaveBtn}
                              onClick={() => updateGeneralNote(note.id)}
                            >
                              Save
                            </button>
                            <button
                              style={styles.noteCancelBtn}
                              onClick={() => { setEditingGeneralNoteId(null); setEditGeneralNoteText(''); }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span style={styles.noteText}>{note.text}</span>
                          <div style={styles.noteActions}>
                            {confirmDeleteGeneralNoteId === note.id ? (
                              <>
                                <span style={styles.confirmDeleteText}>Delete?</span>
                                <button
                                  style={styles.confirmYesBtn}
                                  onClick={() => deleteGeneralNote(note.id)}
                                >
                                  Yes
                                </button>
                                <button
                                  style={styles.confirmNoBtn}
                                  onClick={() => setConfirmDeleteGeneralNoteId(null)}
                                >
                                  No
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  style={styles.noteActionBtn}
                                  onClick={() => { setEditingGeneralNoteId(note.id); setEditGeneralNoteText(note.text); }}
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  style={styles.noteActionBtn}
                                  onClick={() => setConfirmDeleteGeneralNoteId(note.id)}
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

              {/* Add New General Note */}
              <div style={styles.addNoteForm}>
                <textarea
                  value={newGeneralNoteText}
                  onChange={(e) => setNewGeneralNoteText(e.target.value)}
                  placeholder="Add a general note... (Ctrl+Enter to save quickly)"
                  style={styles.noteInput}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      addGeneralNote();
                    }
                  }}
                  rows={2}
                />
                <button
                  style={styles.addNoteBtn}
                  onClick={() => addGeneralNote()}
                  disabled={!newGeneralNoteText.trim()}
                >
                  Add
                </button>
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
                                <textarea
                                  value={editNoteText}
                                  onChange={(e) => setEditNoteText(e.target.value)}
                                  style={styles.noteInput}
                                  autoFocus
                                  rows={3}
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
            </Box>
          </Box>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <Box sx={styles.historyContainer}>
            <Box sx={styles.historyHeader}>
              <Typography variant="h2" sx={styles.historyTitle}>📜 Change History</Typography>
              <button
                style={styles.refreshBtn}
                onClick={loadChangelog}
                disabled={changelogLoading}
              >
                {changelogLoading ? '⏳ Loading...' : '🔄 Refresh'}
              </button>
            </Box>
            <Typography variant="body1" sx={styles.historySubtitle}>All changes are automatically saved so you never lose information</Typography>

            {changelogLoading ? (
              <Box sx={styles.historyLoading}>Loading change history...</Box>
            ) : changelog.length === 0 ? (
              <Box sx={styles.historyEmpty}>
                <Typography variant="body1">📝 No changes recorded yet.</Typography>
                <Typography variant="body2" sx={styles.historyEmptyHint}>Changes to tasks, notes, budget, and dates will appear here.</Typography>
              </Box>
            ) : (
              <Box sx={styles.historyList}>
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
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 2,
          textAlign: 'center',
          bgcolor: 'grey.50',
          borderRadius: 2
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Data syncs automatically to cloud ☁️
        </Typography>
      </Paper>
    </Container>
  );
}

// Seattle Move - Ocean Blues Theme
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

export default App;
