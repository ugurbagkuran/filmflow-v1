import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { agentService } from '../api/services/agentService';
import { useAuth } from '../context/AuthContext';

const AgentChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([
        { role: 'ai', content: 'Merhaba! Ben FilmFlow Yapay Zeka Asistanı. Size film önerileri yapabilir veya sorularınızı yanıtlayabilirim. Nasıl yardımcı olabilirim?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = { role: 'user', content: message };
        setHistory(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            // Backend'e gönderilecek history formatı (son mesaj hariç)
            const contextHistory = history.map(msg => ({
                role: msg.role === 'ai' ? 'ai' : 'user',
                content: msg.content
            }));

            const data = await agentService.chat(userMessage.content, contextHistory);

            setHistory(prev => [...prev, { role: 'ai', content: data.response }]);
        } catch (error) {
            console.error(error);
            setHistory(prev => [...prev, { role: 'ai', content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin. Bağlantınızı kontrol edin veya daha sonra tekrar deneyin.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setIsResetting(true);
        setTimeout(() => setIsResetting(false), 500);
        setHistory([
            { role: 'ai', content: 'Merhaba! Ben FilmFlow Yapay Zeka Asistanı. Size film önerileri yapabilir veya sorularınızı yanıtlayabilirim. Nasıl yardımcı olabilirim?' }
        ]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-[400px] h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-between shadow-md z-10">
                        <div className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-base leading-tight">FilmFlow AI</h3>
                                <p className="text-xs text-red-100 opacity-90">Size nasıl yardımcı olabilirim?</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleReset}
                                title="New Chat"
                                disabled={isResetting}
                                className={`text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all duration-500 ${isResetting ? '-rotate-180 bg-white/10 text-white' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content Area Based on Auth */}
                    {!user ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 bg-gray-50 dark:bg-gray-900/50">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-2 animate-bounce shadow-lg shadow-red-500/10">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Oturum Açın</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                                    Size özel film önerileri almak için giriş yapın.
                                </p>
                            </div>
                            <div className="flex flex-col w-full gap-3 mt-4">
                                <Link
                                    to="/login"
                                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/30 text-center active:scale-95"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    to="/register"
                                    className="w-full py-3 bg-white dark:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold transition-colors text-center"
                                >
                                    Kayıt Ol
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-950/50 scroll-smooth">
                                {history.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`
                                                max-w-[95%] rounded-2xl px-5 py-3.5 text-sm shadow-md overflow-hidden relative
                                                ${msg.role === 'user'
                                                    ? 'bg-gradient-to-br from-red-600 to-red-700 text-white rounded-br-sm'
                                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-sm'
                                                }
                                            `}
                                        >
                                            {msg.role === 'user' ? (
                                                msg.content
                                            ) : (
                                                <div className="prose prose-sm dark:prose-invert max-w-none 
                                                    prose-p:my-2 prose-p:leading-relaxed 
                                                    prose-headings:my-3 prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                                                    prose-ul:my-2 prose-ul:pl-4 
                                                    prose-ol:my-2 prose-ol:pl-4 
                                                    prose-li:my-0.5
                                                    prose-table:w-full prose-table:text-xs prose-table:my-2
                                                    prose-th:bg-gray-100 dark:prose-th:bg-gray-700/50 prose-th:p-2 prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700 prose-th:text-left
                                                    prose-td:p-2 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700
                                                    break-words overflow-x-auto"
                                                >
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start animate-pulse">
                                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 backdrop-blur-xl">
                                <form onSubmit={handleSubmit} className="flex gap-3 relative">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Bir film sorun..."
                                        className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading || !message.trim()}
                                        className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center justify-center aspect-square"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95
                    flex items-center justify-center
                    ${isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-red-600 text-white animate-pulse-slow'}
                `}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default AgentChatWidget;
