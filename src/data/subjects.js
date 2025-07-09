import { Calculator, Microscope, FileText } from 'lucide-react';

export const subjects = [
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Make math fun with interactive problems and visual learning',
    icon: Calculator,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    subtopics: [
      {
        id: 'basic-arithmetic',
        title: 'Basic Arithmetic',
        description: 'Addition, subtraction, multiplication, and division',
        difficulty: 'Beginner',
        estimatedTime: '30 min',
        icon: '🔢',
        lessons: [
          'Understanding Numbers',
          'Addition Basics',
          'Subtraction Fun',
          'Multiplication Magic',
          'Division Discovery'
        ]
      },
      {
        id: 'geometry',
        title: 'Geometry & Shapes',
        description: 'Explore shapes, angles, and spatial relationships',
        difficulty: 'Beginner',
        estimatedTime: '25 min',
        icon: '📐',
        lessons: [
          'Basic Shapes',
          'Lines and Angles',
          'Perimeter and Area',
          'Symmetry',
          '3D Shapes'
        ]
      },
      {
        id: 'patterns',
        title: 'Patterns & Logic',
        description: 'Discover patterns in numbers and sequences',
        difficulty: 'Intermediate',
        estimatedTime: '20 min',
        icon: '🔄',
        lessons: [
          'Number Patterns',
          'Shape Patterns',
          'Logic Puzzles',
          'Sequences',
          'Problem Solving'
        ]
      },
      {
        id: 'fractions',
        title: 'Fractions & Decimals',
        description: 'Understanding parts of a whole',
        difficulty: 'Intermediate',
        estimatedTime: '35 min',
        icon: '🍕',
        lessons: [
          'What are Fractions?',
          'Adding Fractions',
          'Decimal Basics',
          'Converting Fractions',
          'Real-world Applications'
        ]
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
    subtopics: [
      {
        id: 'living-things',
        title: 'Living Things',
        description: 'Discover plants, animals, and how they live',
        difficulty: 'Beginner',
        estimatedTime: '25 min',
        icon: '🌱',
        lessons: [
          'Plants and Animals',
          'Life Cycles',
          'Habitats',
          'Food Chains',
          'Human Body Basics'
        ]
      },
      {
        id: 'earth-space',
        title: 'Earth & Space',
        description: 'Journey through our planet and the universe',
        difficulty: 'Beginner',
        estimatedTime: '30 min',
        icon: '🌍',
        lessons: [
          'Our Planet Earth',
          'Weather and Climate',
          'Day and Night',
          'Solar System',
          'Moon and Stars'
        ]
      },
      {
        id: 'matter-energy',
        title: 'Matter & Energy',
        description: 'Explore what things are made of and how they work',
        difficulty: 'Intermediate',
        estimatedTime: '25 min',
        icon: '⚡',
        lessons: [
          'States of Matter',
          'Heat and Temperature',
          'Light and Sound',
          'Simple Machines',
          'Forces and Motion'
        ]
      },
      {
        id: 'experiments',
        title: 'Fun Experiments',
        description: 'Safe and exciting hands-on science activities',
        difficulty: 'Beginner',
        estimatedTime: '40 min',
        icon: '🧪',
        lessons: [
          'Kitchen Science',
          'Water Experiments',
          'Color Mixing',
          'Growing Plants',
          'Simple Chemistry'
        ]
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
    subtopics: [
      {
        id: 'reading-comprehension',
        title: 'Reading & Comprehension',
        description: 'Improve understanding of texts and stories',
        difficulty: 'Beginner',
        estimatedTime: '25 min',
        icon: '📖',
        lessons: [
          'Phonics Basics',
          'Reading Stories',
          'Understanding Characters',
          'Main Ideas',
          'Making Predictions'
        ]
      },
      {
        id: 'writing-skills',
        title: 'Writing Skills',
        description: 'Express your thoughts through creative writing',
        difficulty: 'Intermediate',
        estimatedTime: '35 min',
        icon: '✍️',
        lessons: [
          'Sentence Building',
          'Paragraph Writing',
          'Creative Stories',
          'Descriptive Writing',
          'Letter Writing'
        ]
      },
      {
        id: 'grammar-basics',
        title: 'Grammar Basics',
        description: 'Learn the building blocks of language',
        difficulty: 'Beginner',
        estimatedTime: '20 min',
        icon: '📝',
        lessons: [
          'Nouns and Verbs',
          'Adjectives',
          'Sentence Structure',
          'Punctuation',
          'Capital Letters'
        ]
      },
      {
        id: 'vocabulary',
        title: 'Vocabulary Building',
        description: 'Expand your word knowledge and usage',
        difficulty: 'Beginner',
        estimatedTime: '20 min',
        icon: '📚',
        lessons: [
          'New Words Daily',
          'Word Families',
          'Synonyms and Antonyms',
          'Context Clues',
          'Fun with Words'
        ]
      }
    ]
  }
];