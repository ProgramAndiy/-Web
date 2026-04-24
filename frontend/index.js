// ─── DATA ─────────────────────────────────────────────────────────────────────
const { useState, useEffect } = React;
const API_URL = "http://localhost:5000/api";

const PRODUCTS = [
  { id: 1,  name: "Круасан масляний",         price: 28,  category: "sweet", emoji: "🥐", desc: "Хрустке тісто з вершковим маслом, золотиста скоринка, ніжна серединка." },
  { id: 2,  name: "Пиріг з м'ясом",           price: 65,  category: "meat",  emoji: "🥧", desc: "Соковита яловичина з цибулею в пишному дріжджовому тісті." },
  { id: 3,  name: "Шоколадний еклер",         price: 35,  category: "sweet", emoji: "🍫", desc: "Заварне тісто, вершковий крем, глазур з чорного шоколаду." },
  { id: 4,  name: "Хліб «Львівський»",        price: 40,  category: "bread", emoji: "🍞", desc: "Житньо-пшеничний хліб на заквасці з кмином та коріандром." },
  { id: 5,  name: "Пирожок з капустою",       price: 32,  category: "meat",  emoji: "🥟", desc: "Тушкована капуста з курятиною, запечено до золотистої скоринки." },
  { id: 6,  name: "Медовик",                  price: 90,  category: "sweet", emoji: "🍯", desc: "Класичний медовий торт з ніжним заварним кремом — 500г." },
  { id: 7,  name: "Плетінка з маком",         price: 55,  category: "sweet", emoji: "🥨", desc: "Здобне плетене тісто з маковою начинкою та цукровою глазур'ю." },
  { id: 8,  name: "Пиріг з печінкою",         price: 58,  category: "meat",  emoji: "🫓", desc: "Куряча печінка з морквою і цибулею у листковому тісті." },
  { id: 9,  name: "Булочка «Синабон»",        price: 45,  category: "sweet", emoji: "🌀", desc: "Американська булочка з корицею та вершковим крем-чизом." },
  { id: 10, name: "Багет французький",        price: 38,  category: "bread", emoji: "🥖", desc: "Традиційний білий багет: хрустка скоринка, повітряна м'якоть." },
  { id: 11, name: "Штрудель яблучний",        price: 72,  category: "sweet", emoji: "🍎", desc: "Листкове тісто з карамельними яблуками, корицею і горіхами." },
  { id: 12, name: "Сосиска в тісті",          price: 28,  category: "meat",  emoji: "🌭", desc: "Свіжа свиняча сосиска у хрусткому здобному тісті." },
];

const PARTNERS = [
  { name: "Novus Lviv",       city: "Львів",                icon: "🛒" },
  { name: "Silpo",            city: "Стрий, Трускавець",    icon: "🏪" },
  { name: "АТБ Маркет",      city: "Мукачеве, Самбір",     icon: "🏬" },
  { name: "Auchan",           city: "Львів (ТРЦ Forum)",    icon: "🏢" },
  { name: "Gastro Lviv",      city: "Дрогобич",             icon: "🍽️" },
  { name: "Metro Cash&Carry", city: "Червоноград",          icon: "📦" },
];

const TEAM = [
  { name: "Олена Коваль",   role: "Шеф-кондитер",        img: "/uploads/worker-1.png" },
  { name: "Богдан Мельник", role: "Майстер-пекар",        img: "/uploads/worker-2.png" },
  { name: "Ірина Лисак",   role: "Технолог виробництва", img: "/uploads/worker-3.png" },
  { name: "Тарас Гнатів",  role: "Керівник логістики",   img: "/uploads/worker-4.png" },
];

const VALUES = [
  { icon: "🌾", title: "Натуральні інгредієнти",  desc: "Тільки локальне борошно, фермерські яйця та вершкове масло без консервантів і штучних барвників." },
  { icon: "🔥", title: "Щоденна свіжа випічка",   desc: "Щодня о 5-й ранку ми починаємо пекти. На полицях — завжди свіжий хліб і здоба." },
  { icon: "🌍", title: "Підтримка місцевих",       desc: "90% постачальників — фермери Львівщини. Ми будуємо економіку регіону разом." },
  { icon: "❤️", title: "Традиції та інновації",   desc: "Поєднуємо рецепти бабусь з сучасними техніками ферментації та випікання." },
];

const DELIVERY_FEE = 50;
const FREE_DELIVERY_FROM = 400;
const BADGE_MAP = {
  sweet: ["badge-sweet", "Солодке"],
  meat:  ["badge-meat",  "М'ясне"],
  bread: ["badge-bread", "Хліб"],
};
const FILTERS = [
  { key: "all",   label: "Усі" },
  { key: "sweet", label: "🍰 Солодкі" },
  { key: "meat",  label: "🥩 З м'ясом" },
  { key: "bread", label: "🍞 Хліб" },
];

const STATUS_LABELS = {
  pending:   "⏳ Очікує",
  confirmed: "✅ Підтверджено",
  completed: "🎉 Виконано",
  cancelled: "❌ Скасовано",
};

const fmtPrice = (n) => `${n} грн`;
const todayStr = new Date().toISOString().split("T")[0];

