const STORAGE_KEYS = {
  cart: "grafiplot_cart_v1",
  theme: "grafiplot_theme_v1",
  note: "grafiplot_note_v1"
};

const BULK_THRESHOLD = 100;

const CATALOG_ITEMS = [
  {
    id: "a4-una-cara-color",
    category: "impresiones-a4",
    categoryLabel: "Impresiones A4",
    icon: "🖨️",
    name: "A4 una cara - Color",
    description: "Impresion simple faz en color para documentos, practicas y guias.",
    tags: "a4 una cara color impresion",
    pricing: { mode: "dual", unidad: 0.1, cantidad: 0.1 }
  },
  {
    id: "a4-una-cara-bn",
    category: "impresiones-a4",
    categoryLabel: "Impresiones A4",
    icon: "🖨️",
    name: "A4 una cara - Blanco y Negro",
    description: "Impresion simple faz en blanco y negro para volumen alto.",
    tags: "a4 una cara blanco negro impresion",
    pricing: { mode: "dual", unidad: 0.1, cantidad: 0.07 }
  },
  {
    id: "a4-duplex-color",
    category: "impresiones-a4",
    categoryLabel: "Impresiones A4",
    icon: "📄",
    name: "A4 ambas caras (duplex) - Color",
    description: "Impresion a doble cara en color para ahorro de papel.",
    tags: "a4 duplex color dos caras impresion",
    pricing: { mode: "dual", unidad: 0.15, cantidad: 0.12 }
  },
  {
    id: "a4-duplex-bn",
    category: "impresiones-a4",
    categoryLabel: "Impresiones A4",
    icon: "📄",
    name: "A4 ambas caras (duplex) - Blanco y Negro",
    description: "Impresion a doble cara en blanco y negro.",
    tags: "a4 duplex blanco negro dos caras impresion",
    pricing: { mode: "dual", unidad: 0.1, cantidad: 0.09 }
  },
  {
    id: "a4-folleto-color",
    category: "impresiones-a4",
    categoryLabel: "Impresiones A4",
    icon: "📰",
    name: "A4 folleto - Color",
    description: "Impresion tipo folleto para presentaciones visuales.",
    tags: "a4 folleto color",
    pricing: { mode: "dual", unidad: 0.15, cantidad: 0.12 }
  },
  {
    id: "a4-folleto-bn",
    category: "impresiones-a4",
    categoryLabel: "Impresiones A4",
    icon: "📰",
    name: "A4 folleto - Blanco y Negro",
    description: "Folleto en blanco y negro con opcion por volumen.",
    tags: "a4 folleto blanco negro",
    pricing: { mode: "dual", unidad: 0.1, cantidad: 0.09 }
  },
  {
    id: "triptico-color",
    category: "impresiones-a4",
    categoryLabel: "Impresiones A4",
    icon: "📘",
    name: "Triptico - Color",
    description: "Tripticos en color para promociones y eventos.",
    tags: "triptico color",
    pricing: { mode: "dual", unidad: 0.15, cantidad: 0.12 }
  },
  {
    id: "triptico-bn",
    category: "impresiones-a4",
    categoryLabel: "Impresiones A4",
    icon: "📘",
    name: "Triptico - Blanco y Negro",
    description: "Tripticos en blanco y negro para volumen.",
    tags: "triptico blanco negro",
    pricing: { mode: "dual", unidad: 0.1, cantidad: 0.1 }
  },
  {
    id: "ploteo-a0",
    category: "ploteos",
    categoryLabel: "Ploteos",
    icon: "📐",
    name: "Ploteo formato A0",
    description: "Formato grande para planos y afiches tecnicos.",
    tags: "ploteo a0 formato grande",
    pricing: { mode: "dual", unidad: 4, cantidad: 3.8 }
  },
  {
    id: "ploteo-a1",
    category: "ploteos",
    categoryLabel: "Ploteos",
    icon: "📐",
    name: "Ploteo formato A1",
    description: "Impresion de planos y posters tamaño A1.",
    tags: "ploteo a1",
    pricing: { mode: "dual", unidad: 2, cantidad: 1.9 }
  },
  {
    id: "ploteo-a2",
    category: "ploteos",
    categoryLabel: "Ploteos",
    icon: "📐",
    name: "Ploteo formato A2",
    description: "Formato A2 para esquemas y material visual.",
    tags: "ploteo a2",
    pricing: { mode: "dual", unidad: 1.5, cantidad: 1.4 }
  },
  {
    id: "ploteo-a3",
    category: "ploteos",
    categoryLabel: "Ploteos",
    icon: "📐",
    name: "Ploteo formato A3",
    description: "Formato A3 sin diferencia por volumen.",
    tags: "ploteo a3",
    pricing: { mode: "dual", unidad: 0.5, cantidad: 0.5 }
  },
  {
    id: "ploteo-a4",
    category: "ploteos",
    categoryLabel: "Ploteos",
    icon: "📐",
    name: "Ploteo formato A4",
    description: "Formato A4 sin descuento por volumen.",
    tags: "ploteo a4",
    pricing: { mode: "dual", unidad: 0.1, cantidad: 0.1 }
  },
  {
    id: "anillado-simple",
    category: "encuadernacion",
    categoryLabel: "Encuadernacion",
    icon: "📚",
    name: "Anillado simple",
    description: "Hasta 100 hojas aprox.",
    tags: "anillado simple encuadernacion",
    pricing: { mode: "single", value: 1.5 }
  },
  {
    id: "anillado-mediano",
    category: "encuadernacion",
    categoryLabel: "Encuadernacion",
    icon: "📚",
    name: "Anillado mediano",
    description: "De 101 a 200 hojas aprox.",
    tags: "anillado mediano encuadernacion",
    pricing: { mode: "single", value: 2 }
  },
  {
    id: "anillado-grueso",
    category: "encuadernacion",
    categoryLabel: "Encuadernacion",
    icon: "📚",
    name: "Anillado grueso",
    description: "De 201 a 300 hojas aprox.",
    tags: "anillado grueso encuadernacion",
    pricing: { mode: "single", value: 3 }
  },
  {
    id: "empastado-fuerte",
    category: "encuadernacion",
    categoryLabel: "Encuadernacion",
    icon: "📕",
    name: "Empastado/Encuadernado fuerte",
    description: "Acabado resistente para trabajos finales.",
    tags: "empastado encuadernado fuerte",
    pricing: { mode: "single", value: 6 }
  },
  {
    id: "papel-fotografico",
    category: "papeleria",
    categoryLabel: "Papeleria especial",
    icon: "🖼️",
    name: "Papel fotografico",
    description: "Acabado brillante para imagenes de alta calidad.",
    tags: "papel fotografico",
    pricing: { mode: "single", value: 1.5 }
  },
  {
    id: "papel-couche",
    category: "papeleria",
    categoryLabel: "Papeleria especial",
    icon: "📇",
    name: "Impresion en papel couche",
    description: "Ideal para volantes y material promocional.",
    tags: "papel couche impresion",
    pricing: { mode: "single", value: 2 }
  },
  {
    id: "cartulina-escolar",
    category: "papeleria",
    categoryLabel: "Papeleria especial",
    icon: "🧾",
    name: "Impresion en cartulina escolar",
    description: "Cartulina para tareas y material educativo.",
    tags: "cartulina escolar",
    pricing: { mode: "single", value: 0.5 }
  },
  {
    id: "cartulina-hilo",
    category: "papeleria",
    categoryLabel: "Papeleria especial",
    icon: "🧾",
    name: "Impresion en cartulina de hilo",
    description: "Textura premium para presentaciones formales.",
    tags: "cartulina hilo",
    pricing: { mode: "single", value: 1 }
  }
];

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
  catalogCount: document.getElementById("catalog-count"),
  catalogHint: document.getElementById("catalog-hint")
};

