import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Target, 
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { useAIRecommendations } from '../hooks/useAI';

const AIRecommendations = ({ childId, onApplyRecommendation }) => {
  const { recommendations, loading, error, applyRecommendation } = useAIRecommendations(childId);

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'next_lesson':
        return BookOpen;
      case 'difficulty_adjustment':
        return TrendingUp;
      case 'learning_path':
        return Target;
      case 'break_suggestion':
        return Clock;
      case 'skill_focus':
        return Brain;
      default:
        return Lightbulb;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'from-red-500 to-red-600';
      case 'high':
        return 'from-orange-500 to-orange-600';
      case 'medium':
        return 'from-blue-500 to-blue-600';
      case 'low':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleApplyRecommendation = async (recommendation) => {
    try {
      await applyRecommendation(recommendation.id);
      if (onApplyRecommendation) {
        onApplyRecommendation(recommendation);
      }
    } catch (error) {
      console.error('Failed to apply recommendation:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">AI Recommendations</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-500 p-2 rounded-lg">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">AI Recommendations</h3>
        </div>
        <div className="text-red-600 text-sm">
          Failed to load recommendations. Please try again later.
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">AI Recommendations</h3>
        </div>
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No new recommendations at the moment.</p>
          <p className="text-sm text-gray-400">Keep learning to get personalized suggestions!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">AI Recommendations</h3>
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation, index) => {
          const IconComponent = getRecommendationIcon(recommendation.recommendation_type);
          
          return (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`bg-gradient-to-r ${getPriorityColor(recommendation.priority)} p-2 rounded-lg`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{recommendation.title}</h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(recommendation.priority)}`}>
                      {recommendation.priority} priority
                    </span>
                  </div>
                </div>
                
                {recommendation.ai_confidence_score && (
                  <div className="text-xs text-gray-500">
                    {Math.round(recommendation.ai_confidence_score * 100)}% confidence
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {recommendation.description}
              </p>

              {recommendation.recommendation_data && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-500 mb-1">Additional Details:</div>
                  {recommendation.recommendation_data.nextTopics && (
                    <div className="text-sm text-gray-700">
                      <strong>Suggested topics:</strong> {recommendation.recommendation_data.nextTopics.join(', ')}
                    </div>
                  )}
                  {recommendation.recommendation_data.estimatedTime && (
                    <div className="text-sm text-gray-700">
                      <strong>Estimated time:</strong> {recommendation.recommendation_data.estimatedTime}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  {new Date(recommendation.created_at).toLocaleDateString()}
                  {recommendation.expires_at && (
                    <span className="ml-2">
                      • Expires {new Date(recommendation.expires_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {!recommendation.is_applied && (
                  <button
                    onClick={() => handleApplyRecommendation(recommendation)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Apply</span>
                  </button>
                )}

                {recommendation.is_applied && (
                  <div className="flex items-center space-x-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Applied</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AIRecommendations;