const STORAGE_KEYS = {
  cart: "grafiplot_cart_v1",
  note: "grafiplot_note_v1"
};

const BULK_THRESHOLD = 100;
const BINDING_BLOCK_SIZE = 200;
const BINDING_BLOCK_PRICE = 6;

const PRINT_CONFIG = {
  sizes: ["a4", "a3", "a2", "a1", "a0"],
  lockedSingleSideSizes: ["a2", "a1", "a0"],
  paperRestrictedSizes: ["a2", "a1", "a0"],
  bindingAllowedSizes: ["a4", "a3"],
  sideLabels: {
    single: "Una sola cara",
    duplex: "Ambas caras (Duplex)"
  },
  styleLabels: {
    bn: "Blanco y Negro",
    color: "Color"
  }
};

const PAPER_OPTIONS = {
      "bond-75": { label: "Papel bond 75g", absolutePriceBySize: { any: null } },
  fotografico: { label: "Papel fotografico", absolutePriceBySize: { a4: 1.5, a3: 3 } },
  couche: { label: "Papel couche", absolutePriceBySize: { a4: 2, a3: 4 } },
  "cartulina-escolar": { label: "Cartulina escolar", absolutePriceBySize: { a4: 0.5, a3: 1 } },
  "cartulina-hilo": { label: "Cartulina de hilo", absolutePriceBySize: { a4: 1, a3: 2 } }
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
      color: { unit: 0.5, bulk: 0.5, name: "A3 ambas caras (duplex) - Color" },
      bn: { unit: 0.5, bulk: 0.5, name: "A3 ambas caras (duplex) - Blanco y Negro" }
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
  utilityToggle: document.getElementById("utility-toggle"),
  utilityClose: document.getElementById("utility-close"),
  utilitySidebar: document.getElementById("utility-sidebar"),
  utilityBackdrop: document.getElementById("utility-backdrop"),
  utilityWorkspace: document.getElementById("utility-workspace"),
  utilityWorkspaceClose: document.getElementById("utility-workspace-close"),
  utilityWorkspaceBack: document.getElementById("utility-workspace-back"),
  utilityWorkspaceTitle: document.getElementById("utility-workspace-title"),
  utilityItems: document.querySelectorAll(".utility-item[data-tool]"),
  utilityToolPanels: document.querySelectorAll(".utility-tool-panel[data-tool-panel]"),
  qrPayloadType: document.getElementById("qr-payload-type"),
  qrTextField: document.getElementById("qr-text-field"),
  qrPayloadText: document.getElementById("qr-payload-text"),
  qrWhatsappFields: document.getElementById("qr-whatsapp-fields"),
  qrWaNumber: document.getElementById("qr-wa-number"),
  qrWaMessage: document.getElementById("qr-wa-message"),
  qrSizeRange: document.getElementById("qr-size-range"),
  qrSizeOutput: document.getElementById("qr-size-output"),
  qrFileName: document.getElementById("qr-file-name"),
  qrValidation: document.getElementById("qr-validation"),
  qrGenerateBtn: document.getElementById("qr-generate-btn"),
  qrDownloadBtn: document.getElementById("qr-download-btn"),
  qrPreviewImage: document.getElementById("qr-preview-image"),
  serviceTabButtons: document.querySelectorAll("[data-tab-btn]"),
  serviceTabPanels: document.querySelectorAll("[data-tab-panel]"),
  supportPanel: document.querySelector('[data-tab-panel="soporte"]'),
  sizeOptions: document.getElementById("size-options"),
  sidesOptions: document.getElementById("sides-options"),
  sidesLockHint: document.getElementById("sides-lock-hint"),
  styleOptions: document.getElementById("style-options"),
  configQuantity: document.getElementById("config-quantity"),
  paperOptions: document.getElementById("paper-options"),
  paperLockHint: document.getElementById("paper-lock-hint"),
  includeBinding: document.getElementById("include-binding"),
  bindingLockHint: document.getElementById("binding-lock-hint"),
  bulkHint: document.getElementById("bulk-hint"),
  configCheer: document.getElementById("config-cheer"),
  configSelection: document.getElementById("config-selection"),
  configUnitPrice: document.getElementById("config-unit-price"),
  configBindingLine: document.getElementById("config-binding-line"),
  configBindingPrice: document.getElementById("config-binding-price"),
  configTotalPrice: document.getElementById("config-total-price"),
  addConfigBtn: document.getElementById("add-config-btn"),
  bindingQuantity: document.getElementById("binding-quantity"),
  bindingBlocks: document.getElementById("binding-blocks"),
  bindingTotal: document.getElementById("binding-total"),
  addBindingBtn: document.getElementById("add-binding-btn"),
  techCards: document.querySelectorAll(".tech-card"),
  lazySlideImages: document.querySelectorAll("img.lazy-slide")
};

