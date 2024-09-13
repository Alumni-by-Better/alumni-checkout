import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./views/Home";

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
      <main style={styles.main}>
        <BrowserRouter basename="/alumni-checkout">
          <Routes>
            <Route index element={<Home />} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  )
}

export default App