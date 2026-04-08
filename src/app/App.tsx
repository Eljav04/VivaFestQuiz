import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "./utils/sampleData";

function App() {
  return <RouterProvider router={router} />;
}

export default App;