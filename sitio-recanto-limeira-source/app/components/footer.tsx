
'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Shield, Settings } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Footer() {
  const { data: session } = useSession();
  
  const handleWhatsAppClick = () => {
    const message = 'Olá! Tenho interesse no Sítio Recanto da Limeira.';
    window.open(generateWhatsAppLink(message), '_blank');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Informações do Sítio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              Sítio Recanto da Limeira
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Refúgio perfeito para momentos inesquecíveis em meio à natureza 
              exuberante de Minas Gerais. Capacidade para até 20 pessoas.
            </p>
            <div className="flex items-center text-gray-300 mb-2">
              <MapPin className="h-4 w-4 mr-2 text-green-400" />
              <span className="text-sm">20km de Itabirito, próximo a Eng. Correa - MG</span>
            </div>
          </motion.div>

          {/* Links Rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-green-400">Links Rápidos</h4>
            <ul className="space-y-2">
              {[
                { label: 'Início', id: 'inicio' },
                { label: 'Sobre o Sítio', id: 'sobre' },
                { label: 'Galeria', id: 'galeria' },
                { label: 'Fazer Reserva', id: 'reservas' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contato */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-green-400">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2 text-green-400" />
                <span className="text-sm">(31) 99467-4730</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2 text-green-400" />
                <span className="text-sm">drarenatacamposdermato@gmail.com</span>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="border-t border-gray-700 pt-8 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Sítio Recanto da Limeira. Todos os direitos reservados.
            </p>
            
            {/* Link discreto para área administrativa */}
            <Link
              href={session ? "/admin/dashboard" : "/admin/login"}
              className="text-gray-500 hover:text-gray-300 transition-colors text-xs flex items-center gap-1 opacity-50 hover:opacity-100"
            >
              <Shield className="h-3 w-3" />
              <span className="hidden sm:inline">
                {session ? "Painel Admin" : "Acesso Restrito"}
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
