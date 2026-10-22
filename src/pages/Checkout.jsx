import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money } from '../api.js';
import { Status, useAsync } from '../lib.jsx';
import { useCart } from '../cart.jsx';

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const states = useAsync(() => api.states(), []);
  const [f, setF] = useState({ customerFirstName: '', customerLastName: '', customerPhone: '', shippingAddress: '', state: '' });
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState('');
  const [done, setDone] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const st = states.data?.find((s) => String(s.id) === String(f.state));
  // Estimate shown to the customer; the order response below is the authoritative total.
  const delivery = st ? st.deliveryToHome : null;

  if (done) return (
    <div className="wrap done"><h1 className="h2">Order placed</h1>
      <p>Thank you, {done.customerFirstName}. We will contact you on {done.customerPhone}.</p>
      <div className="sum"><p><span>Products</span><b>{money(done.productsPrice)}</b></p>
        <p><span>Delivery</span><b>{money(done.deliveryPrice)}</b></p>
        <p className="tot"><span>Total</span><b>{money(done.totalPrice)}</b></p></div>
      <Link className="btn" to="/shop">Keep shopping</Link></div>);
  if (!items.length) return <div className="wrap"><h1 className="h2">Nothing to check out</h1><Link className="btn" to="/shop">Browse the shop</Link></div>;

  const validate = () => {
    const e = {};
    if (!f.customerFirstName.trim()) e.customerFirstName = 'Enter your first name.';
    if (!f.customerLastName.trim()) e.customerLastName = 'Enter your last name.';
    if (f.customerFirstName.length > 50) e.customerFirstName = 'Use 50 characters or fewer.';
    if (f.customerLastName.length > 50) e.customerLastName = 'Use 50 characters or fewer.';
    if (!f.customerPhone.trim()) e.customerPhone = 'Enter a phone number.';
    if (!f.shippingAddress.trim()) e.shippingAddress = 'Enter a delivery address.';
    if (!f.state) e.state = 'Choose where to deliver.';
    return e;
  };
  const submit = async (ev) => {
    ev.preventDefault(); setFail('');
    const e = validate(); setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const res = await api.createOrder({
        customerFirstName: f.customerFirstName.trim(), customerLastName: f.customerLastName.trim(),
        customerPhone: f.customerPhone.trim(), shippingAddress: f.shippingAddress.trim(),
        state: Number(f.state),
        orderItems: items.map((i) => ({ productId: i.productId, color: i.color || undefined, size: i.size || undefined, quantity: i.qty, price: i.price })),
      });
      clear(); setDone(res);
    } catch (err) { setFail(err.message); } finally { setBusy(false); }
  };
  const Field = ({ k, label, type = 'text', ...r }) => (
    <div className="field"><label htmlFor={k}>{label}</label>
      <input id={k} type={type} value={f[k]} onChange={set(k)} aria-invalid={!!errs[k]} aria-describedby={errs[k] ? k + '-e' : undefined} {...r} />
      {errs[k] && <p className="err" id={k + '-e'}>{errs[k]}</p>}</div>);
  return (
    <div className="wrap co">
      <form onSubmit={submit} noValidate>
        <h1 className="h2">Delivery details</h1>
        <div className="two"><Field k="customerFirstName" label="First name" autoComplete="given-name" maxLength={50} />
          <Field k="customerLastName" label="Last name" autoComplete="family-name" maxLength={50} /></div>
        <Field k="customerPhone" label="Phone" type="tel" autoComplete="tel" />
        <Field k="shippingAddress" label="Street address" autoComplete="street-address" />
        <div className="field"><label htmlFor="state">Delivery to</label>
          <Status loading={states.loading} error={states.error}>
            <select id="state" value={f.state} onChange={set('state')} aria-invalid={!!errs.state}>
              <option value="">Choose a state</option>
              {states.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Status>
          {errs.state && <p className="err">{errs.state}</p>}</div>
        {fail && <p className="err" role="alert">Your order was not placed: {fail}</p>}
        <button className="btn yellow big-btn" disabled={busy}>{busy ? 'Placing order…' : 'Place order'}</button>
      </form>
      <aside className="sum" aria-label="Order summary">
        <h2 className="h2 sm">Summary</h2>
        <ul>{items.map((i) => <li key={i.key}><span>{i.qty} × {i.name}</span><span>{money(i.price * i.qty)}</span></li>)}</ul>
        <p><span>Products subtotal</span><b>{money(subtotal)}</b></p>
        <p><span>Delivery fee</span><b>{delivery == null ? 'Choose a state' : money(delivery)}</b></p>
        <p className="tot"><span>Total</span><b>{delivery == null ? '—' : money(subtotal + delivery)}</b></p>
      </aside>
    </div>);
}
