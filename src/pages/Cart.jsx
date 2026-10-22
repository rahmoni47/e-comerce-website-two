import { Link } from 'react-router-dom';
import { img, money } from '../api.js';
import { useCart } from '../cart.jsx';

export default function Cart() {
  const { items, setQty, remove, subtotal } = useCart();
  if (!items.length) return <div className="wrap"><h1 className="h2">Your bag is empty</h1><Link className="btn" to="/shop">Start shopping</Link></div>;
  return (
    <div className="wrap cart">
      <h1 className="h2">Your bag</h1>
      <ul className="lines">{items.map((i) => (
        <li key={i.key}>
          <div className="ph sq">{i.img && <img src={img(i.img)} alt="" />}</div>
          <div className="grow"><Link to={`/product/${i.productId}`}><b>{i.name}</b></Link>
            <p className="muted">{[i.color, i.size].filter(Boolean).join(' / ') || 'Standard'}</p>
            <button className="under" onClick={() => remove(i.key)}>Remove</button></div>
          <div className="qty" role="group" aria-label={`Quantity of ${i.name}`}>
            <button onClick={() => setQty(i.key, i.qty - 1)} aria-label="Decrease">−</button><span>{i.qty}</span>
            <button onClick={() => setQty(i.key, i.qty + 1)} aria-label="Increase">+</button></div>
          <p className="lt">{money(i.price * i.qty)}</p>
        </li>))}</ul>
      <div className="sum"><p><span>Products subtotal</span><b>{money(subtotal)}</b></p>
        <p className="muted">Delivery is added at checkout once you choose where it is going.</p>
        <Link className="btn yellow" to="/checkout">Go to checkout</Link></div>
    </div>);
}
