import { CardsChat } from '@/components/chat';
import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/context/UserProvider';
import { MessageTypes } from '@/types/types';
import ConnectingPage from '@/components/ConnectingPage';
import DisconnectedPage from '@/components/DisconnectedPage';
import { useNavigate } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';

const ChatPage = () => {
  const { user } = useUser()!;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [connectedUser, setConnectedUser] = useState<string | null>(null);
  const navigate = useNavigate()

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('wss://chatrandom-dljz.onrender.com');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setSocket(ws);
      ws.send(JSON.stringify({
        type: "CONNECT",
        user: user
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);

        if (data.type === "PAIR_CONNECTED") {
          console.log("Pair connected:", data.message);
          if (data.users[0] === user?.userName) {
            setConnectedUser(data.users[1]);
          } else {
            setConnectedUser(data.users[0]);
          }

          setConnectionStatus('connected');
        } else if (data.type === "PAIR_DISCONNECTED") {
          console.log("Disconnected:", data.message);
          setConnectionStatus('disconnected');
        } else if (data.type === "MESSAGE") {
          console.log("New chat message:", data.content);
          setMessages(prev => [...prev, {
            userId: data.content.userId,
            message: data.content.message,
            timeStamp: data.content.timeStamp
          }]);
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

    return ws;
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return;
    }
    const ws = connectWebSocket();
    return () => {
      ws.close();
    };
  }, [connectWebSocket, navigate, user]);

  const handleReconnect = () => {
    setConnectionStatus('connecting');
    const ws = connectWebSocket();
    setSocket(ws);
  };


  return (
    <div>
      {connectionStatus === 'error' && <ErrorPage/>}
      {connectionStatus === 'connecting' && <ConnectingPage />}
      {connectionStatus === 'connected' && (
        <CardsChat
          messages={messages}
          socket={socket}
          connectedUser={connectedUser}
        />
      )}
      {connectionStatus === 'disconnected' && (
        <DisconnectedPage handleReconnect={handleReconnect} />
      )}
    </div>
  );
};

export default ChatPage;
