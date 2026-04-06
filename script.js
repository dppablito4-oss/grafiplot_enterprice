const STORAGE_KEYS = {
  cart: "grafiplot_cart_v1",
  theme: "grafiplot_theme_v1",
  note: "grafiplot_note_v1"
};

let cart = [];
let servicesById = {};

const nodes = {
  body: document.body,
  themeToggle: document.getElementById("theme-toggle"),
  a4CopiesInput: document.getElementById("a4-copies"),
  a4Total: document.getElementById("a4-total"),
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
  catalogCount: document.getElementById("catalog-count")
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
  if (!nodes.a4CopiesInput || !nodes.a4Total) {
    return { quantity: 1, unitPrice: 0.1, total: 0.1 };
  }

  const quantity = sanitizeQuantity(nodes.a4CopiesInput.value);
  const unitPrice = getA4UnitPrice(quantity);
  const total = quantity * unitPrice;
  nodes.a4Total.textContent = formatMoney(total);
  return { quantity, unitPrice, total };
}

function refreshServicesFromDom() {
  const addButtons = nodes.servicesGrid.querySelectorAll(".add-btn");
  servicesById = {};

  addButtons.forEach((button) => {
    const id = button.dataset.service;
    if (!id) {
      return;
    }

    const name = button.dataset.name || button.closest(".service-card")?.querySelector("h2")?.textContent || id;
    const isDynamic = button.dataset.dynamic === "tiered-a4";
    const unitPrice = Number.parseFloat(button.dataset.price || "0");

    servicesById[id] = {
      id,
      name,
      dynamic: isDynamic,
      unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0
    };
  });
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

function getTotalUnits() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
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
  const isOpen = minuteOfDay >= today.open && minuteOfDay < today.close;

  if (isOpen) {
    return `Estado: atendiendo ahora (${today.label})`;
  }

  return "Estado: fuera de horario en este momento";
}

function renderQuickSummary() {
  if (!nodes.orderUnits || !nodes.attentionStatus) {
    return;
  }

  nodes.orderUnits.textContent = `Items totales: ${getTotalUnits()}`;
  nodes.attentionStatus.textContent = getAttentionStatusText();
}

function updateWhatsappButtonState(isEmpty) {
  nodes.whatsappBtn.disabled = isEmpty;
  nodes.whatsappBtn.classList.toggle("is-disabled", isEmpty);

  if (nodes.clearCartBtn) {
    nodes.clearCartBtn.disabled = isEmpty;
    nodes.clearCartBtn.classList.toggle("is-disabled", isEmpty);
  }
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
    renderQuickSummary();
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
  renderQuickSummary();
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
  const service = servicesById[serviceId];
  if (!service) {
    return;
  }

  if (service.dynamic) {
    const result = calculateA4Total();
    upsertCartItem({
      id: service.id,
      name: service.name,
      quantity: result.quantity,
      unitPrice: result.unitPrice,
      subtotal: result.total,
      dynamic: true
    });
    showToast("Impresion A4 agregada al pedido");
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

function clearCartWithConfirmation() {
  if (cart.length === 0) {
    return;
  }

  const confirmed = window.confirm("Se vaciara todo el pedido actual. Deseas continuar?");
  if (!confirmed) {
    return;
  }

  cart = [];
  saveCart();
  renderCart();
  showToast("Pedido vaciado correctamente");
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
  const serviceCards = nodes.servicesGrid.querySelectorAll(".service-card");
  let visibleCount = 0;

  serviceCards.forEach((card) => {
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

function exposeCatalogHooks() {
  window.grafiplotCatalog = {
    getCurrentServices: () => ({ ...servicesById }),
    refresh: () => {
      refreshServicesFromDom();
      applyCatalogFilters();
    }
  };
}

function bindEvents() {
  nodes.themeToggle.addEventListener("click", () => {
    const next = nodes.body.classList.contains("light") ? "dark" : "light";
    applyTheme(next);
  });

  if (nodes.a4CopiesInput) {
    nodes.a4CopiesInput.addEventListener("input", calculateA4Total);
  }

  nodes.servicesGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".add-btn");
    if (!button) {
      return;
    }

    const serviceId = button.dataset.service;
    if (!serviceId) {
      return;
    }

    addServiceToCart(serviceId);
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
  nodes.clearCartBtn.addEventListener("click", clearCartWithConfirmation);
}

function init() {
  refreshServicesFromDom();
  exposeCatalogHooks();
  loadTheme();
  loadCart();
  loadNote();
  calculateA4Total();
  applyCatalogFilters();
  renderCart();
  bindEvents();
}

init();
