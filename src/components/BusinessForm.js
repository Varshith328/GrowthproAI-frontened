import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { Building2, MapPin, Search, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const BusinessForm = () => {
  const {
    formData,
    formErrors,
    loading,
    error,
    updateFormData,
    submitBusinessData,
    validateForm,
    setFormErrors,
    clearError,
    setLoading,
    setError
  } = useBusiness();

  const [touched, setTouched] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
    
    updateFormData({ [name]: value });
    
    if (error) clearError();
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const { errors } = validateForm(formData);
    if (errors[name]) {
      setFormErrors(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { isValid, errors } = validateForm(formData);
    
    if (!isValid) {
      setFormErrors(errors);
      setTouched({ name: true, location: true });
      toast.error('Please fix the form errors before submitting');
      return;
    }

    try {
      setLoading(true);
      clearError();
      
      await submitBusinessData(formData);
      toast.success('Business data loaded successfully!');
      
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error.message || 'Failed to fetch business data');
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const businessSuggestions = [
    'Cake & Co', 'Tech Solutions Inc', 'Green Garden Cafe', 'Urban Fitness Studio',
    'Bright Dental Clinic', 'Fashion Forward', 'Auto Repair Pro', 'Beauty Salon Elite'
  ];

  const locationSuggestions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Business Analyzer</h3>
            <p className="text-sm text-gray-600">Enter your business details to get insights</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                formErrors.name && touched.name
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              placeholder="Enter your business name"
              disabled={loading}
            />
          </div>
          {formErrors.name && touched.name && (
            <div className="flex items-center space-x-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{formErrors.name}</span>
            </div>
          )}
          
          {!formData.name && (
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-gray-500">Try:</span>
              {businessSuggestions.slice(0, 4).map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => updateFormData({ name: suggestion })}
                  className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded-md transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                formErrors.location && touched.location
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              placeholder="Enter your business location"
              disabled={loading}
            />
          </div>
          {formErrors.location && touched.location && (
            <div className="flex items-center space-x-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{formErrors.location}</span>
            </div>
          )}
          
          {!formData.location && (
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-gray-500">Popular:</span>
              {locationSuggestions.slice(0, 4).map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => updateFormData({ location: suggestion })}
                  className="text-xs bg-green-50 hover:bg-green-100 text-green-600 px-2 py-1 rounded-md transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !formData.name || !formData.location}
          className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform ${
            loading || !formData.name || !formData.location
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing Business...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Get Business Insights</span>
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            We'll analyze your business rating, reviews, and generate AI-powered SEO headlines
          </p>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">What you'll get:</h4>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-600">Google Business rating simulation</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-600">Review count analysis</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-600">AI-generated SEO headlines</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessForm;