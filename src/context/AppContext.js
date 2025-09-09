import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Initial State
const initialState = {
  user: {
    name: 'Training Manager',
    role: 'Senior Training Coordinator',
    avatar: null,
  },
  agents: [
    {
      id: 'AGT001',
      name: 'Sarah Chen',
      avatar: '👩‍💼',
      department: 'Customer Service',
      level: 'Senior',
      joinDate: '2024-01-15',
      status: 'training',
      currentSession: 'sess_abc123',
      empathyScore: 87,
      sessionDuration: '15m 32s',
      location: 'New York, NY',
      shift: 'Morning',
      phone: '+1 (555) 123-4567',
      email: 'sarah.chen@synchrony.com',
      recentSessions: [
        { date: '2025-09-06', scenario: 'billing_issue', score: 87, duration: '15m' },
        { date: '2025-09-05', scenario: 'customer_complaint', score: 91, duration: '18m' },
        { date: '2025-09-04', scenario: 'workplace_conflict', score: 85, duration: '22m' },
        { date: '2025-09-03', scenario: 'technical_support', score: 89, duration: '12m' },
      ],
      performance: {
        averageScore: 88,
        totalSessions: 156,
        improvementRate: 12,
        strengths: ['Quick responses', 'Good empathy keywords', 'Professional tone'],
        improvements: ['Ask more open-ended questions', 'Use customer name more often'],
      },
    },
    {
      id: 'AGT002',
      name: 'Mike Johnson',
      avatar: '👨‍💼',
      department: 'Customer Service',
      level: 'Junior',
      joinDate: '2024-06-20',
      status: 'available',
      currentSession: null,
      empathyScore: 92,
      sessionDuration: null,
      lastActive: '2h ago',
      location: 'Chicago, IL',
      shift: 'Evening',
      phone: '+1 (555) 234-5678',
      email: 'mike.johnson@synchrony.com',
      recentSessions: [
        { date: '2025-09-05', scenario: 'technical_support', score: 92, duration: '20m' },
        { date: '2025-09-04', scenario: 'billing_issue', score: 88, duration: '16m' },
        { date: '2025-09-03', scenario: 'customer_complaint', score: 94, duration: '25m' },
      ],
      performance: {
        averageScore: 91,
        totalSessions: 89,
        improvementRate: 18,
        strengths: ['Excellent listening skills', 'Patient responses', 'Solution-focused'],
        improvements: ['Faster response time needed', 'More empathy keywords'],
      },
    },
    {
      id: 'AGT003',
      name: 'Lisa Wang',
      avatar: '👩‍💻',
      department: 'Technical Support',
      level: 'Senior',
      joinDate: '2023-11-10',
      status: 'session',
      currentSession: 'sess_def456',
      empathyScore: 73,
      sessionDuration: '8m 15s',
      location: 'San Francisco, CA',
      shift: 'Night',
      phone: '+1 (555) 345-6789',
      email: 'lisa.wang@synchrony.com',
      recentSessions: [
        { date: '2025-09-06', scenario: 'technical_support', score: 73, duration: '8m' },
        { date: '2025-09-05', scenario: 'workplace_conflict', score: 79, duration: '14m' },
        { date: '2025-09-04', scenario: 'billing_issue', score: 82, duration: '19m' },
      ],
      performance: {
        averageScore: 78,
        totalSessions: 203,
        improvementRate: 8,
        strengths: ['Technical expertise', 'Problem-solving', 'Detailed explanations'],
        improvements: ['More empathetic language', 'Slower pace needed', 'Better active listening'],
      },
    },
    {
      id: 'AGT004',
      name: 'John Smith',
      avatar: '👨‍🔧',
      department: 'Customer Service',
      level: 'Senior',
      joinDate: '2023-08-05',
      status: 'training',
      currentSession: 'sess_ghi789',
      empathyScore: 91,
      sessionDuration: '22m 45s',
      location: 'Austin, TX',
      shift: 'Morning',
      phone: '+1 (555) 456-7890',
      email: 'john.smith@synchrony.com',
      recentSessions: [
        { date: '2025-09-06', scenario: 'customer_complaint', score: 91, duration: '22m' },
        { date: '2025-09-05', scenario: 'family_crisis', score: 95, duration: '28m' },
        { date: '2025-09-04', scenario: 'financial_stress', score: 89, duration: '21m' },
      ],
      performance: {
        averageScore: 92,
        totalSessions: 278,
        improvementRate: 15,
        strengths: ['Exceptional empathy', 'Crisis management', 'Calm demeanor'],
        improvements: ['Reduce session duration', 'More structured approach'],
      },
    },
    {
      id: 'AGT005',
      name: 'Emma Davis',
      avatar: '👩‍🎓',
      department: 'Customer Service',
      level: 'Junior',
      joinDate: '2024-08-12',
      status: 'available',
      currentSession: null,
      empathyScore: 85,
      sessionDuration: null,
      lastActive: '1h ago',
      location: 'Miami, FL',
      shift: 'Afternoon',
      phone: '+1 (555) 567-8901',
      email: 'emma.davis@synchrony.com',
      recentSessions: [
        { date: '2025-09-05', scenario: 'billing_issue', score: 85, duration: '17m' },
        { date: '2025-09-04', scenario: 'technical_support', score: 87, duration: '15m' },
        { date: '2025-09-03', scenario: 'customer_complaint', score: 83, duration: '20m' },
      ],
      performance: {
        averageScore: 85,
        totalSessions: 67,
        improvementRate: 22,
        strengths: ['Friendly tone', 'Good rapport building', 'Clear communication'],
        improvements: ['More complex scenarios needed', 'Advanced de-escalation techniques'],
      },
    },
    {
      id: 'AGT006',
      name: 'Alex Brown',
      avatar: '👨‍💻',
      department: 'Technical Support',
      level: 'Junior',
      joinDate: '2024-07-30',
      status: 'session',
      currentSession: 'sess_jkl012',
      empathyScore: 89,
      sessionDuration: '12m 20s',
      location: 'Seattle, WA',
      shift: 'Night',
      phone: '+1 (555) 678-9012',
      email: 'alex.brown@synchrony.com',
      recentSessions: [
        { date: '2025-09-06', scenario: 'technical_support', score: 89, duration: '12m' },
        { date: '2025-09-05', scenario: 'customer_complaint', score: 86, duration: '18m' },
        { date: '2025-09-04', scenario: 'billing_issue', score: 91, duration: '14m' },
      ],
      performance: {
        averageScore: 89,
        totalSessions: 45,
        improvementRate: 25,
        strengths: ['Fast learner', 'Technical aptitude', 'Positive attitude'],
        improvements: ['Confidence building', 'Handling difficult customers', 'Time management'],
      },
    },
  ],
  sessions: {},
  analytics: {
    totalAgents: 6,
    activeTraining: 2,
    availableAgents: 2,
    inSession: 2,
    averageEmpathyScore: 86.2,
    totalSessionsToday: 24,
    improvementRate: 16.7,
  },
  notifications: [],
};

