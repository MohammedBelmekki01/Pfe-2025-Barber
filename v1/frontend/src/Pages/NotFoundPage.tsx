import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, Search, ArrowLeft, Zap, Star, Sparkles } from 'lucide-react';

function NotFoundPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const FloatingIcon = ({ Icon, className, delay = 0 }) => (
    <div 
      className={`absolute animate-pulse ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: '3s'
      }}
    >
      <Icon className="w-6 h-6 text-purple-400/30" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating icons */}
      <FloatingIcon Icon={Star} className="top-20 left-20" delay={0} />
      <FloatingIcon Icon={Sparkles} className="top-32 right-32" delay={1} />
      <FloatingIcon Icon={Zap} className="bottom-32 left-32" delay={2} />
      <FloatingIcon Icon={Star} className="bottom-20 right-20" delay={0.5} />

      {/* Mouse follower effect */}
      <div 
        className="fixed w-96 h-96 bg-gradient-radial from-purple-500/5 to-transparent rounded-full pointer-events-none z-10 transition-all duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>

      {/* Main content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* 404 Number with glassmorphism effect */}
          <div className="relative mb-8">
            <div className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-white/5 leading-none select-none animate-pulse">
              404
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Oops!
            </span>{' '}
            <span className="text-white">
              Page Not Found
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            The page you're looking for seems to have vanished into the digital void. 
            <br className="hidden md:block" />
            But don't worry, we'll help you find your way back!
          </p>

          {/* Alert component */}
          <div className={`mb-12 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <Alert className="bg-white/10 border-purple-500/30 backdrop-blur-sm max-w-md mx-auto">
              <Zap className="h-4 w-4 text-purple-400" />
              <AlertDescription className="text-gray-200">
                Don't panic! This happens to the best of us. Let's get you back on track.
              </AlertDescription>
            </Alert>
          </div>

          {/* Action buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Home Page
            </button>

          </div>

          {/* Footer text */}
          <div className={`mt-16 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-gray-500 text-sm">
              Error Code: 404 | Page Not Found | 
              <span className="text-purple-400 ml-1">Lost in cyberspace</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      {/* Animated dots */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default NotFoundPage;