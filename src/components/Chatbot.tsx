import { useState } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ConversationState {
  stage: 'initial' | 'anxious' | 'grounding' | 'mood_tracking' | 'tea_suggestion' | 'reminder';
  moodRating?: number;
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there, welcome back 🌼 How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [conversationState, setConversationState] = useState<ConversationState>({
    stage: 'initial'
  });

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        text: getLunaResponse(input, conversationState),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getLunaResponse = (userInput: string, state: ConversationState): string => {
    const input = userInput.toLowerCase();

    switch (state.stage) {
      case 'initial':
        if (input.includes('anxious') || input.includes('stressed') || input.includes('worried')) {
          setConversationState({ stage: 'anxious' });
          return "I'm really glad you told me. Would you like to try a 5-minute grounding exercise to help with that?";
        }
        return "I'm here to listen. How are you really feeling today?";

      case 'anxious':
        if (input.includes('sure') || input.includes('yes') || input.includes('okay')) {
          setConversationState({ stage: 'grounding' });
          return "Great. Let's start by taking a deep breath together. Inhale… 1, 2, 3… and exhale… 1, 2, 3.\n(You can close your eyes if you're comfortable.)\nNow, name one thing you can see, one thing you can hear, and one thing you can feel.";
        }
        return "That's okay. Would you like to try a quick grounding exercise? It might help.";

      case 'grounding':
        setConversationState({ stage: 'mood_tracking' });
        return "Perfect. You're doing great. This small check-in grounds you in the present. 🌿\nWould you like to journal about this moment or track your mood for today?";

      case 'mood_tracking':
        if (input.includes('track') || input.includes('mood')) {
          setConversationState({ stage: 'mood_rating' });
          return "Got it! On a scale from 1 (low) to 5 (high), how would you rate your mood right now?";
        }
        return "Would you like to track your mood or journal about this moment?";

      case 'mood_rating':
        const rating = parseInt(input);
        if (!isNaN(rating) && rating >= 1 && rating <= 5) {
          setConversationState({ stage: 'tea_suggestion', moodRating: rating });
          return "Thanks for sharing. I've logged your mood as a " + rating + ".\nWould you like a suggestion for a calming tea or a gentle yoga stretch?";
        }
        return "Please rate your mood from 1 to 5.";

      case 'tea_suggestion':
        if (input.includes('tea')) {
          setConversationState({ stage: 'reminder' });
          return "🍵 How about chamomile or lemon balm? Both are soothing. I'll add \"Tea break\" to your wellness to-do list.\nWould you like me to remind you in 15 minutes?";
        }
        return "Would you like a tea suggestion or a gentle yoga stretch?";

      case 'reminder':
        if (input.includes('yes') || input.includes('sure') || input.includes('okay')) {
          setConversationState({ stage: 'initial' });
          return "Done! I'll check in then 😊 Remember, even small moments of calm can make a big difference.";
        }
        return "Would you like me to set a reminder for your tea break?";

      default:
        setConversationState({ stage: 'initial' });
        return "How are you feeling today?";
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 600, 
      margin: 'auto', 
      height: '80vh', 
      display: 'flex', 
      flexDirection: 'column',
      p: 2
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          mb: 2, 
          overflow: 'auto',
          p: 2,
          backgroundColor: '#f5f5f5'
        }}
      >
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              {message.sender === 'bot' && (
                <Avatar sx={{ mr: 1, bgcolor: '#4CAF50' }}>L</Avatar>
              )}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  backgroundColor: message.sender === 'user' ? 'primary.main' : 'white',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  whiteSpace: 'pre-line'
                }}
              >
                <ListItemText primary={message.text} />
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </Paper>
              {message.sender === 'user' && (
                <Avatar sx={{ ml: 1, bgcolor: 'secondary.main' }}>U</Avatar>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <IconButton 
          color="primary" 
          onClick={handleSend}
          sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}; 