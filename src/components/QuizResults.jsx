import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, RefreshCw, CheckCircle, Target, TrendingUp } from 'lucide-react';

const QuizResults = ({ result, onRetry, onComplete }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score) => {
    if (score >= 90) return 'from-green-400 to-green-600';
    if (score >= 80) return 'from-blue-400 to-blue-600';
    if (score >= 70) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Great Job!';
    if (score >= 70) return 'Good Work!';
    return 'Keep Trying!';
  };

  const getStarCount = (score) => {
    if (score >= 90) return 3;
    if (score >= 70) return 2;
    if (score >= 50) return 1;
    return 0;
  };

  const starCount = getStarCount(result.score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto"
    >
      {/* Header with Trophy */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${getScoreGradient(result.score)} rounded-full flex items-center justify-center`}>
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {getPerformanceLevel(result.score)}
        </h2>
        <p className="text-gray-600">{result.feedback}</p>
      </motion.div>

      {/* Score Display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        className="mb-6"
      >
        <div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}>
          {result.score}%
        </div>
        <div className="text-gray-600">
          {result.correctAnswers} out of {result.totalQuestions} correct
        </div>
      </motion.div>

      {/* Stars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center space-x-2 mb-6"
      >
        {[1, 2, 3].map((star) => (
          <motion.div
            key={star}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: star <= starCount ? 1 : 0.5, 
              rotate: 0 
            }}
            transition={{ 
              delay: 0.6 + (star * 0.1),
              type: 'spring',
              stiffness: 200 
            }}
          >
            <Star 
              className={`w-8 h-8 ${
                star <= starCount 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Performance Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-50 rounded-xl p-4 mb-6"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-blue-500 mr-1" />
            </div>
            <div className="text-lg font-bold text-gray-800">{result.correctAnswers}</div>
            <div className="text-xs text-gray-500">Correct</div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            </div>
            <div className="text-lg font-bold text-gray-800">{result.totalQuestions}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
            </div>
            <div className="text-lg font-bold text-gray-800">{result.score}%</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="space-y-3"
      >
        {onRetry && result.score < 70 && (
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        )}
        
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Continue Learning</span>
        </button>
      </motion.div>

      {/* Motivational Message */}
      {result.score >= 80 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg"
        >
          <p className="text-sm text-gray-700 font-medium">
            🎉 Amazing work! You're becoming an AI expert!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizResults;