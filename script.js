const STORAGE_KEYS = {
  cart: "grafiplot_cart_v1",
  note: "grafiplot_note_v1"
};

const BULK_THRESHOLD = 100;

const PRINT_CONFIG = {
  sizes: ["a4", "a3", "a2", "a1", "a0"],
  lockedSingleSideSizes: ["a2", "a1", "a0"],
  sideLabels: {
    single: "Una sola cara",
    duplex: "Ambas caras (Duplex)"
  },
  styleLabels: {
    bn: "Blanco y Negro",
    color: "Color"
  }
};

const PRICE_MATRIX = {
  a4: {
    single: {
      color: { unit: 0.1, bulk: 0.1, name: "A4 una cara - Color" },
      bn: { unit: 0.1, bulk: 0.07, name: "A4 una cara - Blanco y Negro" }
    },
    duplex: {
      color: { unit: 0.15, bulk: 0.12, name: "A4 ambas caras (duplex) - Color" },
      bn: { unit: 0.1, bulk: 0.09, name: "A4 ambas caras (duplex) - Blanco y Negro" }
    }
  },
  a3: {
    single: {
      color: { unit: 0.5, bulk: 0.5, name: "Ploteo formato A3 - Color" },
      bn: { unit: 0.5, bulk: 0.5, name: "Ploteo formato A3 - Blanco y Negro" }
    },
    duplex: {
      color: { unit: 0.55, bulk: 0.55, name: "A3 ambas caras (duplex) - Color" },
      bn: { unit: 0.55, bulk: 0.55, name: "A3 ambas caras (duplex) - Blanco y Negro" }
    }
  },
  a2: {
    single: {
      color: { unit: 1.5, bulk: 1.4, name: "Ploteo formato A2 - Color" },
      bn: { unit: 1.5, bulk: 1.4, name: "Ploteo formato A2 - Blanco y Negro" }
    }
  },
  a1: {
    single: {
      color: { unit: 2, bulk: 1.9, name: "Ploteo formato A1 - Color" },
      bn: { unit: 2, bulk: 1.9, name: "Ploteo formato A1 - Blanco y Negro" }
    }
  },
  a0: {
    single: {
      color: { unit: 4, bulk: 3.8, name: "Ploteo formato A0 - Color" },
      bn: { unit: 4, bulk: 3.8, name: "Ploteo formato A0 - Blanco y Negro" }
    }
  }
};

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
  cartItems: document.getElementById("cart-items"),
  cartTotal: document.getElementById("cart-total"),
  orderUnits: document.getElementById("order-units"),
  attentionStatus: document.getElementById("attention-status"),
  whatsappBtn: document.getElementById("whatsapp-btn"),
  clearCartBtn: document.getElementById("clear-cart-btn"),
  customerNote: document.getElementById("customer-note"),
  toast: document.getElementById("toast"),
  cartPanel: document.getElementById("cart-panel"),
  cartFab: document.getElementById("cart-fab"),
  cartFabCount: document.getElementById("cart-fab-count"),
  mobileCartSheet: document.getElementById("mobile-cart-sheet"),
  mobileCartBackdrop: document.getElementById("mobile-cart-backdrop"),
  mobileCartClose: document.getElementById("mobile-cart-close"),
  mobileCartItems: document.getElementById("mobile-cart-items"),
  mobileCartTotal: document.getElementById("mobile-cart-total"),
  mobileCartOrder: document.getElementById("mobile-cart-order"),
  serviceTabButtons: document.querySelectorAll("[data-tab-btn]"),
  serviceTabPanels: document.querySelectorAll("[data-tab-panel]"),
  sizeOptions: document.getElementById("size-options"),
  sidesOptions: document.getElementById("sides-options"),
  sidesLockHint: document.getElementById("sides-lock-hint"),
  styleOptions: document.getElementById("style-options"),
  configQuantity: document.getElementById("config-quantity"),
  bulkHint: document.getElementById("bulk-hint"),
  configCheer: document.getElementById("config-cheer"),
  configSelection: document.getElementById("config-selection"),
  configUnitPrice: document.getElementById("config-unit-price"),
  configTotalPrice: document.getElementById("config-total-price"),
  addConfigBtn: document.getElementById("add-config-btn")
};

let cart = [];
let toastTimeoutId = null;
let cheerTimeoutId = null;
let isStoreOpen = false;
let isMobileCartOpen = false;

const systemThemeQuery = window.matchMedia("(prefers-color-scheme: light)");
const mobileCartQuery = window.matchMedia("(max-width: 600px)");

const configState = {
  size: null,
  side: null,
  style: null,
  quantity: 1
};

function formatMoney(value) {
  return `S/ ${value.toFixed(2)}`;
}

