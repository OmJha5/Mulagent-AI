import Artifact from "@/components/Artifact";
import ChatArea from "@/components/ChatArea";
import { LoginPopup } from "@/components/LoginPopup";
import Sidebar from "@/components/Sidebar";
import { useAppSelector } from "@/redux/store";

function Home() {
  const { userData } = useAppSelector((state) => state.user);

  return (
    <div className="h-screen  flex bg-[#0d0f14] text-white overflow-hidden">
      <Sidebar />

      <ChatArea />

      <Artifact />

      {!userData && <LoginPopup />}
    </div>
  );
}

export default Home;
