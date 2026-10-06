'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, ChevronDown, Minus, Plus } from 'lucide-react'
import { aboutImage, events, formatPrice, heroImage, products, star, type CartItem, type Product } from '@/data/content'

type View = 'home' | 'objects' | 'events' | 'about' | 'product' | 'cart'
type Navigate = (view: 'home' | 'objects' | 'events' | 'about' | 'cart') => void

const money = (n: number) => formatPrice(n).replace(/,00$/, '')

// A logo é a imagem original em duas camadas (letras e estrela), nunca texto.
// As cores mudam por CSS (--logo-letters, --logo-star) sem alterar o desenho.
function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`logo-mark ${className}`} role="img" aria-label="Faísca">
      <span className="logo-letters" />
      <span className="logo-star" />
    </span>
  )
}

function Header({ onHero, cartCount, onNavigate }: { onHero: boolean; cartCount: number; onNavigate: Navigate }) {
  return (
    <header className={`site-header ${onHero ? 'on-hero' : ''}`}>
      <button className="logo-button" onClick={() => onNavigate('home')} aria-label="Faísca, início">
        <Logo />
      </button>
      <nav className="desktop-nav" aria-label="Navegação principal">
        <button onClick={() => onNavigate('objects')}>Objetos</button>
        <button onClick={() => onNavigate('events')}>Encontros</button>
        <button onClick={() => onNavigate('about')}>Sobre</button>
      </nav>
      <button className="cart-link" onClick={() => onNavigate('cart')} aria-label={`Carrinho com ${cartCount} itens`}>
        <span className="cart-star">{star}</span>
        <span className="cart-label">Carrinho</span>
        {cartCount > 0 && <b>{cartCount}</b>}
      </button>
    </header>
  )
}

function Footer({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <footer className="footer">
      <button className="logo-button footer-logo" onClick={() => onNavigate('home')} aria-label="Faísca, início">
        <Logo />
      </button>
      <nav className="footer-links" aria-label="Rodapé">
        <a href="mailto:oi@faisca.studio">Contato</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        <button onClick={() => onNavigate('about')}>Envio e trocas</button>
      </nav>
      <form className="newsletter" onSubmit={e => e.preventDefault()}>
        <label htmlFor="email">Carta da Faísca</label>
        <div>
          <input id="email" type="email" placeholder="seu e-mail" aria-label="Seu e-mail" />
          <button aria-label="Inscrever-se"><ArrowUpRight /></button>
        </div>
      </form>
      <p className="copyright">© Faísca 2026 · protótipo com dados de exemplo</p>
    </footer>
  )
}

function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  return (
    <button className="product-card" onClick={() => onSelect(product)}>
      <div className="product-image">
        <Image src={product.image} alt={`Fotografia da peça ${product.name}`} fill sizes="(max-width: 768px) 50vw, 25vw" />
        <Image className="hover-image" src={product.hoverImage} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" />
      </div>
      <div className="product-meta">
        <h3>{product.name}</h3>
        <span>{money(product.price)}</span>
      </div>
    </button>
  )
}

function Home({ onSelect, onNavigate }: { onSelect: (p: Product) => void; onNavigate: Navigate }) {
  const next = events[0]
  return (
    <>
      <section className="hero">
        <Image src={heroImage} alt="Mão segurando um cacho de velas finas cor de cera, sobre fundo azul" fill priority sizes="100vw" />
        <h1>Utilitários contemplativos</h1>
      </section>

      <section className="next-event">
        <p className="eyebrow">Próximo encontro</p>
        <h2>{next.title}</h2>
        <p className="event-details">Sábado, 10 de outubro · 10h<br />{next.location}</p>
        <button className="text-link" onClick={() => onNavigate('events')}>Ver encontro <ArrowUpRight /></button>
      </section>

      <section className="section home-products">
        <div className="section-heading">
          <p className="eyebrow">Objetos</p>
          <button className="text-link" onClick={() => onNavigate('objects')}>Ver todos <ArrowUpRight /></button>
        </div>
        <div className="product-grid featured-grid">
          {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} onSelect={onSelect} />)}
        </div>
      </section>
    </>
  )
}

