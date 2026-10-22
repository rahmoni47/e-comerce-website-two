import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, img, money } from '../api.js';
import { Status, useAsync } from '../lib.jsx';
import { useCart } from '../cart.jsx';

export default function Product() {
  const { id } = useParams();
  const { data: p, loading, error } = useAsync(() => api.product(id), [id]);
  const { add } = useCart();
  const [pic, setPic] = useState(0);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [warn, setWarn] = useState('');
  return (
    <div className="wrap">
      <Status loading={loading} error={error} empty={!p}>
        {p && (() => {
          const pics = [p.mainImg, ...(p.extraImgs || [])].filter(Boolean);
          const submit = () => {
            if (p.colors?.length && !color) return setWarn('Choose a colour first.');
            if (p.sizes?.length && !size) return setWarn('Choose a size first.');
            setWarn('');
            add({ productId: p.id, name: p.name, img: p.mainImg, price: p.price, color, size, qty });
            setAdded(true); setTimeout(() => setAdded(false), 1800);
          };
          return (
            <div className="pdp">
              <div className="gallery">
                <div className="ph main">{pics[pic] && <img src={img(pics[pic])} alt={p.name} />}</div>
                {pics.length > 1 && <div className="thumbs">{pics.map((s, i) => (
                  <button key={i} className={i === pic ? 'on' : ''} onClick={() => setPic(i)} aria-label={`Photo ${i + 1}`}><img src={img(s)} alt="" /></button>))}</div>}
              </div>
              <div className="info">
                {p.category && <Link to={`/shop?cat=${p.categoryId}`} className="crumb">{p.category}</Link>}
                <h1>{p.name}</h1>
                <p className="price">{money(p.price)}</p>
                {p.description && <p className="desc">{p.description}</p>}
                {p.colors?.length > 0 && <fieldset><legend>Colour</legend>{p.colors.map((c) => (
                  <label key={c} className={'chip' + (color === c ? ' on' : '')}><input type="radio" name="color" checked={color === c} onChange={() => setColor(c)} />{c}</label>))}</fieldset>}
                {p.sizes?.length > 0 && <fieldset><legend>Size</legend>{p.sizes.map((s) => (
                  <label key={s} className={'chip' + (size === s ? ' on' : '')}><input type="radio" name="size" checked={size === s} onChange={() => setSize(s)} />{s}</label>))}</fieldset>}
                <div className="qty" role="group" aria-label="Quantity">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button><span>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} aria-label="Increase">+</button></div>
                {warn && <p className="err" role="alert">{warn}</p>}
                <button className="btn big-btn" disabled={p.available === false} onClick={submit}>
                  {p.available === false ? 'Sold out' : added ? 'Added to bag' : 'Add to bag'}</button>
                {added && <p role="status"><Link to="/cart" className="under">View your bag</Link></p>}
              </div>
            </div>);
        })()}
      </Status>
    </div>);
}
