import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import Contact from "../pages/Contact"
import Gallery from "../pages/Gallery"
import Navbar from '../components/Navbar'
import Footer from "../components/Footer"


const AppRoutes = () => {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/about" element={<About />}></Route>
                <Route path="/contact" element={<Contact />}></Route>
                <Route path="/gallery" element={<Gallery />}></Route>
            </Routes>
            <Footer/>
            
        </>

    )
}

export default AppRoutes;