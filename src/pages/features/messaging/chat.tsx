import { useEffect, useState } from 'react';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { ChatInput } from '@/components/ui/chat/chat-input';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import { Send, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useDispatch } from 'react-redux';
import { setBreadcrumb } from '@/redux/slices/breadcrumbSlice';
import { useTranslation } from 'react-i18next';

const fakeContacts = [
  { name: 'Jacquenetta Slowgrave', message: 'Super ! J\'ai hâte.', time: '10 min', online: true, avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg' },
  { name: 'Nickola Peever', message: 'Ça semble parfait ! J\'attendais ça.', time: '40 min', online: false, avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg' },
  { name: 'Farand Hume', message: 'Que diriez-vous de 19h au nouveau restaurant italien ?', time: 'hier', online: false, avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg' },
  { name: 'Ossie Peasey', message: 'Salut Bonnie, oui, bien sûr ! À quelle heure ?', time: '13 jours', online: false, avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg' },
  { name: 'Hall Negri', message: 'Pas de souci ! Je vais réserver une table et...', time: '2 jours', online: false, avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg' },
  { name: 'Elyssa Segot', message: 'Salut, appelle-moi aujourd\'hui.', time: 'hier', online: false, avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg' },
  { name: 'Gil Wilfing', message: 'À tout à l\'heure !', time: '1 jour', online: false, avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg' },
  { name: 'Bab Cleaton', message: 'Si ça prend trop de temps, vous pouvez m\'envoyer un mail.', time: '3 heures', online: false, avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg' },
  { name: 'Janath Satch', message: 'À bientôt !', time: '1 jour', online: false, avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg' },
  { name: 'Janath Satch', message: 'À bientôt !', time: '1 jour', online: false, avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg' },
  { name: 'Janath Satch', message: 'À bientôt !', time: '1 jour', online: false, avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg' },
];

const fakeMessages: Record<string, { sender: string; message: string; isLoading?: boolean }[]> = {
  'Jacquenetta Slowgrave': [
    { sender: 'Jacquenetta Slowgrave', message: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?' },
    { sender: 'Utilisateur', message: 'Bonjour ! J\'ai besoin d\'aide pour quelque chose.' },
    { sender: 'Jacquenetta Slowgrave', message: 'Bien sûr, de quoi avez-vous besoin ?' },
    { sender: 'Utilisateur', message: 'J\'ai besoin de réserver un vol.' },
    { sender: 'Jacquenetta Slowgrave', message: 'Où souhaitez-vous aller ?' },
  ],
  'Nickola Peever': [
    { sender: 'Nickola Peever', message: 'Bien sûr, je peux vous aider. De quoi avez-vous besoin ?' },
    { sender: 'Utilisateur', message: 'J\'ai besoin de savoir comment réinitialiser mon mot de passe.' },
    { sender: 'Nickola Peever', message: 'Vous pouvez réinitialiser votre mot de passe en cliquant sur le lien "Mot de passe oublié" sur la page de connexion.' },
    { sender: 'Utilisateur', message: 'Merci, je vais essayer ça.' },
    { sender: 'Nickola Peever', message: 'Si vous avez d\'autres questions, n\'hésitez pas à demander !' },
  ],
  'Farand Hume': [
    { sender: 'Farand Hume', message: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?' },
    { sender: 'Utilisateur', message: 'J\'ai besoin de recommandations pour des restaurants.' },
    { sender: 'Farand Hume', message: 'Quel type de cuisine recherchez-vous ?' },
    { sender: 'Utilisateur', message: 'J\'ai envie de cuisine italienne.' },
    { sender: 'Farand Hume', message: 'Je vous recommande d\'essayer "La Cucina di Mamma" pour une cuisine italienne authentique.' },
  ],
  // Ajoutez d'autres messages pour les autres contacts ici
};

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<string | null>(fakeContacts[0].name);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState(fakeMessages);
  const [showContacts, setShowContacts] = useState(true);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.chat.home"), t("client.pages.office.chat.messaging")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  const filteredContacts = fakeContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedContactInfo = fakeContacts.find(contact => contact.name === selectedContact);

  const handleSendMessage = (message: string) => {
    if (!selectedContact) return;

    const newMessages = [...messages[selectedContact], { sender: 'Utilisateur', message }];
    setMessages({ ...messages, [selectedContact]: newMessages });
    console.log('Message envoyé:', message);

    setTimeout(() => {
      const response = { sender: selectedContact, message: 'Ceci est une réponse simulée.', isLoading: true };
      const updatedMessages = [...newMessages, response];
      setMessages({ ...messages, [selectedContact]: updatedMessages });

      setTimeout(() => {
        const finalMessages = updatedMessages.map(msg =>
          msg.isLoading ? { ...msg, isLoading: false } : msg
        );
        setMessages({ ...messages, [selectedContact]: finalMessages });
      }, 2000);
    }, 2000);
  };

  const handleContactClick = (contactName: string) => {
    setSelectedContact(contactName);
    if (window.innerWidth <= 768) {
      setShowContacts(false);
    }
  };

  const handleBackClick = () => {
    setShowContacts(true);
    setSelectedContact(null);
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
                  className={`flex items-center p-2 cursor-pointer ${selectedContact === contact.name ? 'bg-background' : ''}`}
                  onClick={() => handleContactClick(contact.name)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <span className="border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-primay">
                        <span className="sr-only">{t("client.pages.office.chat.online")}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex-1 ml-2">
                    <h3 className="font-semibold">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.message}</p>
                  </div>
                  <div className="text-xs text-gray-500">{contact.time}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      <div className={`flex-1 p-4 ${showContacts && window.innerWidth <= 768 ? 'hidden' : ''}`}>
        {selectedContact ? (
          <>
            <div className="flex items-center mb-4">
              {window.innerWidth <= 768 && (
                <Button onClick={handleBackClick} className="mr-2" variant={"ghost"}>
                  <ChevronLeft className="size-4" />
                </Button>
              )}
              <Avatar>
                <AvatarImage src={selectedContactInfo?.avatar} alt={selectedContactInfo?.name} />
                <AvatarFallback>{selectedContactInfo?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <h1 className="text-xl font-semibold">{selectedContactInfo?.name}</h1>
                <p className="text-gray-600">{selectedContactInfo?.online ? t("client.pages.office.chat.online") : t("client.pages.office.chat.offline")}</p>
              </div>
            </div>
            <ScrollArea className="flex-1" style={{ height: `calc(100% - 48px)` }}>
              <ChatMessageList>
                {messages[selectedContact]?.map((msg, index) => (
                  <ChatBubble key={index} variant={msg.sender === selectedContact ? 'received' : 'sent'}>
                    {msg.sender !== 'Utilisateur' && (
                      <ChatBubbleAvatar
                        src={selectedContactInfo?.avatar}
                      />
                    )}
                    <ChatBubbleMessage isLoading={msg.isLoading}>
                      {msg.message}
                    </ChatBubbleMessage>
                  </ChatBubble>
                ))}
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
                className="absolute top-1/2 right-2 transform size-8 -translate-y-1/2"
                size="icon"
                type="submit"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </>
        ) : (
          <p>{t("client.pages.office.chat.selectContact")}</p>
        )}
      </div>
    </div>
  );
}
