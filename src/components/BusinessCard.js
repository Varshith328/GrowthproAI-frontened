import React from 'react';
import { Star, Users, RefreshCw, TrendingUp, MapPin, Award } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import LoadingSpinner from './LoadingSpinner';

const BusinessCard = () => {
  const { businessData, regenerateHeadline, loading } = useBusiness();

  if (!businessData) {
    return null;
  }

  const { name, location, rating, reviews, headline } = businessData;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-5 h-5 text-gray-300" />
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 absolute inset-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Business Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
        {/* Header with Gradient Background */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{name}</h2>
                  <div className="flex items-center mt-1 text-white/90">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-lg">{location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <span className="text-sm font-medium">Business Profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Rating and Reviews */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Customer Rating</h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-4xl font-bold text-gray-800">{rating}</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(rating)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{reviews} reviews</span>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{Math.floor(rating * 20)}%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{Math.floor(reviews / 10)}</div>
                  <div className="text-sm text-gray-600">Monthly Reviews</div>
                </div>
              </div>
            </div>

            {/* SEO Headline Section */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">AI-Generated SEO Headline</h3>
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    AI Powered
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 text-lg leading-relaxed font-medium">
                    "{headline}"
                  </p>
                </div>
                
                <button
                  onClick={regenerateHeadline}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      <span>Regenerate SEO Headline</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
              <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
              <span>Data refreshed automatically</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;