import { Brain, Calculator, Microscope, Palette, Globe, Code } from 'lucide-react';

export const subjects = [
  {
    id: 'ai-technology',
    title: 'AI & Technology',
    description: 'Discover how artificial intelligence works and shapes our world',
    icon: Brain,
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-blue-50',
    activities: [
      {
        id: 'what-is-ai',
        title: 'What is AI?',
        description: 'Learn the basics of artificial intelligence',
        difficulty: 'Beginner',
        duration: '15 min'
      },
      {
        id: 'ai-in-daily-life',
        title: 'AI in Daily Life',
        description: 'Discover AI in apps, games, and devices',
        difficulty: 'Beginner',
        duration: '20 min'
      },
      {
        id: 'smart-assistants',
        title: 'Smart Assistants',
        description: 'How voice assistants understand and respond',
        difficulty: 'Intermediate',
        duration: '25 min'
      }
    ]
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Make math fun with interactive problems and visual learning',
    icon: Calculator,
    color: 'from-green-500 to-teal-600',
    bgColor: 'bg-green-50',
    activities: [
      {
        id: 'number-patterns',
        title: 'Number Patterns',
        description: 'Discover patterns in numbers and sequences',
        difficulty: 'Beginner',
        duration: '20 min'
      },
      {
        id: 'geometry-shapes',
        title: 'Geometry & Shapes',
        description: 'Explore shapes, angles, and spatial relationships',
        difficulty: 'Intermediate',
        duration: '30 min'
      },
      {
        id: 'problem-solving',
        title: 'Problem Solving',
        description: 'Learn strategies to solve math problems',
        difficulty: 'Intermediate',
        duration: '25 min'
      }
    ]
  },
  {
    id: 'science-explorer',
    title: 'Science Explorer',
    description: 'Explore the wonders of science through experiments and discovery',
    icon: Microscope,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    activities: [
      {
        id: 'solar-system',
        title: 'Solar System',
        description: 'Journey through space and learn about planets',
        difficulty: 'Beginner',
        duration: '25 min'
      },
      {
        id: 'simple-experiments',
        title: 'Simple Experiments',
        description: 'Safe and fun science experiments to try',
        difficulty: 'Beginner',
        duration: '30 min'
      },
      {
        id: 'animal-habitats',
        title: 'Animal Habitats',
        description: 'Discover where animals live and how they adapt',
        difficulty: 'Beginner',
        duration: '20 min'
      }
    ]
  },
  {
    id: 'creative-arts',
    title: 'Creative Arts',
    description: 'Express creativity through digital art, music, and storytelling',
    icon: Palette,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
    activities: [
      {
        id: 'digital-drawing',
        title: 'Digital Drawing',
        description: 'Learn to create art using digital tools',
        difficulty: 'Beginner',
        duration: '30 min'
      },
      {
        id: 'music-basics',
        title: 'Music Basics',
        description: 'Understand rhythm, melody, and musical notes',
        difficulty: 'Beginner',
        duration: '25 min'
      },
      {
        id: 'creative-writing',
        title: 'Creative Writing',
        description: 'Write stories and express your imagination',
        difficulty: 'Intermediate',
        duration: '35 min'
      }
    ]
  },
  {
    id: 'world-cultures',
    title: 'World & Cultures',
    description: 'Learn about different countries, languages, and traditions',
    icon: Globe,
    color: 'from-orange-500 to-yellow-600',
    bgColor: 'bg-orange-50',
    activities: [
      {
        id: 'world-geography',
        title: 'World Geography',
        description: 'Explore countries, capitals, and landmarks',
        difficulty: 'Beginner',
        duration: '25 min'
      },
      {
        id: 'cultural-traditions',
        title: 'Cultural Traditions',
        description: 'Learn about festivals and customs worldwide',
        difficulty: 'Beginner',
        duration: '20 min'
      },
      {
        id: 'basic-languages',
        title: 'Basic Languages',
        description: 'Learn simple words in different languages',
        difficulty: 'Beginner',
        duration: '30 min'
      }
    ]
  },
  {
    id: 'coding-basics',
    title: 'Coding Basics',
    description: 'Introduction to programming concepts through fun activities',
    icon: Code,
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-50',
    activities: [
      {
        id: 'what-is-coding',
        title: 'What is Coding?',
        description: 'Understand what programming is and why it matters',
        difficulty: 'Beginner',
        duration: '20 min'
      },
      {
        id: 'algorithms-thinking',
        title: 'Algorithm Thinking',
        description: 'Learn to think step-by-step like a computer',
        difficulty: 'Beginner',
        duration: '25 min'
      },
      {
        id: 'visual-programming',
        title: 'Visual Programming',
        description: 'Create programs using visual blocks',
        difficulty: 'Intermediate',
        duration: '35 min'
      }
    ]
  }
];