

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, ArrowRight, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminAccessCard() {
  const { data: session } = useSession();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Card className="bg-gradient-to-r from-green-600 to-green-700 border-0 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="text-white">
              <p className="text-sm font-semibold">Área do Proprietário</p>
              <p className="text-xs text-green-100">
                {session ? 'Bem-vindo de volta!' : 'Acesso exclusivo'}
              </p>
            </div>
            {session ? (
              <Link href="/admin/dashboard">
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="bg-white text-green-700 hover:bg-gray-100"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Dashboard
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            ) : (
              <Link href="/admin/login">
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="bg-white text-green-700 hover:bg-gray-100"
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Entrar
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

