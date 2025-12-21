import api from '../axios';

export const agentService = {
    /**
     * AI Agent ile sohbet başlatır.
     * @param {string} message - Kullanıcının mesajı
     * @param {Array} history - Sohbet geçmişi [{role: 'user'|'ai', content: '...'}]
     * @returns {Promise} - API yanıtı
     */
    chat: async (message, history = []) => {
        try {
            const response = await api.post('/agent/chat', {
                message,
                history
            });
            return response.data;
        } catch (error) {
            console.error('Agent chat error:', error);
            throw error;
        }
    }
};
