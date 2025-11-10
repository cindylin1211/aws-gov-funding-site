import { Bot, Sparkles } from "lucide-react";

const ChatAssistant = () => {
  const handleOpenChat = () => {
    // 在新視窗開啟外部聊天助手
    window.open(
      "https://main.d2bjhq7oy5zs66.amplifyapp.com/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      {/* 浮動按鈕 */}
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 group flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 animate-gradient-x"
        title="諮詢 AI 補助小助手"
      >
        <div className="relative">
          <Bot className="h-6 w-6 text-white" />
          <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <span className="text-white font-semibold text-base whitespace-nowrap">
          問 AI
        </span>
      </button>

      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default ChatAssistant;
