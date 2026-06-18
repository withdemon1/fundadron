/* =============================================================
   FundaDron — main.js
   Vanilla JS, sin dependencias. IIFE, robusto en file:// y FTP.
   v3 — galería, envío con punto de recogida y mapa InPost.
   ============================================================= */
(function () {
  "use strict";

  var BRAND = window.__FUNDADRON__ || { products: [], config: {}, bundle: null };
  var CFG = BRAND.config || {};
  var CURRENCY = CFG.currency || "EUR";
  var SHIP_PICKUP = typeof CFG.shippingPickup === "number" ? CFG.shippingPickup
                  : (typeof CFG.shippingFlat === "number" ? CFG.shippingFlat : 3.95);
  var FREE_FROM = typeof CFG.freeShippingFrom === "number" ? CFG.freeShippingFrom : 49;
  var shipMethod = "pickup"; /* único método de envío disponible */

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  function escHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }
  function fmt(n) { return n.toFixed(2).replace(".", ",") + " €"; }

  function findProduct(id) {
    if (BRAND.bundle && BRAND.bundle.id === id) {
      return { id: BRAND.bundle.id, name: BRAND.bundle.name, price: BRAND.bundle.price };
    }
    for (var i = 0; i < BRAND.products.length; i++) {
      if (BRAND.products[i].id === id) return BRAND.products[i];
    }
    return null;
  }

  /* ===========================================================
     Splash
     =========================================================== */
  function initSplash() {
    var splash = $("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    if (document.readyState === "complete") setTimeout(hide, 900);
    else window.addEventListener("load", function () { setTimeout(hide, 600); });
    setTimeout(hide, 4000); /* red de seguridad extra */
  }

  /* ===========================================================
     Nav: solidificar al hacer scroll + menú móvil
     =========================================================== */
  function initNav() {
    var nav = $("[data-nav]");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("is-solid", window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var burger = $("[data-burger]");
    if (burger) {
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("menu-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      $$(".nav-links a", nav).forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("menu-open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ===========================================================
     Reveal on scroll (IntersectionObserver + red de seguridad)
     =========================================================== */
  function initReveals() {
    var els = $$(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function (el) { io.observe(el); });

    /* a los 6 s, revela lo que siga oculto en pantalla */
    setTimeout(function () {
      $$(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 6000);
    /* y a los 10 s, todo */
    setTimeout(function () {
      $$(".reveal:not(.is-visible)").forEach(function (el) { el.classList.add("is-visible"); });
    }, 10000);
  }

  /* ===========================================================
     Glow del hero que sigue al ratón
     =========================================================== */
  function initHeroGlow() {
    if (!fineHover) return;
    var hero = $("[data-hero]");
    if (!hero) return;
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      var y = ((e.clientY - r.top) / r.height) * 100;
      hero.style.setProperty("--mx", x + "%");
      hero.style.setProperty("--my", y + "%");
    });
  }

  /* ===========================================================
     Typewriter del subtítulo del hero
     =========================================================== */
  function initTypewriter() {
    var el = $("[data-typewriter]");
    if (!el || reduced) return;
    var full = el.getAttribute("data-typewriter") || el.textContent;
    el.textContent = "";
    el.classList.add("typing");
    var i = 0;
    var tick = function () {
      if (i <= full.length) {
        el.textContent = full.slice(0, i);
        i++;
        setTimeout(tick, 26 + Math.random() * 30);
      } else {
        setTimeout(function () { el.classList.remove("typing"); }, 1600);
      }
    };
    setTimeout(tick, 1300);
  }

  /* ===========================================================
     Count-up de las estadísticas
     =========================================================== */
  function initCountUp() {
    var els = $$("[data-count-to]");
    if (!els.length || reduced) return;
    var animate = function (el) {
      var target = parseFloat(el.getAttribute("data-count-to")) || 0;
      var dur = 1200;
      var t0 = null;
      var step = function (t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.01 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ===========================================================
     Tilt 3D suave en tarjetas
     =========================================================== */
  function initTilt() {
    if (!fineHover) return;
    var MAX = 6;
    $$("[data-tilt]").forEach(function (card) {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(900px) rotateY(" + (px * MAX) + "deg) rotateX(" + (-py * MAX) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseout", function (e) {
        if (card.contains(e.relatedTarget)) return;
        card.style.transform = "";
      });
    });
  }

  /* ===========================================================
     Filtros del catálogo
     =========================================================== */
  function initFilters() {
    var chips = $$(".chip[data-filter]");
    if (!chips.length) return;
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        var f = chip.getAttribute("data-filter");
        $$(".product-card").forEach(function (card) {
          var show = f === "all" || card.getAttribute("data-model") === f;
          card.classList.toggle("is-filtered", !show);
        });
      });
    });
  }

  /* ===========================================================
     CARRITO
     =========================================================== */
  var cart = [];
  function loadCart() {
    try {
      var raw = localStorage.getItem("fundadron-cart");
      if (raw) cart = JSON.parse(raw) || [];
    } catch (e) { cart = []; }
  }
  function saveCart() {
    try { localStorage.setItem("fundadron-cart", JSON.stringify(cart)); } catch (e) {}
  }
  function cartSubtotal() {
    return cart.reduce(function (sum, item) {
      var p = findProduct(item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }
  function cartShipping(subtotal) {
    if (subtotal <= 0) return 0;
    if (subtotal >= FREE_FROM) return 0;
    return SHIP_PICKUP;
  }
  function pickupPointText() {
    var inp = $("[data-pickup-point]");
    return inp ? inp.value.trim() : "";
  }
  function syncShipUI() {
    var radios = $$('input[name="shipmethod"]');
    radios.forEach(function (r) { r.checked = r.value === shipMethod; });
    var zone = $("[data-pickup-zone]");
    if (zone) zone.style.display = shipMethod === "pickup" ? "" : "none";
    var label = $("[data-cart-shiplabel]");
    if (label) label.textContent = "Envío a punto de recogida";
  }
  function cartCount() {
    return cart.reduce(function (s, i) { return s + i.qty; }, 0);
  }

  function addToCart(id) {
    var existing = null;
    for (var i = 0; i < cart.length; i++) if (cart[i].id === id) existing = cart[i];
    if (existing) existing.qty += 1;
    else cart.push({ id: id, qty: 1 });
    saveCart();
    renderCart();
    openCart();
  }
  function setQty(id, qty) {
    cart = cart.map(function (i) { return i.id === id ? { id: i.id, qty: qty } : i; })
               .filter(function (i) { return i.qty > 0; });
    saveCart();
    renderCart();
  }

  function renderCart() {
    var itemsEl = $("[data-cart-items]");
    var footEl = $("[data-cart-foot]");
    var countEl = $("[data-cart-count]");
    if (!itemsEl || !footEl) return;

    var count = cartCount();
    if (countEl) {
      countEl.hidden = count === 0;
      countEl.textContent = count;
      countEl.classList.remove("bump");
      void countEl.offsetWidth;
      countEl.classList.add("bump");
    }

    if (!cart.length) {
      itemsEl.innerHTML = '<p class="cart-empty">Tu carrito está vacío.<br />Las fundas no se compran solas (de momento).</p>';
      footEl.hidden = true;
      return;
    }

    itemsEl.innerHTML = cart.map(function (item) {
      var p = findProduct(item.id);
      if (!p) return "";
      return '<div class="cart-item">' +
        '<span class="cart-item-name">' + escHTML(p.name) + '</span>' +
        '<span class="cart-item-price">' + fmt(p.price * item.qty) + '</span>' +
        '<div class="cart-item-controls">' +
          '<div class="cart-qty">' +
            '<button data-qty-minus="' + escHTML(item.id) + '" aria-label="Quitar una unidad">−</button>' +
            '<span>' + item.qty + '</span>' +
            '<button data-qty-plus="' + escHTML(item.id) + '" aria-label="Añadir una unidad">+</button>' +
          '</div>' +
          '<button class="cart-remove" data-remove="' + escHTML(item.id) + '">Eliminar</button>' +
        '</div>' +
      '</div>';
    }).join("");

    var subtotal = cartSubtotal();
    var shipping = cartShipping(subtotal);
    var total = subtotal + shipping;

    footEl.hidden = false;
    $("[data-cart-subtotal]").textContent = fmt(subtotal);
    $("[data-cart-shipping]").textContent = shipping === 0 ? "Gratis" : fmt(shipping);

    var hint = $("[data-cart-freehint]");
    if (hint) {
      if (shipping > 0) {
        var missing = FREE_FROM - subtotal;
        hint.hidden = false;
        hint.innerHTML = "<span>Te faltan <strong>" + fmt(missing) + "</strong> para el envío gratis ✦</span>";
      } else {
        hint.hidden = false;
        hint.innerHTML = "<span>✦ Envío gratis aplicado</span>";
      }
    }
    $("[data-cart-total]").textContent = fmt(total);

    syncShipUI();
    renderPayPal(total);
  }

  function openCart() {
    var c = $("[data-cart]"), o = $("[data-cart-overlay]");
    if (!c || !o) return;
    c.hidden = false; o.hidden = false;
    requestAnimationFrame(function () {
      c.classList.add("is-open"); o.classList.add("is-open");
    });
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    var c = $("[data-cart]"), o = $("[data-cart-overlay]");
    if (!c || !o) return;
    c.classList.remove("is-open"); o.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function () { c.hidden = true; o.hidden = true; }, 500);
  }

  function initCartUI() {
    loadCart();
    document.addEventListener("click", function (e) {
      var add = e.target.closest("[data-add]");
      if (add) {
        addToCart(add.getAttribute("data-add"));
        add.classList.add("is-added");
        var prev = add.innerHTML;
        add.innerHTML = "Añadido ✓";
        setTimeout(function () { add.classList.remove("is-added"); add.innerHTML = prev; }, 1400);
        return;
      }
      if (e.target.closest("[data-cart-open]")) { renderCart(); openCart(); return; }
      if (e.target.closest("[data-cart-close]") || e.target.closest("[data-cart-overlay]")) { closeCart(); return; }
      var minus = e.target.closest("[data-qty-minus]");
      if (minus) {
        var idm = minus.getAttribute("data-qty-minus");
        var it = cart.filter(function (i) { return i.id === idm; })[0];
        if (it) setQty(idm, it.qty - 1);
        return;
      }
      var plus = e.target.closest("[data-qty-plus]");
      if (plus) {
        var idp = plus.getAttribute("data-qty-plus");
        var it2 = cart.filter(function (i) { return i.id === idp; })[0];
        if (it2) setQty(idp, it2.qty + 1);
        return;
      }
      var rem = e.target.closest("[data-remove]");
      if (rem) { setQty(rem.getAttribute("data-remove"), 0); return; }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeCart();
    });
    /* método de envío */
    document.addEventListener("change", function (e) {
      if (e.target && e.target.name === "shipmethod") {
        shipMethod = e.target.value;
        try { localStorage.setItem("fundadron-ship", shipMethod); } catch (err) {}
        renderCart();
      }
    });
    renderCart();
  }

  /* ===========================================================
     PAYPAL — Smart Buttons (incluye tarjeta como invitado)
     =========================================================== */
  var paypalLoaded = false;
  var paypalLoading = false;

  function renderPayPal(total) {
    var zone = $("#paypal-button-container");
    var note = $("[data-paypal-note]");
    if (!zone) return;

    if (!CFG.paypalClientId) {
      if (note) {
        note.hidden = false;
        note.innerHTML = "<strong>Pago aún no activado.</strong> El dueño de la tienda debe pegar su Client ID de PayPal en <code>lib/manifest.js</code> (ver LEEME.txt). Mientras tanto, puedes hacer tu pedido por email.";
      }
      zone.innerHTML = '<a class="btn btn-primary btn-lg" style="width:100%" href="mailto:' + escHTML(CFG.email || "") + '?subject=Pedido%20FundaDron">Pedir por email</a>';
      return;
    }
    if (note) note.hidden = true;

    if (!paypalLoaded && !paypalLoading) {
      paypalLoading = true;
      var s = document.createElement("script");
      s.src = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(CFG.paypalClientId) + "&currency=" + CURRENCY + "&components=buttons&locale=es_ES";
      s.onload = function () { paypalLoaded = true; paypalLoading = false; mountPayPalButtons(); };
      s.onerror = function () {
        paypalLoading = false;
        if (note) { note.hidden = false; note.textContent = "No se pudo cargar PayPal. Comprueba tu conexión o escríbenos para pedir por email."; }
      };
      document.head.appendChild(s);
      return;
    }
    if (paypalLoaded) mountPayPalButtons();
  }

  function mountPayPalButtons() {
    var zone = $("#paypal-button-container");
    if (!zone || !window.paypal) return;
    zone.innerHTML = "";
    try {
      window.paypal.Buttons({
        style: { layout: "vertical", color: "blue", shape: "pill", label: "paypal" },
        createOrder: function (data, actions) {
          var subtotal = cartSubtotal();
          var shipping = cartShipping(subtotal);
          var total = subtotal + shipping;
          var desc = "Pedido FundaDron (" + cartCount() + " art.)";
          var pt = pickupPointText();
          desc += " · Recogida InPost" + (pt ? ": " + pt : " (punto sin especificar)");
          return actions.order.create({
            purchase_units: [{
              description: desc.slice(0, 127),
              amount: {
                currency_code: CURRENCY,
                value: total.toFixed(2),
                breakdown: {
                  item_total: { currency_code: CURRENCY, value: subtotal.toFixed(2) },
                  shipping: { currency_code: CURRENCY, value: shipping.toFixed(2) }
                }
              },
              items: cart.map(function (item) {
                var p = findProduct(item.id);
                return {
                  name: (p ? p.name : item.id).slice(0, 120),
                  quantity: String(item.qty),
                  unit_amount: { currency_code: CURRENCY, value: (p ? p.price : 0).toFixed(2) }
                };
              })
            }]
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function () {
            cart = [];
            saveCart();
            renderCart();
            closeCart();
            var dlg = $("[data-order-ok]");
            if (dlg && dlg.showModal) dlg.showModal();
          });
        },
        onError: function (err) {
          console.warn("[paypal]", err);
          alert("Hubo un problema con el pago. Inténtalo de nuevo o escríbenos por email.");
        }
      }).render("#paypal-button-container");
    } catch (e) {
      console.warn("[paypal-render]", e);
    }
  }

  /* ===========================================================
     MAPA DE PUNTOS DE RECOGIDA (widget Mondial Relay / InPost)
     =========================================================== */
  var mrLoaded = false;
  var mrLoading = false;
  var mrInited = false;

  function loadScript(src, cb, errCb) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = cb;
    s.onerror = errCb;
    document.head.appendChild(s);
  }

  function mrStatus(msg, isError) {
    var st = $("[data-mapview-status]");
    if (!st) return;
    if (msg === null) { st.style.display = "none"; return; }
    st.style.display = "";
    st.textContent = msg;
    st.classList.toggle("is-error", !!isError);
  }

  function mrFail() {
    mrLoading = false;
    mrStatus("No se pudo cargar el mapa. Busca tu punto en inpost.es y escríbelo a mano en el carrito.", true);
  }

  function mrInitWidget() {
    if (mrInited) { mrStatus(null); return; }
    try {
      window.jQuery("#mr-zone").MR_ParcelShopPicker({
        Target: "#mr-target",
        Brand: CFG.mondialRelayBrand || "BDTEST13",
        Country: "ES",
        PostCode: "28001",
        ColLivMod: "24R",
        NbResults: "7",
        ShowResultsOnMap: true,
        Responsive: true,
        OnParcelShopSelected: function (d) {
          var parts = [];
          if (d && d.Nom) parts.push(d.Nom);
          if (d && d.Adresse1) parts.push(d.Adresse1);
          if (d) parts.push(((d.CP || "") + " " + (d.Ville || "")).trim());
          var label = parts.filter(Boolean).join(", ");
          if (d && d.ID) label += " (ID " + d.ID + ")";
          var inp = $("[data-pickup-point]");
          if (inp && label) inp.value = label.slice(0, 140);
          var dlg = $("[data-mapview]");
          if (dlg && dlg.open) setTimeout(function () { dlg.close(); }, 350);
        }
      });
      mrInited = true;
      mrStatus(null);
    } catch (e) {
      console.warn("[mr-widget]", e);
      mrFail();
    }
  }

  function openPickupMap() {
    var dlg = $("[data-mapview]");
    if (!dlg || !dlg.showModal) return;
    dlg.showModal();
    if (mrLoaded) { mrInitWidget(); return; }
    if (mrLoading) return;
    mrLoading = true;
    mrStatus("Cargando el mapa de puntos…");
    var initPlugin = function () {
      loadScript("https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js",
        function () { mrLoaded = true; mrLoading = false; mrInitWidget(); },
        mrFail);
    };
    if (window.jQuery) initPlugin();
    else loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js", initPlugin, mrFail);
  }

  function initPickupMap() {
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-pickup-map]")) { openPickupMap(); return; }
      var close = e.target.closest("[data-mapview-close]");
      if (close) {
        var dlg = $("[data-mapview]");
        if (dlg) dlg.close();
      }
    });
    var dlg = $("[data-mapview]");
    if (dlg) {
      dlg.addEventListener("click", function (e) {
        if (e.target === dlg) dlg.close();
      });
    }
  }

  /* ===========================================================
     FICHA DE PRODUCTO — galería de fotos
     =========================================================== */
  var pvProduct = null;
  var pvIndex = 0;

  function pvImages(p) {
    var n = p.gallery || 0;
    var imgs = [];
    for (var i = 1; i <= n; i++) imgs.push("assets/img/" + p.id + "-" + i + ".webp");
    if (!imgs.length) imgs.push("assets/img/" + p.id + ".webp");
    return imgs;
  }

  function pvShow(idx) {
    if (!pvProduct) return;
    var imgs = pvImages(pvProduct);
    pvIndex = (idx + imgs.length) % imgs.length;
    var img = $("[data-pview-img]");
    img.src = imgs[pvIndex];
    img.alt = pvProduct.name + " — foto " + (pvIndex + 1) + " de " + imgs.length;
    var counter = $("[data-pview-counter]");
    if (counter) counter.textContent = (pvIndex + 1) + " / " + imgs.length;
    $$(".pview-thumb").forEach(function (t, i) {
      t.classList.toggle("is-current", i === pvIndex);
    });
  }

  function openProduct(id) {
    var p = findProduct(id);
    if (!p || !p.desc) return;
    pvProduct = p;
    var dlg = $("[data-pview]");
    if (!dlg || !dlg.showModal) return;

    $("[data-pview-sub]").textContent = p.sub || "";
    $("[data-pview-name]").textContent = p.name;
    $("[data-pview-desc]").textContent = p.desc;
    $("[data-pview-price]").textContent = fmt(p.price);
    var feats = $("[data-pview-features]");
    feats.innerHTML = (p.features || []).map(function (f) {
      return "<li>" + escHTML(f) + "</li>";
    }).join("");

    var imgs = pvImages(p);
    var thumbs = $("[data-pview-thumbs]");
    thumbs.innerHTML = imgs.map(function (src, i) {
      return '<button class="pview-thumb" data-pview-go="' + i + '" aria-label="Ver foto ' + (i + 1) + '">' +
        '<img src="' + src + '" alt="" loading="lazy" decoding="async" /></button>';
    }).join("");
    thumbs.style.display = imgs.length > 1 ? "" : "none";
    $("[data-pview-prev]").style.display = imgs.length > 1 ? "" : "none";
    $("[data-pview-next]").style.display = imgs.length > 1 ? "" : "none";

    var addBtn = $("[data-pview-add]");
    addBtn.setAttribute("data-pview-add-id", p.id);

    pvShow(0);
    dlg.showModal();
  }

  function initProductView() {
    var dlg = $("[data-pview]");
    if (!dlg) return;

    document.addEventListener("click", function (e) {
      /* abrir ficha al pulsar la tarjeta (salvo el botón Añadir) */
      var card = e.target.closest(".product-card");
      if (card && !e.target.closest("[data-add]")) {
        openProduct(card.getAttribute("data-id"));
        return;
      }
      if (e.target.closest("[data-pview-close]")) { dlg.close(); return; }
      if (e.target.closest("[data-pview-prev]")) { pvShow(pvIndex - 1); return; }
      if (e.target.closest("[data-pview-next]")) { pvShow(pvIndex + 1); return; }
      var go = e.target.closest("[data-pview-go]");
      if (go) { pvShow(parseInt(go.getAttribute("data-pview-go"), 10)); return; }
      var pvAdd = e.target.closest("[data-pview-add]");
      if (pvAdd) {
        var id = pvAdd.getAttribute("data-pview-add-id");
        if (id) { dlg.close(); addToCart(id); }
        return;
      }
    });

    /* clic en el fondo oscuro = cerrar */
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) dlg.close();
    });
    /* flechas del teclado */
    document.addEventListener("keydown", function (e) {
      if (!dlg.open) return;
      if (e.key === "ArrowLeft") pvShow(pvIndex - 1);
      if (e.key === "ArrowRight") pvShow(pvIndex + 1);
    });
  }

  function initOrderDialog() {
    var dlg = $("[data-order-ok]");
    if (!dlg) return;
    var close = $("[data-order-ok-close]");
    if (close) close.addEventListener("click", function () { dlg.close(); });
  }

  /* ===========================================================
     Boot
     =========================================================== */
  function boot() {
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initReveals, "initReveals");
    safe(initHeroGlow, "initHeroGlow");
    safe(initTypewriter, "initTypewriter");
    safe(initCountUp, "initCountUp");
    safe(initTilt, "initTilt");
    safe(initFilters, "initFilters");
    safe(initCartUI, "initCartUI");
    safe(initPickupMap, "initPickupMap");
    safe(initProductView, "initProductView");
    safe(initOrderDialog, "initOrderDialog");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
