import { Calculator, Microscope, FileText } from 'lucide-react';

export const subjects = [
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Make math fun with interactive problems and visual learning',
    icon: Calculator,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    topics: ['Basic Math', 'Patterns', 'Geometry', 'Logic Puzzles'],
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
    id: 'science',
    title: 'Science Explorer',
    description: 'Explore the wonders of science through experiments and discovery',
    icon: Microscope,
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-50',
    topics: ['Nature', 'Experiments', 'Animals', 'Space'],
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
    id: 'english',
    title: 'English Language',
    description: 'Master reading, writing, and communication skills',
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    topics: ['Reading', 'Writing', 'Grammar', 'Vocabulary'],
    activities: [
      {
        id: 'reading-comprehension',
        title: 'Reading Comprehension',
        description: 'Improve understanding of texts and stories',
        difficulty: 'Beginner',
        duration: '25 min'
      },
      {
        id: 'creative-writing',
        title: 'Creative Writing',
        description: 'Express your imagination through writing',
        difficulty: 'Intermediate',
        duration: '35 min'
      },
      {
        id: 'grammar-basics',
        title: 'Grammar Basics',
        description: 'Learn the building blocks of language',
        difficulty: 'Beginner',
        duration: '20 min'
      }
    ]
  }
];