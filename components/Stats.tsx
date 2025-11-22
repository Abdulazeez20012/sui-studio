import React, { useEffect, useRef } from 'react';
import Section from './ui/Section';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';

const STATS = [
  { label: 'Active Developers', value: '12', suffix: 'k+' },
  { label: 'Contracts Deployed', value: '450', suffix: 'k+' },
  { label: 'Avg. Setup Time', value: '5', suffix: 's' },
  { label: 'Ecosystem Partners', value: '85', suffix: '+' },
];

const Counter = ({ value, suffix }: { value: string, suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(parseInt(value));
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return (
    <span className="flex justify-center">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
};

const Stats: React.FC = () => {
  return (
    <Section className="border-y border-white/5 bg-[#0E1217] relative overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
        {/* Vertical Dividers (Desktop) */}
        <div className="hidden md:block absolute left-1/4 top-4 bottom-4 w-px bg-white/5" />
        <div className="hidden md:block absolute left-2/4 top-4 bottom-4 w-px bg-white/5" />
        <div className="hidden md:block absolute left-3/4 top-4 bottom-4 w-px bg-white/5" />

        {STATS.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center group"
          >
            <div className="font-heading font-bold text-4xl md:text-5xl text-white mb-2 group-hover:text-sui-cyan transition-colors duration-500 drop-shadow-[0_0_15px_rgba(60,185,255,0.3)]">
              <Counter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-sm text-slate-500 uppercase tracking-widest font-medium group-hover:text-white transition-colors">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Stats;