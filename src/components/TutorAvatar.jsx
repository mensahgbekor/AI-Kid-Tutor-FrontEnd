import React from 'react';
import { Notebook as Robot, BrainCircuit, PartyPopper, Lightbulb } from 'lucide-react';

const TutorAvatar = ({ tutorState }) => {
  const renderAvatar = () => {
    switch (tutorState.mood) {
      case 'thinking':
        return (
          <div className="bg-info-100 p-4 rounded-full animate-pulse" role="img" aria-label="Tutor is thinking">
            <BrainCircuit size={48} className="text-info-500" aria-hidden="true" />
          </div>
        );
      case 'excited':
        return (
          <div className="bg-warning-100 p-4 rounded-full animate-wiggle" role="img" aria-label="Tutor is excited">
            <Lightbulb size={48} className="text-warning-500" aria-hidden="true" />
          </div>
        );
      case 'celebrating':
        return (
          <div className="bg-success-100 p-4 rounded-full animate-bounce" role="img" aria-label="Tutor is celebrating">
            <PartyPopper size={48} className="text-success-500" aria-hidden="true" />
          </div>
        );
      case 'happy':
      default:
        return (
          <div className="bg-primary-100 p-4 rounded-full animate-float" role="img" aria-label="Tutor is happy">
            <Robot size={48} className="text-primary-500" aria-hidden="true" />
          </div>
        );
    }
  };

  const getRandomEncouragement = () => {
    const encouragements = [
      "You're doing great!",
      "Keep up the awesome work!",
      "You're super smart!",
      "Learning is fun with you!",
      "You're a star student!",
      "High five! You're amazing!"
    ];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  };

  return (
    <div className="flex flex-col items-center" role="status" aria-live="polite">
      <div className="mb-3">{renderAvatar()}</div>
      <div className="bg-white p-4 rounded-2xl shadow-md max-w-xs">
        <p className="font-bold text-primary-700 mb-1">{tutorState.name}</p>
        <p className="text-gray-700">{tutorState.message}</p>
        {tutorState.mood === 'celebrating' && (
          <p className="text-success-600 font-bold mt-2">{getRandomEncouragement()}</p>
        )}
      </div>
    </div>
  );
};

export default TutorAvatar;