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
  stage: 'initial' | 'anxious' | 'grounding' | 'mood_tracking' | 'mood_rating' | 'tea_suggestion' | 'reminder';
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
      p: 2,
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      borderRadius: 4,
      boxShadow: 4,
      position: 'relative',
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          mb: 2, 
          overflow: 'auto',
          p: 2,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
          borderRadius: 3,
        }}
      >
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1,
                transition: 'all 0.3s',
              }}
            >
              {message.sender === 'bot' && (
                <Avatar sx={{ mr: 1, bgcolor: 'primary.main', color: 'white', boxShadow: 2 }}>L</Avatar>
              )}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  background: message.sender === 'user'
                    ? 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
                    : 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)',
                  color: message.sender === 'user' ? 'white' : 'primary.main',
                  whiteSpace: 'pre-line',
                  borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  boxShadow: 2,
                  fontSize: '1.05rem',
                  animation: 'fadeIn 0.4s',
                }}
              >
                <ListItemText primary={message.text} />
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </Paper>
              {message.sender === 'user' && (
                <Avatar sx={{ ml: 1, bgcolor: 'primary.light', color: 'primary.dark', boxShadow: 2 }}>U</Avatar>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
      <Box sx={{
        display: 'flex',
        gap: 1,
        position: 'sticky',
        bottom: 0,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
        borderRadius: 3,
        boxShadow: 2,
        p: 1,
        zIndex: 2,
      }}>
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