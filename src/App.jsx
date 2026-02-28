import { useState, useEffect, useMemo } from 'react';
import { db } from './firebase';
import { useEntityManager, useListItemManager } from './hooks/useEntityManager';
import { styles, colors } from './App.styles';
import { generateSearchURLs } from './services/geminiService';
import GeminiTest from './components/GeminiTest';
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
  LinearProgress,
  Checkbox,
  FormControlLabel,
  Grid,
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
  CheckCircleOutline as CheckCircleOutlineIcon,
  ExpandMore as ExpandMoreIcon
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
      rank: 1,
      specialty: 'Top Dollar + Speed',
      team: 'The Barron Team',
      brokerage: 'Real Brokerage',
      phone: '(858) 805-9899',
      email: '',
      website: 'thebarronteam.com',
      neighborhoods: 'San Carlos, Allied Gardens, Del Cerro',
      priceRange: '$1.0M - $1.8M',
      homesSold: '~40-60 (12mo)',
      avgDaysOnMarket: '10-15 days',
      saleToListRatio: '101-105%',
      overAskingFrequency: 'Very High',
      pricingStrategy: 'Data-driven + Aggressive',
      remoteExperience: '5/5',
      marketing: 'High (Digital + Local)',
      negotiation: 'Exceptional',
      concierge: 'Full coordination, included staging & ROI-focused updates',
      concerns: 'Large team; ensure lead agent involvement clearly defined',
      recommended: true
    },
    {
      id: 'r2',
      name: 'Joel Blumenfeld',
      rank: 2,
      specialty: 'White-Glove Prep',
      team: 'Blumenfeld Group',
      brokerage: 'Compass',
      phone: '(619) 508-2192',
      email: 'joel.blumenfeld@compass.com',
      website: 'theblumenfeldgroup.com',
      neighborhoods: 'San Carlos, Del Cerro, La Mesa',
      priceRange: '$1.1M - $2.0M',
      homesSold: '~10-15 (12mo)',
      avgDaysOnMarket: '12-20 days',
      saleToListRatio: '100-104%',
      overAskingFrequency: 'High',
      pricingStrategy: 'Precision + Prep',
      remoteExperience: '5/5',
      marketing: 'Very High (Luxury Polish)',
      negotiation: 'Very Strong',
      concierge: 'Compass Concierge - fronts costs for staging, paint, flooring, landscaping, minor renovations',
      concerns: 'Lower volume; upside depends on prep execution',
      recommended: true
    },
    {
      id: 'r3',
      name: 'Caitlin Thill',
      rank: 3,
      specialty: 'Prep + Pricing Balance',
      team: "O'Byrne Team",
      brokerage: 'Compass',
      phone: '(858) 869-3940',
      email: 'caitlin@obyrneteam.com',
      website: 'obyrneteam.com/agent/caitlin-thill',
      neighborhoods: 'San Carlos, Allied Gardens, Del Cerro, La Mesa',
      priceRange: '$1.0M - $1.8M+',
      homesSold: '~20-35 team (12mo)',
      avgDaysOnMarket: '10-18 days',
      saleToListRatio: '~100-104%',
      overAskingFrequency: 'High',
      pricingStrategy: 'Team-driven, Data-informed',
      remoteExperience: '4/5',
      marketing: 'High (Compass + Team Reach)',
      negotiation: 'Very Strong',
      concierge: 'Compass Concierge conditional, team-supported staging',
      concerns: 'Team structure; confirm primary point of contact',
      recommended: true
    },
    {
      id: 'r4',
      name: 'Mark Pattison',
      rank: 4,
      specialty: 'Operational Efficiency',
      team: 'PorchLight Realty Team',
      brokerage: 'eXp Realty',
      phone: '(619) 704-7170',
      email: 'mark@porchlightsocal.com',
      website: 'porchlightsocal.com',
      neighborhoods: 'La Mesa, San Carlos, Allied Gardens',
      priceRange: '$900K - $1.6M',
      homesSold: '~25-35 (12mo)',
      avgDaysOnMarket: '12-18 days',
      saleToListRatio: '~99-102%',
      overAskingFrequency: 'Moderate',
      pricingStrategy: 'Volume-driven Comps',
      remoteExperience: '4/5',
      marketing: 'High (Systemized)',
      negotiation: 'Strong',
      concierge: 'Full team coordination for prep',
      concerns: 'Pricing may skew conservative vs peak upside',
      recommended: false
    },
    {
      id: 'r5',
      name: 'Renee Casteel',
      rank: 5,
      specialty: 'Calm, Methodical',
      team: '',
      brokerage: '',
      phone: '',
      email: '',
      website: '',
      neighborhoods: 'La Mesa, Allied Gardens',
      priceRange: '$950K - $1.6M',
      homesSold: '~8-12 (12mo)',
      avgDaysOnMarket: '18-25 days',
      saleToListRatio: '~98-101%',
      overAskingFrequency: 'Moderate',
      pricingStrategy: 'Conservative, Market-safe',
      remoteExperience: '4/5',
      marketing: 'Solid, Traditional',
      negotiation: 'Strong',
      concierge: 'Strong local vendors',
      concerns: 'Less aggressive pricing; may leave upside on table',
      recommended: false
    },
    {
      id: 'r6',
      name: 'Justin Brennan',
      rank: 6,
      specialty: 'Pricing Accuracy',
      team: 'Brennan Real Estate Group',
      brokerage: 'eXp Realty',
      phone: '(619) 823-2120',
      email: '',
      website: 'justincbrennan.com',
      neighborhoods: 'San Carlos, Allied Gardens',
      priceRange: '$1.0M - $1.7M',
      homesSold: '~12-18 (12mo)',
      avgDaysOnMarket: '14-22 days',
      saleToListRatio: '~99-103%',
      overAskingFrequency: 'Moderate-High',
      pricingStrategy: 'Analytical, Tight Comps',
      remoteExperience: '4/5',
      marketing: 'Clean, Data-forward',
      negotiation: 'Very Strong',
      concierge: 'Strong vendor network, guided prep with ROI lens',
      concerns: 'Marketing less flashy; buyer excitement relies on pricing',
      recommended: false
    },
    {
      id: 'r7',
      name: 'Michael A. Willis',
      rank: 7,
      specialty: 'Valuation Expert',
      team: '',
      brokerage: 'Keller Williams Realty',
      phone: '(619) 881-7802',
      email: 'michaelwillisre@gmail.com',
      website: 'michaelwillisre.com',
      neighborhoods: 'San Carlos, Del Cerro, Allied Gardens',
      priceRange: '$800K - $2.3M+',
      homesSold: '~15-30 (12mo)',
      avgDaysOnMarket: '~10-20 days',
      saleToListRatio: 'At/Above Asking',
      overAskingFrequency: 'Moderate-High',
      pricingStrategy: 'Appraiser-informed',
      remoteExperience: '4/5',
      marketing: 'Traditional + Hyper-local',
      negotiation: 'Strong',
      concierge: 'Locally guided prep, valuation-first mindset',
      concerns: 'Marketing reach may be narrower than large teams',
      recommended: false
    },
    {
      id: 'r8',
      name: 'Paul Fan',
      rank: 8,
      specialty: 'Broad Market Exposure',
      team: '',
      brokerage: 'Willis Allen Real Estate',
      phone: '',
      email: '',
      website: 'paulfan.willisallen.com',
      neighborhoods: 'Broader San Diego (Del Mar, Encinitas, Citywide)',
      priceRange: '$297K - $4M',
      homesSold: '~20 (12mo)',
      avgDaysOnMarket: 'Not published',
      saleToListRatio: '~99-103%',
      overAskingFrequency: 'Moderate-High',
      pricingStrategy: 'Experienced + Marketing Background',
      remoteExperience: '4/5',
      marketing: 'Traditional + Agent-driven',
      negotiation: 'Strong',
      concierge: 'Agent-guided staging',
      concerns: 'Less concentrated focus in San Carlos / East County',
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
  timeline: {
    preparation: {
      id: 'preparation',
      title: '🎯 Preparation',
      subtitle: 'Planning & Setup',
      description: 'Initial research, realtor selection, and securing funding',
      status: 'in-progress',
      startDate: '',
      endDate: '',
      tasks: [
        { id: 'prep-1', text: 'Research and interview realtors', done: false },
        { id: 'prep-2', text: 'Get realistic sale price estimate from realtor', done: false },
        { id: 'prep-3', text: 'Get repair recommendations and cost estimates', done: false },
        { id: 'prep-4', text: 'Sign listing agreement', done: false },
        { id: 'prep-5', text: 'Calculate total funding needed', done: false },
        { id: 'prep-6', text: 'Apply for and secure 401k loan or Compass Concierge', done: false },
      ]
    },
    houseReady: {
      id: 'houseReady',
      title: '🏠 House Ready',
      subtitle: 'Repairs & Prep',
      description: 'Complete repairs, declutter, clean, and stage the home',
      status: 'pending',
      startDate: '',
      endDate: '',
      tasks: [
        { id: 'house-1', text: 'Complete must-do repairs (electrical, plumbing, safety)', done: false },
        { id: 'house-2', text: 'Complete high-priority repairs (paint, fixtures, cleaning)', done: false },
        { id: 'house-3', text: 'Sort belongings (keep, sell, donate, discard)', done: false },
        { id: 'house-4', text: 'Sell items on Marketplace/OfferUp', done: false },
        { id: 'house-5', text: 'Move keeper items to storage unit', done: false },
        { id: 'house-6', text: 'Professional carpet and house cleaning', done: false },
        { id: 'house-7', text: 'Pre-listing inspection', done: false },
        { id: 'house-8', text: 'Address any inspection surprises', done: false },
      ]
    },
    onMarket: {
      id: 'onMarket',
      title: '📸 On Market',
      subtitle: 'Listed & Showing',
      description: 'Professional photos, listing goes live, showings begin',
      status: 'pending',
      startDate: '',
      endDate: '',
      tasks: [
        { id: 'market-1', text: 'Professional photos and virtual tour', done: false },
        { id: 'market-2', text: 'Staging consultation (if needed)', done: false },
        { id: 'market-3', text: 'List the house on MLS', done: false },
        { id: 'market-4', text: 'Schedule and host open houses', done: false },
        { id: 'market-5', text: 'Coordinate private showings', done: false },
        { id: 'market-6', text: 'Maintain house in showing condition', done: false },
      ]
    },
    underContract: {
      id: 'underContract',
      title: '✍️ Under Contract',
      subtitle: 'Offer Accepted',
      description: 'Review offers, negotiate, accept offer, enter escrow',
      status: 'pending',
      startDate: '',
      endDate: '',
      tasks: [
        { id: 'contract-1', text: 'Review incoming offers with realtor', done: false },
        { id: 'contract-2', text: 'Negotiate terms if needed', done: false },
        { id: 'contract-3', text: 'Accept best offer', done: false },
        { id: 'contract-4', text: 'Sign purchase agreement', done: false },
        { id: 'contract-5', text: 'Open escrow', done: false },
        { id: 'contract-6', text: 'Secure temporary housing in San Diego', done: false },
      ]
    },
    closing: {
      id: 'closing',
      title: '🏁 Closing',
      subtitle: 'Finalizing Sale',
      description: 'Buyer inspections, appraisal, final walkthrough, close escrow',
      status: 'pending',
      startDate: '',
      endDate: '',
      tasks: [
        { id: 'close-1', text: 'Buyer\'s home inspection', done: false },
        { id: 'close-2', text: 'Address inspection requests if any', done: false },
        { id: 'close-3', text: 'Buyer\'s appraisal', done: false },
        { id: 'close-4', text: 'Final walkthrough with buyer', done: false },
        { id: 'close-5', text: 'Sign closing documents', done: false },
        { id: 'close-6', text: 'Close escrow and receive proceeds', done: false },
        { id: 'close-7', text: 'Hand over keys to new owners', done: false },
      ]
    },
    transition: {
      id: 'transition',
      title: '📦 Transition',
      subtitle: 'Moving Out',
      description: 'Vacate house, move to temporary housing, prepare for Seattle',
      status: 'pending',
      startDate: '',
      endDate: '',
      tasks: [
        { id: 'trans-1', text: 'Vacate house before close date', done: false },
        { id: 'trans-2', text: 'Move into temporary San Diego rental', done: false },
        { id: 'trans-3', text: 'Research Seattle neighborhoods', done: false },
        { id: 'trans-4', text: 'Find pet-friendly rental in Seattle', done: false },
        { id: 'trans-5', text: 'Hire movers for Seattle move', done: false },
        { id: 'trans-6', text: 'Pay off debts with sale proceeds', done: false },
      ]
    },
    settling: {
      id: 'settling',
      title: '🌲 Settling In',
      subtitle: 'Welcome to Seattle!',
      description: 'Move to Seattle, set up new home, wrap up loose ends',
      status: 'pending',
      startDate: '',
      endDate: '',
      tasks: [
        { id: 'settle-1', text: 'Travel to Seattle with pets', done: false },
        { id: 'settle-2', text: 'Move into Seattle rental', done: false },
        { id: 'settle-3', text: 'Set up utilities at new place', done: false },
        { id: 'settle-4', text: 'Set up mail forwarding', done: false },
        { id: 'settle-5', text: 'Update address with important accounts', done: false },
        { id: 'settle-6', text: 'Cancel San Diego utilities', done: false },
        { id: 'settle-7', text: 'Establish emergency fund', done: false },
        { id: 'settle-8', text: 'Explore your new city!', done: false },
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
  },
  financial: {
    salePrice: '',
    realtorFeePercentage: 5,
    fixedDebts: [
      { id: 'fd1', item: 'Remaining Mortgage', amount: '', type: 'debt' },
      { id: 'fd2', item: 'HELOC Loan', amount: '150000', type: 'debt' },
      { id: 'fd3', item: 'SoFi Loan', amount: '50000', type: 'debt' },
      { id: 'fd4', item: 'Solar Loan', amount: '53000', type: 'debt' },
      { id: 'fd5', item: 'Credit Cards', amount: '80000', type: 'debt' },
      { id: 'fd6', item: '401k Loan', amount: '', type: 'debt' },
    ],
    expenses: [
      { id: 'exp1', item: 'Concierge for Upgrades', amount: '', type: 'expense' },
    ],
    customItems: []
  },
  // AI Rental Finder
  aiRentalFinder: {
    searchCriteria: {
      bedrooms: { min: 1, max: 3 },
      bathrooms: { min: 1, max: null },
      priceRange: { min: 0, max: 2500 },
      petFriendly: true,
      neighborhoods: [],
      duration: 'both', // 'short' | 'long' | 'both'
      descriptionKeywords: [],
      moveInDate: '',
    },
    learnedPreferences: {
      dealBreakers: [],
      preferredFeatures: [],
      descriptionKeywords: []
    },
    generatedURLs: {
      zillow: '',
      redfin: '',
      hotpads: ''
    },
    lastSearch: null
  },
  steps: {
    '1': {
      title: 'Choose Realtor',
      description: 'Interview and select the best realtor for your home sale',
      targetDate: '',
      items: [
        { id: '1-1', text: 'Research top realtors in San Carlos area', done: false },
        { id: '1-2', text: 'Schedule interviews with top 3 candidates', done: false },
        { id: '1-3', text: 'Ask prepared questions during interviews', done: false },
        { id: '1-4', text: 'Compare commission rates and services', done: false },
        { id: '1-5', text: 'Sign listing agreement with chosen realtor', done: false }
      ]
    },
    '2': {
      title: 'Secure Funding',
      description: 'Calculate costs and secure funding for repairs, moving, and transition',
      targetDate: '',
      items: [
        { id: '2-1', text: 'Get realistic sale price estimate from realtor', done: false },
        { id: '2-2', text: 'Calculate total repair and prep costs', done: false },
        { id: '2-3', text: 'Calculate moving and transition costs', done: false },
        { id: '2-4', text: 'Explore funding options (401k loan, Compass Concierge, etc.)', done: false },
        { id: '2-5', text: 'Secure funding source', done: false }
      ]
    },
    '3': {
      title: 'Home Repairs',
      description: 'Complete must-do and high-priority repairs to maximize sale value',
      targetDate: '',
      items: [
        { id: '3-1', text: 'Get repair estimates from contractors', done: false },
        { id: '3-2', text: 'Complete must-do safety repairs (electrical, plumbing)', done: false },
        { id: '3-3', text: 'Complete high-priority cosmetic repairs (paint, fixtures)', done: false },
        { id: '3-4', text: 'Professional carpet cleaning', done: false },
        { id: '3-5', text: 'Pressure wash exterior and concrete', done: false },
        { id: '3-6', text: 'Landscaping and curb appeal', done: false }
      ]
    },
    '4': {
      title: 'Sort & Declutter',
      description: 'Sort belongings into keep, sell, donate, and discard categories',
      targetDate: '',
      items: [
        { id: '4-1', text: 'Sort belongings room by room (keep, sell, donate, discard)', done: false },
        { id: '4-2', text: 'List items on Marketplace/OfferUp', done: false },
        { id: '4-3', text: 'Donate items to charity', done: false },
        { id: '4-4', text: 'Rent storage unit for keeper items', done: false },
        { id: '4-5', text: 'Move keeper items to storage', done: false }
      ]
    },
    '5': {
      title: 'Temp Housing',
      description: 'Find temporary housing in San Diego for the transition period',
      targetDate: '',
      items: [
        { id: '5-1', text: 'Research short-term rental options in San Diego', done: false },
        { id: '5-2', text: 'Find pet-friendly temporary housing', done: false },
        { id: '5-3', text: 'Book temporary housing (4-6 weeks)', done: false },
        { id: '5-4', text: 'Plan logistics for move to temp housing', done: false }
      ]
    },
    '6': {
      title: 'Vacate House',
      description: 'Final cleaning, staging, and moving out for sale',
      targetDate: '',
      items: [
        { id: '6-1', text: 'Professional move-out cleaning', done: false },
        { id: '6-2', text: 'Staging consultation and setup', done: false },
        { id: '6-3', text: 'Professional photos and virtual tour', done: false },
        { id: '6-4', text: 'Pre-listing inspection', done: false },
        { id: '6-5', text: 'Move to temporary housing', done: false }
      ]
    },
    '7': {
      title: 'Sell House',
      description: 'List house, manage showings, review offers, and close the sale',
      targetDate: '',
      items: [
        { id: '7-1', text: 'List house on MLS', done: false },
        { id: '7-2', text: 'Host open houses and showings', done: false },
        { id: '7-3', text: 'Review and negotiate offers', done: false },
        { id: '7-4', text: 'Accept offer and open escrow', done: false },
        { id: '7-5', text: 'Complete buyer inspection and appraisal', done: false },
        { id: '7-6', text: 'Sign closing documents', done: false },
        { id: '7-7', text: 'Close escrow and receive proceeds', done: false }
      ]
    },
    '8': {
      title: 'Move to Seattle',
      description: 'Plan and execute the move from San Diego to Seattle',
      targetDate: '',
      items: [
        { id: '8-1', text: 'Research Seattle neighborhoods', done: false },
        { id: '8-2', text: 'Find pet-friendly rental in Seattle', done: false },
        { id: '8-3', text: 'Hire movers for cross-country move', done: false },
        { id: '8-4', text: 'Travel to Seattle with pets', done: false },
        { id: '8-5', text: 'Move into Seattle rental', done: false }
      ]
    },
    '9': {
      title: 'Closing Tasks',
      description: 'Wrap up loose ends, pay off debts, and settle into your new life',
      targetDate: '',
      items: [
        { id: '9-1', text: 'Pay off debts with sale proceeds', done: false },
        { id: '9-2', text: 'Set up utilities at new place', done: false },
        { id: '9-3', text: 'Set up mail forwarding', done: false },
        { id: '9-4', text: 'Update address with important accounts', done: false },
        { id: '9-5', text: 'Cancel San Diego utilities', done: false },
        { id: '9-6', text: 'Establish emergency fund', done: false },
        { id: '9-7', text: 'Explore your new city!', done: false }
      ]
    }
  }
};

const DOCUMENT_ID = 'seattle-move-data';

// Note categories
const NOTE_CATEGORIES = {
  property: { label: '🏠 Property', color: '#3498db' },
  contacts: { label: '📞 Contacts', color: '#9b59b6' },
  ideas: { label: '💭 Ideas', color: colors.seaweed },
  important: { label: '❗ Important', color: '#e74c3c' },
  seattle: { label: '📍 Seattle', color: '#f39c12' }
};

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
  const [editGeneralNoteCategory, setEditGeneralNoteCategory] = useState('ideas');
  const [confirmDeleteGeneralNoteId, setConfirmDeleteGeneralNoteId] = useState(null);
  const [newNoteCategory, setNewNoteCategory] = useState('ideas');
  const [noteFilter, setNoteFilter] = useState('all');
  const [changelog, setChangelog] = useState([]);
  const [changelogLoading, setChangelogLoading] = useState(false);
  // AI Rental Finder state
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiSearchError, setAiSearchError] = useState(null);
  const [newDescriptionKeyword, setNewDescriptionKeyword] = useState('');
  // List item management using custom hooks
  const checklistItems = useListItemManager();
  const budgetItems = useListItemManager();
  // Financial item editing state
  const [editingFinancialItemId, setEditingFinancialItemId] = useState(null);
  const [editFinancialItemText, setEditFinancialItemText] = useState('');
  // Entity management state using custom hooks
  const realtors = useEntityManager({ name: '', team: '', brokerage: '', phone: '', email: '', website: '', notes: '' });
  const questions = useEntityManager({ question: '', idealAnswer: '', answer: '' });
  const neighborhoods = useEntityManager({ name: '', pros: '', cons: '', priceRange: '', notes: '', rating: 0 });
  const properties = useEntityManager({ address: '', neighborhood: '', price: '', bedrooms: '', bathrooms: '', sqft: '', petFriendly: false, url: '', notes: '', interested: false, duration: 'short' });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'seattle-move', DOCUMENT_ID), (docSnap) => {
      if (docSnap.exists()) {
        const firebaseData = docSnap.data();
        // Deep merge Firebase data with initialData to ensure defaults exist
        // Firebase data takes priority over initialData for all fields
        const mergedData = {
          ...initialData,
          ...firebaseData,
          steps: {
            ...initialData.steps,
            ...(firebaseData.steps || {})
          },
          financial: {
            ...initialData.financial,
            ...(firebaseData.financial || {})
          }
        };
        setData(mergedData);
      }
      setLoading(false);
    }, (error) => {
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
    }
  };

  const saveData = async (newData) => {
    // Prevent saving before Firebase data has loaded to avoid overwriting real data with defaults
    if (loading) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'seattle-move', DOCUMENT_ID), newData);
      setLastSaved(new Date());
    } catch (error) {
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
    if (!checklistItems.editText.trim()) return;
    const newData = { ...data };
    const item = newData.steps[stepId].items.find(i => i.id === itemId);
    if (item && item.text !== checklistItems.editText.trim()) {
      const oldText = item.text;
      item.text = checklistItems.editText.trim();
      setData(newData);
      saveData(newData);
      addChangelogEntry(
        'item_edited',
        `Edited task in "${newData.steps[stepId].title}"`,
        oldText,
        checklistItems.editText.trim()
      );
    }
    checklistItems.setEditingId(null);
    checklistItems.setEditText('');
  };

  // Add new checklist item
  const addNewItem = (stepId) => {
    if (!checklistItems.newItemText.trim()) return;
    const newData = { ...data };
    const newId = `${stepId}-${Date.now()}`;
    newData.steps[stepId].items.push({
      id: newId,
      text: checklistItems.newItemText.trim(),
      done: false
    });
    setData(newData);
    saveData(newData);
    addChangelogEntry(
      'item_added',
      `Added task to "${newData.steps[stepId].title}"`,
      null,
      checklistItems.newItemText.trim()
    );
    checklistItems.setNewItemParent(null);
    checklistItems.setNewItemText('');
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
    checklistItems.setConfirmDeleteId(null);
  };

  // Reorder checklist items via drag and drop
  const handleDragStart = (e, itemId) => {
    checklistItems.setDraggedId(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, itemId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (itemId !== checklistItems.dragOverId) {
      checklistItems.setDragOverId(itemId);
    }
  };

  const handleDragLeave = () => {
    checklistItems.setDragOverId(null);
  };

  const handleDrop = (e, stepId, targetItemId) => {
    e.preventDefault();
    if (!checklistItems.draggedId || checklistItems.draggedId === targetItemId) {
      checklistItems.setDraggedId(null);
      return;
    }

    const newData = { ...data };
    const items = newData.steps[stepId].items;
    const draggedIndex = items.findIndex(i => i.id === checklistItems.draggedId);
    const targetIndex = items.findIndex(i => i.id === targetItemId);

    if (draggedIndex === -1 || targetIndex === -1) {
      checklistItems.setDraggedId(null);
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
    checklistItems.setDraggedId(null);
    checklistItems.setDragOverId(null);
  };

  const handleDragEnd = () => {
    checklistItems.setDraggedId(null);
    checklistItems.setDragOverId(null);
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
    if (!budgetItems.editText.trim()) return;
    const newData = { ...data };
    const item = newData.budget[category].find(i => i.id === itemId);
    if (item && item.item !== budgetItems.editText.trim()) {
      const oldText = item.item;
      item.item = budgetItems.editText.trim();
      setData(newData);
      saveData(newData);
      addChangelogEntry(
        'budget_item_edited',
        `Edited budget item`,
        oldText,
        budgetItems.editText.trim()
      );
    }
    budgetItems.setEditingId(null);
    budgetItems.setEditText('');
  };

  // Add new budget item
  const addNewBudgetItem = (category) => {
    if (!budgetItems.newItemText.trim()) return;
    const newData = { ...data };
    const newId = `b-${Date.now()}`;
    newData.budget[category].push({
      id: newId,
      item: budgetItems.newItemText.trim(),
      cost: '',
      done: false
    });
    setData(newData);
    saveData(newData);
    addChangelogEntry(
      'budget_item_added',
      `Added budget item to ${category}`,
      null,
      budgetItems.newItemText.trim()
    );
    budgetItems.setNewItemParent(null);
    budgetItems.setNewItemText('');
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
    budgetItems.setConfirmDeleteId(null);
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
    budgetItems.setDraggedId(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleBudgetDragOver = (e, itemId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (itemId !== budgetItems.dragOverId) {
      budgetItems.setDragOverId(itemId);
    }
  };

  const handleBudgetDragLeave = () => {
    budgetItems.setDragOverId(null);
  };

  const handleBudgetDrop = (e, category, targetItemId) => {
    e.preventDefault();
    if (!budgetItems.draggedId || budgetItems.draggedId === targetItemId) {
      budgetItems.setDraggedId(null);
      budgetItems.setDragOverId(null);
      return;
    }

    const newData = { ...data };
    const items = newData.budget[category];
    const draggedIndex = items.findIndex(i => i.id === budgetItems.draggedId);
    const targetIndex = items.findIndex(i => i.id === targetItemId);

    if (draggedIndex === -1 || targetIndex === -1) {
      budgetItems.setDraggedId(null);
      budgetItems.setDragOverId(null);
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
    budgetItems.setDraggedId(null);
    budgetItems.setDragOverId(null);
  };

  const handleBudgetDragEnd = () => {
    budgetItems.setDraggedId(null);
    budgetItems.setDragOverId(null);
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
  // Generic CRUD helper functions
  const createEntity = (entityKey, idPrefix, newEntityData, primaryField, changelogType, entityName, resetState) => {
    if (!newEntityData[primaryField]?.trim()) return;

    const newData = { ...data };
    if (!newData[entityKey]) newData[entityKey] = [];

    const newId = `${idPrefix}-${Date.now()}`;
    const newEntity = { id: newId };

    // Copy all fields, trimming strings
    Object.keys(newEntityData).forEach(key => {
      if (typeof newEntityData[key] === 'string') {
        newEntity[key] = newEntityData[key].trim();
      } else {
        newEntity[key] = newEntityData[key];
      }
    });

    newData[entityKey].push(newEntity);
    setData(newData);
    saveData(newData);
    addChangelogEntry(changelogType, `Added ${entityName}: ${newEntityData[primaryField].trim()}`, null, newEntityData[primaryField].trim());
    resetState();
  };

  const updateEntity = (entityKey, entityId, editingData, primaryField, changelogType, entityName, resetState) => {
    const newData = { ...data };
    const entity = newData[entityKey]?.find(e => e.id === entityId);

    if (entity) {
      const oldValue = entity[primaryField];

      // Update all fields, trimming strings
      Object.keys(editingData).forEach(key => {
        if (typeof editingData[key] === 'string') {
          entity[key] = editingData[key]?.trim() || '';
        } else if (editingData[key] !== undefined) {
          entity[key] = editingData[key];
        }
      });

      setData(newData);
      saveData(newData);
      addChangelogEntry(changelogType, `Updated ${entityName}: ${entity[primaryField]}`, oldValue, entity[primaryField]);
    }
    resetState();
  };

  const deleteEntity = (entityKey, entityId, primaryField, changelogType, entityName, resetState) => {
    const newData = { ...data };
    const entity = newData[entityKey]?.find(e => e.id === entityId);
    const deletedValue = entity?.[primaryField] || '';

    newData[entityKey] = newData[entityKey]?.filter(e => e.id !== entityId) || [];
    setData(newData);
    saveData(newData);
    addChangelogEntry(changelogType, `Removed ${entityName}: ${deletedValue}`, deletedValue, null);
    resetState();
  };

  const toggleEntityField = (entityKey, entityId, toggleField, primaryField, changelogType, actionVerbs) => {
    const newData = { ...data };
    const entity = newData[entityKey]?.find(e => e.id === entityId);
    if (entity) {
      entity[toggleField] = !entity[toggleField];
      setData(newData);
      saveData(newData);
      addChangelogEntry(
        changelogType,
        `${entity[toggleField] ? actionVerbs.onTrue : actionVerbs.onFalse} "${entity[primaryField]}" as ${toggleField}`,
        !entity[toggleField],
        entity[toggleField]
      );
    }
  };

  // Realtor management functions
  const addRealtor = () => createEntity(
    'realtors', 'r', realtors.newData, 'name', 'realtor_added', 'realtor',
    () => realtors.cancelAdding()
  );

  const updateRealtor = (realtorId) => updateEntity(
    'realtors', realtorId, realtors.editingData, 'name', 'realtor_updated', 'realtor',
    () => realtors.cancelEditing()
  );

  const deleteRealtor = (realtorId) => deleteEntity(
    'realtors', realtorId, 'name', 'realtor_deleted', 'realtor',
    () => realtors.cancelDelete()
  );

  const toggleRealtorRecommended = (realtorId) => toggleEntityField(
    'realtors', realtorId, 'recommended', 'name', 'realtor_recommendation',
    { onTrue: 'Marked', onFalse: 'Unmarked' }
  );

  // Realtor questions management functions
  const addQuestion = () => createEntity(
    'realtorQuestions', 'q', questions.newData, 'question', 'question_added', 'realtor question',
    () => questions.cancelAdding()
  );

  const updateQuestion = (questionId) => updateEntity(
    'realtorQuestions', questionId, questions.editingData, 'question', 'question_updated', 'realtor question',
    () => questions.cancelEditing()
  );

  const deleteQuestion = (questionId) => deleteEntity(
    'realtorQuestions', questionId, 'question', 'question_deleted', 'realtor question',
    () => questions.cancelDelete()
  );

  // Neighborhood management functions
  const addNeighborhood = () => createEntity(
    'neighborhoods', 'n', neighborhoods.newData, 'name', 'neighborhood_added', 'neighborhood',
    () => neighborhoods.cancelAdding()
  );

  const updateNeighborhood = (neighborhoodId) => updateEntity(
    'neighborhoods', neighborhoodId, neighborhoods.editingData, 'name', 'neighborhood_updated', 'neighborhood',
    () => neighborhoods.cancelEditing()
  );

  const deleteNeighborhood = (neighborhoodId) => deleteEntity(
    'neighborhoods', neighborhoodId, 'name', 'neighborhood_deleted', 'neighborhood',
    () => neighborhoods.cancelDelete()
  );

  // Rental property management functions
  const addProperty = () => createEntity(
    'rentalProperties', 'p', {...properties.newData, interested: false}, 'address', 'property_added', 'rental property',
    () => properties.cancelAdding()
  );

  const updateProperty = (propertyId) => updateEntity(
    'rentalProperties', propertyId, properties.editingData, 'address', 'property_updated', 'rental property',
    () => properties.cancelEditing()
  );

  const deleteProperty = (propertyId) => deleteEntity(
    'rentalProperties', propertyId, 'address', 'property_deleted', 'rental property',
    () => properties.cancelDelete()
  );

  const togglePropertyInterested = (propertyId) => toggleEntityField(
    'rentalProperties', propertyId, 'interested', 'address', 'property_interest',
    { onTrue: 'Marked', onFalse: 'Unmarked' }
  );

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
      category: newNoteCategory,
      createdAt: new Date().toISOString()
    });
    setData(newData);
    saveData(newData);
    setNewGeneralNoteText('');
    setNewNoteCategory('ideas'); // Reset to default
    addChangelogEntry(
      'general_note_added',
      `Added ${NOTE_CATEGORIES[newNoteCategory].label} note`,
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
      const oldCategory = note.category;
      note.text = editGeneralNoteText.trim();
      note.category = editGeneralNoteCategory;
      setData(newData);
      saveData(newData);
      addChangelogEntry(
        'general_note_edited',
        `Edited ${NOTE_CATEGORIES[editGeneralNoteCategory].label} note`,
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

  // AI Rental Finder functions
  const addDescriptionKeyword = (keyword) => {
    if (!keyword.trim()) return;
    const newData = { ...data };
    if (!newData.aiRentalFinder.searchCriteria.descriptionKeywords.includes(keyword.trim())) {
      newData.aiRentalFinder.searchCriteria.descriptionKeywords.push(keyword.trim());
      setData(newData);
      saveData(newData);
    }
    setNewDescriptionKeyword('');
  };

  const removeDescriptionKeyword = (keyword) => {
    const newData = { ...data };
    newData.aiRentalFinder.searchCriteria.descriptionKeywords =
      newData.aiRentalFinder.searchCriteria.descriptionKeywords.filter(k => k !== keyword);
    setData(newData);
    saveData(newData);
  };

  const updateSearchCriteria = (field, value) => {
    const newData = { ...data };
    newData.aiRentalFinder.searchCriteria[field] = value;
    setData(newData);
    saveData(newData);
  };

  const handleAISearch = async () => {
    setAiSearchLoading(true);
    setAiSearchError(null);

    try {
      const criteria = data.aiRentalFinder.searchCriteria;
      const learnedPreferences = data.aiRentalFinder.learnedPreferences;

      const urls = await generateSearchURLs(criteria, learnedPreferences);

      const newData = { ...data };
      newData.aiRentalFinder.generatedURLs = urls;
      newData.aiRentalFinder.lastSearch = new Date().toISOString();
      setData(newData);
      saveData(newData);

      addChangelogEntry(
        'ai_search',
        'Generated rental search URLs with AI',
        null,
        `Searched for ${criteria.bedrooms.min}-${criteria.bedrooms.max} bed, max $${criteria.priceRange.max}`
      );
    } catch (error) {
      setAiSearchError(error.message || 'Failed to generate search URLs. Please try again.');
    } finally {
      setAiSearchLoading(false);
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

  // Memoized calculation functions for performance
  const overallProgress = useMemo(() => {
    if (!data.steps) return 0;
    let total = 0;
    let done = 0;
    Object.values(data.steps).forEach(step => {
      total += step.items.length;
      done += step.items.filter(i => i.done).length;
    });
    return total ? Math.round((done / total) * 100) : 0;
  }, [data.steps]);

  const totalTasks = useMemo(() => {
    if (!data.steps) return 0;
    return Object.values(data.steps).reduce((sum, step) => sum + step.items.length, 0);
  }, [data.steps]);

  const completedTasks = useMemo(() => {
    if (!data.steps) return 0;
    return Object.values(data.steps).reduce((sum, step) => sum + step.items.filter(i => i.done).length, 0);
  }, [data.steps]);

  const budgetTotals = useMemo(() => {
    if (!data.budget) return { must: 0, high: 0, nice: 0, other: 0 };
    return {
      must: (data.budget.must || []).reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0),
      high: (data.budget.high || []).reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0),
      nice: (data.budget.nice || []).reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0),
      other: (data.budget.other || []).reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0)
    };
  }, [data.budget]);

  const grandTotal = useMemo(() => {
    return budgetTotals.must + budgetTotals.high + budgetTotals.nice + budgetTotals.other;
  }, [budgetTotals]);

  // Financial calculator functions
  const realtorFees = useMemo(() => {
    const salePrice = parseFloat(data.financial?.salePrice) || 0;
    const percentage = parseFloat(data.financial?.realtorFeePercentage) || 5;
    return salePrice * (percentage / 100);
  }, [data.financial?.salePrice, data.financial?.realtorFeePercentage]);

  const totalDebts = useMemo(() => {
    return (data.financial?.fixedDebts || []).reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);
  }, [data.financial?.fixedDebts]);

  const debtsWithoutMortgage = useMemo(() => {
    return (data.financial?.fixedDebts || [])
      .filter(item => !item.item.toLowerCase().includes('mortgage'))
      .reduce((sum, item) => {
        return sum + (parseFloat(item.amount) || 0);
      }, 0);
  }, [data.financial?.fixedDebts]);

  const totalExpenses = useMemo(() => {
    const expenses = (data.financial?.expenses || []).reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);
    const moving = budgetTotals.other;
    return expenses + moving;
  }, [data.financial?.expenses, budgetTotals]);

  const totalFunding = useMemo(() => {
    return 0; // Funding section removed - 401k moved to debts
  }, []);

  const customItemsTotal = useMemo(() => {
    return (data.financial?.customItems || []).reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      return item.type === 'income' ? sum + amount : sum - amount;
    }, 0);
  }, [data.financial?.customItems]);

  const netProceeds = useMemo(() => {
    const salePrice = parseFloat(data.financial?.salePrice) || 0;
    return salePrice + totalFunding - realtorFees - totalDebts - totalExpenses + customItemsTotal;
  }, [data.financial?.salePrice, totalFunding, realtorFees, totalDebts, totalExpenses, customItemsTotal]);

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
          background: `linear-gradient(135deg, ${colors.pacificBlue} 0%, ${colors.teal} 100%)`,
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
              <HomeIcon sx={{ fontSize: '2.4rem', color: colors.aquamarine, filter: 'drop-shadow(0 2px 4px rgba(127, 255, 212, 0.3))' }} />
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
            {activeTab === 'checklist' && data.steps && data.steps[activeStep] && (
              <Chip
                label={`📍 Step ${activeStep}: ${data.steps[activeStep].title}`}
                size="small"
                sx={{
                  mt: 1,
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              />
            )}
          </Box>
          <Stack direction="row" spacing={2}>
            <Box>
              {saving ? (
                <Chip label="💾 Saving..." color="default" sx={{ background: `linear-gradient(135deg, ${colors.turquoise}, #00d4ff)`, color: 'white', fontWeight: 600, animation: 'pulseGlow 1s ease-in-out infinite', boxShadow: '0 0 10px rgba(26, 188, 156, 0.5)' }} />
              ) : lastSaved ? (
                <Chip label={`✓ Saved ${lastSaved.toLocaleTimeString()}`} color="default" sx={{ background: `linear-gradient(135deg, ${colors.seaweed}, #00a86b)`, color: 'white', fontWeight: 600, boxShadow: '0 0 10px rgba(46, 204, 113, 0.4)' }} />
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
              background: `linear-gradient(135deg, ${colors.pacificBlue} 0%, ${colors.teal} 100%)`,
              height: 4,
              borderRadius: '4px 4px 0 0'
            }
          }}
        >
          <Tab value="checklist" label="Checklist" icon={<span>✓</span>} iconPosition="start" />
          <Tab value="budget" label="Financials" icon={<span>💰</span>} iconPosition="start" />
          <Tab value="timeline" label="Timeline" icon={<span>📅</span>} iconPosition="start" />
          <Tab value="seattle" label="Seattle Research" icon={<span>🌆</span>} iconPosition="start" />
          <Tab value="notes" label="Notes" icon={<span>📝</span>} iconPosition="start" />
          <Tab value="history" label="History" icon={<span>📜</span>} iconPosition="start" />
          <Tab value="test" label="🧪 API Test" icon={<span>🔧</span>} iconPosition="start" />
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
              {Object.entries(data.steps || {}).map(([stepId, step]) => {
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
            {data.steps && data.steps[activeStep] && (
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
                      const categoryTotal = budgetTotals[key];
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
                                draggable={budgetItems.editingId !== item.id}
                                onDragStart={(e) => handleBudgetDragStart(e, item.id)}
                                onDragOver={(e) => handleBudgetDragOver(e, item.id)}
                                onDragLeave={handleBudgetDragLeave}
                                onDrop={(e) => handleBudgetDrop(e, key, item.id)}
                                onDragEnd={handleBudgetDragEnd}
                                style={{
                                  ...styles.repairItem,
                                  ...(item.done ? styles.repairItemDone : {}),
                                  ...(budgetItems.draggedId === item.id ? styles.repairItemDragging : {}),
                                  ...(budgetItems.dragOverId === item.id && budgetItems.draggedId !== item.id ? styles.repairItemDropTarget : {})
                                }}
                              >
                                <span style={styles.dragHandle} title="Drag to reorder">⋮⋮</span>

                                <span
                                  style={item.done ? styles.checkboxDone : styles.checkbox}
                                  onClick={() => toggleBudgetItem(key, item.id)}
                                >
                                  {item.done ? '✓' : ''}
                                </span>

                                {budgetItems.editingId === item.id ? (
                                  <div style={styles.itemEditForm}>
                                    <input
                                      type="text"
                                      value={budgetItems.editText}
                                      onChange={(e) => budgetItems.setEditText(e.target.value)}
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

                                {budgetItems.editingId !== item.id && (
                                  <div style={styles.itemActions}>
                                    {budgetItems.confirmDeleteId === item.id ? (
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
                                          onClick={(e) => { e.stopPropagation(); budgetItems.setConfirmDeleteId(null); }}
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
                                          onClick={(e) => { e.stopPropagation(); budgetItems.setEditingId(item.id); budgetItems.setEditText(item.item); }}
                                          title="Edit"
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          style={styles.itemActionBtn}
                                          onClick={(e) => { e.stopPropagation(); budgetItems.setConfirmDeleteId(item.id); }}
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

                          {budgetItems.newItemParent === key ? (
                            <div style={styles.addRepairItemForm}>
                              <input
                                type="text"
                                value={budgetItems.newItemText}
                                onChange={(e) => budgetItems.setNewItemText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addNewBudgetItem(key)}
                                placeholder="Enter new repair item..."
                                style={styles.addItemInput}
                                autoFocus
                              />
                              <button
                                style={styles.addItemSaveBtn}
                                onClick={() => addNewBudgetItem(key)}
                                disabled={!budgetItems.newItemText.trim()}
                              >
                                Add
                              </button>
                              <button
                                style={styles.addItemCancelBtn}
                                onClick={() => { budgetItems.setNewItemParent(null); budgetItems.setNewItemText(''); }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              style={styles.addRepairItemBtn}
                              onClick={() => budgetItems.setNewItemParent(key)}
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
                      draggable={checklistItems.editingId !== item.id}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragOver={(e) => handleDragOver(e, item.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, activeStep, item.id)}
                      onDragEnd={handleDragEnd}
                      style={{
                        ...styles.checklistItem,
                        ...(item.done ? styles.checklistItemDone : {}),
                        ...(checklistItems.draggedId === item.id ? styles.checklistItemDragging : {}),
                        ...(checklistItems.dragOverId === item.id && checklistItems.draggedId !== item.id ? styles.checklistItemDropTarget : {})
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
                      {checklistItems.editingId === item.id ? (
                        <div style={styles.itemEditForm}>
                          <input
                            type="text"
                            value={checklistItems.editText}
                            onChange={(e) => checklistItems.setEditText(e.target.value)}
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
                      {checklistItems.editingId !== item.id && (
                        <div style={styles.itemActions}>
                          {checklistItems.confirmDeleteId === item.id ? (
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
                                onClick={(e) => { e.stopPropagation(); checklistItems.setConfirmDeleteId(null); }}
                              >
                                No
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                style={styles.itemActionBtn}
                                onClick={(e) => { e.stopPropagation(); checklistItems.setEditingId(item.id); checklistItems.setEditText(item.text); }}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                style={styles.itemActionBtn}
                                onClick={(e) => { e.stopPropagation(); checklistItems.setConfirmDeleteId(item.id); }}
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
                {checklistItems.newItemParent === activeStep ? (
                  <div style={styles.addItemForm}>
                    <input
                      type="text"
                      value={checklistItems.newItemText}
                      onChange={(e) => checklistItems.setNewItemText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNewItem(activeStep)}
                      placeholder="Enter new task..."
                      style={styles.addItemInput}
                      autoFocus
                    />
                    <button
                      style={styles.addItemSaveBtn}
                      onClick={() => addNewItem(activeStep)}
                      disabled={!checklistItems.newItemText.trim()}
                    >
                      Add
                    </button>
                    <button
                      style={styles.addItemCancelBtn}
                      onClick={() => { checklistItems.setNewItemParent(null); checklistItems.setNewItemText(''); }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    style={styles.addItemBtn}
                    onClick={() => checklistItems.setNewItemParent(activeStep)}
                  >
                    + Add task
                  </button>
                )}
                  </>
                )}

                {/* Realtor Candidates Section - Only for Step 1 */}
                {activeStep === '1' && (
                  <div style={styles.realtorsSection}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <h3 style={styles.realtorsSectionTitle}>🏠 Realtor Candidates</h3>
                      <a
                        href="/compare-realtors.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'transform 0.2s',
                          boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        Compare Realtors
                      </a>
                    </div>

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
                          {realtors.editingId === realtor.id ? (
                            // Edit Mode
                            <div style={{...styles.realtorEditForm, maxHeight: '600px', overflowY: 'auto'}}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Name:</label>
                                  <input type="text" value={realtors.editingData.name || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, name: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Rank:</label>
                                  <input type="number" value={realtors.editingData.rank || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, rank: parseInt(e.target.value) || ''})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Specialty:</label>
                                  <input type="text" value={realtors.editingData.specialty || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, specialty: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Team:</label>
                                  <input type="text" value={realtors.editingData.team || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, team: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Brokerage:</label>
                                  <input type="text" value={realtors.editingData.brokerage || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, brokerage: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Phone:</label>
                                  <input type="text" value={realtors.editingData.phone || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, phone: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Email:</label>
                                  <input type="text" value={realtors.editingData.email || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, email: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Website:</label>
                                  <input type="text" value={realtors.editingData.website || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, website: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Neighborhoods:</label>
                                  <input type="text" value={realtors.editingData.neighborhoods || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, neighborhoods: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Price Range:</label>
                                  <input type="text" value={realtors.editingData.priceRange || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, priceRange: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Homes Sold (12mo):</label>
                                  <input type="text" value={realtors.editingData.homesSold || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, homesSold: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Avg Days on Market:</label>
                                  <input type="text" value={realtors.editingData.avgDaysOnMarket || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, avgDaysOnMarket: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Sale-to-List Ratio:</label>
                                  <input type="text" value={realtors.editingData.saleToListRatio || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, saleToListRatio: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Over-Asking Frequency:</label>
                                  <input type="text" value={realtors.editingData.overAskingFrequency || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, overAskingFrequency: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Pricing Strategy:</label>
                                  <input type="text" value={realtors.editingData.pricingStrategy || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, pricingStrategy: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Remote Experience:</label>
                                  <input type="text" value={realtors.editingData.remoteExperience || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, remoteExperience: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Marketing:</label>
                                  <input type="text" value={realtors.editingData.marketing || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, marketing: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                                <div style={styles.realtorFormRow}>
                                  <label style={styles.realtorFormLabel}>Negotiation:</label>
                                  <input type="text" value={realtors.editingData.negotiation || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, negotiation: e.target.value})} style={styles.realtorFormInput} />
                                </div>
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Concierge Services:</label>
                                <textarea value={realtors.editingData.concierge || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, concierge: e.target.value})} style={styles.realtorFormTextarea} rows={3} />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Concerns:</label>
                                <textarea value={realtors.editingData.concerns || ''} onChange={(e) => realtors.setEditingData({...realtors.editingData, concerns: e.target.value})} style={styles.realtorFormTextarea} rows={2} />
                              </div>
                              <div style={styles.realtorFormActions}>
                                <button style={styles.realtorSaveBtn} onClick={() => updateRealtor(realtor.id)}>Save</button>
                                <button style={styles.realtorCancelBtn} onClick={() => { setEditingRealtorId(null); realtors.setEditingData({}); }}>Cancel</button>
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
                                {/* Specialty & Rank */}
                                {realtor.specialty && (
                                  <div style={{
                                    padding: '8px 12px',
                                    background: 'linear-gradient(135deg, rgba(30, 90, 142, 0.1), rgba(43, 146, 152, 0.1))',
                                    borderLeft: `3px solid ${colors.teal}`,
                                    marginBottom: '12px',
                                    borderRadius: '4px'
                                  }}>
                                    <strong style={{ color: colors.pacificBlue, fontSize: '0.9rem' }}>
                                      #{realtor.rank} • {realtor.specialty}
                                    </strong>
                                  </div>
                                )}

                                {/* Contact Info */}
                                <div style={{ marginBottom: '12px' }}>
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
                                </div>

                                {/* Performance Metrics */}
                                {(realtor.homesSold || realtor.avgDaysOnMarket || realtor.saleToListRatio) && (
                                  <div style={{
                                    background: 'rgba(248, 250, 251, 0.6)',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    marginBottom: '12px',
                                    fontSize: '0.85rem'
                                  }}>
                                    <div style={{ fontWeight: 600, color: colors.teal, marginBottom: '6px' }}>📊 Performance Metrics</div>
                                    {realtor.homesSold && <p style={{ margin: '4px 0', color: '#555' }}>• Homes Sold: <strong>{realtor.homesSold}</strong></p>}
                                    {realtor.avgDaysOnMarket && <p style={{ margin: '4px 0', color: '#555' }}>• Avg Days on Market: <strong>{realtor.avgDaysOnMarket}</strong></p>}
                                    {realtor.saleToListRatio && <p style={{ margin: '4px 0', color: '#555' }}>• Sale-to-List Ratio: <strong>{realtor.saleToListRatio}</strong></p>}
                                    {realtor.overAskingFrequency && <p style={{ margin: '4px 0', color: '#555' }}>• Over-Asking Frequency: <strong>{realtor.overAskingFrequency}</strong></p>}
                                  </div>
                                )}

                                {/* Market Focus */}
                                {(realtor.neighborhoods || realtor.priceRange) && (
                                  <div style={{
                                    background: 'rgba(212, 230, 245, 0.3)',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    marginBottom: '12px',
                                    fontSize: '0.85rem'
                                  }}>
                                    <div style={{ fontWeight: 600, color: colors.pacificBlue, marginBottom: '6px' }}>📍 Market Focus</div>
                                    {realtor.neighborhoods && <p style={{ margin: '4px 0', color: '#555' }}>• Neighborhoods: <strong>{realtor.neighborhoods}</strong></p>}
                                    {realtor.priceRange && <p style={{ margin: '4px 0', color: '#555' }}>• Price Range: <strong>{realtor.priceRange}</strong></p>}
                                  </div>
                                )}

                                {/* Strategy & Approach */}
                                {(realtor.pricingStrategy || realtor.marketing || realtor.negotiation) && (
                                  <div style={{
                                    background: 'rgba(138, 154, 123, 0.15)',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    marginBottom: '12px',
                                    fontSize: '0.85rem'
                                  }}>
                                    <div style={{ fontWeight: 600, color: '#8a9a7b', marginBottom: '6px' }}>🎯 Strategy & Approach</div>
                                    {realtor.pricingStrategy && <p style={{ margin: '4px 0', color: '#555' }}>• Pricing: <strong>{realtor.pricingStrategy}</strong></p>}
                                    {realtor.marketing && <p style={{ margin: '4px 0', color: '#555' }}>• Marketing: <strong>{realtor.marketing}</strong></p>}
                                    {realtor.negotiation && <p style={{ margin: '4px 0', color: '#555' }}>• Negotiation: <strong>{realtor.negotiation}</strong></p>}
                                    {realtor.remoteExperience && <p style={{ margin: '4px 0', color: '#555' }}>• Remote Experience: <strong>{realtor.remoteExperience}</strong></p>}
                                  </div>
                                )}

                                {/* Concierge Services */}
                                {realtor.concierge && (
                                  <div style={{
                                    background: 'rgba(212, 160, 60, 0.1)',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    marginBottom: '12px',
                                    fontSize: '0.85rem'
                                  }}>
                                    <div style={{ fontWeight: 600, color: '#d4a03c', marginBottom: '6px' }}>✨ Concierge Services</div>
                                    <p style={{ margin: '4px 0', color: '#555' }}>{realtor.concierge}</p>
                                  </div>
                                )}

                                {/* Concerns */}
                                {realtor.concerns && (
                                  <div style={{
                                    background: 'rgba(255, 182, 193, 0.15)',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    borderLeft: '3px solid #ff8c9d'
                                  }}>
                                    <div style={{ fontWeight: 600, color: '#c4775c', marginBottom: '4px' }}>⚠️ Considerations</div>
                                    <p style={{ margin: '4px 0', color: '#666', fontStyle: 'italic' }}>{realtor.concerns}</p>
                                  </div>
                                )}
                              </div>

                              <div style={styles.realtorCardActions}>
                                {realtors.confirmDeleteId === realtor.id ? (
                                  <>
                                    <span style={styles.confirmDeleteText}>Delete?</span>
                                    <button style={styles.confirmYesBtn} onClick={() => deleteRealtor(realtor.id)}>Yes</button>
                                    <button style={styles.confirmNoBtn} onClick={() => realtors.setConfirmDeleteId(null)}>No</button>
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
                                      onClick={() => { setEditingRealtorId(realtor.id); realtors.setEditingData({...realtor}); }}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      style={styles.realtorDeleteBtn}
                                      onClick={() => realtors.setConfirmDeleteId(realtor.id)}
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
                    {realtors.adding ? (
                      <div style={styles.addRealtorForm}>
                        <h4 style={styles.addRealtorTitle}>Add New Realtor Candidate</h4>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Name:</label>
                          <input
                            type="text"
                            value={realtors.newData.name}
                            onChange={(e) => realtors.setNewData({...realtors.newData, name: e.target.value})}
                            style={styles.realtorFormInput}
                            autoFocus
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Team:</label>
                          <input
                            type="text"
                            value={realtors.newData.team}
                            onChange={(e) => realtors.setNewData({...realtors.newData, team: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Brokerage:</label>
                          <input
                            type="text"
                            value={realtors.newData.brokerage}
                            onChange={(e) => realtors.setNewData({...realtors.newData, brokerage: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Phone:</label>
                          <input
                            type="text"
                            value={realtors.newData.phone}
                            onChange={(e) => realtors.setNewData({...realtors.newData, phone: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Email:</label>
                          <input
                            type="text"
                            value={realtors.newData.email}
                            onChange={(e) => realtors.setNewData({...realtors.newData, email: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Website:</label>
                          <input
                            type="text"
                            value={realtors.newData.website}
                            onChange={(e) => realtors.setNewData({...realtors.newData, website: e.target.value})}
                            style={styles.realtorFormInput}
                            placeholder="https://..."
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Notes:</label>
                          <textarea
                            value={realtors.newData.notes}
                            onChange={(e) => realtors.setNewData({...realtors.newData, notes: e.target.value})}
                            style={styles.realtorFormTextarea}
                            rows={5}
                          />
                        </div>
                        <div style={styles.realtorFormActions}>
                          <button
                            style={styles.realtorSaveBtn}
                            onClick={addRealtor}
                            disabled={!realtors.newData.name.trim()}
                          >
                            Add Realtor
                          </button>
                          <button
                            style={styles.realtorCancelBtn}
                            onClick={() => { realtors.setAdding(false); realtors.setNewData({ name: '', team: '', brokerage: '', phone: '', email: '', website: '', notes: '' }); }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button style={styles.addRealtorBtn} onClick={() => realtors.setAdding(true)}>
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
                          {questions.editingId === q.id ? (
                            // Edit Mode
                            <div style={styles.questionEditForm}>
                              <label style={styles.questionLabel}>Question:</label>
                              <textarea
                                value={questions.editingData.question || ''}
                                onChange={(e) => questions.setEditingData({...questions.editingData, question: e.target.value})}
                                style={styles.questionTextarea}
                                rows={4}
                              />
                              <label style={styles.questionLabel}>Ideal Answer / What to look for:</label>
                              <textarea
                                value={questions.editingData.idealAnswer || ''}
                                onChange={(e) => questions.setEditingData({...questions.editingData, idealAnswer: e.target.value})}
                                style={styles.questionTextarea}
                                rows={4}
                              />
                              <label style={styles.questionLabel}>Notes / Their Answer:</label>
                              <textarea
                                value={questions.editingData.answer || ''}
                                onChange={(e) => questions.setEditingData({...questions.editingData, answer: e.target.value})}
                                style={styles.questionTextarea}
                                rows={4}
                              />
                              <div style={styles.questionEditActions}>
                                <button style={styles.questionSaveBtn} onClick={() => updateQuestion(q.id)}>Save</button>
                                <button style={styles.questionCancelBtn} onClick={() => { setEditingQuestionId(null); questions.setEditingData({}); }}>Cancel</button>
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
                                {questions.confirmDeleteId === q.id ? (
                                  <>
                                    <span style={styles.confirmDeleteText}>Delete?</span>
                                    <button style={styles.confirmYesBtn} onClick={() => deleteQuestion(q.id)}>Yes</button>
                                    <button style={styles.confirmNoBtn} onClick={() => questions.setConfirmDeleteId(null)}>No</button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      style={styles.questionEditBtn}
                                      onClick={() => { setEditingQuestionId(q.id); questions.setEditingData({...q}); }}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      style={styles.questionDeleteBtn}
                                      onClick={() => questions.setConfirmDeleteId(q.id)}
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
                    {questions.adding ? (
                      <div style={styles.addQuestionForm}>
                        <h4 style={styles.addQuestionTitle}>Add New Question</h4>
                        <label style={styles.questionLabel}>Question:</label>
                        <textarea
                          value={questions.newData.question}
                          onChange={(e) => questions.setNewData({...questions.newData, question: e.target.value})}
                          placeholder="What do you want to ask?"
                          style={styles.questionTextarea}
                          rows={4}
                          autoFocus
                        />
                        <label style={styles.questionLabel}>Ideal Answer / What to look for:</label>
                        <textarea
                          value={questions.newData.idealAnswer}
                          onChange={(e) => questions.setNewData({...questions.newData, idealAnswer: e.target.value})}
                          placeholder="What should a good answer include?"
                          style={styles.questionTextarea}
                          rows={4}
                        />
                        <div style={styles.questionEditActions}>
                          <button
                            style={styles.questionSaveBtn}
                            onClick={addQuestion}
                            disabled={!questions.newData.question.trim()}
                          >
                            Add Question
                          </button>
                          <button
                            style={styles.questionCancelBtn}
                            onClick={() => { questions.setAdding(false); questions.setNewData({ question: '', idealAnswer: '', answer: '' }); }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button style={styles.addQuestionBtn} onClick={() => questions.setAdding(true)}>
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
                          {neighborhoods.editingId === neighborhood.id ? (
                            // Edit Mode
                            <div style={styles.realtorEditForm}>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Neighborhood Name:</label>
                                <input
                                  type="text"
                                  value={neighborhoods.editingData.name || ''}
                                  onChange={(e) => neighborhoods.setEditingData({...neighborhoods.editingData, name: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Price Range:</label>
                                <input
                                  type="text"
                                  value={neighborhoods.editingData.priceRange || ''}
                                  onChange={(e) => neighborhoods.setEditingData({...neighborhoods.editingData, priceRange: e.target.value})}
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
                                  value={neighborhoods.editingData.rating || 0}
                                  onChange={(e) => neighborhoods.setEditingData({...neighborhoods.editingData, rating: parseInt(e.target.value) || 0})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Pros:</label>
                                <textarea
                                  value={neighborhoods.editingData.pros || ''}
                                  onChange={(e) => neighborhoods.setEditingData({...neighborhoods.editingData, pros: e.target.value})}
                                  style={styles.realtorFormTextarea}
                                  rows={5}
                                  placeholder="What you like about this area"
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Cons:</label>
                                <textarea
                                  value={neighborhoods.editingData.cons || ''}
                                  onChange={(e) => neighborhoods.setEditingData({...neighborhoods.editingData, cons: e.target.value})}
                                  style={styles.realtorFormTextarea}
                                  rows={5}
                                  placeholder="Concerns or drawbacks"
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Notes:</label>
                                <textarea
                                  value={neighborhoods.editingData.notes || ''}
                                  onChange={(e) => neighborhoods.setEditingData({...neighborhoods.editingData, notes: e.target.value})}
                                  style={styles.realtorFormTextarea}
                                  rows={5}
                                />
                              </div>
                              <div style={styles.realtorFormActions}>
                                <button style={styles.realtorSaveBtn} onClick={() => updateNeighborhood(neighborhood.id)}>Save</button>
                                <button style={styles.realtorCancelBtn} onClick={() => { neighborhoods.setEditingId(null); neighborhoods.setEditingData({}); }}>Cancel</button>
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
                                {neighborhoods.confirmDeleteId === neighborhood.id ? (
                                  <>
                                    <span style={styles.confirmDeleteText}>Delete?</span>
                                    <button style={styles.confirmYesBtn} onClick={() => deleteNeighborhood(neighborhood.id)}>Yes</button>
                                    <button style={styles.confirmNoBtn} onClick={() => neighborhoods.setConfirmDeleteId(null)}>No</button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      style={styles.realtorEditBtn}
                                      onClick={() => { neighborhoods.setEditingId(neighborhood.id); neighborhoods.setEditingData({...neighborhood}); }}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      style={styles.realtorDeleteBtn}
                                      onClick={() => neighborhoods.setConfirmDeleteId(neighborhood.id)}
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
                    {neighborhoods.adding ? (
                      <div style={styles.addRealtorForm}>
                        <h4 style={styles.addRealtorTitle}>Add New Neighborhood</h4>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Neighborhood Name:</label>
                          <input
                            type="text"
                            value={neighborhoods.newData.name}
                            onChange={(e) => neighborhoods.setNewData({...neighborhoods.newData, name: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Price Range:</label>
                          <input
                            type="text"
                            value={neighborhoods.newData.priceRange}
                            onChange={(e) => neighborhoods.setNewData({...neighborhoods.newData, priceRange: e.target.value})}
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
                            value={neighborhoods.newData.rating}
                            onChange={(e) => neighborhoods.setNewData({...neighborhoods.newData, rating: parseInt(e.target.value) || 0})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Pros:</label>
                          <textarea
                            value={neighborhoods.newData.pros}
                            onChange={(e) => neighborhoods.setNewData({...neighborhoods.newData, pros: e.target.value})}
                            style={styles.realtorFormTextarea}
                            rows={5}
                            placeholder="What you like about this area"
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Cons:</label>
                          <textarea
                            value={neighborhoods.newData.cons}
                            onChange={(e) => neighborhoods.setNewData({...neighborhoods.newData, cons: e.target.value})}
                            style={styles.realtorFormTextarea}
                            rows={5}
                            placeholder="Concerns or drawbacks"
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Notes:</label>
                          <textarea
                            value={neighborhoods.newData.notes}
                            onChange={(e) => neighborhoods.setNewData({...neighborhoods.newData, notes: e.target.value})}
                            style={styles.realtorFormTextarea}
                            rows={5}
                          />
                        </div>
                        <div style={styles.addRealtorActions}>
                          <button style={styles.addRealtorSaveBtn} onClick={addNeighborhood}>
                            Add Neighborhood
                          </button>
                          <button style={styles.addRealtorCancelBtn} onClick={() => { neighborhoods.setAdding(false); neighborhoods.setNewData({ name: '', pros: '', cons: '', priceRange: '', notes: '', rating: 0 }); }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button style={styles.addRealtorBtn} onClick={() => neighborhoods.setAdding(true)}>
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
                          {properties.editingId === property.id ? (
                            // Edit Mode
                            <div style={styles.realtorEditForm}>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Address:</label>
                                <input
                                  type="text"
                                  value={properties.editingData.address || ''}
                                  onChange={(e) => properties.setEditingData({...properties.editingData, address: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Neighborhood:</label>
                                <input
                                  type="text"
                                  value={properties.editingData.neighborhood || ''}
                                  onChange={(e) => properties.setEditingData({...properties.editingData, neighborhood: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Price:</label>
                                <input
                                  type="text"
                                  value={properties.editingData.price || ''}
                                  onChange={(e) => properties.setEditingData({...properties.editingData, price: e.target.value})}
                                  style={styles.realtorFormInput}
                                  placeholder="e.g. $2500/mo"
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Bedrooms:</label>
                                <input
                                  type="text"
                                  value={properties.editingData.bedrooms || ''}
                                  onChange={(e) => properties.setEditingData({...properties.editingData, bedrooms: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Bathrooms:</label>
                                <input
                                  type="text"
                                  value={properties.editingData.bathrooms || ''}
                                  onChange={(e) => properties.setEditingData({...properties.editingData, bathrooms: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Square Feet:</label>
                                <input
                                  type="text"
                                  value={properties.editingData.sqft || ''}
                                  onChange={(e) => properties.setEditingData({...properties.editingData, sqft: e.target.value})}
                                  style={styles.realtorFormInput}
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>
                                  <input
                                    type="checkbox"
                                    checked={properties.editingData.petFriendly || false}
                                    onChange={(e) => properties.setEditingData({...properties.editingData, petFriendly: e.target.checked})}
                                    style={{marginRight: '8px'}}
                                  />
                                  Pet Friendly
                                </label>
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Listing URL:</label>
                                <input
                                  type="text"
                                  value={properties.editingData.url || ''}
                                  onChange={(e) => properties.setEditingData({...properties.editingData, url: e.target.value})}
                                  style={styles.realtorFormInput}
                                  placeholder="https://..."
                                />
                              </div>
                              <div style={styles.realtorFormRow}>
                                <label style={styles.realtorFormLabel}>Notes:</label>
                                <textarea
                                  value={properties.editingData.notes || ''}
                                  onChange={(e) => properties.setEditingData({...properties.editingData, notes: e.target.value})}
                                  style={styles.realtorFormTextarea}
                                  rows={5}
                                />
                              </div>
                              <div style={styles.realtorFormActions}>
                                <button style={styles.realtorSaveBtn} onClick={() => updateProperty(property.id)}>Save</button>
                                <button style={styles.realtorCancelBtn} onClick={() => { properties.setEditingId(null); properties.setEditingData({}); }}>Cancel</button>
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
                                {properties.confirmDeleteId === property.id ? (
                                  <>
                                    <span style={styles.confirmDeleteText}>Delete?</span>
                                    <button style={styles.confirmYesBtn} onClick={() => deleteProperty(property.id)}>Yes</button>
                                    <button style={styles.confirmNoBtn} onClick={() => properties.setConfirmDeleteId(null)}>No</button>
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
                                      onClick={() => { properties.setEditingId(property.id); properties.setEditingData({...property}); }}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      style={styles.realtorDeleteBtn}
                                      onClick={() => properties.setConfirmDeleteId(property.id)}
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
                    {properties.adding ? (
                      <div style={styles.addRealtorForm}>
                        <h4 style={styles.addRealtorTitle}>Add New Rental Property</h4>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Address:</label>
                          <input
                            type="text"
                            value={properties.newData.address}
                            onChange={(e) => properties.setNewData({...properties.newData, address: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Neighborhood:</label>
                          <input
                            type="text"
                            value={properties.newData.neighborhood}
                            onChange={(e) => properties.setNewData({...properties.newData, neighborhood: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Price:</label>
                          <input
                            type="text"
                            value={properties.newData.price}
                            onChange={(e) => properties.setNewData({...properties.newData, price: e.target.value})}
                            style={styles.realtorFormInput}
                            placeholder="e.g. $2500/mo"
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Bedrooms:</label>
                          <input
                            type="text"
                            value={properties.newData.bedrooms}
                            onChange={(e) => properties.setNewData({...properties.newData, bedrooms: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Bathrooms:</label>
                          <input
                            type="text"
                            value={properties.newData.bathrooms}
                            onChange={(e) => properties.setNewData({...properties.newData, bathrooms: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Square Feet:</label>
                          <input
                            type="text"
                            value={properties.newData.sqft}
                            onChange={(e) => properties.setNewData({...properties.newData, sqft: e.target.value})}
                            style={styles.realtorFormInput}
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>
                            <input
                              type="checkbox"
                              checked={properties.newData.petFriendly}
                              onChange={(e) => properties.setNewData({...properties.newData, petFriendly: e.target.checked})}
                              style={{marginRight: '8px'}}
                            />
                            Pet Friendly
                          </label>
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Listing URL:</label>
                          <input
                            type="text"
                            value={properties.newData.url}
                            onChange={(e) => properties.setNewData({...properties.newData, url: e.target.value})}
                            style={styles.realtorFormInput}
                            placeholder="https://..."
                          />
                        </div>
                        <div style={styles.realtorFormRow}>
                          <label style={styles.realtorFormLabel}>Notes:</label>
                          <textarea
                            value={properties.newData.notes}
                            onChange={(e) => properties.setNewData({...properties.newData, notes: e.target.value})}
                            style={styles.realtorFormTextarea}
                            rows={5}
                          />
                        </div>
                        <div style={styles.addRealtorActions}>
                          <button style={styles.addRealtorSaveBtn} onClick={addProperty}>
                            Add Property
                          </button>
                          <button style={styles.addRealtorCancelBtn} onClick={() => { properties.setAdding(false); properties.setNewData({ address: '', neighborhood: '', price: '', bedrooms: '', bathrooms: '', sqft: '', petFriendly: false, url: '', notes: '', interested: false }); }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button style={styles.addRealtorBtn} onClick={() => properties.setAdding(true)}>
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

        {/* Sale Proceeds Calculator Tab */}
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

            {/* Key Numbers Summary - Sale Price & Profit Side by Side */}
            <div style={styles.budgetSummary}>
              <h3 style={styles.budgetSummaryTitle}>💰 Financials</h3>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'stretch'}}>
                {/* Sale Price */}
                <div style={{flex: '1 1 300px', minWidth: '300px', background: `linear-gradient(135deg, ${colors.seaweed} 0%, ${colors.emerald} 100%)`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column'}}>
                  <label style={{fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '12px', letterSpacing: '0.5px', opacity: 0.95}}>
                    🏠 Sale Price
                  </label>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{fontSize: '2.2rem', fontWeight: 800, color: 'white'}}>$</span>
                    <input
                      type="text"
                      value={data.financial?.salePrice ? parseFloat(data.financial.salePrice).toLocaleString() : ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, '');
                        if (value === '' || !isNaN(value)) {
                          const newData = {...data, financial: {...data.financial, salePrice: value}};
                          setData(newData);
                          saveData(newData);
                        }
                      }}
                      placeholder="0"
                      style={{
                        background: 'rgba(255,255,255,0.25)',
                        border: '2px solid rgba(255,255,255,0.4)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '2.2rem',
                        fontWeight: 800,
                        padding: '12px 16px',
                        width: '100%',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Net Profit */}
                <div style={{flex: '1 1 300px', minWidth: '300px', background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <span style={{fontSize: '1.2rem', fontWeight: 700, color: 'white', letterSpacing: '0.5px', opacity: 0.95}}>
                    ✨ Cash After Sale
                  </span>
                  <span style={{fontSize: '2.8rem', fontWeight: 800, color: 'white', letterSpacing: '1px', textAlign: 'right'}}>
                    ${netProceeds.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                  </span>
                </div>
              </div>
            </div>

            {/* Home Sale Details */}
            <div className="budget-section" style={{...styles.budgetSection, borderColor: colors.seaweed}}>
              <div style={{...styles.budgetTitle, background: colors.seaweed}}>
                <h3 style={styles.budgetTitleText}>🏠 Home Sale Details</h3>
              </div>
              <div style={{padding: '24px'}}>
                <div style={{
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  borderRadius: '8px',
                  borderLeft: '4px solid #e74c3c'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <span style={{fontSize: '1rem', fontWeight: 600, color: colors.charcoal}}>Realtor Fees:</span>
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      {editingFinancialItemId === 'realtorFeePercentage' ? (
                        <input
                          type="number"
                          value={editFinancialItemText}
                          onChange={(e) => setEditFinancialItemText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const newData = {...data, financial: {...data.financial, realtorFeePercentage: parseFloat(editFinancialItemText) || 5}};
                              setData(newData);
                              saveData(newData);
                              setEditingFinancialItemId(null);
                            }
                          }}
                          onBlur={() => {
                            const newData = {...data, financial: {...data.financial, realtorFeePercentage: parseFloat(editFinancialItemText) || 5}};
                            setData(newData);
                            saveData(newData);
                            setEditingFinancialItemId(null);
                          }}
                          style={{
                            width: '50px',
                            padding: '4px 8px',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            border: '2px solid #3498db',
                            borderRadius: '4px',
                            textAlign: 'center'
                          }}
                          autoFocus
                        />
                      ) : (
                        <span
                          style={{
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#3498db',
                            textDecoration: 'underline',
                            userSelect: 'none'
                          }}
                          onClick={() => {
                            setEditingFinancialItemId('realtorFeePercentage');
                            setEditFinancialItemText(String(data.financial?.realtorFeePercentage || 5));
                          }}
                        >
                          {data.financial?.realtorFeePercentage || 5}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{fontSize: '1.3rem', fontWeight: 700, color: '#e74c3c', textAlign: 'right'}}>
                    -${realtorFees.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                  </div>
                </div>
              </div>
            </div>

            {/* Debts to Pay Off */}
            <div className="budget-section" style={{...styles.budgetSection, borderColor: '#e74c3c'}}>
              <div style={{...styles.budgetTitle, background: '#e74c3c'}}>
                <div>
                  <h3 style={styles.budgetTitleText}>💳 Debts to Pay Off</h3>
                  <p style={styles.budgetTitleDesc}>Outstanding loans and credit</p>
                </div>
                <span style={styles.budgetTitleTotal}>-${totalDebts.toLocaleString()}</span>
              </div>
              <table style={styles.budgetTable}>
                <thead>
                  <tr>
                    <th style={styles.budgetTh}>Item</th>
                    <th style={{...styles.budgetTh, width: '200px', textAlign: 'right'}}>Amount</th>
                    <th style={{...styles.budgetTh, width: '80px', textAlign: 'center'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.financial?.fixedDebts || []).map(item => (
                    <tr key={item.id}>
                      <td style={styles.budgetTd}>
                        {editingFinancialItemId === item.id ? (
                          <input
                            type="text"
                            value={editFinancialItemText}
                            onChange={(e) => setEditFinancialItemText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const newData = {...data};
                                const debtItem = newData.financial.fixedDebts.find(d => d.id === item.id);
                                if (debtItem) {
                                  debtItem.item = editFinancialItemText;
                                  setData(newData);
                                  saveData(newData);
                                }
                                setEditingFinancialItemId(null);
                              }
                            }}
                            onBlur={() => {
                              const newData = {...data};
                              const debtItem = newData.financial.fixedDebts.find(d => d.id === item.id);
                              if (debtItem) {
                                debtItem.item = editFinancialItemText;
                                setData(newData);
                                saveData(newData);
                              }
                              setEditingFinancialItemId(null);
                            }}
                            style={{...styles.budgetTableInput, fontSize: '1rem', fontWeight: 600}}
                            autoFocus
                          />
                        ) : (
                          <span
                            style={{cursor: 'pointer', fontSize: '1rem', fontWeight: 600, userSelect: 'none'}}
                            onClick={() => { setEditingFinancialItemId(item.id); setEditFinancialItemText(item.item); }}
                          >
                            {item.item}
                          </span>
                        )}
                      </td>
                      <td style={{...styles.budgetTd, textAlign: 'right'}}>
                        <div style={{...styles.costInputWrapper, minWidth: '180px'}}>
                          <span style={{...styles.dollarSign, fontSize: '1.2rem', fontWeight: 700}}>$</span>
                          <input
                            type="text"
                            value={item.amount ? parseFloat(item.amount).toLocaleString() : ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '');
                              if (value === '' || !isNaN(value)) {
                                const newData = {...data};
                                const debtItem = newData.financial.fixedDebts.find(d => d.id === item.id);
                                if (debtItem) {
                                  debtItem.amount = value;
                                  setData(newData);
                                  saveData(newData);
                                }
                              }
                            }}
                            placeholder="0"
                            style={{...styles.costField, fontSize: '1.1rem', fontWeight: 700, minWidth: '150px'}}
                          />
                        </div>
                      </td>
                      <td style={{...styles.budgetTd, textAlign: 'center'}}>
                        <button
                          style={styles.budgetTableBtn}
                          onClick={() => {
                            if (confirm(`Delete "${item.item}"?`)) {
                              const newData = {...data};
                              newData.financial.fixedDebts = newData.financial.fixedDebts.filter(d => d.id !== item.id);
                              setData(newData);
                              saveData(newData);
                            }
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(data.financial?.fixedDebts || []).length > 0 && (
                    <tr style={{borderTop: '2px solid #e74c3c'}}>
                      <td style={{...styles.budgetTd, paddingTop: '12px', paddingBottom: '12px'}}>
                        <span style={{fontSize: '1.05rem', fontWeight: 700, color: colors.charcoal}}>
                          Subtotal (excluding mortgage)
                        </span>
                      </td>
                      <td style={{...styles.budgetTd, textAlign: 'right', paddingTop: '12px', paddingBottom: '12px'}}>
                        <span style={{fontSize: '1.2rem', fontWeight: 700, color: '#e74c3c'}}>
                          ${debtsWithoutMortgage.toLocaleString()}
                        </span>
                      </td>
                      <td style={{...styles.budgetTd}}></td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button
                style={styles.addBudgetItemBtn}
                onClick={() => {
                  const itemName = prompt('Enter debt name:');
                  if (!itemName) return;
                  const newData = {...data};
                  if (!newData.financial.fixedDebts) newData.financial.fixedDebts = [];
                  newData.financial.fixedDebts.push({
                    id: 'fd_' + Date.now(),
                    item: itemName,
                    amount: '',
                    type: 'debt'
                  });
                  setData(newData);
                  saveData(newData);
                }}
              >
                + Add debt
              </button>
            </div>

            {/* Expenses */}
            <div className="budget-section" style={{...styles.budgetSection, borderColor: '#9b59b6'}}>
              <div style={{...styles.budgetTitle, background: '#9b59b6'}}>
                <div>
                  <h3 style={styles.budgetTitleText}>💸 Additional Expenses</h3>
                  <p style={styles.budgetTitleDesc}>Concierge, moving, housing, etc.</p>
                </div>
                <span style={styles.budgetTitleTotal}>-${totalExpenses.toLocaleString()}</span>
              </div>
              <table style={styles.budgetTable}>
                <thead>
                  <tr>
                    <th style={styles.budgetTh}>Item</th>
                    <th style={{...styles.budgetTh, width: '200px', textAlign: 'right'}}>Amount</th>
                    <th style={{...styles.budgetTh, width: '80px', textAlign: 'center'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.financial?.expenses || []).map(item => (
                    <tr key={item.id}>
                      <td style={styles.budgetTd}>
                        {editingFinancialItemId === item.id ? (
                          <input
                            type="text"
                            value={editFinancialItemText}
                            onChange={(e) => setEditFinancialItemText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const newData = {...data};
                                const expItem = newData.financial.expenses.find(d => d.id === item.id);
                                if (expItem) {
                                  expItem.item = editFinancialItemText;
                                  setData(newData);
                                  saveData(newData);
                                }
                                setEditingFinancialItemId(null);
                              }
                            }}
                            onBlur={() => {
                              const newData = {...data};
                              const expItem = newData.financial.expenses.find(d => d.id === item.id);
                              if (expItem) {
                                expItem.item = editFinancialItemText;
                                setData(newData);
                                saveData(newData);
                              }
                              setEditingFinancialItemId(null);
                            }}
                            style={{...styles.budgetTableInput, fontSize: '1rem', fontWeight: 600}}
                            autoFocus
                          />
                        ) : (
                          <span
                            style={{cursor: 'pointer', fontSize: '1rem', fontWeight: 600, userSelect: 'none'}}
                            onClick={() => {
                              setEditingFinancialItemId(item.id);
                              setEditFinancialItemText(item.item);
                            }}
                          >
                            {item.item}
                          </span>
                        )}
                      </td>
                      <td style={{...styles.budgetTd, textAlign: 'right'}}>
                        <div style={styles.costInputWrapper}>
                          <span style={{...styles.dollarSign, fontSize: '1.2rem', fontWeight: 700}}>$</span>
                          <input
                            type="text"
                            value={item.amount ? parseFloat(item.amount).toLocaleString() : ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '');
                              if (value === '' || !isNaN(value)) {
                                const newData = {...data};
                                const expItem = newData.financial.expenses.find(d => d.id === item.id);
                                if (expItem) {
                                  expItem.amount = value;
                                  setData(newData);
                                  saveData(newData);
                                }
                              }
                            }}
                            placeholder="0"
                            style={{...styles.costField, fontSize: '1.1rem', fontWeight: 700}}
                          />
                        </div>
                      </td>
                      <td style={{...styles.budgetTd, textAlign: 'center'}}>
                        <button
                          style={styles.budgetTableBtn}
                          onClick={() => {
                            if (confirm(`Delete "${item.item}"?`)) {
                              const newData = {...data};
                              newData.financial.expenses = newData.financial.expenses.filter(d => d.id !== item.id);
                              setData(newData);
                              saveData(newData);
                            }
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data.budget.other.map(item => (
                    <tr key={item.id}>
                      <td style={styles.budgetTd}>
                        {budgetItems.editingId === item.id ? (
                          <input
                            type="text"
                            value={budgetItems.editText}
                            onChange={(e) => budgetItems.setEditText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && updateBudgetItemText('other', item.id)}
                            onBlur={() => updateBudgetItemText('other', item.id)}
                            style={{...styles.budgetTableInput, fontSize: '1rem', fontWeight: 600}}
                            autoFocus
                          />
                        ) : (
                          <span
                            style={{cursor: 'pointer', fontSize: '1rem', fontWeight: 600, userSelect: 'none'}}
                            onClick={() => { budgetItems.setEditingId(item.id); budgetItems.setEditText(item.item); }}
                          >
                            {item.item}
                          </span>
                        )}
                      </td>
                      <td style={{...styles.budgetTd, textAlign: 'right'}}>
                        <div style={styles.costInputWrapper}>
                          <span style={{...styles.dollarSign, fontSize: '1.2rem', fontWeight: 700}}>$</span>
                          <input
                            type="text"
                            value={item.cost ? parseFloat(item.cost).toLocaleString() : ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '');
                              if (value === '' || !isNaN(value)) {
                                updateBudgetCost('other', item.id, value);
                              }
                            }}
                            placeholder="0"
                            style={{...styles.costField, fontSize: '1.1rem', fontWeight: 700}}
                          />
                        </div>
                      </td>
                      <td style={{...styles.budgetTd, textAlign: 'center'}}>
                        <button
                          style={styles.budgetTableBtn}
                          onClick={() => {
                            if (confirm(`Delete "${item.item}"?`)) {
                              deleteBudgetItem('other', item.id);
                            }
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                style={styles.addBudgetItemBtn}
                onClick={() => {
                  const itemName = prompt('Enter expense name:');
                  if (!itemName) return;
                  const newData = {...data};
                  if (!newData.financial.expenses) newData.financial.expenses = [];
                  newData.financial.expenses.push({
                    id: 'exp_' + Date.now(),
                    item: itemName,
                    amount: '',
                    type: 'expense'
                  });
                  setData(newData);
                  saveData(newData);
                }}
              >
                + Add expense
              </button>
            </div>

            {/* Custom Items */}
            <div className="budget-section" style={{...styles.budgetSection, borderColor: '#95a5a6'}}>
              <div style={{...styles.budgetTitle, background: '#95a5a6'}}>
                <div>
                  <h3 style={styles.budgetTitleText}>📋 Custom Items</h3>
                  <p style={styles.budgetTitleDesc}>Additional income or expenses</p>
                </div>
                <span style={styles.budgetTitleTotal}>${customItemsTotal.toLocaleString()}</span>
              </div>
              {(data.financial?.customItems || []).length > 0 && (
                <table style={styles.budgetTable}>
                  <thead>
                    <tr>
                      <th style={styles.budgetTh}>Item</th>
                      <th style={{...styles.budgetTh, width: '100px'}}>Type</th>
                      <th style={{...styles.budgetTh, width: '150px', textAlign: 'right'}}>Amount</th>
                      <th style={{...styles.budgetTh, width: '80px', textAlign: 'center'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.financial?.customItems || []).map(item => (
                      <tr key={item.id}>
                        <td style={styles.budgetTd}>
                          {editingFinancialItemId === item.id ? (
                            <input
                              type="text"
                              value={editFinancialItemText}
                              onChange={(e) => setEditFinancialItemText(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const newData = {...data};
                                  const customItem = newData.financial.customItems.find(d => d.id === item.id);
                                  if (customItem) {
                                    customItem.item = editFinancialItemText;
                                    setData(newData);
                                    saveData(newData);
                                  }
                                  setEditingFinancialItemId(null);
                                }
                              }}
                              onBlur={() => {
                                const newData = {...data};
                                const customItem = newData.financial.customItems.find(d => d.id === item.id);
                                if (customItem) {
                                  customItem.item = editFinancialItemText;
                                  setData(newData);
                                  saveData(newData);
                                }
                                setEditingFinancialItemId(null);
                              }}
                              style={{...styles.budgetTableInput, fontSize: '1rem', fontWeight: 600}}
                              autoFocus
                            />
                          ) : (
                            <span
                              style={{cursor: 'pointer', fontSize: '1rem', fontWeight: 600, userSelect: 'none'}}
                              onClick={() => {
                                setEditingFinancialItemId(item.id);
                                setEditFinancialItemText(item.item);
                              }}
                            >
                              {item.item}
                            </span>
                          )}
                        </td>
                        <td style={styles.budgetTd}>
                          <select
                            value={item.type}
                            onChange={(e) => {
                              const newData = {...data};
                              const customItem = newData.financial.customItems.find(d => d.id === item.id);
                              if (customItem) {
                                customItem.type = e.target.value;
                                setData(newData);
                                saveData(newData);
                              }
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '4px',
                              fontSize: '0.9rem',
                              fontWeight: 600,
                              border: '1px solid #ddd',
                              background: item.type === 'income' ? '#d4edda' : '#f8d7da',
                              color: item.type === 'income' ? '#155724' : '#721c24',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="income">+ Income</option>
                            <option value="expense">- Expense</option>
                          </select>
                        </td>
                        <td style={{...styles.budgetTd, textAlign: 'right'}}>
                          <div style={styles.costInputWrapper}>
                            <span style={{...styles.dollarSign, fontSize: '1.2rem', fontWeight: 700}}>$</span>
                            <input
                              type="text"
                              value={item.amount ? parseFloat(item.amount).toLocaleString() : ''}
                              onChange={(e) => {
                                const value = e.target.value.replace(/,/g, '');
                                if (value === '' || !isNaN(value)) {
                                  const newData = {...data};
                                  const customItem = newData.financial.customItems.find(d => d.id === item.id);
                                  if (customItem) {
                                    customItem.amount = value;
                                    setData(newData);
                                    saveData(newData);
                                  }
                                }
                              }}
                              placeholder="0"
                              style={{...styles.costField, fontSize: '1.1rem', fontWeight: 700}}
                            />
                          </div>
                        </td>
                        <td style={{...styles.budgetTd, textAlign: 'center'}}>
                          <button
                            style={styles.budgetTableBtn}
                            onClick={() => {
                              if (confirm(`Delete "${item.item}"?`)) {
                                const newData = {...data};
                                newData.financial.customItems = newData.financial.customItems.filter(i => i.id !== item.id);
                                setData(newData);
                                saveData(newData);
                              }
                            }}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button
                style={styles.addBudgetItemBtn}
                onClick={() => {
                  const itemName = prompt('Enter item name:');
                  if (!itemName) return;
                  const itemType = confirm('Click OK for INCOME (+), Cancel for EXPENSE (-)') ? 'income' : 'expense';
                  const newData = {...data};
                  if (!newData.financial.customItems) newData.financial.customItems = [];
                  newData.financial.customItems.push({
                    id: 'custom_' + Date.now(),
                    item: itemName,
                    amount: '',
                    type: itemType
                  });
                  setData(newData);
                  saveData(newData);
                }}
              >
                + Add custom item
              </button>
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
              backgroundColor: 'rgba(240, 244, 248, 0.75)',
              zIndex: 0
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1, padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
              <Typography variant="h2" sx={{ fontSize: '2.5rem', fontWeight: 700, color: '#1a365d', marginBottom: '12px', textAlign: 'center' }}>
                🗺️ Move Timeline
              </Typography>
              <Typography sx={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: '24px', textAlign: 'center' }}>
                Your journey from San Diego to Seattle
              </Typography>

              {/* Horizontal Progress Bar */}
              {(() => {
                const phaseOrder = ['preparation', 'houseReady', 'onMarket', 'underContract', 'closing', 'transition', 'settling'];
                const phases = phaseOrder.map(id => data.timeline?.[id]).filter(p => p);
                const completedCount = phases.filter(p => p.status === 'complete').length;
                const progressPercent = Math.round((completedCount / phases.length) * 100);

                return (
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '40px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #e0e0e0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: colors.charcoal }}>
                        Overall Progress
                      </span>
                      <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#3498db' }}>
                        {progressPercent}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '20px',
                      background: '#e0e0e0',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, #3498db 0%, ${colors.seaweed} 100%)`,
                        transition: 'width 0.5s ease',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.85rem', color: '#7f8c8d' }}>
                      <span>{completedCount} of {phases.length} phases complete</span>
                      <span>{phases.length - completedCount} remaining</span>
                    </div>
                  </div>
                );
              })()}

              {/* Vertical Timeline */}
              <div style={{ position: 'relative' }}>
                {/* Connecting Line */}
                <div style={{
                  position: 'absolute',
                  left: '24px',
                  top: '24px',
                  bottom: '80px',
                  width: '3px',
                  background: `linear-gradient(180deg, #3498db 0%, ${colors.seaweed} 100%)`,
                  zIndex: 0
                }} />

                {['preparation', 'houseReady', 'onMarket', 'underContract', 'closing', 'transition', 'settling'].map((phaseId, index) => {
                  const phase = data.timeline?.[phaseId];
                  if (!phase) return null;

                  const isComplete = phase.status === 'complete';
                  const isActive = phase.status === 'in-progress';

                  return (
                    <div key={phase.id} style={{ position: 'relative', marginBottom: '32px', paddingLeft: '70px' }}>
                      {/* Timeline Dot with Star */}
                      <div style={{
                        position: 'absolute',
                        left: '0px',
                        top: '16px',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: isComplete ? colors.seaweed : isActive ? '#3498db' : '#e0e0e0',
                        border: '4px solid white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        zIndex: 2
                      }}>
                        {isComplete ? '✓' : '⭐'}
                      </div>

                      {/* Phase Card */}
                      <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '28px',
                        boxShadow: isActive ? '0 8px 24px rgba(52, 152, 219, 0.2)' : '0 4px 12px rgba(0,0,0,0.08)',
                        border: isActive ? '2px solid #3498db' : '1px solid #e0e0e0',
                        transition: 'all 0.3s ease'
                      }}>
                        {/* Phase Header */}
                        <div style={{ marginBottom: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: colors.charcoal, margin: 0 }}>
                              {phase.title}
                            </h3>
                            <span style={{
                              padding: '6px 14px',
                              borderRadius: '20px',
                              fontSize: '0.9rem',
                              fontWeight: 600,
                              background: isComplete ? '#d4edda' : isActive ? '#cce5ff' : '#f0f0f0',
                              color: isComplete ? '#155724' : isActive ? '#004085' : '#6c757d'
                            }}>
                              {isComplete ? 'Complete' : isActive ? 'In Progress' : 'Pending'}
                            </span>
                          </div>
                          <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#7f8c8d', margin: '0 0 6px 0' }}>
                            {phase.subtitle}
                          </p>
                          <p style={{ fontSize: '1rem', color: '#95a5a6', margin: 0, lineHeight: '1.5' }}>
                            {phase.description}
                          </p>
                        </div>

                        {/* Single Target Date */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            color: colors.charcoal,
                            marginBottom: '10px',
                            letterSpacing: '0.3px'
                          }}>
                            🎯 Target Date
                          </label>
                          <input
                            type="date"
                            value={phase.targetDate || ''}
                            onChange={(e) => {
                              const newData = {...data};
                              newData.timeline[phase.id].targetDate = e.target.value;
                              setData(newData);
                              saveData(newData);
                            }}
                            style={{
                              width: '100%',
                              padding: '14px 18px',
                              border: '2px solid #ddd',
                              borderRadius: '8px',
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              color: colors.charcoal,
                              transition: 'border-color 0.2s ease',
                              cursor: 'pointer'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Box>
          </Box>
        )}

        {/* Seattle Research Tab */}
        {activeTab === 'seattle' && (
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
              backgroundColor: 'rgba(240, 244, 248, 0.88)',
              zIndex: 0
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1, padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
              <Typography variant="h2" sx={{ fontSize: '2.5rem', fontWeight: 700, color: '#1a365d', marginBottom: '12px', textAlign: 'center' }}>
                🌆 Seattle Housing Search
              </Typography>
              <Typography sx={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: '32px', textAlign: 'center' }}>
                Find your temporary and long-term rentals in Seattle
              </Typography>

              {/* AI Rental Finder Section */}
              <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 3, padding: 4, marginBottom: 4, boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)' }}>
                <Typography variant="h3" sx={{ fontSize: '1.8rem', fontWeight: 700, color: 'white', marginBottom: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🤖 AI Rental Finder
                  <Chip label="Powered by Gemini" size="small" sx={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                </Typography>
                <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', marginBottom: 3 }}>
                  Let AI help you find the perfect rental on Zillow, Redfin, and Hotpads
                </Typography>

                {/* Search Criteria Form */}
                <Box sx={{ background: 'white', borderRadius: 2, padding: 3, marginBottom: 3 }}>
                  <Typography variant="h6" sx={{ marginBottom: 2, color: colors.charcoal }}>Search Criteria</Typography>

                  <Grid container spacing={2}>
                    {/* Bedrooms */}
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="caption" sx={{ display: 'block', marginBottom: 1, color: '#7f8c8d', fontWeight: 600 }}>
                        Bedrooms
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          type="number"
                          label="Min"
                          value={data.aiRentalFinder.searchCriteria.bedrooms.min}
                          onChange={(e) => updateSearchCriteria('bedrooms', { ...data.aiRentalFinder.searchCriteria.bedrooms, min: parseInt(e.target.value) || 0 })}
                          size="small"
                          fullWidth
                        />
                        <TextField
                          type="number"
                          label="Max"
                          value={data.aiRentalFinder.searchCriteria.bedrooms.max}
                          onChange={(e) => updateSearchCriteria('bedrooms', { ...data.aiRentalFinder.searchCriteria.bedrooms, max: parseInt(e.target.value) || 3 })}
                          size="small"
                          fullWidth
                        />
                      </Box>
                    </Grid>

                    {/* Bathrooms */}
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="caption" sx={{ display: 'block', marginBottom: 1, color: '#7f8c8d', fontWeight: 600 }}>
                        Bathrooms (min)
                      </Typography>
                      <TextField
                        type="number"
                        value={data.aiRentalFinder.searchCriteria.bathrooms.min}
                        onChange={(e) => updateSearchCriteria('bathrooms', { ...data.aiRentalFinder.searchCriteria.bathrooms, min: parseInt(e.target.value) || 1 })}
                        size="small"
                        fullWidth
                      />
                    </Grid>

                    {/* Max Price */}
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="caption" sx={{ display: 'block', marginBottom: 1, color: '#7f8c8d', fontWeight: 600 }}>
                        Max Price/Month
                      </Typography>
                      <TextField
                        type="number"
                        value={data.aiRentalFinder.searchCriteria.priceRange.max}
                        onChange={(e) => updateSearchCriteria('priceRange', { ...data.aiRentalFinder.searchCriteria.priceRange, max: parseInt(e.target.value) || 2500 })}
                        size="small"
                        fullWidth
                        InputProps={{
                          startAdornment: <Typography sx={{ marginRight: 0.5, color: '#7f8c8d' }}>$</Typography>
                        }}
                      />
                    </Grid>

                    {/* Duration */}
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="caption" sx={{ display: 'block', marginBottom: 1, color: '#7f8c8d', fontWeight: 600 }}>
                        Rental Duration
                      </Typography>
                      <TextField
                        select
                        value={data.aiRentalFinder.searchCriteria.duration}
                        onChange={(e) => updateSearchCriteria('duration', e.target.value)}
                        size="small"
                        fullWidth
                        SelectProps={{ native: true }}
                      >
                        <option value="short">Short-term (1 month)</option>
                        <option value="long">Long-term (1 year)</option>
                        <option value="both">Both</option>
                      </TextField>
                    </Grid>

                    {/* Pet Friendly */}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={data.aiRentalFinder.searchCriteria.petFriendly}
                            onChange={(e) => updateSearchCriteria('petFriendly', e.target.checked)}
                          />
                        }
                        label="Pet-Friendly Required"
                      />
                    </Grid>

                    {/* Description Keywords */}
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ display: 'block', marginBottom: 1, color: '#7f8c8d', fontWeight: 600 }}>
                        Description Keywords
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', marginBottom: 1, color: '#95a5a6', fontStyle: 'italic' }}>
                        Search for features not in standard filters (e.g., "natural light", "quiet", "walkable", "updated kitchen")
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Type a keyword and press Enter"
                        value={newDescriptionKeyword}
                        onChange={(e) => setNewDescriptionKeyword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newDescriptionKeyword.trim()) {
                            addDescriptionKeyword(newDescriptionKeyword);
                          }
                        }}
                      />
                      {data.aiRentalFinder.searchCriteria.descriptionKeywords.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginTop: 1 }}>
                          {data.aiRentalFinder.searchCriteria.descriptionKeywords.map(keyword => (
                            <Chip
                              key={keyword}
                              label={keyword}
                              onDelete={() => removeDescriptionKeyword(keyword)}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                    </Grid>
                  </Grid>

                  {/* Search Button */}
                  <Box sx={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleAISearch}
                      disabled={aiSearchLoading}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        padding: '12px 32px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #63408b 100%)',
                        }
                      }}
                    >
                      {aiSearchLoading ? '🔍 Generating URLs...' : '🤖 Find Rentals with AI'}
                    </Button>
                    {data.aiRentalFinder.lastSearch && (
                      <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                        Last search: {new Date(data.aiRentalFinder.lastSearch).toLocaleString()}
                      </Typography>
                    )}
                  </Box>

                  {/* Error Display */}
                  {aiSearchError && (
                    <Alert severity="error" sx={{ marginTop: 2 }}>
                      {aiSearchError}
                    </Alert>
                  )}
                </Box>

                {/* Generated URLs Display */}
                {(data.aiRentalFinder.generatedURLs.zillow || data.aiRentalFinder.generatedURLs.redfin || data.aiRentalFinder.generatedURLs.hotpads) && (
                  <Box sx={{ background: 'white', borderRadius: 2, padding: 3 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2, color: colors.charcoal }}>🔗 Generated Search URLs</Typography>
                    <Typography variant="body2" sx={{ marginBottom: 2, color: '#7f8c8d' }}>
                      Click to open searches in new tabs. Browse the listings and add ones you like manually below.
                    </Typography>

                    <Stack spacing={2}>
                      {/* Zillow */}
                      {data.aiRentalFinder.generatedURLs.zillow && (
                        <Box sx={{ padding: 2, background: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#006aff' }}>
                              🏠 Zillow
                            </Typography>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => window.open(data.aiRentalFinder.generatedURLs.zillow, '_blank')}
                              sx={{ background: '#006aff' }}
                            >
                              Open Search
                            </Button>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#7f8c8d', wordBreak: 'break-all' }}>
                            {data.aiRentalFinder.generatedURLs.zillow}
                          </Typography>
                        </Box>
                      )}

                      {/* Redfin */}
                      {data.aiRentalFinder.generatedURLs.redfin && (
                        <Box sx={{ padding: 2, background: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#a02021' }}>
                              🏠 Redfin
                            </Typography>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => window.open(data.aiRentalFinder.generatedURLs.redfin, '_blank')}
                              sx={{ background: '#a02021' }}
                            >
                              Open Search
                            </Button>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#7f8c8d', wordBreak: 'break-all' }}>
                            {data.aiRentalFinder.generatedURLs.redfin}
                          </Typography>
                        </Box>
                      )}

                      {/* Hotpads */}
                      {data.aiRentalFinder.generatedURLs.hotpads && (
                        <Box sx={{ padding: 2, background: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ff6f00' }}>
                              🏠 Hotpads
                            </Typography>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => window.open(data.aiRentalFinder.generatedURLs.hotpads, '_blank')}
                              sx={{ background: '#ff6f00' }}
                            >
                              Open Search
                            </Button>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#7f8c8d', wordBreak: 'break-all' }}>
                            {data.aiRentalFinder.generatedURLs.hotpads}
                          </Typography>
                        </Box>
                      )}
                    </Stack>

                    <Typography variant="body2" sx={{ marginTop: 2, padding: 2, background: '#e3f2fd', borderRadius: 1, color: '#1565c0' }}>
                      💡 <strong>Tip:</strong> After browsing, come back and add your favorite listings to the Short-Term or Long-Term sections below for tracking.
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Seattle Neighborhoods Section */}
              <Box sx={{ background: 'white', borderRadius: 3, padding: 4, marginBottom: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <Typography variant="h3" sx={{ fontSize: '1.8rem', fontWeight: 700, color: colors.charcoal, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🏘️ Seattle Neighborhoods to Research
                  <Chip label={`${data.neighborhoods?.length || 0} neighborhoods`} size="small" color="success" />
                </Typography>

                <Typography sx={{ fontSize: '0.95rem', color: '#7f8c8d', marginBottom: 3, fontStyle: 'italic' }}>
                  Research different Seattle neighborhoods to help narrow your rental search
                </Typography>

                {/* Add New Neighborhood Button */}
                {!neighborhoods.adding && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => neighborhoods.setAdding(true)}
                    sx={{ marginBottom: 3 }}
                  >
                    Add Neighborhood
                  </Button>
                )}

                {/* Add Neighborhood Form */}
                {neighborhoods.adding && (
                  <Box sx={{ background: '#f8f9fa', padding: 3, borderRadius: 2, marginBottom: 3 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>Add Seattle Neighborhood</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Neighborhood Name *" value={neighborhoods.newData.name} onChange={(e) => neighborhoods.setNewData({...neighborhoods.newData, name: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Typical Rent Range" value={neighborhoods.newData.priceRange} onChange={(e) => neighborhoods.setNewData({...neighborhoods.newData, priceRange: e.target.value})} placeholder="e.g. $2000-2800/mo" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth multiline rows={2} label="Pros" value={neighborhoods.newData.pros} onChange={(e) => neighborhoods.setNewData({...neighborhoods.newData, pros: e.target.value})} placeholder="Walkable, close to work, good schools, etc." />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth multiline rows={2} label="Cons" value={neighborhoods.newData.cons} onChange={(e) => neighborhoods.setNewData({...neighborhoods.newData, cons: e.target.value})} placeholder="Traffic, expensive, far from amenities, etc." />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth multiline rows={2} label="Notes" value={neighborhoods.newData.notes} onChange={(e) => neighborhoods.setNewData({...neighborhoods.newData, notes: e.target.value})} />
                      </Grid>
                    </Grid>
                    <Box sx={{ marginTop: 2, display: 'flex', gap: 1 }}>
                      <Button variant="contained" startIcon={<SaveIcon />} onClick={addNeighborhood}>Save Neighborhood</Button>
                      <Button variant="outlined" onClick={() => neighborhoods.cancelAdding()}>Cancel</Button>
                    </Box>
                  </Box>
                )}

                {/* Neighborhoods Grid */}
                {data.neighborhoods?.length > 0 ? (
                  <Grid container spacing={3}>
                    {data.neighborhoods.map(hood => (
                      <Grid item xs={12} md={6} key={hood.id}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.charcoal, marginBottom: 1 }}>
                              {hood.name}
                            </Typography>
                            {hood.priceRange && (
                              <Chip label={hood.priceRange} size="small" sx={{ marginBottom: 2 }} />
                            )}
                            {hood.pros && (
                              <Box sx={{ marginBottom: 1 }}>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: colors.emerald }}>✓ Pros:</Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>{hood.pros}</Typography>
                              </Box>
                            )}
                            {hood.cons && (
                              <Box sx={{ marginBottom: 1 }}>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#e74c3c' }}>✗ Cons:</Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>{hood.cons}</Typography>
                              </Box>
                            )}
                            {hood.notes && (
                              <Typography sx={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic', marginTop: 1 }}>
                                📝 {hood.notes}
                              </Typography>
                            )}
                            <Box sx={{ marginTop: 2, display: 'flex', gap: 1 }}>
                              <IconButton size="small" color="primary" onClick={() => neighborhoods.startEditing(hood.id, hood)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => neighborhoods.startDelete(hood.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            {/* Delete Confirmation */}
                            {neighborhoods.confirmDeleteId === hood.id && (
                              <Box sx={{ marginTop: 2, padding: 2, background: '#fff3cd', borderRadius: 1 }}>
                                <Typography sx={{ fontSize: '0.9rem', marginBottom: 1 }}>Delete this neighborhood?</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button size="small" variant="contained" color="error" onClick={() => deleteNeighborhood(hood.id)}>Delete</Button>
                                  <Button size="small" variant="outlined" onClick={() => neighborhoods.cancelDelete()}>Cancel</Button>
                                </Box>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography sx={{ textAlign: 'center', color: '#7f8c8d', padding: 4, background: '#f8f9fa', borderRadius: 2 }}>
                    No neighborhoods added yet. Start researching Seattle areas to help with your rental search!
                  </Typography>
                )}
              </Box>

              {/* Short-Term Rentals Section (1 month) */}
              <Box sx={{ background: 'white', borderRadius: 3, padding: 4, marginBottom: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <Typography variant="h3" sx={{ fontSize: '1.8rem', fontWeight: 700, color: colors.charcoal, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🏠 Short-Term Rentals (1 Month)
                  <Chip label={`${data.rentalProperties?.filter(p => p.duration === 'short').length || 0} options`} size="small" sx={{ background: '#e74c3c', color: 'white' }} />
                </Typography>

                <Typography sx={{ fontSize: '0.95rem', color: '#7f8c8d', marginBottom: 3, fontStyle: 'italic' }}>
                  Temporary housing while you search for a long-term rental (furnished, month-to-month, Airbnb, etc.)
                </Typography>

                {/* Add New Property Button */}
                {!properties.adding && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      properties.setNewData({...properties.newData, duration: 'short'});
                      properties.setAdding(true);
                    }}
                    sx={{ marginBottom: 3 }}
                  >
                    Add Short-Term Option
                  </Button>
                )}

                {/* Add Property Form */}
                {properties.adding && properties.newData.duration === 'short' && (
                  <Box sx={{ background: '#fff3cd', padding: 3, borderRadius: 2, marginBottom: 3, border: '2px solid #e74c3c' }}>
                    <Typography variant="h6" sx={{ marginBottom: 2, color: '#c0392b' }}>Add Short-Term Rental (1 Month)</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Address or Name *" value={properties.newData.address} onChange={(e) => properties.setNewData({...properties.newData, address: e.target.value})} placeholder="e.g. Capitol Hill Furnished Studio" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Neighborhood" value={properties.newData.neighborhood} onChange={(e) => properties.setNewData({...properties.newData, neighborhood: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Price/Month" value={properties.newData.price} onChange={(e) => properties.setNewData({...properties.newData, price: e.target.value})} placeholder="e.g. $2500" />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField fullWidth label="Bedrooms" value={properties.newData.bedrooms} onChange={(e) => properties.setNewData({...properties.newData, bedrooms: e.target.value})} />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField fullWidth label="Bathrooms" value={properties.newData.bathrooms} onChange={(e) => properties.setNewData({...properties.newData, bathrooms: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Sq Ft" value={properties.newData.sqft} onChange={(e) => properties.setNewData({...properties.newData, sqft: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={properties.newData.petFriendly}
                              onChange={(e) => properties.setNewData({...properties.newData, petFriendly: e.target.checked})}
                            />
                          }
                          label="Pet Friendly"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="URL" value={properties.newData.url} onChange={(e) => properties.setNewData({...properties.newData, url: e.target.value})} placeholder="Airbnb, VRBO, or listing URL" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth multiline rows={2} label="Notes" value={properties.newData.notes} onChange={(e) => properties.setNewData({...properties.newData, notes: e.target.value})} placeholder="Furnished? Flexible dates? Parking?" />
                      </Grid>
                    </Grid>
                    <Box sx={{ marginTop: 2, display: 'flex', gap: 1 }}>
                      <Button variant="contained" startIcon={<SaveIcon />} onClick={addProperty}>Save Short-Term Rental</Button>
                      <Button variant="outlined" onClick={() => properties.cancelAdding()}>Cancel</Button>
                    </Box>
                  </Box>
                )}

                {/* Short-Term Properties Grid */}
                {data.rentalProperties?.filter(p => p.duration === 'short').length > 0 ? (
                  <Grid container spacing={3}>
                    {data.rentalProperties.filter(p => p.duration === 'short').map(property => (
                      <Grid item xs={12} md={6} key={property.id}>
                        <Card sx={{ border: property.interested ? '2px solid #3498db' : '1px solid #e74c3c', background: '#fffaf0' }}>
                          <CardContent>
                            {property.interested && (
                              <Chip label="⭐ Interested" size="small" sx={{ background: '#3498db', color: 'white', marginBottom: 1 }} />
                            )}
                            <Chip label="1 MONTH" size="small" sx={{ background: '#e74c3c', color: 'white', marginBottom: 1, marginLeft: property.interested ? 1 : 0 }} />

                            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.charcoal, marginBottom: 1 }}>
                              {property.address}
                            </Typography>

                            <Stack spacing={0.5} sx={{ marginBottom: 2 }}>
                              {property.neighborhood && <Chip label={property.neighborhood} size="small" variant="outlined" />}
                              {property.price && (
                                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#c0392b' }}>
                                  {property.price}/mo
                                </Typography>
                              )}
                              {(property.bedrooms || property.bathrooms || property.sqft) && (
                                <Typography sx={{ fontSize: '0.9rem', color: '#555' }}>
                                  {property.bedrooms && `${property.bedrooms} bed`}
                                  {property.bathrooms && ` • ${property.bathrooms} bath`}
                                  {property.sqft && ` • ${property.sqft} sq ft`}
                                </Typography>
                              )}
                              {property.petFriendly && (
                                <Chip label="🐾 Pet Friendly" size="small" sx={{ background: colors.seaweed, color: 'white' }} />
                              )}
                            </Stack>

                            {property.url && (
                              <Typography sx={{ fontSize: '0.85rem', marginBottom: 1 }}>
                                🔗 <a href={property.url} target="_blank" rel="noopener noreferrer">View Listing</a>
                              </Typography>
                            )}

                            {property.notes && (
                              <Typography sx={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic', marginTop: 1 }}>
                                📝 {property.notes}
                              </Typography>
                            )}

                            <Box sx={{ marginTop: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <IconButton size="small" color="primary" onClick={() => properties.startEditing(property.id, property)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => properties.startDelete(property.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              <Button
                                size="small"
                                variant={property.interested ? "outlined" : "contained"}
                                onClick={() => togglePropertyInterested(property.id)}
                              >
                                {property.interested ? '⭐ Interested' : 'Mark Interested'}
                              </Button>
                            </Box>

                            {/* Delete Confirmation */}
                            {properties.confirmDeleteId === property.id && (
                              <Box sx={{ marginTop: 2, padding: 2, background: '#fff3cd', borderRadius: 1 }}>
                                <Typography sx={{ fontSize: '0.9rem', marginBottom: 1 }}>Delete this property?</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button size="small" variant="contained" color="error" onClick={() => deleteProperty(property.id)}>Delete</Button>
                                  <Button size="small" variant="outlined" onClick={() => properties.cancelDelete()}>Cancel</Button>
                                </Box>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography sx={{ textAlign: 'center', color: '#7f8c8d', padding: 4, background: '#fffaf0', borderRadius: 2 }}>
                    No short-term options added yet. Add Airbnbs, VRBOs, or month-to-month furnished rentals!
                  </Typography>
                )}
              </Box>

              {/* Long-Term Rentals Section (1 year) */}
              <Box sx={{ background: 'white', borderRadius: 3, padding: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <Typography variant="h3" sx={{ fontSize: '1.8rem', fontWeight: 700, color: colors.charcoal, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🏢 Long-Term Rentals (1 Year Lease)
                  <Chip label={`${data.rentalProperties?.filter(p => p.duration === 'long').length || 0} options`} size="small" sx={{ background: colors.emerald, color: 'white' }} />
                </Typography>

                <Typography sx={{ fontSize: '0.95rem', color: '#7f8c8d', marginBottom: 3, fontStyle: 'italic' }}>
                  Your permanent rental for the year - apartments, condos, houses with 12-month leases
                </Typography>

                {/* Add New Property Button */}
                {!properties.adding && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      properties.setNewData({...properties.newData, duration: 'long'});
                      properties.setAdding(true);
                    }}
                    sx={{ marginBottom: 3 }}
                  >
                    Add Long-Term Rental
                  </Button>
                )}

                {/* Add Property Form */}
                {properties.adding && properties.newData.duration === 'long' && (
                  <Box sx={{ background: '#e8f5e9', padding: 3, borderRadius: 2, marginBottom: 3, border: `2px solid ${colors.emerald}` }}>
                    <Typography variant="h6" sx={{ marginBottom: 2, color: '#1e8449' }}>Add Long-Term Rental (1 Year)</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Address *" value={properties.newData.address} onChange={(e) => properties.setNewData({...properties.newData, address: e.target.value})} placeholder="Full address or building name" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Neighborhood" value={properties.newData.neighborhood} onChange={(e) => properties.setNewData({...properties.newData, neighborhood: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Rent/Month" value={properties.newData.price} onChange={(e) => properties.setNewData({...properties.newData, price: e.target.value})} placeholder="e.g. $2200" />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField fullWidth label="Bedrooms" value={properties.newData.bedrooms} onChange={(e) => properties.setNewData({...properties.newData, bedrooms: e.target.value})} />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField fullWidth label="Bathrooms" value={properties.newData.bathrooms} onChange={(e) => properties.setNewData({...properties.newData, bathrooms: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Sq Ft" value={properties.newData.sqft} onChange={(e) => properties.setNewData({...properties.newData, sqft: e.target.value})} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={properties.newData.petFriendly}
                              onChange={(e) => properties.setNewData({...properties.newData, petFriendly: e.target.checked})}
                            />
                          }
                          label="Pet Friendly"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="URL" value={properties.newData.url} onChange={(e) => properties.setNewData({...properties.newData, url: e.target.value})} placeholder="Zillow, Apartments.com, or listing URL" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth multiline rows={2} label="Notes" value={properties.newData.notes} onChange={(e) => properties.setNewData({...properties.newData, notes: e.target.value})} placeholder="Parking? Laundry? Amenities? Move-in date?" />
                      </Grid>
                    </Grid>
                    <Box sx={{ marginTop: 2, display: 'flex', gap: 1 }}>
                      <Button variant="contained" startIcon={<SaveIcon />} onClick={addProperty}>Save Long-Term Rental</Button>
                      <Button variant="outlined" onClick={() => properties.cancelAdding()}>Cancel</Button>
                    </Box>
                  </Box>
                )}

                {/* Long-Term Properties Grid */}
                {data.rentalProperties?.filter(p => p.duration === 'long').length > 0 ? (
                  <Grid container spacing={3}>
                    {data.rentalProperties.filter(p => p.duration === 'long').map(property => (
                      <Grid item xs={12} md={6} key={property.id}>
                        <Card sx={{ border: property.interested ? '2px solid #3498db' : `1px solid ${colors.emerald}`, background: '#f0fdf4' }}>
                          <CardContent>
                            {property.interested && (
                              <Chip label="⭐ Interested" size="small" sx={{ background: '#3498db', color: 'white', marginBottom: 1 }} />
                            )}
                            <Chip label="1 YEAR LEASE" size="small" sx={{ background: colors.emerald, color: 'white', marginBottom: 1, marginLeft: property.interested ? 1 : 0 }} />

                            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.charcoal, marginBottom: 1 }}>
                              {property.address}
                            </Typography>

                            <Stack spacing={0.5} sx={{ marginBottom: 2 }}>
                              {property.neighborhood && <Chip label={property.neighborhood} size="small" variant="outlined" />}
                              {property.price && (
                                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e8449' }}>
                                  {property.price}/mo
                                </Typography>
                              )}
                              {(property.bedrooms || property.bathrooms || property.sqft) && (
                                <Typography sx={{ fontSize: '0.9rem', color: '#555' }}>
                                  {property.bedrooms && `${property.bedrooms} bed`}
                                  {property.bathrooms && ` • ${property.bathrooms} bath`}
                                  {property.sqft && ` • ${property.sqft} sq ft`}
                                </Typography>
                              )}
                              {property.petFriendly && (
                                <Chip label="🐾 Pet Friendly" size="small" sx={{ background: colors.seaweed, color: 'white' }} />
                              )}
                            </Stack>

                            {property.url && (
                              <Typography sx={{ fontSize: '0.85rem', marginBottom: 1 }}>
                                🔗 <a href={property.url} target="_blank" rel="noopener noreferrer">View Listing</a>
                              </Typography>
                            )}

                            {property.notes && (
                              <Typography sx={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic', marginTop: 1 }}>
                                📝 {property.notes}
                              </Typography>
                            )}

                            <Box sx={{ marginTop: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <IconButton size="small" color="primary" onClick={() => properties.startEditing(property.id, property)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => properties.startDelete(property.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              <Button
                                size="small"
                                variant={property.interested ? "outlined" : "contained"}
                                onClick={() => togglePropertyInterested(property.id)}
                              >
                                {property.interested ? '⭐ Interested' : 'Mark Interested'}
                              </Button>
                            </Box>

                            {/* Delete Confirmation */}
                            {properties.confirmDeleteId === property.id && (
                              <Box sx={{ marginTop: 2, padding: 2, background: '#fff3cd', borderRadius: 1 }}>
                                <Typography sx={{ fontSize: '0.9rem', marginBottom: 1 }}>Delete this property?</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button size="small" variant="contained" color="error" onClick={() => deleteProperty(property.id)}>Delete</Button>
                                  <Button size="small" variant="outlined" onClick={() => properties.cancelDelete()}>Cancel</Button>
                                </Box>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography sx={{ textAlign: 'center', color: '#7f8c8d', padding: 4, background: '#f0fdf4', borderRadius: 2 }}>
                    No long-term rentals added yet. Start searching for 1-year lease options on Zillow, Apartments.com, etc.!
                  </Typography>
                )}
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

              {/* Category Filter Buttons */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: 3 }}>
                <Chip
                  label="All Notes"
                  onClick={() => setNoteFilter('all')}
                  sx={{
                    background: noteFilter === 'all' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e0e0',
                    color: noteFilter === 'all' ? 'white' : '#666',
                    fontWeight: noteFilter === 'all' ? 600 : 400,
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 }
                  }}
                />
                {Object.entries(NOTE_CATEGORIES).map(([key, { label, color }]) => (
                  <Chip
                    key={key}
                    label={label}
                    onClick={() => setNoteFilter(key)}
                    sx={{
                      background: noteFilter === key ? color : '#e0e0e0',
                      color: noteFilter === key ? 'white' : '#666',
                      fontWeight: noteFilter === key ? 600 : 400,
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.8 }
                    }}
                  />
                ))}
              </Box>

              {/* Existing General Notes */}
              {data.generalNotes?.length > 0 && (
                <div style={styles.stepNotesList}>
                  {data.generalNotes
                    .filter(note => noteFilter === 'all' || note.category === noteFilter)
                    .map(note => (
                    <div key={note.id} style={styles.stepNoteItem}>
                      {editingGeneralNoteId === note.id ? (
                        <div style={styles.noteEditForm}>
                          <select
                            value={editGeneralNoteCategory}
                            onChange={(e) => setEditGeneralNoteCategory(e.target.value)}
                            style={{
                              ...styles.noteInput,
                              padding: '8px 12px',
                              marginBottom: '8px',
                              height: 'auto',
                              cursor: 'pointer'
                            }}
                          >
                            {Object.entries(NOTE_CATEGORIES).map(([key, { label }]) => (
                              <option key={key} value={key}>{label}</option>
                            ))}
                          </select>
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
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <Chip
                              label={NOTE_CATEGORIES[note.category || 'ideas'].label}
                              size="small"
                              sx={{
                                background: NOTE_CATEGORIES[note.category || 'ideas'].color,
                                color: 'white',
                                fontWeight: 600,
                                width: 'fit-content'
                              }}
                            />
                            <span style={styles.noteText}>{note.text}</span>
                          </div>
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
                                  onClick={() => {
                                    setEditingGeneralNoteId(note.id);
                                    setEditGeneralNoteText(note.text);
                                    setEditGeneralNoteCategory(note.category || 'ideas');
                                  }}
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

              {/* Show message when filter has no results */}
              {data.generalNotes?.length > 0 && noteFilter !== 'all' &&
               data.generalNotes.filter(note => note.category === noteFilter).length === 0 && (
                <Box sx={{
                  textAlign: 'center',
                  padding: 3,
                  color: '#999',
                  fontStyle: 'italic'
                }}>
                  No {NOTE_CATEGORIES[noteFilter].label} notes yet
                </Box>
              )}

              {/* Add New General Note */}
              <div style={styles.addNoteForm}>
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value)}
                  style={{
                    ...styles.noteInput,
                    padding: '8px 12px',
                    marginBottom: '8px',
                    height: 'auto',
                    cursor: 'pointer'
                  }}
                >
                  {Object.entries(NOTE_CATEGORIES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
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
                {Object.entries(data.steps || {}).map(([stepId, step]) => {
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

        {/* API Test Tab */}
        {activeTab === 'test' && (
          <GeminiTest />
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


export default App;
