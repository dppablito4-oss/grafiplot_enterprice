const STORAGE_KEYS = {
  cart: "grafiplot_cart_v1",
  theme: "grafiplot_theme_v1",
  note: "grafiplot_note_v1"
};

const SERVICES = {
  a4: {
    id: "a4",
    name: "Impresion A4 (Color/B&N)",
    dynamic: true
  },
  tesis: {
    id: "tesis",
    name: "Formateo de Tesis (APA, Postgrado)",
    unitPrice: 120
  },
  scan: {
    id: "scan",
    name: "Fotocopias & Escaneado",
    unitPrice: 0.3
  },
  encuadernacion: {
    id: "encuadernacion",
    name: "Encuadernacion (Anillado/Espiralado)",
    unitPrice: 8
  },
  diseno: {
    id: "diseno",
    name: "Diseno Grafico Basico",
    unitPrice: 45
  }
};

let cart = [];

const nodes = {
  body: document.body,
  themeToggle: document.getElementById("theme-toggle"),
  a4CopiesInput: document.getElementById("a4-copies"),
  a4Total: document.getElementById("a4-total"),
  cartItems: document.getElementById("cart-items"),
  cartTotal: document.getElementById("cart-total"),
  whatsappBtn: document.getElementById("whatsapp-btn"),
  customerNote: document.getElementById("customer-note"),
  toast: document.getElementById("toast"),
  serviceSearch: document.getElementById("service-search"),
  categoryFilter: document.getElementById("category-filter"),
  catalogCount: document.getElementById("catalog-count"),
  addButtons: document.querySelectorAll(".add-btn"),
  serviceCards: document.querySelectorAll(".service-card")
};

let toastTimeoutId = null;

function formatMoney(value) {
  return `S/ ${value.toFixed(2)}`;
}

function getA4UnitPrice(quantity) {
  return quantity >= 100 ? 0.09 : 0.1;
}

function sanitizeQuantity(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

function calculateA4Total() {
  const quantity = sanitizeQuantity(nodes.a4CopiesInput.value);
  const unitPrice = getA4UnitPrice(quantity);
  const total = quantity * unitPrice;
  nodes.a4Total.textContent = formatMoney(total);
  return { quantity, unitPrice, total };
}

function saveCart() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

function saveNote() {
  localStorage.setItem(STORAGE_KEYS.note, nodes.customerNote.value.trim());
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cart);
    if (!raw) {
      cart = [];
      return;
    }
    const parsed = JSON.parse(raw);
    cart = Array.isArray(parsed) ? parsed : [];
  } catch {
    cart = [];
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.subtotal, 0);
}

function updateWhatsappButtonState(isEmpty) {
  nodes.whatsappBtn.disabled = isEmpty;
  nodes.whatsappBtn.classList.toggle("is-disabled", isEmpty);
}

function showToast(message) {
  if (!nodes.toast) {
    return;
  }

  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  nodes.toast.textContent = message;
  nodes.toast.classList.add("show");
  toastTimeoutId = setTimeout(() => {
    nodes.toast.classList.remove("show");
  }, 1600);
}

