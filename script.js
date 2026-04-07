const STORAGE_KEYS = {
  cart: "grafiplot_cart_v1",
  note: "grafiplot_note_v1"
};

const BULK_THRESHOLD = 100;

const CATALOG_ITEMS = [
  { id: "a4-una-cara-color", category: "impresiones-a4", categoryLabel: "Impresiones A4", icon: "🖨️", name: "A4 una cara - Color", unitPrice: 0.1, bulkUnitPrice: 0.1 },
  { id: "a4-una-cara-bn", category: "impresiones-a4", categoryLabel: "Impresiones A4", icon: "🖨️", name: "A4 una cara - Blanco y Negro", unitPrice: 0.1, bulkUnitPrice: 0.07 },
  { id: "a4-duplex-color", category: "impresiones-a4", categoryLabel: "Impresiones A4", icon: "📄", name: "A4 ambas caras (duplex) - Color", unitPrice: 0.15, bulkUnitPrice: 0.12 },
  { id: "a4-duplex-bn", category: "impresiones-a4", categoryLabel: "Impresiones A4", icon: "📄", name: "A4 ambas caras (duplex) - Blanco y Negro", unitPrice: 0.1, bulkUnitPrice: 0.09 },
  { id: "a4-folleto-color", category: "impresiones-a4", categoryLabel: "Impresiones A4", icon: "📰", name: "A4 folleto - Color", unitPrice: 0.15, bulkUnitPrice: 0.12 },
  { id: "a4-folleto-bn", category: "impresiones-a4", categoryLabel: "Impresiones A4", icon: "📰", name: "A4 folleto - Blanco y Negro", unitPrice: 0.1, bulkUnitPrice: 0.09 },
  { id: "triptico-color", category: "impresiones-a4", categoryLabel: "Impresiones A4", icon: "📘", name: "Triptico - Color", unitPrice: 0.15, bulkUnitPrice: 0.12 },
  { id: "triptico-bn", category: "impresiones-a4", categoryLabel: "Impresiones A4", icon: "📘", name: "Triptico - Blanco y Negro", unitPrice: 0.1, bulkUnitPrice: 0.1 },
  { id: "ploteo-a0", category: "ploteos", categoryLabel: "Ploteos", icon: "📐", name: "Ploteo formato A0", unitPrice: 4, bulkUnitPrice: 3.8 },
  { id: "ploteo-a1", category: "ploteos", categoryLabel: "Ploteos", icon: "📐", name: "Ploteo formato A1", unitPrice: 2, bulkUnitPrice: 1.9 },
  { id: "ploteo-a2", category: "ploteos", categoryLabel: "Ploteos", icon: "📐", name: "Ploteo formato A2", unitPrice: 1.5, bulkUnitPrice: 1.4 },
  { id: "ploteo-a3", category: "ploteos", categoryLabel: "Ploteos", icon: "📐", name: "Ploteo formato A3", unitPrice: 0.5, bulkUnitPrice: 0.5 },
  { id: "ploteo-a4", category: "ploteos", categoryLabel: "Ploteos", icon: "📐", name: "Ploteo formato A4", unitPrice: 0.1, bulkUnitPrice: 0.1 },
  { id: "anillado-simple", category: "encuadernacion", categoryLabel: "Encuadernacion", icon: "📚", name: "Anillado simple", unitPrice: 1.5 },
  { id: "anillado-mediano", category: "encuadernacion", categoryLabel: "Encuadernacion", icon: "📚", name: "Anillado mediano", unitPrice: 2 },
  { id: "anillado-grueso", category: "encuadernacion", categoryLabel: "Encuadernacion", icon: "📚", name: "Anillado grueso", unitPrice: 3 },
  { id: "empastado-fuerte", category: "encuadernacion", categoryLabel: "Encuadernacion", icon: "📕", name: "Empastado/Encuadernado fuerte", unitPrice: 6 },
  { id: "papel-fotografico", category: "papeleria", categoryLabel: "Papeleria especial", icon: "🖼️", name: "Papel fotografico", unitPrice: 1.5 },
  { id: "papel-couche", category: "papeleria", categoryLabel: "Papeleria especial", icon: "📇", name: "Impresion en papel couche", unitPrice: 2 },
  { id: "cartulina-escolar", category: "papeleria", categoryLabel: "Papeleria especial", icon: "🧾", name: "Impresion en cartulina escolar", unitPrice: 0.5 },
  { id: "cartulina-hilo", category: "papeleria", categoryLabel: "Papeleria especial", icon: "🧾", name: "Impresion en cartulina de hilo", unitPrice: 1 }
];

