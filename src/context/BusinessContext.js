import React, { createContext, useContext, useReducer } from 'react';
import { fetchBusinessData, regenerateHeadlineAPI } from '../utils/api';

const BusinessContext = createContext();

const initialState = {
  businessData: null,
  loading: false,
  error: null,
  formErrors: {},
  formData: {
    name: '',
    location: ''
  }
};

const businessReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_BUSINESS_DATA':
      return { 
        ...state, 
        businessData: action.payload, 
        loading: false, 
        error: null 
      };
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload }
      };
    case 'UPDATE_HEADLINE':
      return {
        ...state,
        businessData: {
          ...state.businessData,
          headline: action.payload
        },
        loading: false
      };
    case 'SET_FORM_ERRORS':
      return { ...state, formErrors: action.payload };
    case 'CLEAR_DATA':
      return {
        ...state,
        businessData: null,
        error: null,
        formErrors: {}
      };
    default:
      return state;
  }
};

export const BusinessProvider = ({ children }) => {
  const [state, dispatch] = useReducer(businessReducer, initialState);

  const updateFormData = (data) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = 'Business name is required';
    if (!data.location.trim()) errors.location = 'Location is required';
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  const setFormErrors = (errors) => {
    dispatch({ type: 'SET_FORM_ERRORS', payload: errors });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const submitBusinessData = async (formData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetchBusinessData(formData);
      dispatch({ 
        type: 'SET_BUSINESS_DATA', 
        payload: { ...response.data, ...formData } 
      });
      return response;
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Failed to fetch business data' 
      });
      throw error;
    }
  };

  const regenerateHeadline = async () => {
    if (!state.businessData) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await regenerateHeadlineAPI(
        state.businessData.name, 
        state.businessData.location
      );
      dispatch({ 
        type: 'UPDATE_HEADLINE', 
        payload: response.headline 
      });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Failed to regenerate headline' 
      });
    }
  };

  const clearData = () => {
    dispatch({ type: 'CLEAR_DATA' });
  };

  const contextValue = {
    ...state,
    updateFormData,
    submitBusinessData,
    regenerateHeadline,
    clearData,
    validateForm,
    setFormErrors,
    clearError,
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error })
  };

  return (
    <BusinessContext.Provider value={contextValue}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

export default BusinessContext;