import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, Play, CheckCircle, Lock, Star, Users, Clock } from 'lucide-react';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  // This must include ALL courses exactly as they appear in CoursesPage.js
  const allCourses = [
    {
      id: 1,
      title: 'Introduction to AI',
      description: 'Learn the basics of artificial intelligence in fun, interactive lessons',
      category: 'AI Basics',
      level: 'Beginner',
      duration: '2 hours',
      lessons: 8,
      enrolled: 1250,
      rating: 4.8,
      progress: 0,
      thumbnail: '🤖',
      color: 'from-blue-400 to-blue-600',
      completed: false,
      unlocked: true,
      skills: ['AI Concepts', 'Problem Solving', 'Critical Thinking']
    },
    {
      id: 2,
      title: 'AI in Everyday Life',
      description: 'Discover how AI works in apps, games, and devices you use daily',
      category: 'AI Basics',
      level: 'Beginner',
      duration: '1.5 hours',
      lessons: 6,
      enrolled: 980,
      rating: 4.9,
      progress: 0,
      thumbnail: '📱',
      color: 'from-green-400 to-green-600',
      completed: false,
      unlocked: true,
      skills: ['Real-world AI', 'Technology Awareness']
    },
    {
      id: 3,
      title: 'How Robots Think',
      description: 'Explore how robots make decisions and learn from their environment',
      category: 'Robotics',
      level: 'Beginner',
      duration: '2.5 hours',
      lessons: 10,
      enrolled: 756,
      rating: 4.7,
      progress: 0,
      thumbnail: '🤖',
      color: 'from-purple-400 to-purple-600',
      completed: false,
      unlocked: true,
      skills: ['Robot Logic', 'Sensors', 'Decision Making']
    },
    {
      id: 4,
      title: 'Machine Learning for Kids',
      description: 'Understand how computers learn and get smarter over time',
      category: 'Machine Learning',
      level: 'Intermediate',
      duration: '3 hours',
      lessons: 12,
      enrolled: 642,
      rating: 4.6,
      progress: 0,
      thumbnail: '🧠',
      color: 'from-indigo-400 to-indigo-600',
      completed: false,
      unlocked: true,
      skills: ['Pattern Recognition', 'Data Analysis', 'Algorithms']
    },
    {
      id: 5,
      title: 'Creative AI Art',
      description: 'Create amazing art and music with the help of artificial intelligence',
      category: 'AI Basics',
      level: 'Beginner',
      duration: '2 hours',
      lessons: 8,
      enrolled: 892,
      rating: 4.9,
      progress: 0,
      thumbnail: '🎨',
      color: 'from-pink-400 to-pink-600',
      completed: false,
      unlocked: true,
      skills: ['Creativity', 'AI Tools', 'Digital Art']
    },
    {
      id: 6,
      title: 'Coding Your First AI',
      description: 'Build simple AI programs using kid-friendly coding tools',
      category: 'Coding',
      level: 'Intermediate',
      duration: '4 hours',
      lessons: 15,
      enrolled: 523,
      rating: 4.8,
      progress: 0,
      thumbnail: '💻',
      color: 'from-orange-400 to-orange-600',
      completed: false,
      unlocked: true,
      skills: ['Programming', 'Logic', 'Problem Solving']
    },
    {
      id: 7,
      title: 'AI Ethics & Responsibility',
      description: 'Learn about using AI safely and responsibly in our world',
      category: 'Ethics',
      level: 'Intermediate',
      duration: '1.5 hours',
      lessons: 6,
      enrolled: 445,
      rating: 4.7,
      progress: 0,
      thumbnail: '⚖️',
      color: 'from-teal-400 to-teal-600',
      completed: false,
      unlocked: true,
      skills: ['Ethics', 'Responsibility', 'Critical Thinking']
    },
    {
      id: 8,
      title: 'Future of AI',
      description: 'Explore what AI might look like in the future and its possibilities',
      category: 'AI Basics',
      level: 'Advanced',
      duration: '2.5 hours',
      lessons: 10,
      enrolled: 334,
      rating: 4.8,
      progress: 0,
      thumbnail: '🚀',
      color: 'from-cyan-400 to-cyan-600',
      completed: false,
      unlocked: true,
      skills: ['Future Thinking', 'Innovation', 'Technology Trends']
    },
    {
      id: 9,
      title: 'Drawing Fundamentals',
      description: 'Learn the basics of drawing shapes, forms, and perspectives',
      category: 'Art & Design',
      level: 'Beginner',
      duration: '3 hours',
      lessons: 10,
      enrolled: 1200,
      rating: 4.7,
      progress: 0,
      thumbnail: '✏️',
      color: 'from-red-400 to-red-600',
      completed: false,
      unlocked: true,
      skills: ['Drawing', 'Perspective', 'Creativity']
    },
    {
      id: 10,
      title: 'Ancient Civilizations',
      description: 'Explore the wonders of ancient Egypt, Greece, and Rome',
      category: 'History',
      level: 'Beginner',
      duration: '2.5 hours',
      lessons: 8,
      enrolled: 950,
      rating: 4.6,
      progress: 0,
      thumbnail: '🏛️',
      color: 'from-amber-400 to-amber-600',
      completed: false,
      unlocked: true,
      skills: ['History', 'Culture', 'Ancient World']
    },
    {
      id: 11,
      title: 'Healthy Eating Habits',
      description: 'Learn about nutrition and how to make healthy food choices',
      category: 'Health & PE',
      level: 'Beginner',
      duration: '1.5 hours',
      lessons: 5,
      enrolled: 1100,
      rating: 4.8,
      progress: 0,
      thumbnail: '🍎',
      color: 'from-emerald-400 to-emerald-600',
      completed: false,
      unlocked: true,
      skills: ['Nutrition', 'Health', 'Wellness']
    },
    {
      id: 12,
      title: 'World Geography',
      description: 'Discover countries, cultures, and earth\'s amazing features',
      category: 'Geography',
      level: 'Beginner',
      duration: '3 hours',
      lessons: 12,
      enrolled: 850,
      rating: 4.5,
      progress: 0,
      thumbnail: '🌎',
      color: 'from-teal-400 to-teal-600',
      completed: false,
      unlocked: true,
      skills: ['Geography', 'Cultures', 'Earth Science']
    },
    {
      id: 13,
      title: 'Introduction to Programming',
      description: 'Learn basic coding concepts with fun, interactive projects',
      category: 'Computer Science',
      level: 'Beginner',
      duration: '4 hours',
      lessons: 15,
      enrolled: 1500,
      rating: 4.9,
      progress: 0,
      thumbnail: '👩‍💻',
      color: 'from-indigo-400 to-indigo-600',
      completed: false,
      unlocked: true,
      skills: ['Coding', 'Logic', 'Problem Solving']
    },
    {
      id: 14,
      title: 'Ecosystems & Wildlife',
      description: 'Explore different ecosystems and the animals that live there',
      category: 'Environmental Science',
      level: 'Beginner',
      duration: '2 hours',
      lessons: 7,
      enrolled: 780,
      rating: 4.7,
      progress: 0,
      thumbnail: '🌿',
      color: 'from-lime-400 to-lime-600',
      completed: false,
      unlocked: true,
      skills: ['Ecology', 'Conservation', 'Biology']
    },
    {
      id: 15,
      title: 'Music Theory Basics',
      description: 'Learn about rhythm, melody, and how music works',
      category: 'Music',
      level: 'Beginner',
      duration: '2 hours',
      lessons: 8,
      enrolled: 650,
      rating: 4.6,
      progress: 0,
      thumbnail: '🎼',
      color: 'from-violet-400 to-violet-600',
      completed: false,
      unlocked: true,
      skills: ['Music', 'Rhythm', 'Creativity']
    },
    {
      id: 16,
      title: 'Spanish for Beginners',
      description: 'Start learning Spanish with fun, interactive lessons',
      category: 'Languages',
      level: 'Beginner',
      duration: '3 hours',
      lessons: 10,
      enrolled: 920,
      rating: 4.8,
      progress: 0,
      thumbnail: '🇪🇸',
      color: 'from-sky-400 to-sky-600',
      completed: false,
      unlocked: true,
      skills: ['Spanish', 'Language', 'Communication']
    },
    {
      id: 17,
      title: 'Community & Citizenship',
      description: 'Learn about being a good citizen and helping your community',
      category: 'Social Studies',
      level: 'Beginner',
      duration: '1.5 hours',
      lessons: 5,
      enrolled: 600,
      rating: 4.5,
      progress: 0,
      thumbnail: '👥',
      color: 'from-rose-400 to-rose-600',
      completed: false,
      unlocked: true,
      skills: ['Citizenship', 'Community', 'Responsibility']
    }
  ];

  useEffect(() => {
    const foundCourse = allCourses.find(c => c.id === parseInt(courseId));
    
    if (foundCourse) {
      // Generate lessons for the found course
      const lessons = Array.from({ length: foundCourse.lessons }, (_, i) => ({
        id: i + 1,
        title: `${foundCourse.title} - Lesson ${i + 1}`,
        duration: `${Math.floor(Math.random() * 10) + 15} min`, // Random duration between 15-25 mins
        completed: i < 1, // First lesson completed
        locked: i > 1 // Lock lessons beyond index 1
      }));

      setCourse({
        ...foundCourse,
        lessons
      });
    } else {
      navigate('/'); // Redirect if course not found
    }
  }, [courseId, navigate]);

  const handleLessonClick = (lesson) => {
    if (lesson.locked) return;
    alert(`Now starting: ${lesson.title}`);
    // In a real app, you would navigate to the actual lesson content
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Courses
        </button>

        {/* Course Header */}
        <div className={`bg-gradient-to-r ${course.color} p-6 rounded-xl text-white mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-white text-opacity-90">{course.description}</p>
            </div>
            <div className="text-6xl">{course.thumbnail}</div>
          </div>
        </div>

        {/* Course Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen size={18} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{course.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star size={18} className="text-yellow-400 fill-current" />
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="font-medium">{course.rating}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={18} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Students</p>
                <p className="font-medium">{course.enrolled.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{course.duration}</p>
              </div>
            </div>
          </div>

          {/* Level Badge */}
          <div className="flex justify-between items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
              course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {course.level} Level
            </span>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Course Progress</h2>
            <span className="text-sm font-medium text-gray-600">
              {course.lessons.filter(l => l.completed).length} of {course.lessons.length} lessons completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className={`bg-gradient-to-r ${course.color} h-3 rounded-full`}
              style={{ width: `${(course.lessons.filter(l => l.completed).length / course.lessons.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{Math.round((course.lessons.filter(l => l.completed).length / course.lessons.length) * 100)}% Complete</span>
            <span>{course.duration} total</span>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Lessons</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {course.lessons.map((lesson, index) => (
              <div 
                key={lesson.id} 
                className={`p-6 transition-colors ${lesson.locked ? 'opacity-60' : 'hover:bg-gray-50 cursor-pointer'}`}
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 text-gray-400 font-medium w-8 text-center">{index + 1}</div>
                    <div>
                      <h3 className="font-medium text-gray-800">{lesson.title}</h3>
                      <p className="text-sm text-gray-500">{lesson.duration}</p>
                    </div>
                  </div>
                  <div>
                    {lesson.locked ? (
                      <Lock className="text-gray-400" size={20} />
                    ) : lesson.completed ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                        <Play size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Skills You'll Learn</h2>
          <div className="flex flex-wrap gap-2">
            {course.skills.map((skill, index) => (
              <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Start Course Button */}
        <div className="mt-6">
          <button 
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
              course.completed
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={() => {
              const firstIncomplete = course.lessons.find(l => !l.completed && !l.locked);
              if (firstIncomplete) handleLessonClick(firstIncomplete);
            }}
          >
            {course.completed ? (
              <>
                <CheckCircle size={16} />
                <span>Course Completed</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Start {course.lessons[0].completed ? 'Next' : 'First'} Lesson</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;