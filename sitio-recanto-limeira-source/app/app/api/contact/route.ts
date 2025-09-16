
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ContactData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data: ContactData = await request.json();
    
    const {
      name,
      email,
      phone,
      subject,
      message
    } = data;

    // Validações básicas
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de e-mail inválido' },
        { status: 400 }
      );
    }

    // Criar contato
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message
      }
    });

    return NextResponse.json({
      message: 'Mensagem enviada com sucesso',
      contact: {
        id: contact.id,
        createdAt: contact.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao enviar mensagem de contato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        subject: true,
        message: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Erro ao buscar mensagens de contato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
