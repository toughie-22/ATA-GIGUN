import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout & Context
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Discover from './pages/Discover';
import Login from './pages/Login';
import Register from './pages/Register';
import HallOfFame from './pages/HallOfFame';
import UserHallOfFame from './pages/UserHallOfFame';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/movies/:id" element={<MovieDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/hall-of-fame" element={<HallOfFame />} />
                <Route path="/hall-of-fame/user/:id" element={<UserHallOfFame />} />
                <Route path="*" element={
                  <div className="pt-32 text-center">
                    <h1 className="text-4xl font-bold mb-4 uppercase tracking-tighter">404</h1>
                    <p className="text-pepper-muted">This page seems to have lost its heat.</p>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme="dark"
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
