const STORAGE_KEYS = {
  cart: "grafiplot_cart_v1",
  theme: "grafiplot_theme_v1"
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
  addButtons: document.querySelectorAll(".add-btn")
};

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

function renderCart() {
  if (cart.length === 0) {
    nodes.cartItems.innerHTML = '<li class="empty">Tu pedido aun esta vacio.</li>';
    nodes.cartTotal.textContent = formatMoney(0);
    nodes.whatsappBtn.disabled = true;
    nodes.whatsappBtn.style.opacity = "0.5";
    nodes.whatsappBtn.style.cursor = "not-allowed";
    return;
  }

  nodes.cartItems.innerHTML = cart
    .map(
      (item) =>
        `<li><span>${item.name} x ${item.quantity}</span><strong>${formatMoney(item.subtotal)}</strong></li>`
    )
    .join("");

  nodes.cartTotal.textContent = formatMoney(getCartTotal());
  nodes.whatsappBtn.disabled = false;
  nodes.whatsappBtn.style.opacity = "1";
  nodes.whatsappBtn.style.cursor = "pointer";
}

function upsertCartItem(newItem) {
  const existing = cart.find((item) => item.id === newItem.id);

  if (existing) {
    existing.quantity += newItem.quantity;
    existing.subtotal += newItem.subtotal;
    if (!newItem.dynamic) {
      existing.unitPrice = newItem.unitPrice;
    }
  } else {
    cart.push({ ...newItem });
  }

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
}

function buildWhatsAppMessage() {
  const lines = cart.map(
    (item) => `${item.name} x ${item.quantity} - ${formatMoney(item.subtotal)}`
  );
  const total = formatMoney(getCartTotal());
  return `Hola EQUIPO GRAFIPLOT, quiero hacer un pedido: ${lines.join(", ")}. Total: ${total}.`;
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

  nodes.whatsappBtn.addEventListener("click", openWhatsAppCheckout);
}

function init() {
  loadTheme();
  loadCart();
  calculateA4Total();
  renderCart();
  bindEvents();
}

init();
