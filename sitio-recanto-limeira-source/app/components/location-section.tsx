

'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Navigation, Car, Clock } from 'lucide-react';

export default function LocationSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const locationDetails = [
    {
      icon: MapPin,
      title: 'Localização',
      description: 'Ouro Preto, Minas Gerais'
    },
    {
      icon: Navigation,
      title: 'Distância',
      description: '20km de Itabirito'
    },
    {
      icon: Car,
      title: 'Acesso',
      description: 'Próximo a Eng. Correa'
    },
    {
      icon: Clock,
      title: 'Trajeto',
      description: '~30min de carro'
    }
  ];

  return (
    <section id="localizacao" className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            <span className="text-green-600">Localização</span> Privilegiada
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Situado em uma região de beleza natural exuberante, com fácil acesso e 
            próximo aos principais pontos turísticos de Minas Gerais.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Mapa */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="shadow-xl border-green-100 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3744.4!2d-43.774891731239606!3d-20.350465073216462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDIxJzAxLjciUyA0M8KwNDYnMjkuNiJX!5e0!3m2!1spt-BR!2sbr!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  ></iframe>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-gray-800">Sítio Recanto da Limeira</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Detalhes da Localização */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Como Chegar
              </h3>
              
              {/* Cards de Informações */}
              <div className="grid grid-cols-2 gap-4">
                {locationDetails.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <Card className="border-green-100 hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-4 text-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <detail.icon className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">
                          {detail.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {detail.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Instruções de Acesso */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 flex items-center">
                    <Navigation className="h-5 w-5 mr-2 text-green-600" />
                    Instruções de Acesso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">1</span>
                      Siga pela BR-356 até Itabirito
                    </li>
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">2</span>
                      Continue em direção a Eng. Correa
                    </li>
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">3</span>
                      Siga as coordenadas: -20.350465, -43.774891
                    </li>
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">4</span>
                      Entre em contato para detalhes específicos
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Botão para abrir no Google Maps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <a
                  href="https://www.google.com/maps?q=-20.350465073216462,-43.774891731239606"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Abrir no Google Maps
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
