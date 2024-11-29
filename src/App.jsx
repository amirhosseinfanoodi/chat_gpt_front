import { useState } from 'react';
import './App.css';
import SendIcon from '@mui/icons-material/Send';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState(''); // برای نگه‌داری پیام تایپی

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
  
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: inputMessage }]);
    setInputMessage('');
    setIsLoading(true);
  
    try {
      // ارسال درخواست به API
      const response = await fetch(`http://127.0.0.1:8000/gpt?query=${inputMessage}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Response from API:', data);
  
      // بررسی پاسخ API و نمایش آن
      if (data.reply) {
        simulateTypingEffect(data.reply);
      } else {
        throw new Error('No reply found in the API response');
      }
    } catch (error) {
      console.error('Error fetching API:', error);
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Error getting response from API' }]);
    }
  
    setIsLoading(false);
  };
  

  const simulateTypingEffect = (text) => {
    if (!text) return; // بررسی اینکه آیا text تعریف شده یا خیر

    setTypingMessage(''); // بازنشانی پیام تایپی

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setTypingMessage((prevMessage) => prevMessage + text[index]); // اضافه کردن کاراکتر بعدی
        index++;
      } else {
        clearInterval(typingInterval); // متوقف کردن تایپ پس از اتمام
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text }]); // اضافه کردن پیام به لیست
        setTypingMessage(''); // پاک کردن پیام تایپی
      }
    }, 50); // سرعت تایپ
  };

  return (
    <>
      <div className="h-screen flex flex-col" style={{ background: '#edf2f7', width: '100%' }}>
        {/* Main Container */}
        <div className="flex flex-col h-full w-full">
          {/* Chat Header */}
          <header className="bg-white p-4 text-gray-500 border-b ">
            <h1 className="text-2xl font-semibold">Neon</h1>
          </header>

          {/* Chat Messages */}
          <div className="flex-grow p-4 overflow-y-auto bg-gradient-to-t from-zinc-100 to-slate-200 ">
            {/* پیام‌های قبلی */}
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                {message.sender === 'bot' && (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                    <img
                      src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                )}
                <div
                  className={`flex max-w-96 p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-violet-500 to-blue-400 text-white'
                      : 'bg-gradient-to-r from-lime-400 to-green-500 text-gray-700'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                    <img
                      src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                      alt="My Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                )}
              </div>
            ))}

            {/* پیام تایپ شده به صورت تدریجی */}
            {typingMessage && (
              <div className="flex mb-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                  <img
                    src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                    alt="Bot Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div className="flex max-w-96 bg-gradient-to-r from-lime-400 to-green-500 rounded-lg p-3 gap-3">
                  <p className="text-gray-700">{typingMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <footer className="bg-white border-t border-gray-300 p-4">
            <div className="flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Type a message..."
                className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
                onClick={handleSendMessage}
              >
                {isLoading ? '...' : <SendIcon />}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