// Action Types
const ActionTypes = {
  UPDATE_AGENT_STATUS: 'UPDATE_AGENT_STATUS',
  START_TRAINING_SESSION: 'START_TRAINING_SESSION',
  END_TRAINING_SESSION: 'END_TRAINING_SESSION',
  UPDATE_EMPATHY_SCORE: 'UPDATE_EMPATHY_SCORE',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  UPDATE_SESSION_DATA: 'UPDATE_SESSION_DATA',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_AGENT_STATUS:
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.agentId
            ? { ...agent, ...action.payload.updates }
            : agent
        ),
      };

    case ActionTypes.START_TRAINING_SESSION:
      const sessionId = uuidv4();
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.agentId
            ? { 
                ...agent, 
                status: 'training', 
                currentSession: sessionId,
                sessionDuration: '0m 0s'
              }
            : agent
        ),
        sessions: {
          ...state.sessions,
          [sessionId]: {
            id: sessionId,
            agentId: action.payload.agentId,
            scenario: action.payload.scenario,
            startTime: new Date(),
            messages: [],
            empathyScore: 0,
            status: 'active',
          },
        },
      };

    case ActionTypes.END_TRAINING_SESSION:
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.agentId
            ? { 
                ...agent, 
                status: 'available', 
                currentSession: null,
                sessionDuration: null
              }
            : agent
        ),
        sessions: {
          ...state.sessions,
          [action.payload.sessionId]: {
            ...state.sessions[action.payload.sessionId],
            status: 'completed',
            endTime: new Date(),
          },
        },
      };

    case ActionTypes.UPDATE_EMPATHY_SCORE:
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.agentId
            ? { ...agent, empathyScore: action.payload.score }
            : agent
        ),
      };

    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          {
            id: uuidv4(),
            ...action.payload,
            timestamp: new Date(),
          },
          ...state.notifications,
        ],
      };

    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload.id
        ),
      };

    case ActionTypes.UPDATE_SESSION_DATA:
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.payload.sessionId]: {
            ...state.sessions[action.payload.sessionId],
            ...action.payload.updates,
          },
        },
      };

    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider Component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const actions = {
    updateAgentStatus: (agentId, updates) => {
      dispatch({
        type: ActionTypes.UPDATE_AGENT_STATUS,
        payload: { agentId, updates },
      });
    },

    startTrainingSession: (agentId, scenario) => {
      dispatch({
        type: ActionTypes.START_TRAINING_SESSION,
        payload: { agentId, scenario },
      });
    },

    endTrainingSession: (agentId, sessionId) => {
      dispatch({
        type: ActionTypes.END_TRAINING_SESSION,
        payload: { agentId, sessionId },
      });
    },

    updateEmpathyScore: (agentId, score) => {
      dispatch({
        type: ActionTypes.UPDATE_EMPATHY_SCORE,
        payload: { agentId, score },
      });
    },

    addNotification: (notification) => {
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: notification,
      });
    },

    removeNotification: (id) => {
      dispatch({
        type: ActionTypes.REMOVE_NOTIFICATION,
        payload: { id },
      });
    },

    updateSessionData: (sessionId, updates) => {
      dispatch({
        type: ActionTypes.UPDATE_SESSION_DATA,
        payload: { sessionId, updates },
      });
    },
  };

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timers = state.notifications.map(notification => {
      return setTimeout(() => {
        actions.removeNotification(notification.id);
      }, 5000);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [state.notifications]);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
