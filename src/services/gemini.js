// Google Gemini AI Integration Service
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Configuration for different AI models
const MODEL_CONFIGS = {
  'gemini-2.0-flash-exp': {
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  }
};

// Get model instance
const getModel = (modelName = 'gemini-2.0-flash-exp') => {
  return genAI.getGenerativeModel({
    model: modelName,
    ...MODEL_CONFIGS[modelName]
  });
};

// Generate educational content for children
export const generateLearningContent = async (topic, ageGroup, difficulty = 'beginner') => {
  try {
    const model = getModel();
    
    const prompt = `
    Create engaging educational content about "${topic}" for children aged ${ageGroup}.
    
    Requirements:
    - Difficulty level: ${difficulty}
    - Use simple, age-appropriate language
    - Include fun facts and examples
    - Make it interactive and engaging
    - Add emojis to make it more appealing
    - Structure with clear headings and bullet points
    - Include 2-3 questions to check understanding
    
    Format the response as a structured lesson with:
    1. Introduction (hook the child's interest)
    2. Main content (3-4 key points)
    3. Fun facts
    4. Real-world examples
    5. Check your understanding (questions)
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating learning content:', error);
    throw new Error('Failed to generate learning content');
  }
};

// Generate quiz questions
export const generateQuizQuestions = async (subject, topic, difficulty = 'beginner', questionCount = 5) => {
  try {
    const model = getModel();
    
    const prompt = `
    Generate ${questionCount} multiple-choice quiz questions about "${topic}" in ${subject} for children.
    
    Requirements:
    - Difficulty: ${difficulty}
    - Age-appropriate language
    - 4 options per question (A, B, C, D)
    - Only one correct answer per question
    - Include brief explanations for correct answers
    - Make questions engaging and fun
    
    Return as JSON array with this structure:
    [
      {
        "id": 1,
        "question": "Question text here?",
        "options": [
          {"id": "A", "text": "Option A", "isCorrect": false},
          {"id": "B", "text": "Option B", "isCorrect": true},
          {"id": "C", "text": "Option C", "isCorrect": false},
          {"id": "D", "text": "Option D", "isCorrect": false}
        ],
        "explanation": "Brief explanation of why B is correct"
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw new Error('Failed to generate quiz questions');
  }
};

// Analyze learning performance and provide recommendations
export const analyzePerformance = async (childProfile, recentSessions, quizResults) => {
  try {
    const model = getModel();
    
    const prompt = `
    Analyze the learning performance for a ${childProfile.age}-year-old child and provide personalized recommendations.
    
    Child Profile:
    - Age: ${childProfile.age}
    - Interests: ${childProfile.interests?.join(', ') || 'Not specified'}
    - Learning preferences: ${JSON.stringify(childProfile.learning_preferences)}
    
    Recent Performance:
    - Sessions completed: ${recentSessions.length}
    - Average completion rate: ${recentSessions.reduce((acc, s) => acc + s.completion_percentage, 0) / recentSessions.length || 0}%
    - Quiz average score: ${quizResults.reduce((acc, q) => acc + q.score_percentage, 0) / quizResults.length || 0}%
    
    Provide analysis and recommendations in JSON format:
    {
      "strengths": ["strength1", "strength2"],
      "areasForImprovement": ["area1", "area2"],
      "recommendations": [
        {
          "type": "next_lesson",
          "title": "Recommendation title",
          "description": "Detailed description",
          "priority": "high|medium|low"
        }
      ],
      "motivationalMessage": "Encouraging message for the child",
      "parentInsights": "Insights for parents"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error analyzing performance:', error);
    throw new Error('Failed to analyze performance');
  }
};

// Generate personalized learning path
export const generateLearningPath = async (childProfile, currentLevel, targetSkills) => {
  try {
    const model = getModel();
    
    const prompt = `
    Create a personalized learning path for a ${childProfile.age}-year-old child.
    
    Child Profile:
    - Age: ${childProfile.age}
    - Current level: ${currentLevel}
    - Interests: ${childProfile.interests?.join(', ') || 'General'}
    - Learning style: ${JSON.stringify(childProfile.learning_preferences)}
    
    Target Skills: ${targetSkills.join(', ')}
    
    Create a structured learning path with 8-12 steps, each building on the previous one.
    
    Return as JSON:
    {
      "pathName": "Descriptive path name",
      "estimatedDays": 30,
      "steps": [
        {
          "stepNumber": 1,
          "title": "Step title",
          "description": "What the child will learn",
          "activities": ["activity1", "activity2"],
          "estimatedTime": "20 minutes",
          "skills": ["skill1", "skill2"]
        }
      ],
      "milestones": [
        {
          "step": 4,
          "title": "Milestone title",
          "reward": "Badge or certificate"
        }
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error generating learning path:', error);
    throw new Error('Failed to generate learning path');
  }
};

// Generate adaptive difficulty adjustment
export const generateDifficultyAdjustment = async (childId, subject, performanceHistory) => {
  try {
    const model = getModel();
    
    const prompt = `
    Analyze performance history and recommend difficulty adjustment for a child learning ${subject}.
    
    Performance History (last 10 sessions):
    ${JSON.stringify(performanceHistory)}
    
    Provide recommendation in JSON format:
    {
      "currentDifficulty": "beginner|intermediate|advanced",
      "recommendedDifficulty": "beginner|intermediate|advanced",
      "adjustmentReason": "Explanation for the adjustment",
      "confidence": 0.85,
      "nextTopics": ["topic1", "topic2"],
      "supportStrategies": ["strategy1", "strategy2"]
    }
    
    Consider:
    - Consistent high scores (>85%) = increase difficulty
    - Consistent low scores (<60%) = decrease difficulty
    - Inconsistent scores = maintain current level with support
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error generating difficulty adjustment:', error);
    throw new Error('Failed to generate difficulty adjustment');
  }
};

// Generate motivational feedback
export const generateMotivationalFeedback = async (childProfile, achievement) => {
  try {
    const model = getModel();
    
    const prompt = `
    Generate encouraging and motivational feedback for a ${childProfile.age}-year-old child who just ${achievement}.
    
    Requirements:
    - Age-appropriate language
    - Positive and encouraging tone
    - Specific to the achievement
    - Include emojis
    - Keep it brief but meaningful
    - Suggest what to try next
    
    Child's name: ${childProfile.name}
    Achievement: ${achievement}
    
    Generate 3 different versions of motivational messages.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating motivational feedback:', error);
    throw new Error('Failed to generate motivational feedback');
  }
};

// Chat with AI tutor
export const chatWithTutor = async (childProfile, message, conversationHistory = []) => {
  try {
    const model = getModel();
    
    const prompt = `
    You are an AI tutor for children. Respond to the child's message in a helpful, encouraging, and age-appropriate way.
    
    Child Profile:
    - Name: ${childProfile.name}
    - Age: ${childProfile.age}
    - Interests: ${childProfile.interests?.join(', ') || 'Learning'}
    
    Conversation History:
    ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    
    Child's message: "${message}"
    
    Guidelines:
    - Be friendly and encouraging
    - Use age-appropriate language
    - Include emojis to make it fun
    - Ask follow-up questions to keep them engaged
    - Provide educational value when possible
    - Keep responses concise but helpful
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in AI tutor chat:', error);
    throw new Error('Failed to get AI tutor response');
  }
};

// Error handling wrapper
export const withErrorHandling = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`AI Service Error: ${error.message}`);
      
      // Fallback responses for different functions
      if (fn === generateLearningContent) {
        return "I'm having trouble generating content right now. Please try again later! 🤖";
      }
      if (fn === generateQuizQuestions) {
        return [];
      }
      if (fn === chatWithTutor) {
        return "I'm having a little trouble right now, but I'm still here to help! Can you try asking me again? 😊";
      }
      
      throw error;
    }
  };
};

// Export wrapped functions with error handling
export const safeGenerateLearningContent = withErrorHandling(generateLearningContent);
export const safeGenerateQuizQuestions = withErrorHandling(generateQuizQuestions);
export const safeChatWithTutor = withErrorHandling(chatWithTutor);