import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { ChatInput } from '@/components/ui/chat/chat-input';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import { Send, ChevronLeft, File, Download, Contact } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useDispatch, useSelector } from 'react-redux';
import { setBreadcrumb } from '@/redux/slices/breadcrumbSlice';
import { useTranslation } from 'react-i18next';
import { RootState } from '@/redux/store';
import { useNavigate } from 'react-router-dom';
import DeliveryNegotiateDialog from './delivery-negociate';

interface Contact {
  user_id: string;
  first_name: string;
  last_name: string;
  photo: string;
  message: string;
  time: string;
  online: boolean;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  fileUrl?: string;
  isRead: boolean;
  timestamp: string;
  __v?: number;
  isLoading?: boolean;
}

interface Messages {
  [key: string]: Message[];
}

const socketUrl = import.meta.env.VITE_API_BASE_URL;
const socket: Socket = io(socketUrl);

const ChatPage = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Messages>({});
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showContacts, setShowContacts] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const messageListRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.user.user);

  const myUserId = user?.user_id || '';
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.chat.home"), t("client.pages.office.chat.messaging")],
        links: ["/office/dashboard"],
      })
    );

    socket.emit('clientConnected', myUserId);

    socket.on('contacts', (contactsData: Contact[]) => {
      setContacts(contactsData);
    });

    socket.on('receiveMessage', (message: Message) => {
      console.log('Received message:', message);
    
      setMessages(prevMessages => {
        const contactId = message.senderId === myUserId ? message.receiverId : message.senderId;
    
        const contactMessages = prevMessages[contactId] || [];
    
        const existingMessageIndex = contactMessages.findIndex(msg => msg._id === message._id);
    
        let updatedContactMessages;
    
        if (existingMessageIndex !== -1) {
          console.log('Message already exists, updating it:', message);
          updatedContactMessages = [...contactMessages];
          updatedContactMessages[existingMessageIndex] = message;
        } else {
          console.log('Adding new message:', message);
          updatedContactMessages = [...contactMessages, message];
        }
    
        return {
          ...prevMessages,
          [contactId]: updatedContactMessages,
        };
      });
    
      scrollToBottom();
    });

    socket.on('messagesHistory', (receivedMessages: Message[]) => {
      if (selectedContact) {
        setMessages(prevMessages => ({
          ...prevMessages,
          [selectedContact]: receivedMessages,
        }));
        console.log('Messages history:', receivedMessages);
        scrollToBottom();
      }
    });

    return () => {
      socket.off('contacts');
      socket.off('receiveMessage');
      socket.off('messagesHistory');
    };
  }, [dispatch, t, selectedContact]);

  useEffect(() => {
    if (selectedContact && messages[selectedContact]) {
      scrollToBottom();
    }
  }, [selectedContact, messages]);

  useEffect(() => {
    const handleConnect = () => {
      console.log('🔌 Connected to socket:', socket.id);
      if (myUserId) {
        socket.emit('clientConnected', myUserId);
      }
    };
  
    socket.on('connect', handleConnect);
  
    return () => {
      socket.off('connect', handleConnect);
    };
  }, [myUserId]);

  const filteredContacts = contacts.filter(contact =>
    contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedContactInfo = contacts.find(contact => contact.user_id === selectedContact);

  const handleSendMessage = (messageContent: string) => {
    if (!selectedContact) return;

    if (selectedFile) {
      handleFileUpload();
      setSelectedFile(null);
    }
    socket.emit('sendMessage', { receiverId: selectedContact, content: messageContent });
    scrollToBottom();
  };

  const handleFileUpload = () => {
    if (!selectedContact || !selectedFile) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64File = reader.result as string;

      socket.emit('uploadFile', {
        receiverId: selectedContact,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        base64Data: base64File,
      });
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleContactClick = (contactId: string) => {
    setSelectedContact(contactId);
    if (window.innerWidth <= 768) {
      setShowContacts(false);
    }
    socket.emit('getMessages', { receiverId: contactId });
  };

  const handleBackClick = () => {
    setShowContacts(true);
    setSelectedContact(null);
  };

  const getFileType = (url: string) => {
    const urlObj = new URL(url);
    const prefix = urlObj.searchParams.get('prefix');
    if (prefix) {
      const fileName = prefix.split('/').pop();
      const extension = fileName?.split('.').pop()?.toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
        return 'image';
      }
    }
    return 'file';
  };

  return (
    <div className="flex h-[calc(100vh-150px)]">
      {(showContacts || window.innerWidth > 768) && (
        <div className="w-full lg:w-1/4 bg-background p-4">
          <h2 className="text-lg font-semibold mb-4">{t("client.pages.office.chat.discussions")}</h2>
          <Input
            type="text"
            placeholder={t("client.pages.office.chat.searchPlaceholder")}
            className="w-full p-2 mb-4 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ScrollArea className='h-[calc(100vh-230px)]'>
            <div className="space-y-2 mr-4">
              {filteredContacts.map((contact, index) => (
                <div
                  key={index}
                  className={`flex items-center p-2 cursor-pointer ${selectedContact === contact.user_id ? 'bg-background' : ''}`}
                  onClick={() => handleContactClick(contact.user_id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.photo} alt={contact.first_name} />
                      <AvatarFallback>{contact.first_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 ml-2">
                    <h3 className="font-semibold">{contact.first_name} {contact.last_name}</h3>
                    <p className="text-sm text-gray-600">{contact.message}</p>
                  </div>
                  <div className="text-xs text-gray-500">{contact.time}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      <div className={`flex-1 mb-8 ${showContacts && window.innerWidth <= 768 ? 'hidden' : ''}`}>
        {selectedContact ? (
          <>
            <div className="flex items-center mb-4">
              {window.innerWidth <= 768 && (
          <Button onClick={handleBackClick} className="mr-2" variant={"ghost"}>
            <ChevronLeft className="size-4" />
          </Button>
              )}
              <Avatar>
          <AvatarImage src={selectedContactInfo?.photo} alt={selectedContactInfo?.first_name} />
          <AvatarFallback>{selectedContactInfo?.first_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
          <h1 className="text-xl font-semibold">{selectedContactInfo?.first_name} {selectedContactInfo?.last_name}</h1>
          <p className="text-gray-600">{selectedContactInfo?.online ? t("client.pages.office.chat.online") : t("client.pages.office.chat.offline")}</p>
              </div>
              <DeliveryNegotiateDialog deliveryman_user_id={selectedContactInfo?.user_id || ""} />
            </div>
            <ScrollArea className="flex-1" style={{ height: `calc(100% - 48px)` }}>
              <ChatMessageList ref={messageListRef}>
          {messages[selectedContact]?.map((msg) => (
            <ChatBubble key={msg._id} variant={msg.senderId === selectedContact ? 'received' : 'sent'}>
              {msg.senderId !== myUserId && (
                <ChatBubbleAvatar src={selectedContactInfo?.photo} />
              )}
              <ChatBubbleMessage isLoading={msg.isLoading}>
                {msg.fileUrl ? (
            <div>
              {getFileType(msg.fileUrl) === 'image' ? (
                <img src={msg.fileUrl} alt="File" className="max-w-full h-auto" style={{ maxHeight: '300px' }} />
              ) : (
                <Button onClick={() => msg.fileUrl && navigate(msg.fileUrl)} className="flex items-center">
                  <Download className="mr-2" />
                  Télécharger un document
                </Button>
              )}
            </div>
                ) : (
            msg.content
                )}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
          <div ref={bottomRef}></div>
              </ChatMessageList>
            </ScrollArea>
            <form
              className="flex relative gap-2 mt-4"
              onSubmit={(e) => {
          e.preventDefault();
          const input = (e.target as HTMLFormElement).elements.namedItem('chatInput') as HTMLInputElement;
          handleSendMessage(input.value);
          input.value = '';
              }}
            >
              <ChatInput
          name="chatInput"
          className="min-h-12 bg-background shadow-none"
          placeholder={t("client.pages.office.chat.typeMessage")}
              />
              <Button
          className="absolute top-1/2 right-12 transform size-8 -translate-y-1/2"
          size="icon"
          type="button"
          onClick={() => document.getElementById('fileInput')?.click()}
              >
          <File className="size-4" />
              </Button>
              <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setSelectedFile(file);
              handleFileUpload();
            }
          }}
              />
              <Button
          className="absolute top-1/2 right-2 transform size-8 -translate-y-1/2"
          size="icon"
          type="submit"
              >
          <Send className="size-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
            <Contact
              size={32}
              className="text-muted-foreground/50 mb-2"
            />
            <h3 className="text-lg font-medium">{t("client.pages.office.chat.selectContact")}</h3>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
