import React, { useRef } from 'react'
import styles from '../pages/Client/Home/scss/ChatBot.module.scss'

export const ChatForm = ({ setChatHistory, generateBotResponse, chatHistory }) => {
  const inputRef = useRef()

  const handleFormSubmit = e => {
    e.preventDefault()
    const userMessage = inputRef.current.value.trim()
    if (!userMessage) return
    inputRef.current.value = ''
    setChatHistory(history => [...history, { role: 'user', text: userMessage }])
    setTimeout(() => {
      setChatHistory(history => [...history, { role: 'model', text: 'Thinking...' }])
      generateBotResponse([...chatHistory, { role: 'user', text: userMessage }])
    }, 600)
  }

  return (
    <form className={styles['chat-form']} onSubmit={handleFormSubmit} action="#">
      <input
        ref={inputRef}
        type="text"
        placeholder="Please enter a message..."
        className={styles['message-input']}
        required
      />
      <button type="primary" className={styles['send-button']} style={{ fontFamily: 'Material Symbols Rounded' }}>
        arrow_upward
      </button>
    </form>
  )
}
