import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Trophy, 
  BookOpen, 
  Play,
  Target,
  Zap,
  Gift,
  Crown,
  Heart,
  Flame,
  Award,
  Gamepad2,
  Clock,
  ChevronRight,
  Volume2,
  Settings,
  Home,
  User,
  Calendar,
  TrendingUp,
  Medal,
  Sparkles,
  Rainbow
} from 'lucide-react';

// Mock student data
const mockStudentData = {
  student: {
    id: 1,
    name: "Emma",
    age: 8,
    avatar: "👧",
    level: "Math Explorer",
    grade: "Grade 2",
    totalPoints: 2450,
    currentStreak: 7,
    maxStreak: 12,
    experience: 1250,
    nextLevelExp: 1500,
    joinDate: "2024-02-01"
  },
  todayGoal: {
    target: 3,
    completed: 2,
    pointsTarget: 150,
    pointsEarned: 120
  },
  recentAchievements: [
    { id: 1, name: "Math Wizard", icon: "🧙‍♀️", description: "Completed 10 math lessons", earnedAt: "2 hours ago", rarity: "rare" },
    { id: 2, name: "Reading Star", icon: "⭐", description: "Read 5 stories this week", earnedAt: "1 day ago", rarity: "common" },
    { id: 3, name: "Streak Master", icon: "🔥", description: "7-day learning streak", earnedAt: "Today", rarity: "epic" }
  ],
  subjects: [
    {
      id: 1,
      name: "Mathematics",
      icon: "🔢",
      color: "from-blue-400 to-blue-600",
      progress: 78,
      totalLessons: 25,
      completedLessons: 19,
      currentLesson: "Multiplication Magic",
      difficulty: "Medium",
      estimatedTime: "15 min",
      points: 850
    },
    {
      id: 2,
      name: "Reading",
      icon: "📚",
      color: "from-green-400 to-green-600",
      progress: 65,
      totalLessons: 20,
      completedLessons: 13,
      currentLesson: "Adventure Stories",
      difficulty: "Easy",
      estimatedTime: "20 min",
      points: 650
    },
    {
      id: 3,
      name: "Science",
      icon: "🔬",
      color: "from-purple-400 to-purple-600",
      progress: 45,
      totalLessons: 18,
      completedLessons: 8,
      currentLesson: "Amazing Animals",
      difficulty: "Easy",
      estimatedTime: "18 min",
      points: 400
    },
    {
      id: 4,
      name: "Art & Creativity",
      icon: "🎨",
      color: "from-pink-400 to-pink-600",
      progress: 82,
      totalLessons: 15,
      completedLessons: 12,
      currentLesson: "Color Mixing Fun",
      difficulty: "Easy",
      estimatedTime: "25 min",
      points: 720
    }
  ],
  quickGames: [
    { id: 1, name: "Number Ninja", icon: "🥷", difficulty: "Easy", points: 50, playTime: "5 min" },
    { id: 2, name: "Word Builder", icon: "🏗️", difficulty: "Medium", points: 75, playTime: "8 min" },
    { id: 3, name: "Shape Detective", icon: "🕵️", difficulty: "Easy", points: 40, playTime: "6 min" },
    { id: 4, name: "Memory Palace", icon: "🏰", difficulty: "Hard", points: 100, playTime: "10 min" }
  ],
  weeklyChallenge: {
    name: "Super Learner Week",
    description: "Complete 15 lessons this week",
    progress: 11,
    target: 15,
    reward: "Special Rainbow Badge 🌈",
    timeLeft: "2 days"
  },
  friends: [
    { id: 1, name: "Alex", avatar: "👦", points: 2200, status: "online" },
    { id: 2, name: "Sofia", avatar: "👧", points: 2680, status: "learning" },
    { id: 3, name: "Noah", avatar: "👦", points: 1950, status: "offline" }
  ]
};

const StudentDashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [animatePoints, setAnimatePoints] = useState(false);

  useEffect(() => {
    // Simulate point animation on load
    setTimeout(() => setAnimatePoints(true), 500);
  }, []);

  const StudentHeader = () => (
    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white p-6 rounded-2xl mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-5xl animate-bounce">{mockStudentData.student.avatar}</div>
            <div>
              <h1 className="text-2xl font-bold">Hi {mockStudentData.student.name}! 🌟</h1>
              <p className="text-purple-100">{mockStudentData.student.level} • {mockStudentData.student.grade}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className={`text-2xl font-bold ${animatePoints ? 'animate-pulse' : ''}`}>
                {mockStudentData.student.totalPoints.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-orange-300" />
              <span className="text-sm">{mockStudentData.student.currentStreak} day streak!</span>
            </div>
          </div>
        </div>
        
        {/* Progress to next level */}
        <div className="bg-white bg-opacity-20 rounded-full p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Level Progress</span>
            <span className="text-sm">{mockStudentData.student.experience}/{mockStudentData.student.nextLevelExp} XP</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(mockStudentData.student.experience / mockStudentData.student.nextLevelExp) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const TodayGoalCard = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Target className="h-5 w-5 mr-2 text-green-600" />
          Today's Goal
        </h3>
        <div className="text-2xl">🎯</div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Lessons Completed</span>
            <span className="font-bold text-gray-900">
              {mockStudentData.todayGoal.completed}/{mockStudentData.todayGoal.target}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(mockStudentData.todayGoal.completed / mockStudentData.todayGoal.target) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Points Earned</span>
            <span className="font-bold text-gray-900">
              {mockStudentData.todayGoal.pointsEarned}/{mockStudentData.todayGoal.pointsTarget}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(mockStudentData.todayGoal.pointsEarned / mockStudentData.todayGoal.pointsTarget) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {mockStudentData.todayGoal.completed >= mockStudentData.todayGoal.target && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 text-green-800">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">Goal Completed! 🎉</span>
          </div>
        </div>
      )}
    </div>
  );

  const SubjectCard = ({ subject }) => (
    <div
      className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => setSelectedSubject(subject)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${subject.color} flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
            {subject.icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              {subject.name}
            </h3>
            <p className="text-sm text-gray-600">{subject.completedLessons}/{subject.totalLessons} lessons</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 mb-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-bold text-gray-900">{subject.points}</span>
          </div>
          <span className="text-xs text-gray-500">{subject.progress}% complete</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Current: {subject.currentLesson}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            subject.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            subject.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {subject.difficulty}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${subject.color} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${subject.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{subject.estimatedTime}</span>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
          <Play className="h-4 w-4" />
          <span>Continue</span>
        </button>
      </div>
    </div>
  );

  const QuickGamesSection = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <Gamepad2 className="h-5 w-5 mr-2 text-pink-600" />
        Quick Games 🎮
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockStudentData.quickGames.map((game) => (
          <div
            key={game.id}
            className="text-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer group"
          >
            <div className="text-3xl mb-2 group-hover:animate-bounce">{game.icon}</div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">{game.name}</h4>
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-xs font-medium">{game.points}</span>
            </div>
            <p className="text-xs text-gray-600">{game.playTime}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const WeeklyChallengeCard = () => (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-purple-900 flex items-center">
          <Crown className="h-5 w-5 mr-2" />
          Weekly Challenge
        </h3>
        <div className="text-2xl">🏆</div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-bold text-purple-900 mb-1">{mockStudentData.weeklyChallenge.name}</h4>
        <p className="text-sm text-purple-700 mb-3">{mockStudentData.weeklyChallenge.description}</p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-purple-700">Progress</span>
          <span className="font-bold text-purple-900">
            {mockStudentData.weeklyChallenge.progress}/{mockStudentData.weeklyChallenge.target}
          </span>
        </div>
        <div className="w-full bg-purple-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(mockStudentData.weeklyChallenge.progress / mockStudentData.weeklyChallenge.target) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-purple-700">Reward: {mockStudentData.weeklyChallenge.reward}</p>
          <p className="text-xs text-purple-600">Time left: {mockStudentData.weeklyChallenge.timeLeft}</p>
        </div>
        <div className="text-3xl">🌈</div>
      </div>
    </div>
  );

  const AchievementsSection = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <Award className="h-5 w-5 mr-2 text-yellow-600" />
        Recent Achievements ✨
      </h3>
      <div className="space-y-3">
        {mockStudentData.recentAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-l-4 ${
              achievement.rarity === 'epic' ? 'border-purple-500 bg-purple-50' :
              achievement.rarity === 'rare' ? 'border-blue-500 bg-blue-50' :
              'border-green-500 bg-green-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-xs text-gray-500">{achievement.earnedAt}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {achievement.rarity}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FriendsSection = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <Heart className="h-5 w-5 mr-2 text-red-600" />
        Learning Friends 👫
      </h3>
      <div className="space-y-3">
        {mockStudentData.friends.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{friend.avatar}</div>
              <div>
                <h4 className="font-semibold text-gray-900">{friend.name}</h4>
                <div className="flex items-center space-x-2">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-sm text-gray-600">{friend.points} points</span>
                </div>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              friend.status === 'online' ? 'bg-green-500' :
              friend.status === 'learning' ? 'bg-blue-500' :
              'bg-gray-400'
            }`}></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StudentHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <TodayGoalCard />
            
            {/* Subjects Grid */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-purple-600" />
                Your Learning Journey 📚
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockStudentData.subjects.map((subject) => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            </div>
            
            <QuickGamesSection />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <WeeklyChallengeCard />
            <AchievementsSection />
            <FriendsSection />
          </div>
        </div>
      </div>

      {/* Subject Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${selectedSubject.color} flex items-center justify-center text-white text-4xl mx-auto mb-4`}>
                {selectedSubject.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedSubject.name}</h3>
              <p className="text-gray-600">{selectedSubject.currentLesson}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">Progress</p>
                  <p className="text-xl font-bold text-blue-900">{selectedSubject.progress}%</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Points</p>
                  <p className="text-xl font-bold text-green-900">{selectedSubject.points}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600">Completed</p>
                  <p className="text-xl font-bold text-purple-900">{selectedSubject.completedLessons}</p>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <p className="text-sm text-pink-600">Time</p>
                  <p className="text-xl font-bold text-pink-900">{selectedSubject.estimatedTime}</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`bg-gradient-to-r ${selectedSubject.color} h-4 rounded-full transition-all duration-500`}
                  style={{ width: `${selectedSubject.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedSubject(null)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className={`flex-1 px-4 py-3 bg-gradient-to-r ${selectedSubject.color} text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2`}>
                <Play className="h-4 w-4" />
                <span>Start Learning</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;