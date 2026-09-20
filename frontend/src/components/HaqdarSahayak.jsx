import React, { useState, useEffect, useRef } from "react";

export default function HaqdarSahayak({ workerData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "sahayak",
      text: "नमस्ते! मैं हक़दार सहायक हूँ। बोलकर या लिखकर अपना सवाल पूछें।",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Voice Output (Text-to-Speech)
  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN"; // Hindi voice accent
    utterance.rate = 0.95;    // Clear speaking pace

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang.includes("hi"));
    if (hindiVoice) utterance.voice = hindiVoice;

    window.speechSynthesis.speak(utterance);
  };

  // Voice Input (Speech-to-Text)
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Aapka browser voice support nahi karta. Google Chrome use karein.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN"; // Recognizes Hindi and Hinglish
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
      sendMessage(spokenText);
    };

    recognition.start();
  };

  const quickPrompts = [
    "Mera pending wage kitna hai?",
    "Dispute raise kaise karein?",
    "Proof receipt explain karein",
  ];

  const sendMessage = async (userMessage) => {
    const textToSend = userMessage || input;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { sender: "user", text: textToSend }];
    setMessages(newMessages);
    if (!userMessage) setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          workerData: workerData || {},
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages([...newMessages, { sender: "sahayak", text: data.reply }]);
        speakText(data.reply);
      } else {
        const errText = "क्षमा करें, अभी हम कनेक्ट नहीं हो पा रहे हैं।";
        setMessages([...newMessages, { sender: "sahayak", text: errText }]);
        speakText(errText);
      }
    } catch (err) {
      const netErr = "नेटवर्क में समस्या है। कृपया फिर से प्रयास करें।";
      setMessages([...newMessages, { sender: "sahayak", text: netErr }]);
      speakText(netErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1000 }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            borderRadius: "9999px",
            padding: "12px 20px",
            border: "none",
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
            cursor: "pointer",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          🎙️ Haqdar Sahayak AI
        </button>
      )}

      {isOpen && (
        <div
          style={{
            width: "360px",
            height: "500px",
            backgroundColor: "#1f2937",
            color: "#f3f4f6",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #374151",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#111827",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #374151",
            }}
          >
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px" }}>हक़दार सहायक (Voice AI)</div>
              <div style={{ fontSize: "11px", color: "#10b981" }}>● Live Voice Assistance</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                title="Toggle Voice Output"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "15px",
                  color: voiceEnabled ? "#10b981" : "#9ca3af",
                }}
              >
                {voiceEnabled ? "🔊" : "🔇"}
              </button>
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div
            style={{
              padding: "8px 12px",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              background: "#111827",
            }}
          >
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt)}
                style={{
                  fontSize: "11px",
                  padding: "5px 9px",
                  borderRadius: "12px",
                  background: "#374151",
                  color: "#d1d5db",
                  border: "none",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div
            style={{
              flex: 1,
              padding: "12px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: m.sender === "user" ? "#2563eb" : "#374151",
                  color: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  maxWidth: "80%",
                  fontSize: "13px",
                  lineHeight: "1.4",
                }}
              >
                {m.text}
                {m.sender === "sahayak" && (
                  <button
                    onClick={() => speakText(m.text)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "6px",
                      fontSize: "12px",
                      opacity: 0.8,
                    }}
                    title="Play Audio"
                  >
                    🔊
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                सहायक सोच रहे हैं...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Input & Text Control */}
          <div
            style={{
              padding: "10px 12px",
              background: "#111827",
              borderTop: "1px solid #374151",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* Mic Button */}
            <button
              onClick={startListening}
              style={{
                backgroundColor: isListening ? "#ef4444" : "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: isListening ? "0 0 10px #ef4444" : "none",
                transition: "all 0.2s",
                fontSize: "16px",
              }}
              title={isListening ? "Listening..." : "Click to Speak"}
            >
              🎤
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={isListening ? "Listening... बोलिए..." : "Type or click mic..."}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #4b5563",
                background: "#1f2937",
                color: "#ffffff",
                fontSize: "13px",
                outline: "none",
              }}
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}