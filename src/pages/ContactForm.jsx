"use client"

import React, { useState } from "react"
import { Send, Sparkles, Heart } from "lucide-react"

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    age: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState("")

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert("Thanks for your message! We'll get back to you soon.")
    setIsSubmitting(false)
    setFormData({
      name: "",
      email: "",
      subject: "",
      age: "",
      message: "",
    })
  }

  const FloatingParticle = ({ delay = 0 }) => (
    <div
      className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 animate-pulse"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
    />
  )

  return (
    <section
      id="contact"
      className="relative py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} />
        ))}

        {/* Gradient Orbs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-16 -right-16 w-64 h-64 bg-gradient-to-br from-pink-300/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Sparkles className="h-6 w-6 text-purple-500 animate-spin" style={{ animationDuration: "3s" }} />
              <Heart className="absolute -top-1 -right-1 h-3 w-3 text-pink-500 animate-bounce" />
            </div>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold mb-4 relative">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent animate-pulse">
              Let's Connect
            </span>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-70 animate-ping" />
          </h2>

          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ready to unlock your child's potential? We're here to help create a personalized learning journey that
            sparks curiosity and builds confidence.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
            {/* Glowing Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 rounded-2xl blur-sm -z-10" />

            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl shadow-lg">
                <Send className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-bold ml-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Send us a message
              </h3>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative group">
                  <label className="block text-xs font-semibold text-gray-700 mb-1 transition-colors group-focus-within:text-purple-600">
                    Parent Name ✨
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField("")}
                    className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-300 bg-white/70 backdrop-blur-sm text-sm
                      ${
                        focusedField === "name"
                          ? "border-purple-400 ring-2 ring-purple-100 shadow-lg scale-105"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    placeholder="Your magical name"
                    required
                  />
                  {focusedField === "name" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
                  )}
                </div>

                <div className="relative group">
                  <label className="block text-xs font-semibold text-gray-700 mb-1 transition-colors group-focus-within:text-pink-600">
                    Email Address 💌
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-300 bg-white/70 backdrop-blur-sm text-sm
                      ${
                        focusedField === "email"
                          ? "border-pink-400 ring-2 ring-pink-100 shadow-lg scale-105"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    placeholder="your@email.com"
                    required
                  />
                  {focusedField === "email" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping" />
                  )}
                </div>
              </div>

              <div className="relative group">
                <label className="block text-xs font-semibold text-gray-700 mb-1 transition-colors group-focus-within:text-indigo-600">
                  What's on your mind? 💭
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("subject")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-300 bg-white/70 backdrop-blur-sm text-sm
                    ${
                      focusedField === "subject"
                        ? "border-indigo-400 ring-2 ring-indigo-100 shadow-lg scale-105"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  placeholder="Let's talk about..."
                  required
                />
              </div>

              <div className="relative group">
                <label className="block text-xs font-semibold text-gray-700 mb-1 transition-colors group-focus-within:text-purple-600">
                  Child's Age 🎂
                </label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("age")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-300 bg-white/70 backdrop-blur-sm text-sm
                    ${
                      focusedField === "age"
                        ? "border-purple-400 ring-2 ring-purple-100 shadow-lg scale-105"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                >
                  <option value="">Select age range</option>
                  <option value="3-5">3-5 years (Little Explorers)</option>
                  <option value="6-8">6-8 years (Curious Minds)</option>
                  <option value="9-12">9-12 years (Young Scholars)</option>
                  <option value="13+">13+ years (Future Leaders)</option>
                </select>
              </div>

              <div className="relative group">
                <label className="block text-xs font-semibold text-gray-700 mb-1 transition-colors group-focus-within:text-pink-600">
                  Tell us your story 📖
                </label>
                <textarea
                  rows="3"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-300 bg-white/70 backdrop-blur-sm resize-none text-sm
                    ${
                      focusedField === "message"
                        ? "border-pink-400 ring-2 ring-pink-100 shadow-lg scale-105"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                  placeholder="Share your child's dreams, goals, or any questions you have. We're here to listen and help! ✨"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm 
                         hover:from-purple-700 hover:via-pink-600 hover:to-indigo-700 
                         transform hover:scale-105 transition-all duration-300 shadow-xl 
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Sending your message...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Send Message
                    <Sparkles className="w-3 h-3 ml-2 animate-pulse" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm;
