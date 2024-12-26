import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./views/Home";
import PreCheckout from "./views/PreCheckout";
import { ThankYou } from "./views/ThankYou";
import { UserProvider } from "./context/UserContext";

function App() {

  const styles = {
    main: {
      fontFamily: 'Manrope, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#d7eefe',
      padding: '0',
      boxSize: 'border-box',
    },
  }
  return (
    <>
      <UserProvider>
        <main style={styles.main}>
          <BrowserRouter basename="/alumni-checkout">
            <Routes>
              <Route path="/" element={<PreCheckout />} />
              <Route path="/checkout/:token" element={<Home />} />
              <Route path="/success" element={<ThankYou />} />
              <Route path="/error" element={<h1>Error</h1>} />
              <Route path="*" element={<h1>404 - Not Found</h1>} />
            </Routes>
          </BrowserRouter>
        </main>
      </UserProvider>
    </>
  )
}

export default App