import { CardsChat } from '@/components/chat';
import React, { useEffect, useState } from 'react';

interface Message {
  content: string;
  timestamp: number;
  type: 'user' | 'system';
}

const App = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setSocket(ws);
      setConnectionStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);
        setMessages(prev => [...prev, {
          content: data.message || data.content,
          timestamp: Date.now(),
          type: data.type === 'PAIR_CONNECTED' ? 'system' : 'user'
        }]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };

    ws.onclose = () => {
      console.log('Connection closed');
      setConnectionStatus('disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        const messageData = JSON.stringify({
          content: message,
          timestamp: Date.now()
        });
        socket.send(messageData);
        setInputMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className='flex max-h-screen flex-col bg-white/30 p-6 md:p-10'>  
      <CardsChat/>
    </div>
  );
};



export default App;