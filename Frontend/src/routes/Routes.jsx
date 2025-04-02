import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import Contact from "../pages/Contact"
import Gallery from "../pages/Gallery"
import Navbar from '../components/Navbar'
import Footer from "../components/Footer"
import Service from "../pages/service"
import Donate from "../pages/Donate"
import LoginPage from "../pages/Login"
import RegisterPage from "../pages/Register"

const AppRoutes = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/service" element={<Service />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </main>
            <Footer/>
        </div>
    )
}

export default AppRoutes;