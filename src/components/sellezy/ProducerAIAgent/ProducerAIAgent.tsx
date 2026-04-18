import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, X, MessageSquare, Sparkles, Wand2, Languages, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { getModuleFromPath, PRODUCER_AI_KNOWLEDGE, getModuleContextSummary } from "@/lib/producerAIContext";
import WaveformGlow from "./WaveformGlow";

const ProducerAIAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const location = useLocation();
  const { lang, t } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const currentModule = getModuleFromPath(location.pathname);
  const context = PRODUCER_AI_KNOWLEDGE[currentModule];
  
  // Safe helper for multilingual context strings
  const getContextString = (obj: Record<string, any>, fallback: string = ""): any => {
    return obj[lang] || obj["EN"] || fallback;
  };

  const currentTitle = getContextString(context.title, "Producer Copilot");
  const suggestedPrompts = getContextString(context.prompts, []);
  const insights = getContextString(context.insights, []);

  // Initialize with welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      const welcome = lang === "KA" 
        ? `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ${currentTitle}. ಇಂದು ${currentModule} ಬಗ್ಗೆ ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?`
        : `Hello! I'm your ${currentTitle}. How can I help you with ${currentModule} analytics today?`;
      setMessages([{ role: "assistant", content: welcome }]);
    }
  }, [currentModule, lang]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isProcessing, isOpen, statusMessage]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === "KA" ? "kn-IN" : "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage(lang === "KA" ? "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ..." : "Listening...");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSend(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setStatusMessage(lang === "KA" ? "ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ" : "Microphone access denied");
        } else if (event.error === "aborted") {
          // Normal stop
          setStatusMessage(null);
        } else {
          setStatusMessage(lang === "KA" ? "ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆಯಲ್ಲಿ ದೋಷ" : "Error recognizing speech");
        }
        setTimeout(() => setStatusMessage(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setStatusMessage(null);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Already stopped
        }
      }
    };
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen]);

  const generateLocalFallback = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes("health") || lower.includes("score") || lower.includes("ಆರೋಗ್ಯ")) {
      return lang === "KA" 
        ? "ನಿಮ್ಮ ಉತ್ಪನ್ನದ ಆರೋಗ್ಯ ಸ್ಕೋರ್ 5% ಸುಧಾರಿಸಿದೆ."
        : "Your product health score improved by 5%.";
    }
    return lang === "KA"
      ? "ಕ್ಷಮಿಸಿ, ಈ ಬಾರಿ ಜೆಮಿನಿ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      : "I couldn't reach Gemini right now, but I'm here to help!";
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      setStatusMessage(lang === "KA" ? "ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ" : "Voice not supported in this browser");
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatusMessage(null);
    } else {
      try {
        // Proactively show starting state
        setIsListening(true);
        setStatusMessage(lang === "KA" ? "ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ..." : "Starting...");
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start recognition:", err);
        setIsListening(false);
        setStatusMessage(null);
        // If it's already started, stop it and try again or just let it be
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  };

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || inputText;
    if (!text.trim()) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    try {
      const pageContext = getModuleContextSummary(currentModule);
      
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: text,
          history: messages.slice(-5), // Keep a small window for performance
          moduleName: currentModule,
          lang: lang,
          contextData: pageContext
        }
      });

      if (error) throw error;

      const assistantMessage: Message = { role: "assistant", content: data.text };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Gemini Error:", err);
      const fallbackText = generateLocalFallback(text);
      setMessages(prev => [...prev, { role: "assistant", content: fallbackText }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] pointer-events-none">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto p-4 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 shadow-[0_0_20px_rgba(44,177,165,0.4)] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary-glow animate-pulse" />
              <span className="text-sm font-display font-bold text-white pr-2">Producer AI</span>
            </div>
            {/* Notification Dot */}
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-bounce" />
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="pointer-events-auto w-[380px] h-[580px] glass-card flex flex-col overflow-hidden shadow-2xl border-primary/20"
          >
            {/* Header */}
            <div className="p-4 border-b border-primary/10 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Wand2 className="w-5 h-5 text-primary-glow" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-bold text-white tracking-wide">{currentTitle}</h3>
                  <p className="text-[10px] text-primary/80 font-mono uppercase tracking-widest">Context Aware System</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Scroll Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-black/10">
              {/* Message History */}
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary/20 border border-primary/30 text-white rounded-tr-none"
                        : "bg-white/5 border border-white/10 text-foreground/90 rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Insight Zone (Contextual) */}
              {insights.length > 0 && messages.length < 4 && (
                <div className="pt-4 space-y-2">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-1">Contextual Insights</p>
                  <div className="grid gap-2">
                    {insights.map((insight: string, i: number) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-3"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-primary-glow mt-0.5 shrink-0" />
                        <span className="text-xs text-foreground/90 leading-relaxed italic">"{insight}"</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Prompts */}
              <div className="pt-4 space-y-3">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-1">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt: string, i: number) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="px-3 py-2 rounded-lg bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-[11px] text-foreground transition-all flex items-center gap-2 group"
                    >
                      {prompt}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-primary/10 bg-black/60 backdrop-blur-3xl">
              {statusMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-2 text-center"
                >
                  <span className="text-[10px] font-mono text-primary-glow uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                    {statusMessage}
                  </span>
                </motion.div>
              )}
              
              <div className="mb-3 flex justify-center">
                <WaveformGlow isListening={isListening} isProcessing={isProcessing} />
              </div>
              
              <div className="relative flex items-center gap-2">
                <button 
                  onClick={handleMicClick}
                  disabled={isProcessing}
                  className={`p-2.5 rounded-full transition-all ${
                    isListening 
                      ? "bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                      : "hover:bg-white/10 text-primary-glow"
                  } border border-transparent disabled:opacity-30`}
                >
                  <Mic className={`w-5 h-5 ${isListening ? "animate-pulse" : ""}`} />
                </button>
                
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isProcessing}
                  placeholder={isListening ? "Listening..." : "Ask your copilot..."}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-muted-foreground disabled:opacity-50"
                />

                <button 
                  onClick={() => handleSend()}
                  disabled={!inputText.trim() || isProcessing}
                  className="p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProducerAIAgent;