// ─── APP ──────────────────────────────────────────────────────────────────────
function App() {
  const [page, setPage]           = useState("home");
  const [adminTab, setAdminTab]   = useState("orders");
  const [modal, setModal]         = useState(null);
  const [authMode, setAuthMode]   = useState("user");
  const [user, setUser]           = useState(() => {
    try { return JSON.parse(localStorage.getItem("userFull") || "null"); } catch { return null; }
  });
  const [formData, setFormData]   = useState({ name:"", email:"", password:"", adminCode:"" });
  const [formStep, setFormStep]   = useState("form");
  const [searchQ, setSearchQ]     = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [scrolled, setScrolled]   = useState(false);
  const [cart, setCart]           = useState([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [cartTab, setCartTab]     = useState("items");
  const [orderDone, setOrderDone] = useState(false);
  const [bumpKey, setBumpKey]     = useState(0);
  const [delivery, setDelivery]   = useState({ name:"", phone:"", email:"", address:"", city:"", date:"", comment:"" });
  const [dbProducts, setDbProducts] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userOrders, setUserOrders]   = useState([]);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name:"" });

  // Завантажити товари з API при старті
  useEffect(() => {
    const loadProductsFromDB = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) {
          const data = await response.json();
          const transformed = data.map(p => ({
            id: p.id,
            name: p.name,
            price: parseInt(p.price),
            category: p.category_id === 1 ? "sweet" : p.category_id === 2 ? "meat" : "bread",
            emoji: p.emoji || "📦",
            desc: p.description || "",
            image_url: p.image_url || null
          }));
          setDbProducts(transformed);
        }
      } catch (e) {
        console.log("API недоступний, використовую локальні товари");
      }
    };
    loadProductsFromDB();
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [page]);

  const navigate = (p) => { setPage(p); window.scrollTo(0,0); };
  const openModal = (type) => { setModal(type); setFormStep("form"); setFormData({ name:"", email:"", password:"", adminCode:"" }); };
  const closeModal = () => setModal(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = modal === "login" ? "/users/login" : "/users/register";
      const payload = {
        email: formData.email,
        password: formData.password,
        ...(modal === "register" && { name: formData.name }),
        ...(authMode === "admin" && { adminCode: formData.adminCode })
      };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ Помилка: ${data.error || "Невідома помилка"}`);
        return;
      }

      const userRole = data.user?.role || (authMode === "admin" ? "admin" : "user");
      const fullUser = {
        id: data.user?.id,
        name: data.user?.name || formData.name || formData.email.split("@")[0],
        email: data.user?.email,
        role: userRole,
        token: data.token
      };
      setUser(fullUser);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userFull", JSON.stringify(fullUser));

      setFormStep("success");
      setTimeout(closeModal, 2000);
    } catch (err) {
      alert("❌ Помилка підключення до сервера. Переконайтеся, що він запущений на http://localhost:5000");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userFull");
    setProfileOpen(false);
    setUserOrders([]);
  };

  const openProfile = async () => {
    setProfileOpen(true);
    setEditProfile(false);
    setProfileForm({ name: user?.name || "" });
    if (user?.id) {
      try {
        const headers = { "Authorization": `Bearer ${user.token}` };
        const res = await fetch(`${API_URL}/orders/user/${user.id}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setUserOrders(Array.isArray(data) ? data : []);
        }
      } catch (e) { setUserOrders([]); }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${user.token}` },
        body: JSON.stringify({ name: profileForm.name })
      });
      if (!res.ok) throw new Error();
      const updated = { ...user, name: profileForm.name };
      setUser(updated);
      localStorage.setItem("userFull", JSON.stringify(updated));
      setEditProfile(false);
      alert("✅ Профіль оновлено!");
    } catch (e) {
      alert("❌ Помилка оновлення профілю");
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? {...i, qty: i.qty+1} : i);
      return [...prev, {...product, qty:1}];
    });
    setBumpKey(k => k+1);
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const changeQty = (id, delta) => setCart(prev => prev.map(i => i.id===id ? {...i, qty: Math.max(1, i.qty+delta)} : i));

  const cartCount    = cart.reduce((s,i) => s+i.qty, 0);
  const cartSubtotal = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const deliveryFee  = cartSubtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const cartTotal    = cartSubtotal + deliveryFee;

  // ВИПРАВЛЕНО: тепер відправляє замовлення на бекенд
  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      const orderPayload = {
        user_id:          user?.id || null,
        customer_name:    delivery.name,
        customer_email:   delivery.email,
        customer_phone:   delivery.phone,
        delivery_city:    delivery.city,
        delivery_street:  delivery.address,
        delivery_date:    delivery.date,
        delivery_comment: delivery.comment,
        subtotal:         cartSubtotal,
        delivery_fee:     deliveryFee,
        items: cart.map(i => ({
          product_id:    i.id,
          product_name:  i.name,
          product_price: i.price,
          quantity:      i.qty
        }))
      };

      const headers = { "Content-Type": "application/json" };
      if (user?.token) headers["Authorization"] = `Bearer ${user.token}`;

      const response = await fetch(`${API_URL}/orders/create`, {
        method: "POST",
        headers,
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const err = await response.json();
        alert(`❌ ${err.error || "Помилка оформлення замовлення"}`);
        return;
      }

      setOrderDone(true);
      setTimeout(() => {
        setCart([]); setCartOpen(false); setCartTab("items"); setOrderDone(false);
        setDelivery({ name:"", phone:"", email:"", address:"", city:"", date:"", comment:"" });
      }, 3000);
    } catch (err) {
      alert("❌ Помилка підключення до сервера");
    }
  };

  const productsToUse = dbProducts || PRODUCTS;
  const filtered = productsToUse.filter(p => {
    const ms = p.name.toLowerCase().includes(searchQ.toLowerCase());
    const mf = activeFilter === "all" || p.category === activeFilter;
    return ms && mf;
  });

  return (
    <>
      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => navigate("home")}>
          Сучасна <span>Пекарня</span>
        </div>
        <ul className="nav-links">
          {[["home","Головна"],["products","Товари"],["about","Про нас"]].map(([p,l]) => (
            <li key={p}><a className={page===p?"active":""} onClick={() => navigate(p)}>{l}</a></li>
          ))}
        </ul>
        <div className="nav-right">
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 Кошик
            {cartCount > 0 && <span key={bumpKey} className="cart-count bump">{cartCount}</span>}
          </button>
          {user ? (
            <div className="user-badge">
              <div className="user-avatar" onClick={openProfile} style={{cursor:"pointer"}} title="Мій профіль">
                {user.name[0].toUpperCase()}
              </div>
              <div onClick={openProfile} style={{cursor:"pointer"}}>
                <div className="user-name">{user.name}</div>
                <div className="user-role-label">{user.role==="admin" ? "👑 Адмін" : "Користувач"}</div>
              </div>
              {user.role === "admin" && (
                <button className="admin-btn" title="Адмін-панель" onClick={() => navigate("admin")}>⚙️</button>
              )}
              <button className="logout-btn" onClick={handleLogout}>✕</button>
            </div>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => openModal("login")}>Увійти</button>
              <button className="btn btn-fill"    onClick={() => openModal("register")}>Реєстрація</button>
            </>
          )}
        </div>
      </nav>

      {/* PAGES */}
      {page==="home"     && <HomePage navigate={navigate} addToCart={addToCart} dbProducts={dbProducts} />}
      {page==="products" && <ProductsPage filtered={filtered} searchQ={searchQ} setSearchQ={setSearchQ} activeFilter={activeFilter} setActiveFilter={setActiveFilter} addToCart={addToCart} />}
      {page==="about"    && <AboutPage />}
      {page==="admin"    && user?.role==="admin" && <AdminPage adminTab={adminTab} setAdminTab={setAdminTab} dbProducts={dbProducts} setDbProducts={setDbProducts} token={user?.token} />}

      {/* AUTH MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) closeModal(); }}>
          <div className="modal">
            <button className="modal-close" onClick={closeModal}>✕</button>
            {formStep==="success" ? (
              <div className="success-msg">
                <div className="success-icon">🎉</div>
                <h3>Ласкаво просимо, {user?.name}!</h3>
                <p>{user?.role==="admin" ? "Ви увійшли як адміністратор." : "Реєстрацію успішно завершено."}</p>
              </div>
            ) : (
              <>
                <div className="modal-logo">Сучасна <span>Пекарня</span></div>
                <h2>{modal==="login" ? "Увійти" : "Реєстрація"}</h2>
                <p className="modal-sub">{modal==="login" ? "Раді бачити вас знову!" : "Створіть обліковий запис"}</p>
                <div className="role-tabs">
                  <button className={`role-tab${authMode==="user"?" active":""}`} onClick={() => setAuthMode("user")}>👤 Користувач</button>
                  <button className={`role-tab${authMode==="admin"?" active":""}`} onClick={() => setAuthMode("admin")}>👑 Адмін</button>
                </div>
                {authMode==="admin" && (
                  <div className="admin-note">ℹ️ Доступ адміністратора потребує секретного коду.</div>
                )}
                <form onSubmit={handleAuth}>
                  {modal==="register" && (
                    <div className="form-group">
                      <label className="form-label">Ім'я та прізвище</label>
                      <input className="form-input" type="text" placeholder="Іван Франко" required value={formData.name} onChange={e => setFormData({...formData, name:e.target.value})} />
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="example@gmail.com" required value={formData.email} onChange={e => setFormData({...formData, email:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Пароль</label>
                    <input className="form-input" type="password" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({...formData, password:e.target.value})} />
                  </div>
                  {authMode==="admin" && (
                    <div className="form-group">
                      <label className="form-label">Код адміністратора</label>
                      <input className="form-input" type="password" placeholder="••••••" required value={formData.adminCode} onChange={e => setFormData({...formData, adminCode:e.target.value})} />
                    </div>
                  )}
                  <div className="form-action">
                    <button type="submit" className="btn btn-fill btn-block">{modal==="login" ? "Увійти" : "Зареєструватися"}</button>
                  </div>
                </form>
                <div className="modal-switch">
                  {modal==="login"
                    ? <><span>Немає акаунту? </span><a onClick={() => openModal("register")}>Зареєструватися</a></>
                    : <><span>Вже є акаунт? </span><a onClick={() => openModal("login")}>Увійти</a></>
                  }
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {profileOpen && user && (
        <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setProfileOpen(false); }}>
          <div className="modal" style={{maxWidth:"560px",maxHeight:"80vh",overflowY:"auto"}}>
            <button className="modal-close" onClick={() => setProfileOpen(false)}>✕</button>
            <div className="modal-logo">Сучасна <span>Пекарня</span></div>
            <h2>👤 Мій профіль</h2>

            {editProfile ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label className="form-label">Ім'я та прізвище</label>
                  <input className="form-input" type="text" required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name:e.target.value})} />
                </div>
                <div style={{display:"flex",gap:"12px",marginTop:"16px"}}>
                  <button type="submit" className="btn btn-fill">💾 Зберегти</button>
                  <button type="button" className="btn btn-outline" onClick={() => setEditProfile(false)}>Скасувати</button>
                </div>
              </form>
            ) : (
              <div style={{marginBottom:"20px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"16px"}}>
                  <div style={{width:"56px",height:"56px",borderRadius:"50%",background:"var(--brown-dark)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:"1.4rem"}}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:"1.1rem",color:"var(--brown-dark)"}}>{user.name}</div>
                    <div style={{fontSize:"0.85rem",color:"var(--text-muted)"}}>{user.email}</div>
                    <div style={{fontSize:"0.75rem",marginTop:"4px",padding:"2px 10px",borderRadius:"20px",background:user.role==="admin"?"var(--gold)":"var(--cream)",color:"var(--brown-dark)",display:"inline-block"}}>
                      {user.role === "admin" ? "👑 Адміністратор" : "👤 Користувач"}
                    </div>
                  </div>
                </div>
                <button className="btn btn-outline" style={{fontSize:"0.8rem",padding:"8px 16px"}} onClick={() => setEditProfile(true)}>✏️ Редагувати профіль</button>
              </div>
            )}

            <div style={{borderTop:"1px solid var(--border)",paddingTop:"20px",marginTop:"8px"}}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",marginBottom:"14px"}}>📦 Мої замовлення</h3>
              {userOrders.length === 0 ? (
                <div style={{textAlign:"center",padding:"24px",color:"var(--text-muted)"}}>
                  <div style={{fontSize:"2rem",marginBottom:"8px"}}>🧺</div>
                  <p>Ще немає замовлень</p>
                </div>
              ) : userOrders.map(o => (
                <div key={o.id} style={{background:"var(--warm-white)",borderRadius:"10px",padding:"14px",marginBottom:"10px",border:"1px solid var(--border)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
                    <span style={{fontWeight:600,color:"var(--brown-dark)"}}>Замовлення #{o.id}</span>
                    <span style={{fontSize:"0.8rem",padding:"3px 10px",borderRadius:"20px",background:"var(--cream)",color:"var(--brown-dark)"}}>
                      {STATUS_LABELS[o.status] || o.status}
                    </span>
                  </div>
                  {o.items?.length > 0 && (
                    <div style={{fontSize:"0.85rem",color:"var(--text-muted)",marginBottom:"6px"}}>
                      {o.items.map(i => `${i.product_name} ×${i.quantity}`).join(", ")}
                    </div>
                  )}
                  <div style={{fontWeight:600,color:"var(--gold-dark)"}}>{fmtPrice(o.total_price || o.total)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <>
          <div className="cart-overlay" onClick={() => setCartOpen(false)} />
          <div className="cart-drawer">
            <div className="cart-header">
              <div>
                <h2>🛒 Кошик</h2>
                <div className="cart-header-sub">{cartCount} {cartCount===1?"товар":cartCount<5?"товари":"товарів"}</div>
              </div>
              <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="cart-tabs">
              <button className={`cart-tab${cartTab==="items"?" active":""}`} onClick={() => setCartTab("items")}>
                Товари {cartCount>0 && `(${cartCount})`}
              </button>
              <button className={`cart-tab${cartTab==="checkout"?" active":""}`} onClick={() => setCartTab("checkout")} disabled={cart.length===0}>
                Оформлення
              </button>
            </div>
            <div className="cart-body">
              {orderDone ? (
                <div className="order-success">
                  <div className="ok-icon">✅</div>
                  <h3>Замовлення прийнято!</h3>
                  <p>Дякуємо! Ми зв'яжемося з вами для підтвердження доставки.</p>
                </div>
              ) : cartTab==="items" ? (
                cart.length===0 ? (
                  <div className="cart-empty">
                    <div className="empty-icon">🧺</div>
                    <h3>Кошик порожній</h3>
                    <p>Додайте смачні товари з меню!</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-img">{item.emoji}</div>
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">{fmtPrice(item.price)} / шт</div>
                        <div className="cart-item-qty">
                          <button className="qty-btn" onClick={() => changeQty(item.id,-1)}>−</button>
                          <span className="qty-num">{item.qty}</span>
                          <button className="qty-btn" onClick={() => changeQty(item.id,+1)}>+</button>
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"8px"}}>
                        <div className="cart-item-total">{fmtPrice(item.price*item.qty)}</div>
                        <button className="cart-remove" onClick={() => removeFromCart(item.id)}>🗑</button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                <form id="checkout-form" onSubmit={handleOrder}>
                  <div className="checkout-section">
                    <div className="checkout-section-title">👤 Контактні дані</div>
                    <div className="form-group">
                      <label className="form-label">Ім'я та прізвище *</label>
                      <input className="form-input" type="text" placeholder="Іван Франко" required value={delivery.name} onChange={e => setDelivery({...delivery,name:e.target.value})} />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Телефон *</label>
                        <input className="form-input" type="tel" placeholder="+38 093 000 00 00" required value={delivery.phone} onChange={e => setDelivery({...delivery,phone:e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input className="form-input" type="email" placeholder="you@email.com" required value={delivery.email} onChange={e => setDelivery({...delivery,email:e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="checkout-section">
                    <div className="checkout-section-title">📍 Адреса доставки</div>
                    <div className="form-group">
                      <label className="form-label">Місто *</label>
                      <input className="form-input" type="text" placeholder="Львів" required value={delivery.city} onChange={e => setDelivery({...delivery,city:e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Вулиця, будинок, квартира *</label>
                      <input className="form-input" type="text" placeholder="вул. Городоцька 56, кв. 12" required value={delivery.address} onChange={e => setDelivery({...delivery,address:e.target.value})} />
                    </div>
                  </div>
                  <div className="checkout-section">
                    <div className="checkout-section-title">📅 Дата доставки</div>
                    <div className="form-group">
                      <label className="form-label">Бажана дата *</label>
                      <input className="form-input" type="date" required min={todayStr} value={delivery.date} onChange={e => setDelivery({...delivery,date:e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Коментар</label>
                      <input className="form-input" type="text" placeholder="Наприклад: зателефонуйте за 30 хв" value={delivery.comment} onChange={e => setDelivery({...delivery,comment:e.target.value})} />
                    </div>
                  </div>
                </form>
              )}
            </div>
            {!orderDone && cart.length>0 && (
              <div className="cart-footer">
                {deliveryFee===0 ? (
                  <div className="delivery-badge">🎉 Безкоштовна доставка для вашого замовлення!</div>
                ) : (
                  <div className="delivery-badge">🚚 До безкоштовної доставки: {fmtPrice(FREE_DELIVERY_FROM-cartSubtotal)}</div>
                )}
                <div className="price-row">
                  <span>Сума товарів:</span><span>{fmtPrice(cartSubtotal)}</span>
                </div>
                <div className="price-row">
                  <span>Доставка:</span><span>{deliveryFee===0 ? "Безкоштовно 🎉" : fmtPrice(deliveryFee)}</span>
                </div>
                <div className="price-divider"></div>
                <div className="price-row total">
                  <span>Разом:</span><span>{fmtPrice(cartTotal)}</span>
                </div>
                {cartTab==="items" ? (
                  <button className="btn btn-gold btn-block" style={{marginTop:"16px"}} onClick={() => setCartTab("checkout")}>
                    Оформити замовлення →
                  </button>
                ) : (
                  <button type="submit" form="checkout-form" className="btn btn-fill btn-block" style={{marginTop:"16px"}}>
                    ✅ Підтвердити замовлення
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Сучасна <span>Пекарня</span></h3>
            <p>Щодня о 5-й ранку ми печемо для вас. Натуральні інгредієнти, традиційні рецепти, сучасний підхід.</p>
          </div>
          <div>
            <h4>Меню</h4>
            <ul>
              <li><a onClick={() => navigate("home")}>Головна</a></li>
              <li><a onClick={() => navigate("products")}>Товари</a></li>
              <li><a onClick={() => navigate("about")}>Про нас</a></li>
            </ul>
          </div>
          <div>
            <h4>Контакти</h4>
            <ul>
              <li>📍 вул. Городоцька 56, Львів</li>
              <li>📞 +38 032 123-45-67</li>
              <li>✉️ hello@suchasna.lviv.ua</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2025 <span>Сучасна Пекарня</span> — Смак, що об'єднує</div>
          <div>Зроблено з 🤍 у Львові</div>
        </div>
      </footer>
    </>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ navigate, addToCart, dbProducts }) {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Пекарня · Львів · З 1998 року</div>
          <h1>Сучасна <em>випічка</em> з серцем</h1>
          <p>Щоденна свіжість, натуральні інгредієнти та рецепти, що передаються від бабусі до онуків</p>
          <div className="hero-cta">
            <button className="btn btn-fill" style={{padding:"14px 32px",fontSize:"0.9rem"}} onClick={() => navigate("products")}>Переглянути товари</button>
            <button className="btn btn-outline" style={{padding:"14px 32px",fontSize:"0.9rem"}} onClick={() => navigate("about")}>Про нас</button>
          </div>
        </div>
        <div className="hero-scroll">Гортайте вниз</div>
      </section>

      <div style={{background:"white",borderBottom:"1px solid var(--border)",padding:"32px 40px"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"24px"}}>
          {[["🌾","100% натуральне","Без консервантів"],["🔥","Свіжо щодня","Випікаємо з 5:00"],["🚚","Доставка","По Львівщині"],["🏆","25 років","досвіду"]].map(([ico,t,s]) => (
            <div key={t} style={{textAlign:"center",padding:"8px"}}>
              <div style={{fontSize:"2rem",marginBottom:"8px"}}>{ico}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:700,color:"var(--brown-dark)"}}>{t}</div>
              <div style={{fontSize:"0.8rem",color:"var(--text-muted)"}}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-header reveal">
          <span className="section-label">Хіти продажів</span>
          <h2 className="section-title">Найулюбленіше <em>від покупців</em></h2>
          <div className="divider"></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"24px"}}>
          {(dbProducts || PRODUCTS).slice(0,4).map(p => {
            const [bc,bl] = BADGE_MAP[p.category]||["badge-other","Інше"];
            return (
              <div key={p.id} className="product-card reveal">
                <div className="product-img" style={{position:"relative",overflow:"hidden"}}>
                  {p.image_url
                    ? <img src={`http://localhost:5000${p.image_url}`} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0,borderRadius:"16px 16px 0 0"}} />
                    : <><div className="product-img-bg"></div><span className="product-emoji">{p.emoji}</span></>
                  }
                  <span className={`product-badge ${bc}`} style={{position:"relative",zIndex:1}}>{bl}</span>
                </div>
                <div className="product-body">
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">{p.desc}</div>
                  <div className="product-footer">
                    <div className="product-price">{fmtPrice(p.price)} <span>/ шт</span></div>
                    <button className="btn btn-fill" style={{padding:"8px 18px",fontSize:"0.75rem"}} onClick={() => addToCart(p)}>В кошик</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{textAlign:"center",marginTop:"40px"}}>
          <button className="btn btn-fill" style={{padding:"14px 40px"}} onClick={() => navigate("products")}>Усі товари →</button>
        </div>
      </div>

      <section className="partners-section">
        <div className="partners-inner">
          <div className="section-header">
            <span className="section-label">Наші партнери</span>
            <h2 className="section-title" style={{color:"white"}}>Ми постачаємо до <em style={{color:"var(--gold-light)"}}>великих компаній</em></h2>
            <div className="divider"></div>
            <p style={{color:"rgba(255,255,255,0.5)",marginTop:"16px",fontSize:"0.9rem"}}>Наша продукція в найбільших мережах Львівщини</p>
          </div>
          <div className="partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="partner-card">
                <div className="partner-icon">{p.icon}</div>
                <div className="partner-info">
                  <div className="partner-name">{p.name}</div>
                  <div className="partner-city">{p.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{background:"var(--warm-white)",padding:"0 0 80px"}}>
        <div className="section" style={{paddingBottom:0}}>
          <div className="section-header reveal">
            <span className="section-label">Де нас знайти</span>
            <h2 className="section-title">Наша <em>пекарня</em></h2>
            <div className="divider"></div>
          </div>
        </div>
        <div style={{maxWidth:"1200px",margin:"0 auto",padding:"0 40px"}}>
          <div className="map-container reveal">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=24.0097%2C49.8197%2C24.0497%2C49.8597&layer=mapnik&marker=49.8397%2C24.0297"
              style={{width:"100%",height:"420px",border:"none",borderRadius:"20px",display:"block"}}
              allowFullScreen
              loading="lazy"
              title="Сучасна Пекарня на карті"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────
