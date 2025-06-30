import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, Award } from 'lucide-react';
import QuizResults from './QuizResults';

const InteractiveQuiz = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [attempts, setAttempts] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleOptionSelect = (optionId) => {
    if (!showExplanation) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmit = () => {
    if (!selectedOption) return;

    const isCorrect = currentQuestion.options.find(opt => opt.id === selectedOption)?.isCorrect || false;
    
    if (!isCorrect && !showExplanation && attempts === 1) {
      // First attempt was wrong, allow one more try
      setShowExplanation(true);
      setAttempts(2);
      setTimeout(() => {
        setShowExplanation(false);
        setSelectedOption(null);
      }, 3000);
      return;
    }

    setAnswers([...answers, isCorrect]);
    setShowExplanation(true);
    setAttempts(1); // Reset attempts for next question
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const correctAnswers = answers.filter(a => a).length;
      const score = Math.round((correctAnswers / questions.length) * 100);
      
      const result = {
        totalQuestions: questions.length,
        correctAnswers,
        score,
        feedback: getFeedback(score)
      };
      
      setQuizResult(result);
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setAnswers([]);
    setAttempts(1);
    setShowResults(false);
    setQuizResult(null);
  };

  const getFeedback = (score) => {
    if (score >= 90) return "Outstanding! You're a superstar!";
    if (score >= 80) return "Great job! Keep up the good work!";
    if (score >= 70) return "Good effort! Keep practicing!";
    return "Keep trying! You'll get better with practice!";
  };

  if (showResults && quizResult) {
    return (
      <QuizResults
        result={quizResult}
        onRetry={quizResult.score < 70 ? handleRetry : undefined}
        onComplete={() => onComplete(quizResult)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-md p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Question {currentQuestionIndex + 1} of {questions.length}</h3>
        <div className="flex items-center">
          <Award className="text-warning-500 mr-2" />
          <span className="font-semibold">{answers.filter(a => a).length} correct</span>
        </div>
      </div>

      <motion.div
        key={currentQuestion.id}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-6"
      >
        <p className="text-lg font-semibold mb-4">{currentQuestion.text}</p>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const showResult = showExplanation && isSelected;
            const isCorrect = showResult && option.isCorrect;

            return (
              <motion.button
                key={option.id}
                whileHover={!showExplanation ? { scale: 1.02 } : {}}
                whileTap={!showExplanation ? { scale: 0.98 } : {}}
                onClick={() => handleOptionSelect(option.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? showResult
                      ? isCorrect
                        ? 'border-success-500 bg-success-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                disabled={showExplanation}
              >
                <div className="flex items-center">
                  {showResult && (
                    isCorrect ? (
                      <CheckCircle className="text-success-500 mr-2 shrink-0" />
                    ) : (
                      <XCircle className="text-red-500 mr-2 shrink-0" />
                    )
                  )}
                  <span>{option.text}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gray-50 rounded-xl"
        >
          <p className="font-semibold mb-2">
            {attempts === 2 ? "Try one more time!" : "Explanation:"}
          </p>
          {attempts !== 2 && <p>{currentQuestion.explanation}</p>}
        </motion.div>
      )}

      <div className="flex justify-end">
        {!showExplanation ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`btn-primary ${!selectedOption ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Submit Answer
          </button>
        ) : (
          attempts !== 2 && (
            <button
              onClick={handleNext}
              className="btn-primary flex items-center"
            >
              {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
              <ArrowRight size={20} className="ml-2" />
            </button>
          )
        )}
      </div>
    </motion.div>
  );
};

export default InteractiveQuiz;