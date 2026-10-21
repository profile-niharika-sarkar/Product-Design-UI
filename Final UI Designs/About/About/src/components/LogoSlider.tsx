import React from 'react';

interface LogoItem {
  id: string;
  name: string;
  src: string;
}

const LOGOS: LogoItem[] = [
  {
    id: 'ai-for-good',
    name: 'AI for Good',
    src: '/Public/Brand%20Logos/1.png',
  },
  {
    id: '4rna',
    name: '4RNA Intelligence',
    src: '/Public/Brand%20Logos/2.png',
  },
  {
    id: 'georgia-ai-alliance',
    name: 'Georgia AI Alliance',
    src: '/Public/Brand%20Logos/3.png',
  },
  {
    id: 'amplified-concepts',
    name: 'Amplified Concepts',
    src: '/Public/Brand%20Logos/4.png',
  },
  {
    id: 'enterprise-technology-association',
    name: 'Enterprise Technology Association',
    src: '/Public/Brand%20Logos/5.png',
  },
  {
    id: 'sweetrush',
    name: 'SweetRush',
    src: '/Public/Brand%20Logos/6.png',
  },
  {
    id: 'workfast',
    name: 'Workfast Consulting',
    src: '/Public/Brand%20Logos/7.png',
  },
  {
    id: 'gwinnett-chamber',
    name: 'Gwinnett Chamber',
    src: '/Public/Brand%20Logos/c%20lo.png',
  },
  {
    id: 'coursera',
    name: 'Coursera',
    src: '/Public/Brand%20Logos/gwi.png',
  },
];

export const LogoSlider: React.FC = () => {
  const marqueeLogos = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <div className="w-full overflow-hidden py-4 select-none" aria-label="Client and partner organizations">
      <div className="flex animate-marquee gap-6 items-center">
        {marqueeLogos.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            title={logo.name}
            className="w-[160px] h-[64px] shrink-0 bg-[#091f33]/90 hover:bg-[#11314d] border border-slate-700/60 rounded flex items-center justify-center p-2 transition-all duration-200 hover:border-slate-500 shadow-sm"
          >
            <img
              src={logo.src}
              alt={logo.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
