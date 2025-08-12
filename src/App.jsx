import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Scanner from "@/components/pages/Scanner";
import Collection from "@/components/pages/Collection";
import Profile from "@/components/pages/Profile";
import WineDetails from "@/components/pages/WineDetails";
import AddWine from "@/components/pages/AddWine";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-wine-cream">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Scanner />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wine/:id" element={<WineDetails />} />
            <Route path="/add-wine" element={<AddWine />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;