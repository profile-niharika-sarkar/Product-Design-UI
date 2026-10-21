import React, { useState } from 'react';
import { X, Calendar, CheckCircle, Send, Sparkles } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'discovery' | 'speaking' | 'workshop';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialType = 'discovery',
}) => {
  const [inquiryType, setInquiryType] = useState<string>(initialType);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    estimatedDate: '',
    selectedTopic: 'Intro to AI for Small Business',
    notes: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0c2940] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[#f8c51c] text-xs font-bold uppercase tracking-wider block font-h2">
              The Bradbury Group
            </span>
            <h3 className="text-xl font-bold font-h2 text-white">
              {inquiryType === 'speaking'
                ? 'Book Paige to Speak'
                : inquiryType === 'workshop'
                ? 'Request an AI Workshop'
                : 'Book a Discovery Call'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold font-h2 text-[#0c2940]">
              Inquiry Received!
            </h4>
            <p className="text-sm text-slate-600 font-body leading-relaxed max-w-md mx-auto">
              Thank you, <strong>{formData.name || 'there'}</strong>. Paige and our learning team will review your request for{' '}
              <strong>{formData.organization || 'your organization'}</strong> and get back to you within 24 business hours.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-[#0c2940] text-white font-medium rounded-lg hover:bg-[#071d2e] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Type selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Engagement Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setInquiryType('discovery')}
                  className={`py-2 px-3 text-xs font-semibold rounded-md border text-center transition-all ${
                    inquiryType === 'discovery'
                      ? 'bg-[#0c2940] text-[#f8c51c] border-[#0c2940] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Discovery Call
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('speaking')}
                  className={`py-2 px-3 text-xs font-semibold rounded-md border text-center transition-all ${
                    inquiryType === 'speaking'
                      ? 'bg-[#0c2940] text-[#f8c51c] border-[#0c2940] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Book to Speak
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('workshop')}
                  className={`py-2 px-3 text-xs font-semibold rounded-md border text-center transition-all ${
                    inquiryType === 'workshop'
                      ? 'bg-[#0c2940] text-[#f8c51c] border-[#0c2940] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Workshop
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0c2940] focus:border-[#0c2940]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Work Email *
                </label>
                <input
                  required
                  type="email"
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0c2940] focus:border-[#0c2940]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Organization / Company *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Acorn Healthcare"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0c2940] focus:border-[#0c2940]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Date / Timeline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next Month / Q1 2027"
                  value={formData.estimatedDate}
                  onChange={(e) => setFormData({ ...formData, estimatedDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0c2940] focus:border-[#0c2940]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Primary Focus Topic
              </label>
              <select
                value={formData.selectedTopic}
                onChange={(e) => setFormData({ ...formData, selectedTopic: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0c2940] bg-white text-slate-900"
              >
                <option value="Intro to AI for Small Business">Intro to AI for Small Business</option>
                <option value="Working with AI as a Thought Partner">Working with AI as a Thought Partner</option>
                <option value="Prompting Foundations">Prompting Foundations</option>
                <option value="Building an AI Assistant (2-day workshop)">Building an AI Assistant (2-day workshop)</option>
                <option value="Running a Pilot Project That Scales">Running a Pilot Project That Scales</option>
                <option value="Funding the AI Journey">Funding the AI Journey</option>
                <option value="Executive AI Strategic Coaching">Executive AI Strategic Coaching</option>
                <option value="General Discovery & Assessment">General Discovery & Assessment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Additional Context or Goals
              </label>
              <textarea
                rows={3}
                placeholder="Tell us about where your team is on their AI journey and what measurable outcomes you are looking for..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0c2940] focus:border-[#0c2940]"
              ></textarea>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f8c51c] text-[#0c2940] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#eab308] transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit Request</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
