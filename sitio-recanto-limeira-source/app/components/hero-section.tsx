
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Button } from './ui/button';
import { MapPin, Users, Home, Waves, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 200]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToReservations = () => {
    const element = document.getElementById('reservas');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-300/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
            style={{
              left: `${10 + (i * 5) % 80}%`,
              top: `${20 + (i * 7) % 60}%`,
            }}
          />
        ))}
      </div>

      {/* Parallax Background com vídeo */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: y1 }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            // Se o vídeo falhar, ocultar ele e mostrar a imagem de fallback
            e.currentTarget.style.display = 'none';
          }}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Imagem de fallback caso o vídeo não carregue */}
        <Image
          src="https://cdn.abacus.ai/images/caa5f1ad-7878-4d3f-a1ea-1cf03c64dbba.png"
          alt="Sítio Recanto da Limeira - Vista da piscina e área externa"
          fill
          className="object-cover"
          priority
          style={{ zIndex: -1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      </motion.div>

      {/* Interactive overlay that follows mouse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 197, 94, 0.1), transparent 40%)`,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
      />

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center text-white px-4 max-w-4xl"
        style={{ y: y2 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.span
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(34, 197, 94, 0.5)',
                  '0 0 40px rgba(34, 197, 94, 0.8)', 
                  '0 0 20px rgba(34, 197, 94, 0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Sítio Recanto da <span className="text-green-400">Limeira</span>
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-3xl mb-4 font-semibold tracking-wide"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <motion.span
              animate={{ 
                color: ['#4ade80', '#22c55e', '#16a34a', '#22c55e', '#4ade80']
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              UM LUGAR ESPECIAL PARA MOMENTOS ÚNICOS
            </motion.span>
          </motion.p>

          <motion.p 
            className="text-lg md:text-xl mb-8 text-gray-200"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Localizado a 20km de Itabirito, próximo a Engenheiro Correa
          </motion.p>

          {/* Features with staggered animation */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { icon: Users, text: 'Até 20 pessoas', delay: 0 },
              { icon: Home, text: '8 quartos', delay: 0.1 },
              { icon: Waves, text: 'Piscina', delay: 0.2 },
              { icon: MapPin, text: '20km de Itabirito', delay: 0.3 }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.8 + item.delay,
                  type: 'spring',
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                >
                  <item.icon className="h-8 w-8 text-green-400 mb-2" />
                </motion.div>
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white shadow-xl w-full sm:w-auto px-8 py-4"
                onClick={scrollToReservations}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Fazer Reserva
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-black shadow-xl w-full sm:w-auto px-8 py-4"
                onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Conhecer Mais
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ 
          y: [0, 15, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: 'easeInOut'
        }}
      >
        <motion.div 
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center relative"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div 
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
            animate={{ 
              height: ['12px', '20px', '12px'],
              backgroundColor: ['rgba(255,255,255,0.5)', 'rgba(34,197,94,0.8)', 'rgba(255,255,255,0.5)']
            }}
            transition={{ 
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
