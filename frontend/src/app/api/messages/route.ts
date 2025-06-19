import { NextRequest, NextResponse } from 'next/server';
import { services } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const { serviceId, message } = await request.json();

    if (!serviceId || !message) {
      return NextResponse.json(
        { error: 'Service ID and message are required' },
        { status: 400 }
      );
    }


    const serviceMessage = await services.sendMessage(Number(serviceId), message, true);

    return NextResponse.json(serviceMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const serviceId = url.searchParams.get('serviceId');

    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    const messages = await services.getMessages(Number(serviceId));
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
} 