const servicesById = Object.fromEntries(CATALOG_ITEMS.map((item) => [item.id, item]));
let cart = [];
let toastTimeoutId = null;
let isStoreOpen = false;
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: light)");
const mobileCartQuery = window.matchMedia("(max-width: 600px)");

const nodes = {
  body: document.body,
  waBubble: document.getElementById("wa-bubble"),
  waClose: document.getElementById("wa-close"),
  waAgent: document.getElementById("wa-agent"),
  waOnline: document.getElementById("wa-online"),
  waMsg: document.getElementById("wa-msg"),
  toggleStoreBtn: document.getElementById("toggle-store-btn"),
  openStoreLinks: document.querySelectorAll("[data-open-store='true']"),
  homeLinks: document.querySelectorAll("[data-go-home='true']"),
  screenFlash: document.getElementById("screen-flash"),
  storeShell: document.getElementById("catalogo"),
  servicesGrid: document.getElementById("services-grid"),
  cartItems: document.getElementById("cart-items"),
  cartTotal: document.getElementById("cart-total"),
  orderUnits: document.getElementById("order-units"),
  attentionStatus: document.getElementById("attention-status"),
  whatsappBtn: document.getElementById("whatsapp-btn"),
  clearCartBtn: document.getElementById("clear-cart-btn"),
  customerNote: document.getElementById("customer-note"),
  toast: document.getElementById("toast"),
  serviceSearch: document.getElementById("service-search"),
  categoryFilter: document.getElementById("category-filter"),
  catalogCount: document.getElementById("catalog-count"),
  cartPanel: document.getElementById("cart-panel"),
  cartFab: document.getElementById("cart-fab"),
  cartFabCount: document.getElementById("cart-fab-count"),
  mobileCartSheet: document.getElementById("mobile-cart-sheet"),
  mobileCartBackdrop: document.getElementById("mobile-cart-backdrop"),
  mobileCartClose: document.getElementById("mobile-cart-close"),
  mobileCartItems: document.getElementById("mobile-cart-items"),
  mobileCartTotal: document.getElementById("mobile-cart-total"),
  mobileCartOrder: document.getElementById("mobile-cart-order")
};

let isMobileCartOpen = false;

function formatMoney(value) {
  return `S/ ${value.toFixed(2)}`;
}

