import { CardsChat } from '@/components/chat';
import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/context/UserProvider';
import { timeStamp } from 'console';
import { MessageTypes } from '@/types/types';


const App = () => {
  const { userId, setUserId } = useUser()!;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');


  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);

        if (data.type === "USER_ID") {
          console.log("Received userId:", data.userId);
          setUserId(data.userId);
          return;
        }
        if(data.type === "PAIR_CONNECTED") {
          console.log("Received message:", data.message);
          setConnectionStatus('connected');
          return;
        }
        if(data.type === "PAIR_DISCONNECTED") {
          console.log("Received message:", data.message);
          setConnectionStatus('disconnected');
          return;
        }
        if(data.type === "MESSAGE") {
          console.log("Received message:", data.message);
          setMessages(prev => [...prev, {
            userId: data.content.userId,
            message: data.content.message,
            timeStamp: data.content.timeStamp
          }]);
          console.log("Messages:", messages);
          
          return;
        }
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
  }, [userId]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      socket?.close();
    };
  }, []);

  const handleReconnect = () => {
    setConnectionStatus('connecting');
    connectWebSocket();
  }
  const sendMessage =  (message: string) => {
    if (!message.trim()) return;
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        const messageData = JSON.stringify({
          type: "MESSAGE",
          content: {
            userId,
            message: message,
            timeStamp: Date.now()
          }
        });
         socket.send(messageData);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className='flex max-h-screen flex-col bg-white/30 p-6 md:p-10'>  
    {connectionStatus === 'connecting' && <p>Connecting...</p>}
    {connectionStatus === 'connected' && <CardsChat messages={messages} sendMessage={sendMessage} />}
    {connectionStatus === 'disconnected' && <p>Disconnected</p>}
    </div>
  );
};



export default App;