import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Loader2, Bot, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestedQuestions = [
  "What is the difference between CTC and in-hand salary?",
  "How is PF calculated from my basic salary?",
  "Can I reduce my income tax legally?",
  "What happens to my PF if I switch jobs?",
  "Why is my in-hand salary so much less than CTC?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await supabase.functions.invoke("salary-chat", {
        body: { messages: updatedMessages },
      });

      if (resp.error) throw new Error(resp.error.message);

      const assistantContent = resp.data?.reply || resp.data?.content || "Sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: assistantContent }]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, something went wrong. Please try again in a moment." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pt-24 pb-4 px-4 flex flex-col">
      <div className="container mx-auto max-w-2xl flex flex-col flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="font-display text-3xl font-bold mb-1">
            Ask Your <span className="text-gradient">Salary</span> Questions
          </h1>
          <p className="text-muted-foreground text-sm">
            AI-powered answers about salary, PF, tax, and more — in simple English
          </p>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 bg-gradient-card rounded-xl border border-border/50 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground text-center mb-6">
                  Ask anything about your salary, PF, tax, or payslip
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-full transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user" ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    {msg.role === "user" ? (
                      <User className="w-4 h-4 text-primary" />
                    ) : (
                      <Bot className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className={`rounded-xl px-4 py-3 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-primary/20 text-foreground"
                      : "bg-secondary text-foreground"
                  }`}>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="bg-secondary rounded-xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60 mb-2">
              <AlertCircle className="w-3 h-3" />
              Educational only — not financial advice
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about salary, PF, tax..."
                className="bg-secondary border-border"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
