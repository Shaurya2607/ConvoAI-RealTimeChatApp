import { useState } from "react";

import Navbar from "../../components/layout/Navbar/Navbar";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import ChatWindow from "../../components/chat/ChatWindow/ChatWindow";
import AIAssistant from "../../components/chat/AIAssistant/AIAssistant";

import "./Home.css";

function Home() {
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="home">
      <Navbar />

      <div className="home-body">
        <Sidebar onOpenAI={() => setShowAI(true)} />

        <ChatWindow />
      </div>

      <AIAssistant
        isOpen={showAI}
        onClose={() => setShowAI(false)}
      />
    </div>
  );
}

export default Home;