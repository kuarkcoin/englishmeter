// app/contact/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Başarılı
      setStatus('success');
      setFeedback('Your message has been sent successfully! We will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error: any) {
      setStatus('error');
      setFeedback(error.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl">
        <div className="card">
          <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
          <p className="text-center text-slate-600 mb-6">
            Have a question or feedback? Fill out the form below to get in touch with us.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>

            {feedback && (
              <p className={`mt-4 text-center text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {feedback}
              </p>
            )}
          </form>
        </div>
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-slate-600 hover:text-brand transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}