function Objects({ onSelect }: { onSelect: (p: Product) => void }) {
  const [filter, setFilter] = useState('Todos')
  const filters = ['Todos', 'Velas', 'Castiçais', 'Kits', 'Peças únicas', 'Pronta entrega']
  const shown = filter === 'Todos' || filter === 'Pronta entrega' ? products : products.filter(p => p.category === filter)
  return (
    <section className="page-section">
      <h1 className="page-title">Objetos</h1>
      <div className="filters" role="group" aria-label="Filtrar objetos">
        {filters.map(f => <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}
      </div>
      <div className="product-grid">
        {shown.map(p => <ProductCard key={p.id} product={p} onSelect={onSelect} />)}
      </div>
    </section>
  )
}

function EventList() {
  const upcoming = events.filter(e => !e.past)
  const past = events.filter(e => e.past)
  return (
    <section className="page-section events-page">
      <h1 className="page-title">Encontros</h1>
      <div className="events-list">
        {upcoming.map(e => (
          <article className="event-block" key={e.id}>
            <div className="event-row">
              <span className="event-date">{e.date}</span>
              <div>
                <h2>{e.title}</h2>
                <p>{e.details}<br />{e.location}</p>
              </div>
              <button className="outline-button">Reservar <ArrowUpRight /></button>
            </div>
            {e.images && (
              <div className="event-images">
                {e.images.map(i => <Image key={i.src} src={i.src} alt={i.alt} width={i.width} height={i.height} sizes="(max-width: 768px) 100vw, 80vw" />)}
              </div>
            )}
          </article>
        ))}
      </div>
      <div className="archive">
        <p className="eyebrow">Arquivo</p>
        <div className="archive-grid">
          {past.map(e => (
            <article key={e.id}>
              <div className="archive-image"><Image src={e.image!} alt={`Registro do encontro ${e.title}`} fill sizes="(max-width: 768px) 100vw, 50vw" /></div>
              <p className="event-date">{e.date}</p>
              <h3>{e.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="page-section about-page">
      <div className="about-photo">
        <Image src={aboutImage} alt="Uma pedra de pirita dourada na palma da mão" fill sizes="(max-width: 768px) 100vw, 40vw" />
      </div>
      <div className="about-copy">
        <p className="eyebrow">Sobre</p>
        <p>Faísca é um coletivo de artistas da presença que faz objetos de fogo e luz. Cada vela e cada castiçal é feito à mão, uma pequena peça para acompanhar a vida cotidiana.</p>
        <p>A vela é um convite ao ritual: um começo, uma pausa, um jeito de estar junto.</p>
      </div>
    </section>
  )
}

function ProductDetail({ product, onBack, onAdd }: { product: Product; onBack: () => void; onAdd: (p: Product) => void }) {
  return (
    <section className="detail-page">
      <button className="back-link" onClick={onBack}><ArrowLeft /> Objetos</button>
      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-photo"><Image src={product.image} alt={`Fotografia de ${product.name}`} fill sizes="(max-width: 768px) 100vw, 40vw" /></div>
          <div className="detail-photo second"><Image src={product.hoverImage} alt={`Detalhe de ${product.name}`} fill sizes="(max-width: 768px) 50vw, 20vw" /></div>
        </div>
        <div className="detail-info">
          <p className="eyebrow">{product.category} {product.stock === 1 && <span className="unique-badge">Peça única</span>}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">{money(product.price)}</p>
          <p className="detail-description">{product.description}</p>
          <button className="button add-button" onClick={() => onAdd(product)}>Adicionar ao carrinho <Plus /></button>
          <p className="shipping">Envio em até 5 dias úteis · frete calculado no checkout</p>
          <div className="accordion">
            <details open>
              <summary>Ficha técnica <ChevronDown /></summary>
              <dl>{product.specs.map(s => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>
            </details>
            <details>
              <summary>Feito por <ChevronDown /></summary>
              <p>{product.artist}</p>
            </details>
            <details>
              <summary>Ritual <ChevronDown /></summary>
              <p>Acenda sobre uma superfície estável. Quando terminar, reaproveite o recipiente como pequeno vaso ou para guardar o que importa.</p>
            </details>
          </div>
        </div>
      </div>
    </section>
  )
}

function Cart({ items, onClose, onChange }: { items: CartItem[]; onClose: () => void; onChange: (id: string, delta: number) => void }) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  return (
    <section className="cart-page">
      <button className="back-link" onClick={onClose}><ArrowLeft /> Continuar olhando</button>
      <div className="cart-heading">
        <p className="eyebrow">Carrinho</p>
        <h1>{items.length ? `${items.length} ${items.length === 1 ? 'peça' : 'peças'}` : 'Ainda vazio'}</h1>
      </div>
      {items.length ? (
        <>
          <div className="cart-items">
            {items.map(item => (
              <div className="cart-item" key={item.product.id}>
                <div className="cart-thumb"><Image src={item.product.image} alt="" fill sizes="100px" /></div>
                <div>
                  <h2>{item.product.name}</h2>
                  <p>{money(item.product.price)}</p>
                  <div className="quantity">
                    <button onClick={() => onChange(item.product.id, -1)} aria-label="Diminuir quantidade"><Minus /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onChange(item.product.id, 1)} aria-label="Aumentar quantidade"><Plus /></button>
                  </div>
                </div>
                <strong>{money(item.product.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <span>Subtotal</span>
            <strong>{money(subtotal)}</strong>
            <button className="button">Finalizar <ArrowUpRight /></button>
            <small>Checkout visual de protótipo · frete calculado na próxima etapa.</small>
          </div>
        </>
      ) : (
        <p className="empty-cart">Escolha um objeto para começar.</p>
      )}
    </section>
  )
}

export default function FaiscaSite() {
  const [view, setView] = useState<View>('home')
  const [selected, setSelected] = useState<Product | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const go: Navigate = next => { setSelected(null); setView(next); toTop() }
  const open = (p: Product) => { setSelected(p); setView('product'); toTop() }
  const add = (p: Product) => {
    setCart(items => {
      const found = items.find(i => i.product.id === p.id)
      return found ? items.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i) : [...items, { product: p, quantity: 1 }]
    })
    setSelected(null); setView('cart'); toTop()
  }
  const change = (id: string, delta: number) =>
    setCart(items => items.map(i => i.product.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity))

  return (
    <>
      <Header onHero={view === 'home'} cartCount={cartCount} onNavigate={go} />
      <main>
        {view === 'home' && <Home onSelect={open} onNavigate={go} />}
        {view === 'objects' && <Objects onSelect={open} />}
        {view === 'events' && <EventList />}
        {view === 'about' && <About />}
        {view === 'product' && selected && <ProductDetail product={selected} onBack={() => go('objects')} onAdd={add} />}
        {view === 'cart' && <Cart items={cart} onClose={() => go('objects')} onChange={change} />}
      </main>
      <Footer onNavigate={go} />
      <nav className="mobile-nav" aria-label="Navegação principal">
        <button onClick={() => go('objects')}>Objetos</button>
        <button onClick={() => go('events')}>Encontros</button>
        <button onClick={() => go('about')}>Sobre</button>
      </nav>
    </>
  )
}