let cart = [];
let toastTimeoutId = null;
let cheerTimeoutId = null;
let isStoreOpen = false;
let isMobileCartOpen = false;
let techPulseIntervalId = null;
let supportPanelVisible = false;
let lastPulsedCardIndex = -1;
let isUtilityOpen = false;
let isUtilityWorkspaceOpen = false;
let qrCurrentUrl = "";

const systemThemeQuery = window.matchMedia("(prefers-color-scheme: light)");
const mobileCartQuery = window.matchMedia("(max-width: 600px)");
const utilityDrawerQuery = window.matchMedia("(max-width: 991px)");

const configState = {
  size: null,
  side: null,
  style: null,
  quantity: 1,
  paperType: "bond-75",
  includeBinding: false
};

function formatMoney(value) {
  return `S/ ${value.toFixed(2)}`;
}

function sanitizeQuantity(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

function parseQuantityOrNull(value) {
  const raw = `${value ?? ""}`.trim();
  if (raw === "") {
    return null;
  }

  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

function isLockedToSingleSide(size) {
  return PRINT_CONFIG.lockedSingleSideSizes.includes(size);
}

function isPaperRestricted(size) {
  return PRINT_CONFIG.paperRestrictedSizes.includes(size);
}

function allowsBinding(size) {
  return PRINT_CONFIG.bindingAllowedSizes.includes(size);
}

function getPaperSelection() {
  return PAPER_OPTIONS[configState.paperType] || PAPER_OPTIONS["bond-75"];
}

function getPaperPriceOverride(size, paperType) {
  const option = PAPER_OPTIONS[paperType] || PAPER_OPTIONS["bond-75"];
  if (Object.prototype.hasOwnProperty.call(option.absolutePriceBySize, "any")) {
    return option.absolutePriceBySize.any;
  }

  if (Object.prototype.hasOwnProperty.call(option.absolutePriceBySize, size)) {
    return option.absolutePriceBySize[size];
  }

  return null;
}

function getCurrentPriceRule() {
  const { size, side, style } = configState;
  if (!size || !side || !style) {
    return null;
  }

  return PRICE_MATRIX[size]?.[side]?.[style] || null;
}

function getBaseUnitFromRule(rule, quantity) {
  if (!rule) {
    return 0;
  }

  return typeof rule.bulk === "number" && quantity > BULK_THRESHOLD ? rule.bulk : rule.unit;
}

function getEffectiveUnitPrice(rule, quantity) {
  const base = getBaseUnitFromRule(rule, quantity);
  const override = getPaperPriceOverride(configState.size, configState.paperType);
  return typeof override === "number" ? override : base;
}

function buildConfigItemName() {
  const rule = getCurrentPriceRule();
  if (!rule) {
    return "";
  }

  const paper = getPaperSelection();
  return `${rule.name} | ${paper.label}${configState.includeBinding ? " | + Anillado" : ""}`;
}

function getBindingCalc(pages) {
  const safePages = sanitizeQuantity(pages);
  const blocks = Math.max(1, Math.ceil(safePages / BINDING_BLOCK_SIZE));
  return {
    pages: safePages,
    blocks,
    total: blocks * BINDING_BLOCK_PRICE
  };
}

function getAutoBindingForConfig(quantity) {
  if (!configState.includeBinding || !allowsBinding(configState.size)) {
    return null;
  }

  return getBindingCalc(quantity);
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

function triggerFieldShake(field) {
  if (!field) {
    return;
  }

  field.classList.remove("field-shake");
  void field.offsetWidth;
  field.classList.add("field-shake");
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
  const baseUnit = item.bulkUnitPrice && item.quantity > BULK_THRESHOLD ? item.bulkUnitPrice : item.baseUnitPrice;
  const override = typeof item.paperPriceOverride === "number" ? item.paperPriceOverride : null;
  const unit = override ?? baseUnit;
  const bindingCalc = item.includeBinding ? getBindingCalc(item.quantity) : null;
  item.unitPrice = unit;
  item.bindingBlocks = bindingCalc ? bindingCalc.blocks : 0;
  item.bindingTotal = bindingCalc ? bindingCalc.total : 0;
  item.subtotal = item.unitPrice * item.quantity + item.bindingTotal;
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
    .map((item) => {
      const secondary = `${formatMoney(item.unitPrice)} x ${item.quantity}`;

      return `<li>
        <div class="cart-item-head">
          <span>✅ ${item.name}</span>
          <strong>${formatMoney(item.subtotal)}</strong>
        </div>
        <div class="cart-item-meta">${secondary}</div>
        ${item.bindingTotal ? `<div class="cart-item-meta">Anillado auto (${item.bindingBlocks} bloque${item.bindingBlocks === 1 ? "" : "s"}): ${formatMoney(item.bindingTotal)}</div>` : ""}
        <div class="cart-item-actions">
          <button class="cart-action" type="button" data-action="decrease" data-id="${item.id}" aria-label="Quitar una unidad">-</button>
          <button class="cart-action" type="button" data-action="increase" data-id="${item.id}" aria-label="Agregar una unidad">+</button>
          <button class="cart-action remove" type="button" data-action="remove" data-id="${item.id}" aria-label="Eliminar servicio">x</button>
        </div>
      </li>`;
    })
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

  const key = `${configState.size}-${configState.side}-${configState.style}-${configState.paperType}-${configState.includeBinding ? "bind" : "nobind"}`;
  const existing = cart.find((item) => item.id === key);
  const paper = getPaperSelection();
  const paperPriceOverride = getPaperPriceOverride(configState.size, configState.paperType);

  if (existing) {
    existing.quantity += quantity;
    recomputeCartItem(existing);
  } else {
    const unitPrice = getEffectiveUnitPrice(rule, quantity);
    cart.push({
      id: key,
      name: buildConfigItemName(),
      size: configState.size,
      side: configState.side,
      style: configState.style,
      quantity,
      baseUnitPrice: rule.unit,
      bulkUnitPrice: typeof rule.bulk === "number" ? rule.bulk : null,
      paperType: configState.paperType,
      paperLabel: paper.label,
      paperPriceOverride,
      includeBinding: configState.includeBinding,
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

function updatePaperState() {
  const size = configState.size;

  if (!size) {
    configState.paperType = "bond-75";
    setActiveOption(nodes.paperOptions, "bond-75", "paper");
    nodes.paperOptions.querySelectorAll(".option-btn").forEach((button) => {
      button.disabled = false;
    });
    nodes.paperLockHint.hidden = true;
    return;
  }

  if (isPaperRestricted(size)) {
    configState.paperType = "bond-75";
    setActiveOption(nodes.paperOptions, "bond-75", "paper");
    nodes.paperOptions.querySelectorAll(".option-btn").forEach((button) => {
      button.disabled = button.dataset.paper !== "bond-75";
    });
    nodes.paperLockHint.hidden = false;
  } else {
    nodes.paperOptions.querySelectorAll(".option-btn").forEach((button) => {
      button.disabled = false;
    });
    nodes.paperLockHint.hidden = true;
  }
}

function updateConfigSummary() {
  const rule = getCurrentPriceRule();
  const quantity = parseQuantityOrNull(nodes.configQuantity.value);
  configState.quantity = quantity ?? 0;

  nodes.configQuantity.classList.toggle("field-error", quantity === null);

  if (!rule || quantity === null) {
    nodes.configSelection.textContent = "Selecciona tamaño, caras y estilo para calcular.";
    nodes.configUnitPrice.textContent = formatMoney(0);
    if (nodes.configBindingLine && nodes.configBindingPrice) {
      nodes.configBindingLine.hidden = true;
      nodes.configBindingPrice.textContent = formatMoney(0);
    }
    nodes.configTotalPrice.textContent = formatMoney(0);
    nodes.bulkHint.textContent = quantity === null ? "Ingresa una cantidad valida para continuar." : "";
    nodes.addConfigBtn.disabled = true;
    return;
  }

  const unitPrice = getEffectiveUnitPrice(rule, quantity);
  const bindingCalc = getAutoBindingForConfig(quantity);
  const totalPrice = unitPrice * quantity + (bindingCalc ? bindingCalc.total : 0);
  const sideLabel = PRINT_CONFIG.sideLabels[configState.side] || "";
  const styleLabel = PRINT_CONFIG.styleLabels[configState.style] || "";
  const paper = getPaperSelection();
  const paperOverride = getPaperPriceOverride(configState.size, configState.paperType);

  nodes.configSelection.textContent = `${configState.size.toUpperCase()} | ${sideLabel} | ${styleLabel} | ${paper.label}`;
  nodes.configUnitPrice.textContent = formatMoney(unitPrice);
  if (nodes.configBindingLine && nodes.configBindingPrice) {
    nodes.configBindingLine.hidden = !bindingCalc;
    nodes.configBindingPrice.textContent = bindingCalc ? formatMoney(bindingCalc.total) : formatMoney(0);
  }
  nodes.configTotalPrice.textContent = formatMoney(totalPrice);

  const baseUnit = getBaseUnitFromRule(rule, quantity);
  if (quantity > BULK_THRESHOLD && typeof rule.bulk === "number") {
    nodes.bulkHint.textContent = `Se activo precio por mayor. Base: ${formatMoney(baseUnit)}${typeof paperOverride === "number" ? ` | Papel final: ${formatMoney(paperOverride)}` : ""}${bindingCalc ? ` + anillado: ${formatMoney(bindingCalc.total)}` : ""}.`;
  } else {
    nodes.bulkHint.textContent = `Precio unitario para 1-100 hojas.${typeof paperOverride === "number" ? ` Papel final: ${formatMoney(paperOverride)}.` : ""}${bindingCalc ? ` Anillado: ${formatMoney(bindingCalc.total)}.` : ""}`;
  }

  nodes.addConfigBtn.disabled = false;
}

function updateBindingState() {
  if (!configState.size) {
    configState.includeBinding = false;
    if (nodes.includeBinding) {
      nodes.includeBinding.checked = false;
      nodes.includeBinding.disabled = true;
    }
    if (nodes.bindingLockHint) {
      nodes.bindingLockHint.hidden = true;
    }
    return;
  }

  const canBind = allowsBinding(configState.size);
  if (!canBind) {
    configState.includeBinding = false;
    if (nodes.includeBinding) {
      nodes.includeBinding.checked = false;
      nodes.includeBinding.disabled = true;
    }
    if (nodes.bindingLockHint) {
      nodes.bindingLockHint.hidden = false;
    }
    return;
  }

  if (nodes.includeBinding) {
    nodes.includeBinding.disabled = false;
  }
  if (nodes.bindingLockHint) {
    nodes.bindingLockHint.hidden = true;
  }
}

function updateBindingServiceSummary() {
  if (!nodes.bindingQuantity || !nodes.bindingBlocks || !nodes.bindingTotal || !nodes.addBindingBtn) {
    return;
  }

  const quantity = parseQuantityOrNull(nodes.bindingQuantity.value);
  nodes.bindingQuantity.classList.toggle("field-error", quantity === null);

  if (quantity === null) {
    nodes.bindingBlocks.textContent = "Bloques: -";
    nodes.bindingTotal.textContent = formatMoney(0);
    nodes.addBindingBtn.disabled = true;
    return;
  }

  const calc = getBindingCalc(quantity);
  nodes.bindingBlocks.textContent = `Bloques: ${calc.blocks}`;
  nodes.bindingTotal.textContent = formatMoney(calc.total);
  nodes.addBindingBtn.disabled = false;
}

function addBindingServiceToCart() {
  if (!nodes.bindingQuantity) {
    return;
  }

  const quantity = parseQuantityOrNull(nodes.bindingQuantity.value);
  if (quantity === null) {
    showToast("Ingresa una cantidad valida para encuadernado.");
    triggerFieldShake(nodes.bindingQuantity);
    nodes.bindingQuantity.focus();
    return;
  }

  const calc = getBindingCalc(quantity);
  const key = "servicio-encuadernado";
  const existing = cart.find((item) => item.id === key);

  if (existing) {
    existing.quantity += calc.blocks;
    recomputeCartItem(existing);
  } else {
    cart.push({
      id: key,
      name: "Encuadernado (cada 200 hojas)",
      quantity: calc.blocks,
      baseUnitPrice: BINDING_BLOCK_PRICE,
      bulkUnitPrice: null,
      paperType: "bond-75",
      paperLabel: "No aplica",
      paperPriceOverride: null,
      includeBinding: false,
      unitPrice: BINDING_BLOCK_PRICE,
      subtotal: calc.total
    });
  }

  saveCart();
  renderCart();
  triggerCartFabFeedback();
  showToast("Encuadernado agregado al pedido");
}

function addConfiguredItemToCart() {
  const rule = getCurrentPriceRule();
  if (!rule) {
    showToast("Completa la configuracion antes de agregar.");
    return;
  }

  const typedQuantity = parseQuantityOrNull(nodes.configQuantity.value);
  if (typedQuantity === null) {
    showToast("Ingresa una cantidad valida para continuar.");
    triggerFieldShake(nodes.configQuantity);
    nodes.configQuantity?.focus();
    return;
  }

  const quantity = typedQuantity;
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

function setUtilityOpen(nextOpen) {
  isUtilityOpen = nextOpen;
  document.body.classList.toggle("utility-open", isUtilityOpen);

  if (nodes.utilityToggle) {
    nodes.utilityToggle.setAttribute("aria-expanded", isUtilityOpen ? "true" : "false");
  }

  if (nodes.utilitySidebar) {
    const isDesktop = !utilityDrawerQuery.matches;
    nodes.utilitySidebar.setAttribute("aria-hidden", isDesktop ? "false" : (isUtilityOpen ? "false" : "true"));
  }
}

function getUtilityToolTitle(toolKey) {
  switch (toolKey) {
    case "qr":
      return "Generador codigo QR";
    case "pdf-lock":
      return "Encriptar PDF";
    case "img-to-pdf":
      return "Convertir imagen a PDF";
    case "pdf-compress":
      return "Comprimir PDF";
    case "sign":
      return "Firma rapida de documentos";
    default:
      return "Herramientas";
  }
}

function setUtilityWorkspaceOpen(nextOpen) {
  isUtilityWorkspaceOpen = nextOpen;
  document.body.classList.toggle("utility-workspace-open", isUtilityWorkspaceOpen);

  if (nodes.utilityWorkspace) {
    nodes.utilityWorkspace.setAttribute("aria-hidden", isUtilityWorkspaceOpen ? "false" : "true");
  }
}

function sanitizeDigits(value) {
  return `${value || ""}`.replace(/\D/g, "");
}

function normalizeUrl(value) {
  const raw = `${value || ""}`.trim();
  if (!raw) {
    return "";
  }

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function sanitizeFileName(value) {
  const trimmed = `${value || ""}`.trim();
  if (!trimmed) {
    return "qr-grafiplot";
  }

  return trimmed.replace(/[\\/:*?"<>|]+/g, "-").slice(0, 80);
}

function setActiveUtilityTool(toolKey) {
  nodes.utilityItems?.forEach((item) => {
    item.classList.toggle("active", item.dataset.tool === toolKey);
  });

  nodes.utilityToolPanels?.forEach((panel) => {
    const isActive = panel.dataset.toolPanel === toolKey;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });

  if (nodes.utilityWorkspaceTitle) {
    nodes.utilityWorkspaceTitle.textContent = getUtilityToolTitle(toolKey);
  }
}

function toggleQrFields() {
  if (!nodes.qrPayloadType || !nodes.qrWhatsappFields || !nodes.qrTextField) {
    return;
  }

  const isWhatsapp = nodes.qrPayloadType.value === "whatsapp";
  const isTextOrUrl = nodes.qrPayloadType.value === "text" || nodes.qrPayloadType.value === "url";
  nodes.qrWhatsappFields.hidden = !isWhatsapp;
  nodes.qrTextField.hidden = !isTextOrUrl;
}

function updateQrSizeOutput() {
  if (!nodes.qrSizeRange || !nodes.qrSizeOutput) {
    return;
  }

  nodes.qrSizeOutput.textContent = `${nodes.qrSizeRange.value} px`;
}

function getQrPayload() {
  if (!nodes.qrPayloadType) {
    return { payload: "", error: "Modulo QR no disponible." };
  }

  if (nodes.qrPayloadType.value === "whatsapp") {
    const number = sanitizeDigits(nodes.qrWaNumber?.value || "");
    if (!number || number.length < 8 || number.length > 15) {
      return { payload: "", error: "Numero WhatsApp invalido (8 a 15 digitos)." };
    }

    const message = encodeURIComponent((nodes.qrWaMessage?.value || "").trim());
    return {
      payload: message ? `https://wa.me/${number}?text=${message}` : `https://wa.me/${number}`,
      error: ""
    };
  }

  if (nodes.qrPayloadType.value === "url") {
    const normalized = normalizeUrl(nodes.qrPayloadText?.value || "");
    if (!normalized) {
      return { payload: "", error: "El link debe iniciar con http:// o https://" };
    }

    return { payload: normalized, error: "" };
  }

  const text = (nodes.qrPayloadText?.value || "").trim();
  if (!text) {
    return { payload: "", error: "Escribe un texto para generar el QR." };
  }

  return { payload: text, error: "" };
}

function setQrValidation(message, isError = false) {
  if (!nodes.qrValidation) {
    return;
  }

  nodes.qrValidation.textContent = message;
  nodes.qrValidation.classList.toggle("error", isError);
}

function buildQrUrl(payload) {
  const size = Number.parseInt(nodes.qrSizeRange?.value || "360", 10) || 360;
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}&format=png`;
}

function generateQrPreview() {
  if (!nodes.qrPreviewImage || !nodes.qrDownloadBtn) {
    return;
  }

  const { payload, error } = getQrPayload();
  if (error) {
    qrCurrentUrl = "";
    nodes.qrPreviewImage.hidden = true;
    nodes.qrPreviewImage.removeAttribute("src");
    nodes.qrDownloadBtn.disabled = true;
    setQrValidation(error, true);
    return;
  }

  qrCurrentUrl = buildQrUrl(payload);
  nodes.qrPreviewImage.src = qrCurrentUrl;
  nodes.qrPreviewImage.hidden = false;
  nodes.qrDownloadBtn.disabled = false;
  setQrValidation("QR generado. Puedes descargarlo en PNG.", false);
}

async function downloadQrPng() {
  if (!qrCurrentUrl) {
    setQrValidation("Genera primero un QR para descargar.", true);
    return;
  }

  try {
    const response = await fetch(qrCurrentUrl);
    if (!response.ok) {
      throw new Error("download_failed");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${sanitizeFileName(nodes.qrFileName?.value)}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    setQrValidation("No se pudo descargar ahora. Intenta de nuevo.", true);
  }
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

function startTechCardsPulse() {
  if (!nodes.techCards || nodes.techCards.length === 0) {
    return;
  }

  if (techPulseIntervalId) {
    return;
  }

  const cards = Array.from(nodes.techCards);
  const triggerPulse = () => {
    cards.forEach((card) => card.classList.remove("pulse"));

    let randomIndex = Math.floor(Math.random() * cards.length);
    if (cards.length > 1 && randomIndex === lastPulsedCardIndex) {
      randomIndex = (randomIndex + 1) % cards.length;
    }

    lastPulsedCardIndex = randomIndex;
    const selectedCard = cards[randomIndex];
    if (!selectedCard) {
      return;
    }

    selectedCard.classList.add("pulse");
    setTimeout(() => {
      selectedCard.classList.remove("pulse");
    }, 3000);
  };

  triggerPulse();
  techPulseIntervalId = setInterval(triggerPulse, 3000);
}

function stopTechCardsPulse() {
  if (techPulseIntervalId) {
    clearInterval(techPulseIntervalId);
    techPulseIntervalId = null;
  }

  nodes.techCards?.forEach((card) => card.classList.remove("pulse"));
}

function bindDetailCards() {
  document.addEventListener("click", (event) => {
    const toggle = event.target.closest(".detail-toggle");
    if (!toggle) {
      return;
    }

    const card = toggle.closest(".service-detail-card");
    if (!card) {
      return;
    }

    const grid = card.closest(".thesis-grid, .tech-grid");
    const willOpen = !card.classList.contains("open");

    if (grid) {
      grid.querySelectorAll(".service-detail-card").forEach((item) => {
        item.classList.remove("open");
        const itemToggle = item.querySelector(".detail-toggle");
        if (itemToggle) {
          itemToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    if (willOpen) {
      card.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    }
  });
}

function syncTechPulseState() {
  const supportPanelActive = Boolean(
    nodes.supportPanel &&
    !nodes.supportPanel.hidden &&
    nodes.supportPanel.classList.contains("active")
  );

  if (supportPanelActive && supportPanelVisible && !document.hidden) {
    startTechCardsPulse();
    return;
  }

  stopTechCardsPulse();
}

function initSupportPanelVisibilityObserver() {
  if (!nodes.supportPanel) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    supportPanelVisible = true;
    syncTechPulseState();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      supportPanelVisible = entries.some(
        (entry) => entry.target === nodes.supportPanel && entry.isIntersecting && entry.intersectionRatio > 0.2
      );
      syncTechPulseState();
    },
    {
      threshold: [0, 0.2, 0.4],
      rootMargin: "0px 0px -12% 0px"
    }
  );

  observer.observe(nodes.supportPanel);
}

function initLazySlideImages() {
  if (!nodes.lazySlideImages || nodes.lazySlideImages.length === 0) {
    return;
  }

  nodes.lazySlideImages.forEach((image) => {
    if (!image.hasAttribute("loading")) {
      image.loading = "lazy";
    }
  });

  if (!("IntersectionObserver" in window)) {
    nodes.lazySlideImages.forEach((image) => image.classList.add("is-visible"));
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "120px 0px"
    }
  );

  nodes.lazySlideImages.forEach((image) => imageObserver.observe(image));
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

    updatePaperState();
    updateBindingState();
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

  nodes.paperOptions?.addEventListener("click", (event) => {
    const button = event.target.closest(".option-btn[data-paper]");
    if (!button || button.disabled) {
      return;
    }

    configState.paperType = button.dataset.paper;
    setActiveOption(nodes.paperOptions, configState.paperType, "paper");
    showConfigCheer("Perfecto, tipo de papel actualizado.");
    updateConfigSummary();
  });

  nodes.configQuantity?.addEventListener("input", () => {
    updateConfigSummary();
    const qty = parseQuantityOrNull(nodes.configQuantity.value);
    if (qty !== null && qty > BULK_THRESHOLD) {
      showConfigCheer("Activaste precio por mayor. Muy buena jugada.");
    }
  });

  nodes.includeBinding?.addEventListener("change", () => {
    configState.includeBinding = nodes.includeBinding.checked;
    updateConfigSummary();
  });

  nodes.bindingQuantity?.addEventListener("input", updateBindingServiceSummary);

  nodes.addConfigBtn?.addEventListener("click", addConfiguredItemToCart);
  nodes.addBindingBtn?.addEventListener("click", addBindingServiceToCart);
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

  syncTechPulseState();
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

  nodes.utilityToggle?.addEventListener("click", () => {
    setUtilityOpen(!isUtilityOpen);
  });

  nodes.utilityClose?.addEventListener("click", () => {
    setUtilityOpen(false);
  });

  nodes.utilityBackdrop?.addEventListener("click", () => {
    setUtilityOpen(false);
  });

  nodes.utilityWorkspaceClose?.addEventListener("click", () => {
    setUtilityWorkspaceOpen(false);
  });

  nodes.utilityWorkspaceBack?.addEventListener("click", () => {
    setUtilityWorkspaceOpen(false);
  });

  nodes.utilityItems?.forEach((item) => {
    item.addEventListener("click", () => {
      setActiveUtilityTool(item.dataset.tool);
      setUtilityWorkspaceOpen(true);
      if (utilityDrawerQuery.matches) {
        setUtilityOpen(false);
      }
      if (item.dataset.tool === "qr") {
        setQrValidation("Completa los datos y genera tu codigo.", false);
      }
    });
  });

  nodes.qrPayloadType?.addEventListener("change", () => {
    toggleQrFields();
  });

  nodes.qrSizeRange?.addEventListener("input", updateQrSizeOutput);

  nodes.qrWaNumber?.addEventListener("input", () => {
    nodes.qrWaNumber.value = sanitizeDigits(nodes.qrWaNumber.value);
  });

  nodes.qrGenerateBtn?.addEventListener("click", generateQrPreview);
  nodes.qrDownloadBtn?.addEventListener("click", () => {
    downloadQrPng();
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setUtilityOpen(false);
      setUtilityWorkspaceOpen(false);
    }
  });

  if (typeof utilityDrawerQuery.addEventListener === "function") {
    utilityDrawerQuery.addEventListener("change", () => {
      setUtilityOpen(false);
      setUtilityWorkspaceOpen(false);
    });
  } else {
    utilityDrawerQuery.addListener(() => {
      setUtilityOpen(false);
      setUtilityWorkspaceOpen(false);
    });
  }

  document.addEventListener("visibilitychange", syncTechPulseState);
}

function hydrateCartForNewModel() {
  cart = cart.map((item) => {
    const baseUnit = typeof item.baseUnitPrice === "number" ? item.baseUnitPrice : (typeof item.unitPrice === "number" ? item.unitPrice : 0);
    const size = typeof item.size === "string" ? item.size : configState.size;
    const paperType = typeof item.paperType === "string" ? item.paperType : "bond-75";
    const overrideFromPaper = size ? getPaperPriceOverride(size, paperType) : null;
    const fallbackOverride = typeof item.paperSurcharge === "number" && item.paperSurcharge > 0 ? baseUnit + item.paperSurcharge : null;
    return {
      ...item,
      baseUnitPrice: baseUnit,
      bulkUnitPrice: typeof item.bulkUnitPrice === "number" ? item.bulkUnitPrice : null,
      paperPriceOverride: typeof item.paperPriceOverride === "number"
        ? item.paperPriceOverride
        : (typeof overrideFromPaper === "number" ? overrideFromPaper : fallbackOverride),
      includeBinding: Boolean(item.includeBinding),
      quantity: sanitizeQuantity(item.quantity),
      unitPrice: baseUnit,
      subtotal: baseUnit * sanitizeQuantity(item.quantity)
    };
  });

  cart.forEach((item) => recomputeCartItem(item));
}

function init() {
  initSystemTheme();
  loadCart();
  hydrateCartForNewModel();
  loadNote();
  setUtilityOpen(false);
  setUtilityWorkspaceOpen(false);
  setActiveUtilityTool("qr");
  toggleQrFields();
  updateQrSizeOutput();
  setQrValidation("Completa los datos y genera tu codigo.", false);
  setActiveServiceTab("produccion");
  setMobileCartOpen(false);
  setStoreOpen(false, false);
  updatePaperState();
  updateBindingState();
  updateSidesStepState();
  updateConfigSummary();
  updateBindingServiceSummary();
  renderCart();
  bindConfiguratorEvents();
  bindEvents();
  bindDetailCards();
  initLazySlideImages();
  initSupportPanelVisibilityObserver();
  syncTechPulseState();
}

init();
