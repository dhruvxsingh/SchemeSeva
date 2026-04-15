import { useState } from "react";
import axios from "axios";

const AiChat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        { role: "ai", text: "👋 Hi! I'm your government scheme assistant. Ask me anything like 'schemes for farmers' or 'education schemes for girls'!" }
    ]);
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;
        const userMsg = message;
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setMessage("");
        setLoading(true);
        setSchemes([]);

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/chat`,
                { message: userMsg }
            );
            setMessages(prev => [...prev, { role: "ai", text: res.data.reply }]);
            setSchemes(res.data.schemes || []);
        } catch {
            setMessages(prev => [...prev, { role: "ai", text: "Sorry, something went wrong." }]);
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 750, margin: "40px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
            <h2 style={{ textAlign: "center", color: "#1a73e8" }}>🇮🇳 AI Scheme Assistant</h2>
            <p style={{ textAlign: "center", color: "#666" }}>Ask about any government scheme in plain English</p>

            {/* Chat Box */}
            <div style={{
                border: "1px solid #ddd", borderRadius: 12, padding: 16,
                height: 250, overflowY: "auto", background: "#f9f9f9", marginBottom: 16
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                        marginBottom: 12
                    }}>
                        <div style={{
                            maxWidth: "75%", padding: "10px 14px", borderRadius: 16,
                            background: msg.role === "user" ? "#1a73e8" : "#fff",
                            color: msg.role === "user" ? "#fff" : "#333",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            whiteSpace: "pre-wrap", lineHeight: 1.5
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                        <div style={{
                            padding: "10px 14px", borderRadius: 16,
                            background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", color: "#999"
                        }}>
                            ⏳ Searching 3400 schemes...
                        </div>
                    </div>
                )}
            </div>

            {/* Scheme Cards */}
            {schemes.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                    <h4 style={{ color: "#333", marginBottom: 8 }}>📋 {schemes.length} Schemes Found:</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto" }}>
                        {schemes.map((s, i) => (
                            <div key={i} style={{
                                background: "#fff", border: "1px solid #e0e0e0",
                                borderRadius: 10, padding: 14,
                                boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                            }}>
                                <h4 style={{ margin: "0 0 6px", color: "#1a73e8", fontSize: 15 }}>{s.name}</h4>
                                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888" }}>
                                    📁 {s.category} &nbsp;|&nbsp; 🏛️ {s.level}
                                </p>
                                <p style={{ margin: "0 0 4px", fontSize: 13 }}>
                                    <strong>Benefits:</strong> {s.benefits}
                                </p>
                                <p style={{ margin: 0, fontSize: 13 }}>
                                    <strong>Eligibility:</strong> {s.eligibility}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggestions */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {["Schemes for farmers", "Education for girls", "Health schemes", "MSME schemes"].map(s => (
                    <button key={s} onClick={() => setMessage(s)} style={{
                        padding: "6px 12px", borderRadius: 20, border: "1px solid #1a73e8",
                        background: "#fff", color: "#1a73e8", cursor: "pointer", fontSize: 13
                    }}>{s}</button>
                ))}
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: 8 }}>
                <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Ask about any government scheme..."
                    style={{
                        flex: 1, padding: "12px 16px", borderRadius: 24,
                        border: "1px solid #ddd", fontSize: 15, outline: "none"
                    }}
                />
                <button onClick={sendMessage} disabled={loading} style={{
                    padding: "12px 24px", borderRadius: 24, background: "#1a73e8",
                    color: "#fff", border: "none", cursor: "pointer", fontSize: 15,
                    opacity: loading ? 0.7 : 1
                }}>Send</button>
            </div>
        </div>
    );
};

export default AiChat;