import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/esm/socket';
import { TProfileDefault } from '../types/Profile';
import Back from '../assets/back.svg';
import Pfp from '../assets/pfp-two.svg';
import Send from '../assets/send.svg';
import useAuthContext from '../hooks/useAuthContext';
import TMessage from '../types/Message';

type Props = {
  profile: TProfileDefault;
  close: () => void;
};

function Chat({ profile, close }: Props) {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [message, setMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const auth = useAuthContext();

  function handleMessage(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;
    setMessage(target.value);
  }

  async function handleSend() {
    if (message) {
      try {
        const res = await fetch('/api/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiver: profile._id, message }),
        });
        if (res.ok) {
          setMessage('');
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    const newSocket = io(`http://localhost:${__PORT__}`, {
      autoConnect: false,
      auth: { id: auth.user?._id },
      withCredentials: true,
    });
    setSocket(newSocket);
    newSocket.connect();

    return () => {
      newSocket.disconnect();
      newSocket.off();
    };
  }, [auth]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (m: TMessage) => {
        setMessages([...messages, m]);
      });
    }
  }, [socket, messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 border-b-2 pb-2 shadow-sm pl-2 py-2">
        <button type="button" onClick={close} className="h-9 w-9">
          <Back height="100%" width="100%" fill="gray" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-12 w-12">
            <Pfp height="100%" width="100%" />
          </div>
          <p className="font-bold text-xl">{profile.fullName}</p>
        </div>
      </div>
      <div className="grow">
        {messages.map((msg) => {
          return (
            <div key={msg._id}>
              <p>{msg.message}</p>
            </div>
          );
        })}
      </div>
      <div className="p-2 flex items-center">
        <input
          type="text"
          autoComplete="off"
          className="bg-gray-200 h-9 p-2 rounded-full w-full"
          onChange={handleMessage}
          value={message}
        />
        <button className="h-8 w-8" type="button" onClick={handleSend}>
          <Send
            height="100%"
            width="100%"
            fill={message ? 'rgb(96 165 250)' : 'rgb(209 213 219)'}
          />
        </button>
      </div>
    </div>
  );
}

export default Chat;
