import React from 'react'
import styles from '../pages/Client/Home/scss/ChatBot.module.scss'
import ChatbotIcon from 'components/common/ChatBot'

export const ChatMessage = ({ chat }) => {
  return (
    !chat.hideInChatbot && (
      <div
        className={`${styles.message} ${
          chat.role === 'model' ? styles['bot-message'] : styles['user-message']
        } ${chat.isError ? styles.error : ''}`}
      >
        {chat.role === 'model' && <ChatbotIcon />}
        <p className={styles['message-text']}>{chat.text}</p>
      </div>
    )
  )
}
