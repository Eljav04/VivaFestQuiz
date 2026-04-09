import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "../components/ui/sonner";
import "./utils/sampleData";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;