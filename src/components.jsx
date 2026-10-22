import { Link } from 'react-router-dom';
import { img, money } from './api.js';
export function Card({ p, big }) {
  return (
    <Link to={`/product/${p.id}`} className={'card' + (big ? ' big' : '')}>
      <div className="ph">{p.mainImg ? <img src={img(p.mainImg)} alt="" loading="lazy" /> : null}
        {p.available === false && <span className="tag">Sold out</span>}</div>
      <h3>{p.name}</h3><p>{money(p.price)}</p>
    </Link>);
}