let toastTimeoutId = null;

function formatMoney(value) {
  return `S/ ${value.toFixed(2)}`;
}

function sanitizeQuantity(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

function calculateA4Total() {
  return { quantity: 1, unitPrice: 0.1, total: 0.1 };
}

function getTierLabel(service, quantity) {
  if (service.pricing.mode !== "dual") {
    return "Precio fijo";
  }

  return quantity > BULK_THRESHOLD ? "Cantidad (101+ hojas)" : "Unidad (1-100 hojas)";
}

function getTierStatusMessage(service, quantity) {
  if (service.pricing.mode !== "dual") {
    return "Tarifa fija para este servicio";
  }

  return quantity > BULK_THRESHOLD
    ? "Se activo precio por mayor"
    : "Aplicando precio por unidad";
}

function renderCatalog() {
  const cardsMarkup = CATALOG_ITEMS.map((item) => {
    const hasDualPricing = item.pricing.mode === "dual";
    const pricingBlock = hasDualPricing
      ? `<div class="price-line"><span>Unidad: <strong>${formatMoney(item.pricing.unidad)}</strong></span><span>Cantidad: <strong>${formatMoney(item.pricing.cantidad)}</strong></span></div>`
      : `<div class="price-line"><span>Precio: <strong>${formatMoney(item.pricing.value)}</strong></span></div>`;

    const autoRuleLine = hasDualPricing
      ? `<p class="price-line">Regla automatica: <strong>1-100 hojas = Unidad</strong> | <strong>101+ hojas = Cantidad</strong></p>`
      : "";

    return `<article class="service-card" data-category="${item.category}" data-search="${item.tags} ${item.name.toLowerCase()}" aria-labelledby="${item.id}-title">
      <div class="card-head">
        <div class="icon" aria-hidden="true">${item.icon}</div>
      </div>
      <p class="service-category">${item.categoryLabel}</p>
      <h2 id="${item.id}-title">${item.name}</h2>
      <p>${item.description}</p>
      ${pricingBlock}
      ${autoRuleLine}
      <div class="service-controls">
        <div class="controls">
          <label><span>Cantidad</span><input class="quantity-input" data-id="${item.id}" type="number" min="1" value="1" inputmode="numeric"></label>
        </div>
        <p class="tier-status" id="tier-${item.id}">${getTierStatusMessage(item, 1)}</p>
        <p class="total-preview">Total estimado: <strong id="preview-${item.id}">${formatMoney(getEstimatedTotal(item, 1))}</strong></p>
      </div>
      <button class="btn add-btn" data-service="${item.id}" type="button">Agregar al pedido</button>
    </article>`;
  }).join("");

  nodes.servicesGrid.innerHTML = cardsMarkup;
}

function getEstimatedUnitPrice(service, quantity) {
  const safeQuantity = sanitizeQuantity(quantity);

  if (service.pricing.mode === "single") {
    return service.pricing.value;
  }

  return safeQuantity > BULK_THRESHOLD ? service.pricing.cantidad : service.pricing.unidad;
}

function getEstimatedTotal(service, quantity) {
  return sanitizeQuantity(quantity) * getEstimatedUnitPrice(service, quantity);
}

function refreshServicesFromDom() {
  const addButtons = nodes.servicesGrid.querySelectorAll(".add-btn");
  servicesById = {};

  addButtons.forEach((button) => {
    const id = button.dataset.service;
    if (!id) {
      return;
    }

    const serviceData = CATALOG_ITEMS.find((item) => item.id === id);
    if (!serviceData) {
      return;
    }

    servicesById[id] = {
      ...serviceData
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
    if (newItem.pricingMode === "dual-threshold") {
      const sourceService = servicesById[newItem.sourceServiceId];
      if (sourceService) {
        existing.unitPrice = getEstimatedUnitPrice(sourceService, existing.quantity);
        existing.tierLabel = getTierLabel(sourceService, existing.quantity);
        existing.name = `${sourceService.name} [${existing.tierLabel}]`;
      }
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
  if (item.pricingMode === "dual-threshold") {
    const sourceService = servicesById[item.sourceServiceId];
    if (sourceService) {
      item.unitPrice = getEstimatedUnitPrice(sourceService, item.quantity);
      item.tierLabel = getTierLabel(sourceService, item.quantity);
      item.name = `${sourceService.name} [${item.tierLabel}]`;
    }
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

  const quantityInput = nodes.servicesGrid.querySelector(`.quantity-input[data-id="${serviceId}"]`);
  const quantity = sanitizeQuantity(quantityInput ? quantityInput.value : 1);
  const unitPrice = getEstimatedUnitPrice(service, quantity);
  const tierLabel = getTierLabel(service, quantity);

  upsertCartItem({
    id: service.id,
    sourceServiceId: service.id,
    name: service.pricing.mode === "dual" ? `${service.name} [${tierLabel}]` : service.name,
    quantity,
    unitPrice,
    subtotal: quantity * unitPrice,
    pricingMode: service.pricing.mode === "dual" ? "dual-threshold" : "single",
    tierLabel
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

function updateCardPreview(card) {
  const serviceId = card.querySelector(".add-btn")?.dataset.service;
  const previewNode = card.querySelector(".total-preview strong");
  const tierNode = card.querySelector(".tier-status");
  if (!serviceId || !previewNode) {
    return;
  }

  const service = servicesById[serviceId];
  if (!service) {
    return;
  }

  const qtyInput = card.querySelector(`.quantity-input[data-id="${serviceId}"]`);
  const quantity = sanitizeQuantity(qtyInput ? qtyInput.value : 1);
  const total = getEstimatedTotal(service, quantity);
  previewNode.textContent = formatMoney(total);

  if (tierNode) {
    tierNode.textContent = getTierStatusMessage(service, quantity);
    tierNode.classList.toggle("is-bulk", service.pricing.mode === "dual" && quantity > BULK_THRESHOLD);
  }
}

function bindCatalogControls() {
  nodes.servicesGrid.addEventListener("input", (event) => {
    const card = event.target.closest(".service-card");
    if (!card) {
      return;
    }

    const quantityInput = event.target.closest(".quantity-input");
    if (quantityInput) {
      quantityInput.value = String(sanitizeQuantity(quantityInput.value));
      updateCardPreview(card);
    }
  });

  nodes.servicesGrid.addEventListener("change", (event) => {
    const card = event.target.closest(".service-card");
    if (!card) {
      return;
    }

    if (event.target.closest(".quantity-input")) {
      updateCardPreview(card);
    }
  });
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
  bindCatalogControls();
}

function init() {
  renderCatalog();
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
