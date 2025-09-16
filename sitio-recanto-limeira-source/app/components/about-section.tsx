
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { 
  Home, Bath, Users, TreePine, 
  Waves, Car, Wifi, Coffee 
} from 'lucide-react';

export default function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    { icon: Home, label: '8 Quartos', description: 'Acomodações confortáveis' },
    { icon: Bath, label: '4 Banheiros', description: '2 internos + 2 externos' },
    { icon: Users, label: 'Até 20 Pessoas', description: 'Ideal para grupos' },
    { icon: TreePine, label: 'Natureza Exuberante', description: 'Mata preservada' },
    { icon: Waves, label: 'Piscina Privativa', description: 'Área de lazer completa' },
    { icon: Car, label: 'Estacionamento', description: 'Vagas suficientes' },
    { icon: Wifi, label: 'Internet', description: 'Wi-Fi disponível' },
    { icon: Coffee, label: 'Área Gourmet', description: 'Churrasqueira e cozinha' }
  ];

  return (
    <section id="sobre" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            Sobre o <span className="text-green-600">Sítio</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Um refúgio perfeito em meio à natureza exuberante de Minas Gerais.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Conforto e Natureza
            </h3>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                8 quartos espaçosos, 4 banheiros, 2 salas de estar e uma piscina 
                cercada pela exuberante natureza mineira.
              </p>
              <p>
                Capacidade para até 20 hóspedes. Ideal para confraternizações, 
                retiros familiares e celebrações especiais.
              </p>
            </div>
          </motion.div>

          {/* Imagem */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://cdn.abacus.ai/images/af08c9b3-6f88-4c45-8011-47b784fa6659.png"
                alt="Área externa noturna do Sítio Recanto da Limeira"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-white border-green-100">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{feature.label}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
