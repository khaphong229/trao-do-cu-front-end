import ChatbotIcon from 'components/common/ChatBot'
import { companyInfo } from 'constants/companyInfo'
import { useEffect, useRef, useState } from 'react'
import styles from '../scss/ChatBot.module.scss'
import { ChatForm } from 'components/ChatForm'
import { ChatMessage } from 'components/ChatMessage'
import chatboticon from 'assets/images/logo/chatbot-icon.png'
const ChatBot = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChatbot: true,
      type: 'model',
      text: companyInfo
    }
  ])
  const [showChatbot, setShowChatbot] = useState(false)
  const chatBodyRef = useRef()

  const generateBotResponse = async history => {
    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== 'Đang trả lời...'), { role: 'model', text, isError }])
    }

    // Định dạng lại history để đảm bảo role hợp lệ
    history = history.map(({ role, text }) => ({
      role: role === 'user' ? 'user' : 'model',
      parts: [{ text }]
    }))

    const apiUrl = process.env.REACT_APP_API_URL

    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: history })
    }

    try {
      const response = await fetch(apiUrl, requestOption)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Something went wrong')
      }

      // Kiểm tra dữ liệu có hợp lệ trước khi truy xuất vào `parts[0].text`
      const firstCandidate = data.candidates?.[0]
      const firstContent = firstCandidate?.content
      const firstPart = firstContent?.parts?.[0]

      if (!firstPart?.text) {
        throw new Error("Invalid API response format: Missing 'text' field")
      }

      const apiResponseText = firstPart.text.replace(/\*\*(.?)\*\*/g, '$1').trim()
      updateHistory(apiResponseText)
    } catch (error) {
      updateHistory(error.message, true)
    }
  }

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [chatHistory])

  return (
    <div className={styles.container}>
      <button
        onClick={() => setShowChatbot(prev => !prev)}
        id={styles['chatbot-toggler']}
        className={showChatbot ? styles['show-chatbot'] : ''}
      >
        <span style={{ fontFamily: 'Material Symbols Rounded' }} className="material-symbols-rounded">
          mode_comment
        </span>
        <span style={{ fontFamily: 'Material Symbols Rounded' }} className="material-symbols-rounded">
          close
        </span>
      </button>

      <div className={`${styles['chatbot-popup']} ${showChatbot ? styles['show-chatbot'] : ''}`}>
        {/* Chatbot header */}
        <div className={styles['chat-header']}>
          <div className={styles['header-info']}>
            <ChatbotIcon />
            <h2 className={styles['logo-text']}>Chatbot Trao Đồ Cũ</h2>
          </div>
          <button
            style={{ fontFamily: 'Material Symbols Rounded' }}
            onClick={() => setShowChatbot(false)}
            className="material-symbols-rounded"
          >
            keyboard_arrow_down
          </button>
        </div>

        {/* Chatbot body */}
        <div className={styles['chat-body']} ref={chatBodyRef}>
          <div className={`${styles.message} ${styles['bot-message']}`}>
            <ChatbotIcon />
            <p className={styles['message-text']}>Chào bạn! Tôi có thể giúp gì bạn hôm nay?</p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chatbot footer */}
        <div className={styles['chat-footer']}>
          <ChatForm
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
            chatHistory={chatHistory}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatBot
