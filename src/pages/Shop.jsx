import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { Status, useAsync } from '../lib.jsx';
import { Card } from '../components.jsx';

export default function Shop() {
  const [sp] = useSearchParams();
  const cat = sp.get('cat');
  const cats = useAsync(() => api.categories(), []);
  // Category filtering uses GET /categories/{id}, which returns that category's products.
  const res = useAsync(async () => cat ? (await api.category(cat)).products : (await api.products(0, 100)).content, [cat]);
  const current = cats.data?.find((c) => c.id === cat);
  return (
    <div className="wrap shop">
      <aside aria-label="Categories">
        <h2 className="h2 sm">Categories</h2>
        <ul>
          <li><Link className={!cat ? 'on' : ''} to="/shop">All products</Link></li>
          {cats.data?.map((c) => <li key={c.id}><Link className={cat === c.id ? 'on' : ''} to={`/shop?cat=${c.id}`}>{c.name}</Link></li>)}
        </ul>
      </aside>
      <section>
        <h1 className="h2">{current?.name || 'All products'}</h1>
        {current?.description && <p className="lede">{current.description}</p>}
        <Status loading={res.loading} error={res.error} empty={!res.data?.length}>
          <div className="grid">{res.data?.map((p) => <Card key={p.id} p={p} />)}</div>
        </Status>
      </section>
    </div>);
}