function sanitizeQuantity(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

function hasBulkPrice(service) {
  return typeof service.bulkUnitPrice === "number";
}

function getUnitPrice(service, quantity) {
  if (!hasBulkPrice(service)) {
    return service.unitPrice;
  }

  return quantity > BULK_THRESHOLD ? service.bulkUnitPrice : service.unitPrice;
}

function getTierMessage(service, quantity) {
  if (!hasBulkPrice(service)) {
    return "";
  }

  return quantity > BULK_THRESHOLD ? "Se activo precio por mayor" : "";
}

function setStoreOpen(nextOpen, shouldScroll = false) {
  isStoreOpen = nextOpen;
  nodes.storeShell.classList.toggle("is-open", isStoreOpen);
  nodes.storeShell.setAttribute("aria-hidden", isStoreOpen ? "false" : "true");
  nodes.body.classList.toggle("in-store", isStoreOpen);
  syncWhatsAppBubble(isStoreOpen);

  if (nodes.toggleStoreBtn) {
    nodes.toggleStoreBtn.setAttribute("aria-expanded", isStoreOpen ? "true" : "false");
  }

  if (!shouldScroll) {
    return;
  }

  nodes.storeShell.scrollIntoView({ behavior: "smooth", block: "start" });
}

function syncWhatsAppBubble(inStore) {
  if (!nodes.waAgent || !nodes.waOnline || !nodes.waMsg || !nodes.waBubble) {
    return;
  }

  nodes.waBubble.classList.remove("hide");
  if (inStore) {
    nodes.waAgent.textContent = "Roy Vasquez";
    nodes.waOnline.textContent = "venta online";
    nodes.waMsg.textContent = "Bienvenido, indicanos que producto desea consultar.";
    return;
  }

  nodes.waAgent.textContent = "WhatsApp";
  nodes.waOnline.textContent = "atencion directa";
  nodes.waMsg.textContent = "Contactar por WhatsApp";
}

function openStoreWithFlash() {
  if (nodes.screenFlash) {
    nodes.screenFlash.classList.remove("run");
    void nodes.screenFlash.offsetWidth;
    nodes.screenFlash.classList.add("run");
  }

  setTimeout(() => {
    setStoreOpen(true, true);
  }, 170);
}

function renderCatalog() {
  const cardsMarkup = CATALOG_ITEMS.map((item) => {
    const unitPrice = getUnitPrice(item, 1);
    const productImagePath = `assets/products/${item.id}.svg`;
    const searchText = `${item.name} ${item.category} ${item.categoryLabel}`.toLowerCase();

    return `<article class="service-card" data-category="${item.category}" data-search="${searchText}" aria-labelledby="${item.id}-title">
      <div class="card-head"><div class="icon" aria-hidden="true">${item.icon}</div></div>
      <figure class="service-media" data-image-wrap="${item.id}">
        <img class="product-image" src="${productImagePath}" alt="${item.name}" loading="lazy">
        <span class="media-fallback">${item.name}</span>
      </figure>
      <p class="service-category">${item.categoryLabel}</p>
      <h2 id="${item.id}-title">${item.name}</h2>
      <p class="unit-line">Precio unitario: <strong id="unit-${item.id}">${formatMoney(unitPrice)}</strong></p>
      <div class="service-controls">
        <div class="controls">
          <label><span>Cantidad</span><input class="quantity-input" data-id="${item.id}" type="number" min="1" value="1" inputmode="numeric"></label>
        </div>
        <p class="tier-status" id="tier-${item.id}"></p>
        <p class="total-preview">Precio estimado: <strong id="preview-${item.id}">${formatMoney(unitPrice)}</strong></p>
      </div>
      <button class="btn add-btn" data-service="${item.id}" type="button">Agregar producto</button>
    </article>`;
  }).join("");

  nodes.servicesGrid.innerHTML = cardsMarkup;
}

function bindProductImageFallbacks() {
  nodes.servicesGrid.querySelectorAll(".product-image").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        const wrapper = image.closest(".service-media");
        if (!wrapper) {
          return;
        }

        wrapper.classList.add("missing-image");
        image.remove();
      },
      { once: true }
    );
  });
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.subtotal, 0);
}

function getTotalUnits() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function saveCart() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cart);
    const parsed = raw ? JSON.parse(raw) : [];
    cart = Array.isArray(parsed) ? parsed : [];
  } catch {
    cart = [];
  }
}

function saveNote() {
  localStorage.setItem(STORAGE_KEYS.note, nodes.customerNote.value.trim());
}

function loadNote() {
  nodes.customerNote.value = localStorage.getItem(STORAGE_KEYS.note) || "";
}

function getAttentionStatusText(now = new Date()) {
  const day = now.getDay();
  const minuteOfDay = now.getHours() * 60 + now.getMinutes();
  const schedules = {
    0: { open: 9 * 60, close: 22 * 60, label: "Domingos" },
    1: { open: 7 * 60, close: 22 * 60, label: "Lunes a viernes" },
    2: { open: 7 * 60, close: 22 * 60, label: "Lunes a viernes" },
    3: { open: 7 * 60, close: 22 * 60, label: "Lunes a viernes" },
    4: { open: 7 * 60, close: 22 * 60, label: "Lunes a viernes" },
    5: { open: 7 * 60, close: 22 * 60, label: "Lunes a viernes" },
    6: { open: 8 * 60, close: 22 * 60, label: "Sabados" }
  };

  const today = schedules[day];
  return minuteOfDay >= today.open && minuteOfDay < today.close
    ? `Estado: atendiendo ahora (${today.label})`
    : "Estado: fuera de horario en este momento";
}

function renderQuickSummary() {
  nodes.orderUnits.textContent = `Items totales: ${getTotalUnits()}`;
  nodes.attentionStatus.textContent = getAttentionStatusText();
}

