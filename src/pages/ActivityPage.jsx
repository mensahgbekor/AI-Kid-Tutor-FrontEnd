import React, { useState, useEffect } from 'react';
import TutorAvatar from '../components/TutorAvatar';
import InteractiveQuiz from '../components/InteractiveQuiz';
import { activities } from '../data/activities';
import { ArrowLeft } from 'lucide-react';
import { generateContent, generateQuizQuestions } from '../services/gemini';

const ActivityPage = ({ 
  activityId, 
  onBack,
  onComplete
}) => {
  const [activity, setActivity] = useState(undefined);
  const [content, setContent] = useState('');
  const [tutorState, setTutorState] = useState({
    name: 'Tutor Bot',
    mood: 'thinking',
    message: 'Getting everything ready for your learning activity...'
  });
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  useEffect(() => {
    const selectedActivity = activities.find(a => a.id === activityId);
    setActivity(selectedActivity);

    if (selectedActivity) {
      generateContent(`Create an engaging educational explanation about ${selectedActivity.title} for children. Make it fun and easy to understand. Format the content with proper markdown for headings (no ## symbols), bold text (no ** symbols), and lists.`)
        .then(generatedContent => {
          setContent(generatedContent);
          setTutorState({
            name: 'Tutor Bot',
            mood: 'excited',
            message: `Let's learn about ${selectedActivity.title}! Read through the content, then test your knowledge with the quiz!`
          });
        })
        .catch(error => {
          console.error('Error generating content:', error);
          setTutorState({
            name: 'Tutor Bot',
            mood: 'thinking',
            message: 'Sorry, I had trouble loading the content. Please try again.'
          });
        });
    }
  }, [activityId]);

  const handleStartQuiz = async () => {
    if (!activity) return;
    
    setIsLoadingQuiz(true);
    setTutorState({
      name: 'Tutor Bot',
      mood: 'thinking',
      message: 'Preparing your quiz questions...'
    });

    try {
      const questions = await generateQuizQuestions(activity.subjectId, activity.title);
      setQuizQuestions(questions);
      setShowQuiz(true);
      setTutorState({
        name: 'Tutor Bot',
        mood: 'excited',
        message: 'Time to test your knowledge! Good luck!'
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      setTutorState({
        name: 'Tutor Bot',
        mood: 'thinking',
        message: 'Sorry, I had trouble creating the quiz. Please try again.'
      });
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleQuizComplete = (result) => {
    setTutorState({
      name: 'Tutor Bot',
      mood: 'celebrating',
      message: result.feedback
    });
    
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const formatContent = (content) => {
    return content
      .replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold my-4">$1</h2>')
      .replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\*\s+(.+)$/gm, '<li class="ml-4">$1</li>')
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph)
      .map(paragraph => {
        if (paragraph.startsWith('<h') || paragraph.startsWith('<li')) {
          return paragraph;
        }
        return `<p class="mb-4">${paragraph}</p>`;
      })
      .join('\n');
  };

  if (!activity) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 mb-20 md:mb-0">
      <button 
        onClick={onBack}
        className="flex items-center mb-6 text-primary-600 hover:text-primary-800 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back to Activities
      </button>
      
      <div className="mb-8 max-w-md mx-auto">
        <TutorAvatar tutorState={tutorState} />
      </div>
      
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
        {activity.imageUrl && (
          <div className="h-48 overflow-hidden">
            <img 
              src={activity.imageUrl} 
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-3">{activity.title}</h2>
          <p className="text-gray-600 mb-6">{activity.description}</p>
          
          {!showQuiz ? (
            <>
              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <div className="prose max-w-none">
                  {content ? (
                    <div 
                      className="text-gray-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatContent(content) }} 
                    />
                  ) : (
                    <p className="text-gray-700">Loading activity content...</p>
                  )}
                </div>
              </div>
              
              <button 
                onClick={handleStartQuiz}
                disabled={isLoadingQuiz}
                className={`btn-primary w-full ${isLoadingQuiz ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoadingQuiz ? 'Preparing Quiz...' : 'Start Quiz'}
              </button>
            </>
          ) : (
            <InteractiveQuiz
              questions={quizQuestions}
              onComplete={handleQuizComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;