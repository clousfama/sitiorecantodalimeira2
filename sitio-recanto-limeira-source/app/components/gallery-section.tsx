
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { Card } from './ui/card';
import { sitioImages } from '@/lib/images';
import { X } from 'lucide-react';

export default function GallerySection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Mostrar todas as imagens sempre, sem filtros
  const allImages = sitioImages;

  return (
    <section id="galeria" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            <span className="text-green-600">Galeria</span> de Fotos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conheça os espaços do Sítio Recanto da Limeira.
          </p>
        </motion.div>



        {/* Gallery Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {allImages && allImages.length > 0 ? (
            allImages.map((image, index) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div 
                    className="relative aspect-[4/3] bg-gray-200"
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 6}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Nenhuma imagem encontrada para esta categoria.</p>
            </div>
          )}
        </motion.div>

        {/* Modal */}
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-12 right-0 text-white hover:text-green-400 transition-colors z-10"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-8 w-8" />
              </button>
              <div className="relative aspect-video w-full">
                <Image
                  src={allImages[selectedImage]?.src || ''}
                  alt={allImages[selectedImage]?.alt || ''}
                  fill
                  className="object-contain"
                />
              </div>

            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