function triggerCartFabFeedback() {
  if (!nodes.cartFab || !nodes.cartFabCount) {
    return;
  }

  nodes.cartFab.classList.remove("bump");
  nodes.cartFabCount.classList.remove("bump");
  void nodes.cartFab.offsetWidth;
  nodes.cartFab.classList.add("bump");
  nodes.cartFabCount.classList.add("bump");
}

function setMobileCartOpen(nextOpen) {
  if (!nodes.mobileCartSheet || !nodes.cartFab) {
    return;
  }

  isMobileCartOpen = nextOpen;
  document.body.classList.toggle("mobile-cart-open", isMobileCartOpen);
  nodes.mobileCartSheet.setAttribute("aria-hidden", isMobileCartOpen ? "false" : "true");
  nodes.cartFab.setAttribute("aria-expanded", isMobileCartOpen ? "true" : "false");
}

function scrollToDetailedCart() {
  if (!isStoreOpen) {
    openStoreWithFlash();
    setTimeout(() => {
      nodes.cartPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 260);
    return;
  }

  nodes.cartPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderMobileCartSummary() {
  if (!nodes.mobileCartItems || !nodes.mobileCartTotal || !nodes.cartFabCount) {
    return;
  }

  const totalUnits = getTotalUnits();
  nodes.cartFabCount.textContent = String(totalUnits);

  if (cart.length === 0) {
    nodes.mobileCartItems.innerHTML = '<li class="empty">Tu pedido aun esta vacio.</li>';
    nodes.mobileCartTotal.textContent = formatMoney(0);
    return;
  }

  nodes.mobileCartItems.innerHTML = cart
    .map(
      (item) => `<li>
        <div class="cart-item-head">
          <span>${item.name}</span>
          <strong>${formatMoney(item.subtotal)}</strong>
        </div>
        <div class="cart-item-meta">${formatMoney(item.unitPrice)} x ${item.quantity}</div>
        <div class="cart-item-actions">
          <button class="cart-action" type="button" data-action="decrease" data-id="${item.id}" aria-label="Quitar una unidad">-</button>
          <button class="cart-action" type="button" data-action="increase" data-id="${item.id}" aria-label="Agregar una unidad">+</button>
          <button class="cart-action remove" type="button" data-action="remove" data-id="${item.id}" aria-label="Eliminar producto">x</button>
        </div>
      </li>`
    )
    .join("");

  nodes.mobileCartTotal.textContent = formatMoney(getCartTotal());
}

function showToast(message) {
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  nodes.toast.textContent = message;
  nodes.toast.classList.add("show");
  toastTimeoutId = setTimeout(() => {
    nodes.toast.classList.remove("show");
  }, 1600);
}

function updateCheckoutStates() {
  const isEmpty = cart.length === 0;
  nodes.whatsappBtn.disabled = isEmpty;
  nodes.whatsappBtn.classList.toggle("is-disabled", isEmpty);
  nodes.clearCartBtn.disabled = isEmpty;
  nodes.clearCartBtn.classList.toggle("is-disabled", isEmpty);
}

function recomputeCartItem(item) {
  const service = servicesById[item.sourceServiceId];
  if (!service) {
    return;
  }

  item.unitPrice = getUnitPrice(service, item.quantity);
  item.subtotal = item.quantity * item.unitPrice;
  item.name = service.name;
}

function renderCart() {
  if (cart.length === 0) {
    nodes.cartItems.innerHTML = '<li class="empty">Tu pedido aun esta vacio.</li>';
    nodes.cartTotal.textContent = formatMoney(0);
    renderQuickSummary();
    renderMobileCartSummary();
    updateCheckoutStates();
    return;
  }

  nodes.cartItems.innerHTML = cart
    .map(
      (item) => `<li>
        <div class="cart-item-head">
          <span>✅ ${item.name}</span>
          <strong>${formatMoney(item.subtotal)}</strong>
        </div>
        <div class="cart-item-meta">${formatMoney(item.unitPrice)} x ${item.quantity}</div>
        <div class="cart-item-actions">
          <button class="cart-action" type="button" data-action="decrease" data-id="${item.id}" aria-label="Quitar una unidad">-</button>
          <button class="cart-action" type="button" data-action="increase" data-id="${item.id}" aria-label="Agregar una unidad">+</button>
          <button class="cart-action remove" type="button" data-action="remove" data-id="${item.id}" aria-label="Eliminar servicio">x</button>
        </div>
      </li>`
    )
    .join("");

  nodes.cartTotal.textContent = formatMoney(getCartTotal());
  renderQuickSummary();
  renderMobileCartSummary();
  updateCheckoutStates();
}

function upsertCartItem(serviceId, quantity) {
  const service = servicesById[serviceId];
  if (!service) {
    return;
  }

  const existing = cart.find((item) => item.id === serviceId);
  if (existing) {
    existing.quantity += quantity;
    recomputeCartItem(existing);
  } else {
    const newItem = {
      id: serviceId,
      sourceServiceId: serviceId,
      name: service.name,
      quantity,
      unitPrice: getUnitPrice(service, quantity),
      subtotal: 0
    };
    newItem.subtotal = newItem.quantity * newItem.unitPrice;
    cart.push(newItem);
  }

  saveCart();
  renderCart();
}

function changeItemQuantity(serviceId, action) {
  const item = cart.find((entry) => entry.id === serviceId);
  if (!item) {
    return;
  }

  if (action === "remove") {
    cart = cart.filter((entry) => entry.id !== serviceId);
    saveCart();
    renderCart();
    showToast("Servicio eliminado del pedido");
    return;
  }

  const delta = action === "increase" ? 1 : -1;
  const nextQuantity = item.quantity + delta;
  if (nextQuantity < 1) {
    cart = cart.filter((entry) => entry.id !== serviceId);
    saveCart();
    renderCart();
    return;
  }

  item.quantity = nextQuantity;
  recomputeCartItem(item);
  saveCart();
  renderCart();
}

function updateCardPricing(card) {
  const serviceId = card.querySelector(".add-btn")?.dataset.service;
  if (!serviceId) {
    return;
  }

  const service = servicesById[serviceId];
  const qtyInput = card.querySelector(`.quantity-input[data-id="${serviceId}"]`);
  const unitNode = card.querySelector(`#unit-${serviceId}`);
  const previewNode = card.querySelector(`#preview-${serviceId}`);
  const tierNode = card.querySelector(`#tier-${serviceId}`);
  if (!service || !qtyInput || !unitNode || !previewNode || !tierNode) {
    return;
  }

  const quantity = sanitizeQuantity(qtyInput.value);
  qtyInput.value = String(quantity);
  const unitPrice = getUnitPrice(service, quantity);
  const total = unitPrice * quantity;

  unitNode.textContent = formatMoney(unitPrice);
  previewNode.textContent = formatMoney(total);
  tierNode.textContent = getTierMessage(service, quantity);
  tierNode.classList.toggle("is-bulk", quantity > BULK_THRESHOLD && hasBulkPrice(service));
}

function addServiceToCart(serviceId) {
  const quantityInput = nodes.servicesGrid.querySelector(`.quantity-input[data-id="${serviceId}"]`);
  const quantity = sanitizeQuantity(quantityInput ? quantityInput.value : 1);
  upsertCartItem(serviceId, quantity);
  triggerCartFabFeedback();
  showToast("Producto agregado al pedido");
}

function applyCatalogFilters() {
  const query = nodes.serviceSearch.value.trim().toLowerCase();
  const selectedCategory = nodes.categoryFilter.value;
  let visibleCount = 0;

  nodes.servicesGrid.querySelectorAll(".service-card").forEach((card) => {
    const category = card.dataset.category;
    const searchableText = `${card.dataset.search || ""}`;
    const matchCategory = selectedCategory === "all" || category === selectedCategory;
    const matchQuery = !query || searchableText.includes(query);
    const isVisible = matchCategory && matchQuery;
    card.hidden = !isVisible;
    if (isVisible) {
      visibleCount += 1;
    }
  });

  nodes.catalogCount.textContent = `Mostrando ${visibleCount} servicio${visibleCount === 1 ? "" : "s"}`;
}

function buildWhatsAppMessage() {
  const lines = cart.map((item, index) => `${index + 1}. ✅ ${item.name} (${formatMoney(item.unitPrice)} x ${item.quantity}) = ${formatMoney(item.subtotal)}`);
  const total = formatMoney(getCartTotal());
  const customerNote = nodes.customerNote.value.trim();
  const noteSection = customerNote ? `\n📝 Nota del cliente:\n${customerNote}` : "";
  return `Hola EQUIPO GRAFIPLOT, quiero hacer un pedido:\n\n📦 Detalle del pedido:\n${lines.join("\n")}\n\n💰 Total: ${total}${noteSection}\n\nGracias.`;
}

function openWhatsAppCheckout() {
  if (cart.length === 0) {
    return;
  }

  const encoded = encodeURIComponent(buildWhatsAppMessage());
  window.open(`https://wa.me/952628844?text=${encoded}`, "_blank", "noopener,noreferrer");
}

function clearCartWithConfirmation() {
  if (cart.length === 0) {
    return;
  }

  if (!window.confirm("Se vaciara todo el pedido actual. Deseas continuar?")) {
    return;
  }

  cart = [];
  saveCart();
  renderCart();
  showToast("Pedido vaciado correctamente");
}

function applySystemTheme(isLight) {
  nodes.body.classList.toggle("light", isLight);
}

function initSystemTheme() {
  applySystemTheme(systemThemeQuery.matches);

  if (typeof systemThemeQuery.addEventListener === "function") {
    systemThemeQuery.addEventListener("change", (event) => {
      applySystemTheme(event.matches);
    });
    return;
  }

  systemThemeQuery.addListener((event) => {
    applySystemTheme(event.matches);
  });
}

function bindEvents() {
  nodes.cartFab?.addEventListener("click", () => {
    if (mobileCartQuery.matches) {
      setMobileCartOpen(!isMobileCartOpen);
      return;
    }

    scrollToDetailedCart();
  });

  nodes.mobileCartClose?.addEventListener("click", () => {
    setMobileCartOpen(false);
  });

  nodes.mobileCartBackdrop?.addEventListener("click", () => {
    setMobileCartOpen(false);
  });

  nodes.mobileCartItems?.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-action]");
    if (!target) {
      return;
    }

    changeItemQuantity(target.dataset.id, target.dataset.action);
  });

  nodes.mobileCartOrder?.addEventListener("click", () => {
    setMobileCartOpen(false);
    scrollToDetailedCart();
  });

  nodes.servicesGrid.addEventListener("input", (event) => {
    const quantityInput = event.target.closest(".quantity-input");
    if (!quantityInput) {
      return;
    }

    const card = quantityInput.closest(".service-card");
    if (card) {
      updateCardPricing(card);
    }
  });

  nodes.servicesGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".add-btn");
    if (!button) {
      return;
    }

    addServiceToCart(button.dataset.service);
  });

  nodes.cartItems.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-action]");
    if (!target) {
      return;
    }

    changeItemQuantity(target.dataset.id, target.dataset.action);
  });

  nodes.customerNote.addEventListener("input", saveNote);
  nodes.serviceSearch.addEventListener("input", applyCatalogFilters);
  nodes.categoryFilter.addEventListener("change", applyCatalogFilters);
  nodes.whatsappBtn.addEventListener("click", openWhatsAppCheckout);
  nodes.clearCartBtn.addEventListener("click", clearCartWithConfirmation);

  if (nodes.toggleStoreBtn) {
    nodes.toggleStoreBtn.addEventListener("click", () => {
      if (isStoreOpen) {
        nodes.storeShell.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      openStoreWithFlash();
    });
  }

  nodes.openStoreLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (isStoreOpen) {
        nodes.storeShell.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      openStoreWithFlash();
    });
  });

  nodes.homeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setStoreOpen(false, true);
      const hero = document.getElementById("inicio");
      hero?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  if (nodes.waClose && nodes.waBubble) {
    nodes.waClose.addEventListener("click", () => {
      nodes.waBubble.classList.add("hide");
    });
  }
}

function init() {
  renderCatalog();
  bindProductImageFallbacks();

  nodes.servicesGrid.querySelectorAll(".service-card").forEach((card) => {
    updateCardPricing(card);
  });

  initSystemTheme();
  loadCart();
  loadNote();
  setMobileCartOpen(false);
  setStoreOpen(false, false);
  applyCatalogFilters();
  renderCart();
  bindEvents();
}

init();