function sanitizeQuantity(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

function isLockedToSingleSide(size) {
  return PRINT_CONFIG.lockedSingleSideSizes.includes(size);
}

function getCurrentPriceRule() {
  const { size, side, style } = configState;
  if (!size || !side || !style) {
    return null;
  }

  return PRICE_MATRIX[size]?.[side]?.[style] || null;
}

function getEffectiveUnitPrice(rule, quantity) {
  if (!rule) {
    return 0;
  }

  if (typeof rule.bulk === "number" && quantity > BULK_THRESHOLD) {
    return rule.bulk;
  }

  return rule.unit;
}

function buildConfigItemName() {
  const rule = getCurrentPriceRule();
  if (!rule) {
    return "";
  }

  return rule.name;
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
  nodes.orderUnits.textContent = `Items totales: ${cart.reduce((sum, item) => sum + item.quantity, 0)}`;
  nodes.attentionStatus.textContent = getAttentionStatusText();
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

function showConfigCheer(message) {
  if (!nodes.configCheer) {
    return;
  }

  if (cheerTimeoutId) {
    clearTimeout(cheerTimeoutId);
  }

  nodes.configCheer.textContent = message;
  nodes.configCheer.classList.add("show");
  cheerTimeoutId = setTimeout(() => {
    nodes.configCheer.classList.remove("show");
  }, 1700);
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

function updateCheckoutStates() {
  const isEmpty = cart.length === 0;
  nodes.whatsappBtn.disabled = isEmpty;
  nodes.whatsappBtn.classList.toggle("is-disabled", isEmpty);
  nodes.clearCartBtn.disabled = isEmpty;
  nodes.clearCartBtn.classList.toggle("is-disabled", isEmpty);
}

function renderMobileCartSummary() {
  if (!nodes.mobileCartItems || !nodes.mobileCartTotal || !nodes.cartFabCount) {
    return;
  }

  const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
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

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
  nodes.mobileCartTotal.textContent = formatMoney(total);
}

function recomputeCartItem(item) {
  const unit = item.bulkUnitPrice && item.quantity > BULK_THRESHOLD ? item.bulkUnitPrice : item.baseUnitPrice;
  item.unitPrice = unit;
  item.subtotal = item.unitPrice * item.quantity;
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

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
  nodes.cartTotal.textContent = formatMoney(total);
  renderQuickSummary();
  renderMobileCartSummary();
  updateCheckoutStates();
}

function upsertCartItemFromConfig(quantity) {
  const rule = getCurrentPriceRule();
  if (!rule) {
    return;
  }

  const name = buildConfigItemName();
  const key = `${configState.size}-${configState.side}-${configState.style}`;
  const existing = cart.find((item) => item.id === key);

  if (existing) {
    existing.quantity += quantity;
    recomputeCartItem(existing);
  } else {
    const unitPrice = getEffectiveUnitPrice(rule, quantity);
    cart.push({
      id: key,
      name,
      size: configState.size,
      side: configState.side,
      style: configState.style,
      quantity,
      baseUnitPrice: rule.unit,
      bulkUnitPrice: typeof rule.bulk === "number" ? rule.bulk : null,
      unitPrice,
      subtotal: unitPrice * quantity
    });
  }

  saveCart();
  renderCart();
}

function changeItemQuantity(itemId, action) {
  const item = cart.find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }

  if (action === "remove") {
    cart = cart.filter((entry) => entry.id !== itemId);
    saveCart();
    renderCart();
    showToast("Servicio eliminado del pedido");
    return;
  }

  const delta = action === "increase" ? 1 : -1;
  const nextQuantity = item.quantity + delta;
  if (nextQuantity < 1) {
    cart = cart.filter((entry) => entry.id !== itemId);
    saveCart();
    renderCart();
    return;
  }

  item.quantity = nextQuantity;
  recomputeCartItem(item);
  saveCart();
  renderCart();
}

function setActiveOption(container, value, attrName) {
  container?.querySelectorAll(".option-btn").forEach((button) => {
    const isActive = button.dataset[attrName] === value;
    button.classList.toggle("active", isActive);
  });
}

function updateSidesStepState() {
  const size = configState.size;
  const isLocked = size && isLockedToSingleSide(size);

  if (!size) {
    nodes.sidesLockHint.hidden = true;
    nodes.sidesOptions.querySelectorAll(".option-btn").forEach((button) => {
      button.disabled = false;
    });
    return;
  }

  nodes.sidesOptions.querySelectorAll(".option-btn").forEach((button) => {
    const isDuplex = button.dataset.side === "duplex";
    button.disabled = isLocked && isDuplex;
  });

  if (isLocked) {
    configState.side = "single";
    setActiveOption(nodes.sidesOptions, "single", "side");
    nodes.sidesLockHint.hidden = false;
  } else {
    nodes.sidesLockHint.hidden = true;
  }
}

function updateConfigSummary() {
  const rule = getCurrentPriceRule();
  const quantity = sanitizeQuantity(nodes.configQuantity.value);
  configState.quantity = quantity;
  nodes.configQuantity.value = String(quantity);

  if (!rule) {
    nodes.configSelection.textContent = "Selecciona tamaño, caras y estilo para calcular.";
    nodes.configUnitPrice.textContent = formatMoney(0);
    nodes.configTotalPrice.textContent = formatMoney(0);
    nodes.bulkHint.textContent = "";
    nodes.addConfigBtn.disabled = true;
    return;
  }

  const unitPrice = getEffectiveUnitPrice(rule, quantity);
  const totalPrice = unitPrice * quantity;
  const sideLabel = PRINT_CONFIG.sideLabels[configState.side] || "";
  const styleLabel = PRINT_CONFIG.styleLabels[configState.style] || "";

  nodes.configSelection.textContent = `${configState.size.toUpperCase()} | ${sideLabel} | ${styleLabel}`;
  nodes.configUnitPrice.textContent = formatMoney(unitPrice);
  nodes.configTotalPrice.textContent = formatMoney(totalPrice);
  nodes.bulkHint.textContent = quantity > BULK_THRESHOLD && typeof rule.bulk === "number"
    ? "Se activo precio por mayor en esta configuracion."
    : "Precio unitario para 1-100 hojas. Precio por mayor se activa en 101+ hojas.";
  nodes.addConfigBtn.disabled = false;
}

function addConfiguredItemToCart() {
  const rule = getCurrentPriceRule();
  if (!rule) {
    showToast("Completa la configuracion antes de agregar.");
    return;
  }

  const quantity = sanitizeQuantity(nodes.configQuantity.value);
  upsertCartItemFromConfig(quantity);
  triggerCartFabFeedback();
  showToast("Configuracion agregada al pedido");
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

function buildWhatsAppMessage() {
  const lines = cart.map((item, index) => `${index + 1}. ✅ ${item.name} (${formatMoney(item.unitPrice)} x ${item.quantity}) = ${formatMoney(item.subtotal)}`);
  const total = formatMoney(cart.reduce((sum, item) => sum + item.subtotal, 0));
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

function bindConfiguratorEvents() {
  nodes.sizeOptions?.addEventListener("click", (event) => {
    const button = event.target.closest(".option-btn[data-size]");
    if (!button) {
      return;
    }

    configState.size = button.dataset.size;
    setActiveOption(nodes.sizeOptions, configState.size, "size");

    if (isLockedToSingleSide(configState.size)) {
      configState.side = "single";
      setActiveOption(nodes.sidesOptions, "single", "side");
      showConfigCheer("Perfecto. Ese tamaño va una sola cara por limite de maquina.");
    } else {
      showConfigCheer("Genial, tamaño elegido. Ya estas cerca de tener tu trabajo listo.");
    }

    updateSidesStepState();
    updateConfigSummary();
  });

  nodes.sidesOptions?.addEventListener("click", (event) => {
    const button = event.target.closest(".option-btn[data-side]");
    if (!button || button.disabled) {
      return;
    }

    configState.side = button.dataset.side;
    setActiveOption(nodes.sidesOptions, configState.side, "side");
    showConfigCheer("Buena eleccion de caras. Vamos firme con tu pedido.");
    updateConfigSummary();
  });

  nodes.styleOptions?.addEventListener("click", (event) => {
    const button = event.target.closest(".option-btn[data-style]");
    if (!button) {
      return;
    }

    configState.style = button.dataset.style;
    setActiveOption(nodes.styleOptions, configState.style, "style");
    showConfigCheer("Excelente. El estilo de impresion ya esta definido.");
    updateConfigSummary();
  });

  nodes.configQuantity?.addEventListener("input", () => {
    updateConfigSummary();
    const qty = sanitizeQuantity(nodes.configQuantity.value);
    if (qty > BULK_THRESHOLD) {
      showConfigCheer("Activaste precio por mayor. Muy buena jugada.");
    }
  });
  nodes.addConfigBtn?.addEventListener("click", addConfiguredItemToCart);
}

function setActiveServiceTab(tabKey) {
  nodes.serviceTabButtons.forEach((button) => {
    const isActive = button.dataset.tabBtn === tabKey;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  nodes.serviceTabPanels.forEach((panel) => {
    const isActive = panel.dataset.tabPanel === tabKey;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
}

function bindEvents() {
  nodes.serviceTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveServiceTab(button.dataset.tabBtn);
    });
  });

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

  nodes.cartItems.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-action]");
    if (!target) {
      return;
    }

    changeItemQuantity(target.dataset.id, target.dataset.action);
  });

  nodes.customerNote.addEventListener("input", saveNote);
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

function hydrateCartForNewModel() {
  cart = cart.map((item) => {
    if (typeof item.baseUnitPrice === "number") {
      recomputeCartItem(item);
      return item;
    }

    const fallbackBaseUnit = typeof item.unitPrice === "number" ? item.unitPrice : 0;
    return {
      ...item,
      baseUnitPrice: fallbackBaseUnit,
      bulkUnitPrice: null,
      subtotal: fallbackBaseUnit * item.quantity,
      unitPrice: fallbackBaseUnit
    };
  });
}

function init() {
  initSystemTheme();
  loadCart();
  hydrateCartForNewModel();
  loadNote();
  setActiveServiceTab("produccion");
  setMobileCartOpen(false);
  setStoreOpen(false, false);
  updateSidesStepState();
  updateConfigSummary();
  renderCart();
  bindConfiguratorEvents();
  bindEvents();
}

init();
