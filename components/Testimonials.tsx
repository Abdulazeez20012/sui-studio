import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Lead Developer at DeFi Protocol',
      avatar: '👨‍💻',
      content: 'The real-time video collaboration feature is a game-changer. We can now pair program on smart contracts with our remote team seamlessly.',
      rating: 5,
      highlight: 'Video Collaboration',
    },
    {
      name: 'Sarah Martinez',
      role: 'Blockchain Architect',
      avatar: '👩‍💼',
      content: 'Resizable panels and customizable workspace make Sui Studio feel like a professional IDE. The attention to detail is impressive.',
      rating: 5,
      highlight: 'Customization',
    },
    {
      name: 'David Kim',
      role: 'Smart Contract Auditor',
      avatar: '🔒',
      content: 'The detailed error reporting with context and file locations saves me hours of debugging. Best Move IDE I\'ve used.',
      rating: 5,
      highlight: 'Error Reporting',
    },
    {
      name: 'Emma Thompson',
      role: 'NFT Project Founder',
      avatar: '🎨',
      content: 'Deployed my first NFT collection in under 10 minutes. The templates and one-click deployment are incredible!',
      rating: 5,
      highlight: 'Ease of Use',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Full-Stack Web3 Dev',
      avatar: '⚡',
      content: 'Screen sharing during code reviews is so smooth. The HD quality and low latency make it feel like we\'re in the same room.',
      rating: 5,
      highlight: 'Screen Sharing',
    },
    {
      name: 'Lisa Wang',
      role: 'DAO Contributor',
      avatar: '🌐',
      content: 'Finally, an IDE that understands Web3 development. The integrated wallet and gas analyzer are must-have features.',
      rating: 5,
      highlight: 'Web3 Integration',
    },
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sui-cyan/5 to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-sui-cyan/10 border border-sui-cyan/30 rounded-full text-sui-cyan text-sm font-semibold">
              💬 Loved by Developers
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-sui-cyan to-white bg-clip-text text-transparent">
            What Developers Say
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Join thousands of developers building the future of Web3 on Sui
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-dark-surface/50 backdrop-blur-sm border border-dark-border rounded-2xl p-8 hover:border-sui-cyan/50 transition-all duration-300 hover:shadow-neon-lg hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-sui-cyan" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-300 leading-relaxed mb-6 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Highlight Badge */}
              <div className="mb-4">
                <span className="px-3 py-1 bg-sui-cyan/10 border border-sui-cyan/30 rounded-full text-sui-cyan text-xs font-semibold">
                  {testimonial.highlight}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-sui-cyan to-blue-500 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-sui-cyan/0 to-sui-cyan/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-6">
            Join the community of developers building on Sui
          </p>
          <a
            href="/ide"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-neon text-black font-bold rounded-xl hover:shadow-neon-lg transition-all duration-300 hover:scale-105"
          >
            <span>Start Building Free</span>
            <Star className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
