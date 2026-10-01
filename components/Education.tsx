
import React from 'react';
import { View } from '../App';

interface EducationProps {
  navigateTo?: (view: View) => void;
}

const Education: React.FC<EducationProps> = ({ navigateTo }) => {
  const topics = [
    { title: 'Crypto Basics', duration: '15 mins', category: 'Beginner', color: 'primary' },
    { title: 'Copy Trading 101', duration: '25 mins', category: 'Intermediate', color: 'secondary' },
    { title: 'Risk Management', duration: '20 mins', category: 'Essential', color: 'success' },
  ];

  const handleLessonStart = () => {
    if (navigateTo) navigateTo('faq');
  };

  return (
    <section id="education" className="py-32 bg-[hsl(var(--color-bg))] relative border-t border-[hsl(var(--color-border)/0.5)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20 anim-fade-in">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase italic leading-none">
            Velo <span className="velo-text-gradient inline-block">Academy</span>
          </h2>
          <p className="text-[hsl(var(--color-text-muted))] text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Learn how to build wealth from scratch with our professional-grade educational resources and real-world trading strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topics.map((topic, idx) => (
            <div 
              key={idx} 
              className={`group relative overflow-hidden p-10 rounded-[2.5rem] bg-[hsl(var(--color-surface)/0.3)] border border-[hsl(var(--color-border)/0.5)] hover:border-[hsl(var(--primary-500)/0.5)] transition-all duration-500 backdrop-blur-xl shadow-2xl anim-fade-in delay-${(idx + 1) * 100}`}
            >
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-20 transition-all duration-700 group-hover:-translate-x-4 group-hover:translate-y-4">
                 <svg className="w-40 h-40 text-[hsl(var(--primary-500))]" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
                 </svg>
              </div>
              
              <div className="relative z-10">
                <span className={`inline-block px-4 py-1.5 rounded-xl bg-[hsl(var(--color-bg))] border border-[hsl(var(--color-border))] text-[hsl(var(--color-text-muted))] text-[10px] font-black uppercase tracking-[0.2em] mb-6 group-hover:border-[hsl(var(--secondary-500)/0.5)] group-hover:text-white transition-all`}>
                  {topic.category}
                </span>
                <h3 className="text-3xl font-black text-white uppercase italic mb-4 tracking-tight group-hover:velo-text-gradient transition-all">{topic.title}</h3>
                <p className="text-[hsl(var(--color-text-muted))] text-base mb-8 leading-relaxed">Master the art of {topic.title.toLowerCase()} in just {topic.duration} with expert insights.</p>
                <button 
                  onClick={handleLessonStart}
                  className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[hsl(var(--secondary-400))] group-hover:text-white transition-all group/btn outline-none focus-visible:underline"
                >
                  Start Lesson
                  <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;

