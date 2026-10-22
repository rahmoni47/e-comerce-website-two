import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, img } from '../api.js';
import { Status, useAsync } from '../lib.jsx';
import { Card } from '../components.jsx';

export default function Home() {
  const cats = useAsync(() => api.categories(), []);
  const prods = useAsync(() => api.products(0, 9), []);
  const [active, setActive] = useState(0);
  const list = cats.data || [];
  const cur = list[active];
  return (<>
    <section className="hero">
      <div className="hero-copy">
        <h1>Pick a shelf.<br />Take it home.</h1>
        <p>Everything in the store, sorted by where it belongs. Choose a category to see what is on it.</p>
        <Link className="btn yellow" to="/shop">Browse all products</Link>
      </div>
      <div className="hero-index">
        <Status loading={cats.loading} error={cats.error} empty={!list.length}>
          <div className="arch" aria-hidden="true">{cur?.img && <img key={cur.id} src={img(cur.img)} alt="" />}</div>
          <ul>{list.map((c, i) => (
            <li key={c.id}>
              <Link to={`/shop?cat=${c.id}`} className={i === active ? 'on' : ''}
                onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>{c.name}</Link>
            </li>))}</ul>
        </Status>
      </div>
    </section>
    <section className="wrap">
      <h2 className="h2">Latest in</h2>
      <Status loading={prods.loading} error={prods.error} empty={!prods.data?.content?.length}>
        <div className="grid stagger">{prods.data?.content?.map((p, i) => <Card key={p.id} p={p} big={i === 0} />)}</div>
        <p style={{ marginTop: 32 }}><Link className="btn" to="/shop">See everything</Link></p>
      </Status>
    </section>
  </>);
}
