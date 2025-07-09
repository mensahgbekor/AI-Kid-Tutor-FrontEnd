import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  Gamepad2, 
  Calculator, 
  Globe, 
  Palette, 
  Music, 
  Beaker,
  Play,
  Star,
  Clock,
  Trophy,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AITutorChat from '../components/AITutorChat';

const SubjectsPage = () => {
  const [selectedChild, setSelectedChild] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const navigate = useNavigate();

  // Mock child data - replace with actual data from Supabase
  const children = [
    { 
      id: 1, 
      name: 'Emma', 
      age: 8, 
      avatar: '👧',
      interests: ['AI', 'Art', 'Animals'],
      learning_preferences: { visual: 60, auditory: 25, kinesthetic: 15 }
    },
    { 
      id: 2, 
      name: 'Alex', 
      age: 10, 
      avatar: '👦',
      interests: ['Coding', 'Games', 'Science'],
      learning_preferences: { visual: 40, auditory: 30, kinesthetic: 30 }
    }
  ];

  const subjects = [
    {
      id: 'ai-basics',
      title: 'AI & Technology',
      description: 'Learn about artificial intelligence, robots, and how computers think',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Beginner',
      lessons: 12,
      duration: '3 hours',
      topics: ['What is AI?', 'Smart Assistants', 'Machine Learning', 'Robots']
    },
    {
      id: 'mathematics',
      title: 'Mathematics',
      description: 'Fun with numbers, patterns, and problem-solving',
      icon: Calculator,
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Beginner',
      lessons: 15,
      duration: '4 hours',
      topics: ['Basic Math', 'Patterns', 'Geometry', 'Logic Puzzles']
    },
    {
      id: 'science',
      title: 'Science Explorer',
      description: 'Discover how the world works through experiments and exploration',
      icon: Beaker,
      color: 'from-green-500 to-teal-500',
      difficulty: 'Beginner',
      lessons: 10,
      duration: '2.5 hours',
      topics: ['Nature', 'Experiments', 'Animals', 'Space']
    },
    {
      id: 'creative-arts',
      title: 'Creative Arts',
      description: 'Express yourself through art, music, and creative projects',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      difficulty: 'Beginner',
      lessons: 8,
      duration: '2 hours',
      topics: ['Drawing', 'Colors', 'Music', 'Crafts']
    },
    {
      id: 'world-explorer',
      title: 'World Explorer',
      description: 'Travel the world and learn about different cultures and places',
      icon: Globe,
      color: 'from-orange-500 to-red-500',
      difficulty: 'Beginner',
      lessons: 12,
      duration: '3 hours',
      topics: ['Countries', 'Cultures', 'Languages', 'Geography']
    },
    {
      id: 'coding-games',
      title: 'Coding & Games',
      description: 'Learn programming through fun games and interactive activities',
      icon: Gamepad2,
      color: 'from-indigo-500 to-purple-500',
      difficulty: 'Intermediate',
      lessons: 20,
      duration: '5 hours',
      topics: ['Scratch', 'Logic', 'Algorithms', 'Game Design']
    }
  ];

  useEffect(() => {
    // Set default child
    if (children.length > 0) {
      setSelectedChild(children[0]);
    }
  }, []);

  const handleSubjectClick = (subject) => {
    navigate(`/learning/${subject.id}`, { 
      state: { 
        subject, 
        child: selectedChild 
      } 
    });
  };

  return (
    <div>
      {/* AI Tutor Chat Modal */}
      <AITutorChat
        subjectId={subject.id}
        childProfile={selectedChild}
        onClose={() => setShowAIChat(false)}
      />
    </div>
  );
};

export default SubjectsPage;