function ProductsPage({ filtered, searchQ, setSearchQ, activeFilter, setActiveFilter, addToCart }) {
  return (
    <div className="products-page">
      <div className="products-hero">
        <h1>Наша випічка</h1>
        <p>Щоденна свіжість, натуральні інгредієнти, щира любов до справи</p>
      </div>
      <div className="search-filter-bar">
        <div className="search-input-wrap">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input className="search-input" placeholder="Пошук за назвою..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
        </div>
        <div className="filter-tags">
          {FILTERS.map(f => (
            <button key={f.key} className={`tag${activeFilter===f.key?" active":""}`} onClick={() => setActiveFilter(f.key)}>{f.label}</button>
          ))}
        </div>
      </div>
      {filtered.length===0 ? (
        <div className="no-results">
          <div className="emoji">🔍</div>
          <h3>Нічого не знайдено</h3>
          <p>Спробуйте змінити запит або фільтр</p>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map(p => {
            const [bc,bl] = BADGE_MAP[p.category]||["badge-other","Інше"];
            return (
              <div key={p.id} className="product-card">
                <div className="product-img">
                  {p.image_url
                    ? <img src={`http://localhost:5000${p.image_url}`} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"16px 16px 0 0",position:"absolute",inset:0}} />
                    : <><div className="product-img-bg"></div><span className="product-emoji">{p.emoji}</span></>
                  }
                  <span className={`product-badge ${bc}`} style={{position:"relative",zIndex:1}}>{bl}</span>
                </div>
                <div className="product-body">
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">{p.desc}</div>
                  <div className="product-footer">
                    <div className="product-price">{fmtPrice(p.price)} <span>/ шт</span></div>
                    <button className="btn btn-fill" style={{padding:"8px 18px",fontSize:"0.75rem"}} onClick={() => addToCart(p)}>В кошик</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div className="about-page">
      <div style={{background:"linear-gradient(135deg,#F0E6D3 0%,var(--cream) 100%)",paddingTop:"70px"}}>
        <div className="about-hero">
          <div className="about-hero-text">
            <span style={{fontSize:"0.7rem",fontWeight:600,letterSpacing:"3px",textTransform:"uppercase",color:"var(--gold)",marginBottom:"12px",display:"block"}}>Наша історія</span>
            <h1>Пекарня, що пахне <em style={{color:"var(--brown-mid)",fontStyle:"italic"}}>домом</em></h1>
            <p>У 1998 році Олена Коваль відкрила невеличку пекарню на Городоцькій. Сьогодні ми — команда з 45 фахівців, яка щодня постачає свіжу випічку до найбільших магазинів Львівщини.</p>
            <p>Наш принцип не змінився: тільки натуральні інгредієнти, традиційні рецепти і щира любов до своєї справи.</p>
            <div style={{display:"flex",gap:"16px",marginTop:"28px",flexWrap:"wrap"}}>
              {[["25+","років досвіду"],["45","майстрів"],["3000+","порцій/день"]].map(([n,l]) => (
                <div key={l} style={{background:"white",borderRadius:"12px",padding:"16px 24px",border:"1px solid var(--border)"}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:700,color:"var(--brown-dark)"}}>{n}</div>
                  <div style={{fontSize:"0.75rem",color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"1px"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="about-visual">
            <span className="big-emoji">🏭</span>
            <div className="about-stats">
              {[["6","Торгових мереж"],["18","Локацій"],["50+","Видів випічки"],["🌟","Якість ISO"]].map(([n,l]) => (
                <div key={l} className="stat-box">
                  <div className="stat-num">{n}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-header reveal">
          <span className="section-label">Наші цінності</span>
          <h2 className="section-title">Що <em>відрізняє</em> нас</h2>
          <div className="divider"></div>
        </div>
        <div className="values-grid">
          {VALUES.map(v => (
            <div key={v.title} className="value-card reveal">
              <div className="value-icon">{v.icon}</div>
              <div className="value-title">{v.title}</div>
              <div className="value-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"var(--warm-white)"}}>
        <div className="section">
          <div className="section-header reveal">
            <span className="section-label">Команда</span>
            <h2 className="section-title">Люди, що <em>стоять за смаком</em></h2>
            <div className="divider"></div>
          </div>
          <div className="team-grid">
            {TEAM.map(m => (
              <div key={m.name} className="team-card reveal">
                <div className="team-avatar" style={{padding:0,overflow:"hidden",background:"var(--beige-light)"}}>
                  <img src={`http://localhost:5000${m.img}`} alt={m.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
                </div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{background:"var(--brown-dark)",padding:"80px 40px",textAlign:"center"}}>
        <div style={{maxWidth:"600px",margin:"0 auto"}}>
          <span style={{fontSize:"0.7rem",fontWeight:600,letterSpacing:"3px",textTransform:"uppercase",color:"var(--gold)",marginBottom:"12px",display:"block"}}>Хочете співпрацювати?</span>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:700,color:"white",marginBottom:"16px"}}>Стати нашим <em style={{color:"var(--gold-light)"}}>партнером</em></h2>
          <p style={{color:"rgba(255,255,255,0.6)",marginBottom:"32px",fontSize:"0.95rem"}}>Ми шукаємо нові торгові точки та мережі для розширення присутності на Львівщині</p>
          <button className="btn btn-gold" style={{padding:"14px 40px",fontSize:"0.9rem"}}>Написати нам</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
function AdminPage({ adminTab, setAdminTab, dbProducts, setDbProducts, token }) {
  const [orders, setOrders]         = useState([]);
  const [products, setProducts]     = useState(dbProducts || PRODUCTS);
  const [stats, setStats]           = useState(null);
  const [users, setUsers]           = useState([]);
  const [newProduct, setNewProduct] = useState({ name:"", price:"", category:"sweet", description:"", imageFile:null, imagePreview:null });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    if (adminTab === "orders")     loadOrders();
    if (adminTab === "statistics") loadStatistics();
    if (adminTab === "users")      loadUsers();
  }, [adminTab]);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token || localStorage.getItem("authToken")}`
  });
  const getAuthHeader = () => ({
    "Authorization": `Bearer ${token || localStorage.getItem("authToken")}`
  });

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/orders`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setOrders([
        { id: 1, customer_name: "Іван Петренко", total: 450, status: "pending",   items: [{product_name:"Круасан",   quantity:2}] },
        { id: 2, customer_name: "Олена Коваль",  total: 890, status: "completed", items: [{product_name:"Медовик",    quantity:1}] },
      ]);
    }
    setLoading(false);
  };

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/statistics`, { headers: getHeaders() });
      if (!res.ok) throw new Error();
      setStats(await res.json());
    } catch (e) { setStats(null); }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/users`, { headers: getHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) { setUsers([]); }
    setLoading(false);
  };

  // ВИПРАВЛЕНО: зміна статусу замовлення
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error();
      setOrders(prev => prev.map(o => o.id === orderId ? {...o, status} : o));
    } catch (e) { alert("❌ Помилка оновлення статусу"); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) { alert("Заповніть: назву та ціну"); return; }
    try {
      const fd = new FormData();
      fd.append("name",        newProduct.name);
      fd.append("price",       newProduct.price);
      fd.append("category",    newProduct.category);
      fd.append("description", newProduct.description);
      if (newProduct.imageFile) fd.append("image", newProduct.imageFile);

      const res = await fetch(`${API_URL}/admin/products`, {
        method: "POST", headers: getAuthHeader(), body: fd
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Помилка"); }
      const data = await res.json();
      const p = {
        id: data.product?.id || Date.now(),
        name: newProduct.name, price: parseFloat(newProduct.price),
        category: newProduct.category, emoji: "📦",
        desc: newProduct.description, description: newProduct.description,
        image_url: data.product?.image_url || null
      };
      setProducts(prev => [...prev, p]);
      if (dbProducts) setDbProducts([...dbProducts, p]);
      setNewProduct({ name:"", price:"", category:"sweet", description:"", imageFile:null, imagePreview:null });
      alert("✅ Товар додано!");
    } catch (err) { alert(`❌ ${err.message}`); }
  };

  // ВИПРАВЛЕНО: редагування товару
  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name",        editingProduct.name);
      fd.append("price",       editingProduct.price);
      fd.append("category",    editingProduct.category);
      fd.append("description", editingProduct.description || editingProduct.desc || "");
      if (editingProduct.imageFile) fd.append("image", editingProduct.imageFile);

      const res = await fetch(`${API_URL}/admin/products/${editingProduct.id}`, {
        method: "PUT", headers: getAuthHeader(), body: fd
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Помилка"); }
      const data = await res.json();
      const updated = {
        ...editingProduct,
        desc: editingProduct.description || editingProduct.desc,
        image_url: data.product?.image_url || editingProduct.image_url
      };
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
      if (dbProducts) setDbProducts(dbProducts.map(p => p.id === editingProduct.id ? updated : p));
      setEditingProduct(null);
      alert("✅ Товар оновлено!");
    } catch (err) { alert(`❌ ${err.message}`); }
  };

  const deleteProduct = async (productId) => {
    if (!confirm("Ви впевнені?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/products/${productId}`, { method:"DELETE", headers: getHeaders() });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Помилка"); }
      setProducts(prev => prev.filter(p => p.id !== productId));
      if (dbProducts) setDbProducts(dbProducts.filter(p => p.id !== productId));
    } catch (err) { alert(`❌ ${err.message}`); }
  };

  const deactivateUser = async (userId) => {
    if (!confirm("Деактивувати цього користувача?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/deactivate`, { method:"PUT", headers: getHeaders() });
      if (!res.ok) throw new Error();
      setUsers(prev => prev.map(u => u.id === userId ? {...u, is_active: false} : u));
    } catch (e) { alert("❌ Помилка деактивації"); }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>⚙️ Адмін-панель</h1>
        <p>Управління замовленнями, товарами та користувачами</p>
      </div>

      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"0 20px"}}>
        <div className="admin-tabs">
          {[["orders","📋 Замовлення"],["products","📦 Товари"],["statistics","📊 Статистика"],["users","👥 Користувачі"]].map(([key,label]) => (
            <button key={key} className={`admin-tab${adminTab===key?" active":""}`} onClick={() => setAdminTab(key)}>{label}</button>
          ))}
        </div>

        {/* ЗАМОВЛЕННЯ */}
        {adminTab === "orders" && (
          <div className="admin-orders">
            <h2>Всі замовлення</h2>
            {loading ? <div className="admin-loading">Завантаження...</div>
            : orders.length === 0 ? (
              <div className="admin-empty"><div className="admin-empty-icon">📋</div><p>Немає замовлень</p></div>
            ) : orders.map(o => (
              <div key={o.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-id">Замовлення #{o.id}</div>
                    <div className="order-customer">{o.customer_name}</div>
                    {o.customer_phone && <div style={{fontSize:"0.8rem",color:"var(--text-muted)"}}>{o.customer_phone}</div>}
                  </div>
                  <div className={`order-status ${o.status}`}>{STATUS_LABELS[o.status] || o.status}</div>
                </div>
                <div className="order-items">
                  <strong>Товари:</strong> {o.items?.map(i => `${i.product_name} (×${i.quantity})`).join(", ")}
                </div>
                <div className="order-total">Сума: {o.total_price || o.total} грн</div>
                {/* ВИПРАВЛЕНО: кнопки зміни статусу */}
                <div style={{display:"flex",gap:"8px",marginTop:"12px",flexWrap:"wrap"}}>
                  {o.status === "pending" && <>
                    <button className="btn btn-fill"    style={{fontSize:"0.75rem",padding:"6px 12px"}} onClick={() => updateOrderStatus(o.id,"confirmed")}>✅ Підтвердити</button>
                    <button className="btn btn-outline" style={{fontSize:"0.75rem",padding:"6px 12px"}} onClick={() => updateOrderStatus(o.id,"cancelled")}>❌ Скасувати</button>
                  </>}
                  {o.status === "confirmed" && <>
                    <button className="btn btn-fill"    style={{fontSize:"0.75rem",padding:"6px 12px"}} onClick={() => updateOrderStatus(o.id,"completed")}>🎉 Виконано</button>
                    <button className="btn btn-outline" style={{fontSize:"0.75rem",padding:"6px 12px"}} onClick={() => updateOrderStatus(o.id,"cancelled")}>❌ Скасувати</button>
                  </>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ТОВАРИ */}
        {adminTab === "products" && (
          <div className="admin-products">
            <h2>Управління товарами</h2>

            {/* ВИПРАВЛЕНО: форма редагування */}
            {editingProduct ? (
              <div className="add-product-section">
                <h3>✏️ Редагувати товар</h3>
                <form onSubmit={handleEditProduct} className="product-form">
                  <div className="form-row-grid">
                    <div className="form-group">
                      <input type="text" placeholder="Назва товару" required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <input type="number" placeholder="Ціна (грн)" required value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                      <option value="sweet">🍰 Солодкі</option>
                      <option value="meat">🥩 З м'ясом</option>
                      <option value="bread">🍞 Хліб</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <textarea placeholder="Опис товару" value={editingProduct.description || editingProduct.desc || ""} onChange={e => setEditingProduct({...editingProduct, description: e.target.value, desc: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label style={{fontSize:"0.85rem",fontWeight:600,color:"var(--brown-dark)",marginBottom:"6px",display:"block"}}>🖼 Зображення товару</label>
                    <input type="file" accept="image/*" style={{fontSize:"0.85rem"}} onChange={e => {
                      const file = e.target.files[0];
                      if (file) setEditingProduct({...editingProduct, imageFile: file, imagePreview: URL.createObjectURL(file)});
                    }} />
                    {(editingProduct.imagePreview || editingProduct.image_url) && (
                      <img
                        src={editingProduct.imagePreview || `http://localhost:5000${editingProduct.image_url}`}
                        alt="прев'ю"
                        style={{width:"100px",height:"100px",objectFit:"cover",borderRadius:"10px",marginTop:"10px",border:"2px solid var(--border)"}}
                      />
                    )}
                  </div>
                  <div style={{display:"flex",gap:"12px"}}>
                    <button type="submit" className="form-submit">💾 Зберегти</button>
                    <button type="button" className="btn btn-outline" onClick={() => setEditingProduct(null)}>Скасувати</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="add-product-section">
                <h3>➕ Додати новий товар</h3>
                <form onSubmit={handleAddProduct} className="product-form">
                  <div className="form-row-grid">
                    <div className="form-group">
                      <input type="text" placeholder="Назва товару" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <input type="number" placeholder="Ціна (грн)" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                      <option value="sweet">🍰 Солодкі</option>
                      <option value="meat">🥩 З м'ясом</option>
                      <option value="bread">🍞 Хліб</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <textarea placeholder="Опис товару (необов'язково)" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label style={{fontSize:"0.85rem",fontWeight:600,color:"var(--brown-dark)",marginBottom:"6px",display:"block"}}>🖼 Зображення товару</label>
                    <input type="file" accept="image/*" style={{fontSize:"0.85rem"}} onChange={e => {
                      const file = e.target.files[0];
                      if (file) setNewProduct({...newProduct, imageFile: file, imagePreview: URL.createObjectURL(file)});
                    }} />
                    {newProduct.imagePreview && (
                      <img
                        src={newProduct.imagePreview}
                        alt="прев'ю"
                        style={{width:"100px",height:"100px",objectFit:"cover",borderRadius:"10px",marginTop:"10px",border:"2px solid var(--border)"}}
                      />
                    )}
                  </div>
                  <button type="submit" className="form-submit">➕ Додати товар</button>
                </form>
              </div>
            )}

            <h2>Поточні товари</h2>
            <div className="products-display">
              {products.map(p => (
                <div key={p.id} className="product-card-admin">
                  {p.image_url
                    ? <img src={`http://localhost:5000${p.image_url}`} alt={p.name} style={{width:"72px",height:"72px",objectFit:"cover",borderRadius:"10px",border:"2px solid var(--border)"}} />
                    : <span className="product-emoji">{p.emoji || "📦"}</span>
                  }
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">{p.price} грн</div>
                  <div className="product-category">{BADGE_MAP[p.category]?.[1] || p.category}</div>
                  <div style={{display:"flex",gap:"8px",marginTop:"8px"}}>
                    <button className="btn btn-fill"    style={{fontSize:"0.75rem",padding:"6px 12px"}} onClick={() => setEditingProduct({...p, imageFile:null, imagePreview:null})}>✏️ Редагувати</button>
                    <button className="btn btn-outline" style={{fontSize:"0.75rem",padding:"6px 12px"}} onClick={() => deleteProduct(p.id)}>🗑 Видалити</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* СТАТИСТИКА */}
        {adminTab === "statistics" && (
          <div className="admin-statistics">
            <h2>📊 Статистика</h2>
            {loading ? <div className="admin-loading">Завантаження...</div>
            : !stats ? (
              <div className="admin-empty"><div className="admin-empty-icon">📊</div><p>Немає даних</p></div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"20px",marginTop:"20px"}}>
                {[
                  ["📦","Всього замовлень",  stats.total_orders || 0],
                  ["✅","Виконано",          stats.orders_by_status?.find(s=>s.status==="completed")?.count || 0],
                  ["⏳","Очікує",            stats.orders_by_status?.find(s=>s.status==="pending")?.count   || 0],
                  ["💰","Загальний дохід",  `${stats.total_revenue || 0} грн`],
                  ["👥","Клієнтів",          stats.total_users   || 0],
                  ["🍞","Товарів",           stats.total_products || 0],
                ].map(([ico,label,val]) => (
                  <div key={label} style={{background:"white",borderRadius:"16px",padding:"24px",border:"1px solid var(--border)",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                    <div style={{fontSize:"2rem",marginBottom:"8px"}}>{ico}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:700,color:"var(--brown-dark)"}}>{val}</div>
                    <div style={{fontSize:"0.8rem",color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"1px"}}>{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* КОРИСТУВАЧІ */}
        {adminTab === "users" && (
          <div className="admin-users">
            <h2>👥 Користувачі</h2>
            {loading ? <div className="admin-loading">Завантаження...</div>
            : users.length === 0 ? (
              <div className="admin-empty"><div className="admin-empty-icon">👥</div><p>Немає зареєстрованих користувачів</p></div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:"12px",marginTop:"16px"}}>
                {users.map(u => (
                  <div key={u.id} style={{background:"white",borderRadius:"12px",padding:"16px 20px",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
                      <div style={{width:"44px",height:"44px",borderRadius:"50%",background:"var(--brown-dark)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:"1.1rem"}}>
                        {u.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <div style={{fontWeight:600,color:"var(--brown-dark)"}}>{u.name}</div>
                        <div style={{fontSize:"0.85rem",color:"var(--text-muted)"}}>{u.email}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"}}>
                      <span style={{padding:"4px 12px",borderRadius:"20px",fontSize:"0.75rem",fontWeight:600,background:u.role==="admin"?"var(--gold)":"var(--cream)",color:"var(--brown-dark)"}}>
                        {u.role === "admin" ? "👑 Адмін" : "👤 Користувач"}
                      </span>
                      <span style={{padding:"4px 12px",borderRadius:"20px",fontSize:"0.75rem",fontWeight:600,background:u.is_active===false?"#ffe0e0":"#e0ffe0",color:u.is_active===false?"#c00":"#060"}}>
                        {u.is_active === false ? "❌ Деактивовано" : "✅ Активний"}
                      </span>
                      {u.is_active !== false && u.role !== "admin" && (
                        <button className="btn btn-outline" style={{fontSize:"0.75rem",padding:"6px 12px"}} onClick={() => deactivateUser(u.id)}>
                          Деактивувати
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MOUNT ────────────────────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
if (window.__appReady) window.__appReady();
