import { useEffect } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useCart } from './cart.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';

export default function App() {
  const { count } = useCart();
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return (<>
    <a className="skip" href="#main">Skip to content</a>
    <header className="top">
      <Link to="/" className="logo">Stall</Link>
      <nav aria-label="Main"><NavLink to="/shop">Shop</NavLink></nav>
      <Link to="/cart" className="bag" aria-label={`Bag, ${count} items`}>Bag <b>{count}</b></Link>
    </header>
    <main id="main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<p className="note wrap">That page does not exist. <Link to="/shop">Browse the shop</Link></p>} />
      </Routes>
    </main>
    <footer className="foot"><span>Stall</span><span>Pay on delivery details are confirmed when you place your order.</span></footer>
  </>);
}
