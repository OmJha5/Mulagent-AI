import ChatInput from "@/components/ChatInput";
import MessageList from "@/components/MessageList";
import Nav from "@/components/Nav";

function ChatArea() {
  return (
    <div className="flex-1 flex flex-col min-w-0 h-full relative bg-[#0b0d12] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(99,102,241,0.06),transparent)]" />
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  );
}

export default ChatArea;
