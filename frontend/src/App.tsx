import Home from "@/pages/Home";
import { useEffect } from "react";
import { setUserdata } from "./redux/userSlice";
import getCurrentUser from "./features/getCurrentUser";
import { useAppDispatch } from "./redux/store";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getMyDetails = async () => {
      const data = await getCurrentUser();
      dispatch(setUserdata(data));
    };
    getMyDetails();
  }, [dispatch]);

  return (
    <div>
      <Home />
    </div>
  );
}

export default App;
