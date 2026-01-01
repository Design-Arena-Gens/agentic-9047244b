'use client'

import { useState } from 'react'
import { Calendar, Clock, Sparkles, Twitter, Facebook, Instagram, Linkedin, Send, Plus, Trash2, Check } from 'lucide-react'
import { format, addDays } from 'date-fns'

type Platform = 'twitter' | 'facebook' | 'instagram' | 'linkedin'

interface ScheduledPost {
  id: string
  content: string
  platforms: Platform[]
  scheduledTime: Date
  status: 'pending' | 'posted'
}

const platformIcons = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
}

const platformColors = {
  twitter: 'bg-blue-500',
  facebook: 'bg-blue-600',
  instagram: 'bg-pink-500',
  linkedin: 'bg-blue-700',
}

const contentSuggestions = [
  "Just launched our new feature! 🚀 Check it out and let us know what you think.",
  "Monday motivation: Success is not final, failure is not fatal. Keep pushing forward! 💪",
  "Did you know? 73% of marketers believe social media is effective for their business. 📊",
  "Behind the scenes: Here's how we build amazing products for our customers. 🎯",
  "Weekend vibes! What are you working on this weekend? Share below! ✨",
  "Pro tip: Consistency is key to growing your social media presence. Post regularly! 📅",
  "Thank you to our amazing community! Your support means everything to us. ❤️",
  "New blog post alert! Learn how to automate your social media workflow. 🔗",
]

export default function Home() {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [scheduledDate, setScheduledDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [scheduledTime, setScheduledTime] = useState('12:00')
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const generateAISuggestion = () => {
    const randomSuggestion = contentSuggestions[Math.floor(Math.random() * contentSuggestions.length)]
    setContent(randomSuggestion)
    setShowSuggestions(false)
  }

  const schedulePost = () => {
    if (!content || selectedPlatforms.length === 0) {
      alert('Please enter content and select at least one platform')
      return
    }

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`)
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      content,
      platforms: selectedPlatforms,
      scheduledTime: scheduledDateTime,
      status: 'pending',
    }

    setScheduledPosts(prev => [...prev, newPost])
    setContent('')
    setSelectedPlatforms([])
    setScheduledDate(format(new Date(), 'yyyy-MM-dd'))
    setScheduledTime('12:00')
  }

  const deletePost = (id: string) => {
    setScheduledPosts(prev => prev.filter(post => post.id !== id))
  }

  const markAsPosted = (id: string) => {
    setScheduledPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, status: 'posted' as const } : post
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Social Media Automation
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Create, schedule, and automate your social media posts with AI-powered suggestions
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Content Creation Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Post</h2>
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                AI Suggest
              </button>
            </div>

            {showSuggestions && (
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-sm text-purple-800 dark:text-purple-300">AI Suggestions:</p>
                <button
                  onClick={generateAISuggestion}
                  className="w-full text-left p-3 bg-white dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-lg transition-colors text-sm"
                >
                  Click to generate a random suggestion
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Write your post here..."
                className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {content.length} characters
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Platforms
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(platformIcons) as Platform[]).map((platform) => {
                  const Icon = platformIcons[platform]
                  const isSelected = selectedPlatforms.includes(platform)
                  return (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? `${platformColors[platform]} text-white border-transparent shadow-lg scale-105`
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium capitalize">{platform}</span>
                      {isSelected && <Check className="w-5 h-5 ml-auto" />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={schedulePost}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              <Send className="w-5 h-5" />
              Schedule Post
            </button>
          </div>

          {/* Scheduled Posts Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Scheduled Posts</h2>

            {scheduledPosts.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No scheduled posts yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Create your first post to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {scheduledPosts
                  .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
                  .map((post) => (
                    <div
                      key={post.id}
                      className={`p-4 rounded-lg border-2 ${
                        post.status === 'posted'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                          : 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-2">
                          {post.platforms.map((platform) => {
                            const Icon = platformIcons[platform]
                            return (
                              <div
                                key={platform}
                                className={`${platformColors[platform]} p-2 rounded-full`}
                              >
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex gap-2">
                          {post.status === 'pending' && (
                            <button
                              onClick={() => markAsPosted(post.id)}
                              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                              title="Mark as posted"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deletePost(post.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            title="Delete post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {format(post.scheduledTime, 'MMM dd, yyyy')}
                          <Clock className="w-4 h-4 ml-2" />
                          {format(post.scheduledTime, 'h:mm a')}
                        </div>
                        {post.status === 'posted' && (
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                            Posted
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {scheduledPosts.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Posts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {scheduledPosts.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Scheduled</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {scheduledPosts.filter(p => p.status === 'posted').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Posted</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {new Set(scheduledPosts.flatMap(p => p.platforms)).size}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Platforms</div>
          </div>
        </div>
      </div>
    </div>
  )
}
