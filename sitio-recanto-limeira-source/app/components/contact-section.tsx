
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ContactData } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/utils';

export default function ContactSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [formData, setFormData] = useState<ContactData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppClick = () => {
    const message = 'Olá! Tenho interesse no Sítio Recanto da Limeira. Poderiam me ajudar com mais informações?';
    window.open(generateWhatsAppLink(message), '_blank');
  };

  return (
    <section id="contato" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            Entre em <span className="text-green-600">Contato</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tem alguma dúvida ou precisa de informações adicionais? 
            Estamos aqui para ajudar você a planejar sua estadia perfeita.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Informações de Contato */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="shadow-xl border-green-100 h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800 mb-4">
                  Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Responsável</h3>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-800 mb-4">Renata</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <span className="text-gray-600">WhatsApp:</span>
                          <p className="font-semibold text-gray-800">(31) 99467-4730</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <span className="text-gray-600">E-mail:</span>
                          <p className="font-semibold text-gray-800">drarenatacamposdermato@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Localização</h3>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-green-600 mr-3 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        20 km de Itabirito<br />
                        Próximo a Engenheiro Correa<br />
                        Minas Gerais, Brasil
                      </p>
                    </div>
                  </div>
                </div>


              </CardContent>
            </Card>
          </motion.div>

          {/* Formulário de Contato */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="shadow-xl border-green-100">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Envie uma Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      name="name"
                      type="text"
                      placeholder="Seu nome"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-12 border-green-200 focus:border-green-500"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Seu e-mail"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-12 border-green-200 focus:border-green-500"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Telefone (opcional)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-12 border-green-200 focus:border-green-500"
                    />
                  </div>

                  <Input
                    name="subject"
                    type="text"
                    placeholder="Assunto"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="border-green-200 focus:border-green-500"
                  />

                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea
                      name="message"
                      placeholder="Sua mensagem"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="pl-12 border-green-200 focus:border-green-500 min-h-[120px]"
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800">
                        Mensagem enviada com sucesso! Entraremos em contato em breve.
                      </span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      <span className="text-red-800">
                        Erro ao enviar mensagem. Tente novamente.
                      </span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
