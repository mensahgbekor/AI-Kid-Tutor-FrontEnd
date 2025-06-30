import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  Brain, 
  Trophy, 
  Settings, 
  HelpCircle, 
  User, 
  Bell, 
  Star,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  MessageCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'lessons',
      label: 'AI Lessons',
      icon: BookOpen,
      path: '/lessons',
      submenu: [
        { id: 'basics', label: 'AI Basics', path: '/lessons/basics' },
        { id: 'robots', label: 'Robots & AI', path: '/lessons/robots' },
        { id: 'games', label: 'AI Games', path: '/lessons/games' }
      ]
    },
    {
      id: 'practice',
      label: 'Practice Zone',
      icon: Brain,
      path: '/practice',
      submenu: [
        { id: 'quizzes', label: 'Fun Quizzes', path: '/practice/quizzes' },
        { id: 'coding', label: 'Simple Coding', path: '/practice/coding' },
        { id: 'projects', label: 'Mini Projects', path: '/practice/projects' }
      ]
    },
    {
      id: 'games',
      label: 'AI Games',
      icon: Gamepad2,
      path: '/games'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      path: '/achievements'
    },
    {
      id: 'chat',
      label: 'AI Assistant',
      icon: MessageCircle,
      path: '/chat',
      badge: '2'
    }
  ];

  const userMenuItems = [
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      path: '/profile'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings'
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      path: '/help'
    }
  ];

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleItemClick = (item) => {
    setActiveSection(item.id);
    if (item.submenu) {
      toggleMenu(item.id);
    }
    // Close mobile menu when item is clicked
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const sidebarClasses = `
    ${isExpanded ? 'w-72' : 'w-20'} 
    bg-white shadow-xl border-r border-gray-200 
    transition-all duration-300 ease-in-out
    flex flex-col h-screen
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    fixed md:relative z-50
  `;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${!isExpanded && 'justify-center'}`}>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Brain className="text-white" size={24} />
              </div>
              {isExpanded && (
                <div>
                  <h1 className="text-lg font-bold text-gray-800">AI Kid Tutor</h1>
                  <p className="text-xs text-gray-500">Learning Made Fun!</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden md:block p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className={`flex items-center ${!isExpanded ? 'justify-center' : 'space-x-3'}`}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                E
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            {isExpanded && (
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Emma Johnson</p>
                <div className="flex items-center space-x-1">
                  <Star size={12} className="text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500">Level 3 Explorer</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-2 px-4">
            {navigationItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                    activeSection === item.id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <div className={`flex items-center ${!isExpanded ? 'justify-center w-full' : 'space-x-3'}`}>
                    <item.icon size={20} />
                    {isExpanded && (
                      <>
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {isExpanded && item.submenu && (
                    <div className="transition-transform duration-200">
                      {expandedMenus[item.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  )}
                </button>

                {/* Submenu */}
                {isExpanded && item.submenu && expandedMenus[item.id] && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveSection(subItem.id)}
                        className={`w-full flex items-center space-x-3 p-2 rounded-lg text-sm transition-colors ${
                          activeSection === subItem.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                      >
                        <div className="w-2 h-2 bg-current rounded-full opacity-50"></div>
                        <span>{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          {/* Notifications */}
          <button className={`w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ${!isExpanded && 'justify-center'}`}>
            <div className="relative">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            {isExpanded && <span className="ml-3 font-medium">Notifications</span>}
          </button>

          {/* User Menu Items */}
          {userMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              } ${!isExpanded && 'justify-center'}`}
            >
              <item.icon size={20} />
              {isExpanded && <span className="ml-3 font-medium">{item.label}</span>}
            </button>
          ))}

          {/* Logout */}
          <button className={`w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${!isExpanded && 'justify-center'}`}>
            <LogOut size={20} />
            {isExpanded && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;