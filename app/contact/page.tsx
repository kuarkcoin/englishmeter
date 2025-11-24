// app/contact/page.tsx
'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Temel validasyon (ekstra güvenlik)
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });

      // API yoksa (404) → Demo modu (geliştirme sırasında çok işine yarar)
      if (res.status === 404) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setStatus('success');
        setFeedback('Your message has been sent successfully! (Demo Mode – API not found)');
        resetForm();
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFeedback('Thank you! Your message has been sent. We’ll reply soon');
      resetForm();
    } catch (error: any) {
      setStatus('error');
      setFeedback(error.message || 'Something went wrong. Please try again later.');
      console.error('Contact form error:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
  };

  const isSubmitting = status === 'loading';
  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Have a question, suggestion, or just want to say hi? We’d love to hear from you!
          </p>
        </div>

        {/* Form Kartı */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting || isSuccess}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="John Doe"
                    aria-label="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting || isSuccess}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="john@example.com"
                    aria-label="Your email"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={isSubmitting || isSuccess}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Write your message here..."
                  aria-label="Your message"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`
                  w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-lg
                  transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg
                  ${
                    isSuccess
                      ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/30'
                  }
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Sending...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    Sent Successfully!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>

              {/* Feedback Message */}
              {feedback && (
                <div
                  className={`
                    mt-6 p-5 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500
                    ${status === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}
                  `}
                >
                  {status === 'success' ? (
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium">{feedback}</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Alt Bilgi */}
        <p className="text-center text-sm text-gray-500 mt-10">
          We usually reply within 24 hours
        </p>
      </div>
    </div>
  );
}