function renderCart() {
  if (cart.length === 0) {
    nodes.cartItems.innerHTML = '<li class="empty">Tu pedido aun esta vacio.</li>';
    nodes.cartTotal.textContent = formatMoney(0);
    updateWhatsappButtonState(true);
    return;
  }

  nodes.cartItems.innerHTML = cart
    .map(
      (item) =>
        `<li>
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
  updateWhatsappButtonState(false);
}

function upsertCartItem(newItem) {
  const existing = cart.find((item) => item.id === newItem.id);

  if (existing) {
    existing.quantity += newItem.quantity;
    if (newItem.dynamic) {
      existing.unitPrice = getA4UnitPrice(existing.quantity);
      existing.subtotal = existing.quantity * existing.unitPrice;
    } else {
      existing.unitPrice = newItem.unitPrice;
      existing.subtotal = existing.quantity * existing.unitPrice;
    }
  } else {
    cart.push({ ...newItem });
  }

  saveCart();
  renderCart();
}

function changeItemQuantity(serviceId, direction) {
  const item = cart.find((entry) => entry.id === serviceId);
  if (!item) {
    return;
  }

  if (direction === "remove") {
    cart = cart.filter((entry) => entry.id !== serviceId);
    saveCart();
    renderCart();
    showToast("Servicio eliminado del pedido");
    return;
  }

  const delta = direction === "increase" ? 1 : -1;
  const nextQuantity = item.quantity + delta;

  if (nextQuantity < 1) {
    cart = cart.filter((entry) => entry.id !== serviceId);
    saveCart();
    renderCart();
    showToast("Servicio eliminado del pedido");
    return;
  }

  item.quantity = nextQuantity;
  if (item.dynamic) {
    item.unitPrice = getA4UnitPrice(item.quantity);
  }
  item.subtotal = item.quantity * item.unitPrice;

  saveCart();
  renderCart();
}

function addServiceToCart(serviceId) {
  if (serviceId === SERVICES.a4.id) {
    const result = calculateA4Total();
    upsertCartItem({
      id: SERVICES.a4.id,
      name: SERVICES.a4.name,
      quantity: result.quantity,
      unitPrice: result.unitPrice,
      subtotal: result.total,
      dynamic: true
    });
    showToast("Impresion A4 agregada al pedido");
    return;
  }

  const service = SERVICES[serviceId];
  if (!service) {
    return;
  }

  upsertCartItem({
    id: service.id,
    name: service.name,
    quantity: 1,
    unitPrice: service.unitPrice,
    subtotal: service.unitPrice,
    dynamic: false
  });
  showToast(`${service.name} agregado al pedido`);
}

function buildWhatsAppMessage() {
  const lines = cart.map((item, index) => {
    return `${index + 1}. ✅ ${item.name} (${formatMoney(item.unitPrice)} x ${item.quantity}) = ${formatMoney(item.subtotal)}`;
  });

  const customerNote = nodes.customerNote.value.trim();
  const noteSection = customerNote ? `\n📝 Nota del cliente:\n${customerNote}` : "";
  const total = formatMoney(getCartTotal());
  return `Hola EQUIPO GRAFIPLOT, quiero hacer un pedido:\n\n📦 Detalle del pedido:\n${lines.join("\n")}\n\n💰 Total: ${total}${noteSection}\n\nGracias.`;
}

function openWhatsAppCheckout() {
  if (cart.length === 0) {
    return;
  }

  const message = buildWhatsAppMessage();
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/918165428?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function applyTheme(theme) {
  const selected = theme === "light" ? "light" : "dark";
  nodes.body.classList.toggle("light", selected === "light");
  localStorage.setItem(STORAGE_KEYS.theme, selected);
}

function loadTheme() {
  const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  applyTheme(storedTheme || "dark");
}

function loadNote() {
  const savedNote = localStorage.getItem(STORAGE_KEYS.note);
  nodes.customerNote.value = savedNote || "";
}

function applyCatalogFilters() {
  const query = nodes.serviceSearch.value.trim().toLowerCase();
  const selectedCategory = nodes.categoryFilter.value;
  let visibleCount = 0;

  nodes.serviceCards.forEach((card) => {
    const category = card.dataset.category;
    const searchableText = `${card.dataset.search || ""} ${card.textContent}`.toLowerCase();
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

function bindEvents() {
  nodes.themeToggle.addEventListener("click", () => {
    const next = nodes.body.classList.contains("light") ? "dark" : "light";
    applyTheme(next);
  });

  nodes.a4CopiesInput.addEventListener("input", calculateA4Total);

  nodes.addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const serviceId = button.dataset.service;
      addServiceToCart(serviceId);
    });
  });

  nodes.cartItems.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-action]");
    if (!target) {
      return;
    }

    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) {
      return;
    }

    changeItemQuantity(id, action);
  });

  nodes.customerNote.addEventListener("input", saveNote);
  nodes.serviceSearch.addEventListener("input", applyCatalogFilters);
  nodes.categoryFilter.addEventListener("change", applyCatalogFilters);

  nodes.whatsappBtn.addEventListener("click", openWhatsAppCheckout);
}

function init() {
  loadTheme();
  loadCart();
  loadNote();
  calculateA4Total();
  applyCatalogFilters();
  renderCart();
  bindEvents();
}

init();
