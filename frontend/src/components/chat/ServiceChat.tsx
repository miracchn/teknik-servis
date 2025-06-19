'use client';

import { useEffect, useRef, useState } from 'react';
import { ServiceMessage } from '@/types';
import { toast } from 'react-hot-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ServiceChatProps {
  serviceId: number;
  messages: ServiceMessage[];
  onSendMessage: (message: string) => Promise<void>;
}

export function ServiceChat({ serviceId, messages, onSendMessage }: ServiceChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await onSendMessage(newMessage.trim());
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
      toast.error('Mesaj gönderilemedi');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Mesajlar</h2>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-4" ref={scrollAreaRef}>
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.is_from_customer ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.is_from_customer
                    ? 'bg-muted text-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-xs opacity-80 mt-1">
                  {new Date(message.created_at).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 rounded-md border-r border-b border-border/50 bg-gradient-to-br from-background/80 to-background/50 py-2.5 px-4 shadow-[1px_1px_2px_-1px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50"
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
} 