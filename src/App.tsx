import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from 'lenis';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import OurFactory from './pages/OurFactory';
import Residential from './pages/Residential';
import Commercial from './pages/Commercial';
import Corporate from './pages/Corporate';

function App() {
    useEffect(() => {
        const lenis = new Lenis()

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, []);

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/our-factory" element={<OurFactory />} />
                        <Route path="/residential" element={<Residential />} />
                        <Route path="/commercial" element={<Commercial />} />
                        <Route path="/corporate" element={<Corporate />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
