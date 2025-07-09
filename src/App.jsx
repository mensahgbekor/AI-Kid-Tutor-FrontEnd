import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import Features from "./pages/Features";
import HeroSection from "./pages/HeroSection";
import Pricing from "./pages/Pricing";
import ContactForm from "./pages/ContactForm";
import DashboardLayout from "./layouts/DashboardLayout";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetails";
import SubjectsPage from "./pages/SubjectsPage";
import LearningPage from "./pages/LearningPage";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "login", element: <LoginForm /> },
    { path: "register", element: <RegisterForm /> },
    { path: "about", element: <AboutPage /> },
    { path: "features", element: <Features /> },
    { path: "hero", element: <HeroSection /> },
    { path: "price", element: <Pricing /> },
    { path: "contact", element: <ContactForm /> },
    {path: "courses", element: <CoursesPage />},
    {path: "/course/:courseId" , element: <CourseDetailsPage />},
    {path: "subjects", element: <SubjectsPage />},
    {path: "/learning/:subjectId", element: <LearningPage />},
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <StudentDashboard />,
        },
      ],
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;