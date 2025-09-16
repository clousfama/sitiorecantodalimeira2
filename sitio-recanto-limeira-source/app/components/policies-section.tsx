
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  CreditCard,
  FileText
} from 'lucide-react';

export default function PoliciesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const policies = [
    {
      icon: Clock,
      title: 'Horários',
      items: [
        'Check-in: 10:00',
        'Check-out: 16:00',
        'Solicitações especiais sujeitas à disponibilidade'
      ]
    },
    {
      icon: CreditCard,
      title: 'Pagamento',
      items: [
        'Entrada de 50% obrigatória para confirmação',
        'Restante no check-in',
        'PIX, transferência ou dinheiro'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Cancelamento',
      items: [
        'Desistência: nova data oferecida',
        'Cancelamento < 30 dias: taxa de 20%',
        'Alteração sujeita à disponibilidade'
      ]
    },
    {
      icon: FileText,
      title: 'Regras Gerais',
      items: [
        'Máximo 20 pessoas',
        'Aceita animais de pequeno porte',
        'Silêncio após 22:00',
        'Responsabilidade por danos'
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            Políticas e <span className="text-green-600">Regras</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Para garantir uma experiência agradável para todos, 
            seguimos algumas políticas simples e transparentes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-green-100">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <policy.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl text-center text-gray-800">
                    {policy.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {policy.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Política de Cancelamento Detalhada */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="shadow-xl border-green-100 bg-green-50">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-800">
                Política de Cancelamento Detalhada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-6 flex items-center justify-center text-xl">
                  <FileText className="h-6 w-6 mr-2 text-green-600" />
                  Políticas de Cancelamento
                </h4>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Em caso de desistência será oferecida pelo Locador outra data para a locação</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Caso o Locatário não tenha interesse ou cancelamento com menos de 30 dias: taxa de 20%</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Alterações de datas sujeitas à disponibilidade</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
