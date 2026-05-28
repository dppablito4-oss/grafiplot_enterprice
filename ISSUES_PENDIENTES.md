# 📋 Issues Pendientes — Grafiplot Enterprise

> **Instrucciones:** Crear estos issues en GitHub → Issues → New Issue  
> **Repo:** https://github.com/dppablito4-oss/grafiplot_enterprice/issues

---

## Issue 1: 🧪 Agregar tests unitarios al motor de precios

**Labels:** `enhancement`, `testing`  
**Priority:** Alta

### Descripción
El motor de precios (`src/lib/pricing.js`) es el componente más crítico del negocio y no tiene ningún test automatizado. Cualquier cambio de precio podría romper cálculos sin que nadie se dé cuenta.

### Tareas
- [ ] Instalar Vitest: `npm install -D vitest`
- [ ] Crear `src/lib/__tests__/pricing.test.js`
- [ ] Tests para: precio unitario, mayoreo, duplex, acabados, regla especial A4 color
- [ ] Agregar `npm test` al CI/CD pipeline
- [ ] Agregar badge de tests al README

---

## Issue 2: 🌐 Migrar de HashRouter a BrowserRouter (SEO)

**Labels:** `enhancement`, `seo`  
**Priority:** Media

### Descripción
Actualmente las URLs son `grafiplotvasquez.lat/#/login` en vez de `grafiplotvasquez.lat/login`. Esto perjudica el SEO y se ve poco profesional.

### Tareas
- [ ] Cambiar `HashRouter` por `BrowserRouter` en `App.jsx`
- [ ] Crear `public/404.html` con redirect script para GitHub Pages SPA
- [ ] Verificar que refrescar en cualquier ruta funcione
- [ ] Agregar `robots.txt` y `sitemap.xml`

---

## Issue 3: 🔒 Verificar RLS en tabla `pedidos`

**Labels:** `security`, `bug`  
**Priority:** Alta

### Descripción
El componente `Home.jsx` hace `supabase.from('pedidos').select('*')` sin filtro de `user_id`. Si no hay RLS configurado en la tabla `pedidos`, un usuario podría ver los pedidos de todos.

### Tareas
- [ ] Verificar políticas RLS existentes en Supabase Dashboard
- [ ] Crear política: usuarios solo ven sus propios pedidos
- [ ] Crear política: admin puede ver todos los pedidos
- [ ] Mover scripts SQL sueltos a `supabase/migrations/`

---

## Issue 4: 📘 Migración parcial a TypeScript

**Labels:** `enhancement`, `tech-debt`  
**Priority:** Baja

### Descripción
El proyecto tiene 80+ archivos en JavaScript plano. Una migración gradual a TypeScript empezando por los archivos de datos y lógica mejoraría la mantenibilidad.

### Tareas
- [ ] Instalar TypeScript y tipos de React
- [ ] Crear `tsconfig.json` con `allowJs: true`
- [ ] Migrar `src/lib/pricing.js` → `.ts`
- [ ] Crear interfaces para `PrintConfig`, `Profile`, `Pedido`
- [ ] Migrar `src/data/catalog.js` y `servicesData.js`

---

## Issue 5: 📱 PWA + Notificaciones

**Labels:** `feature`, `mobile`  
**Priority:** Baja

### Descripción
Convertir la app en PWA para que los clientes puedan "instalar" la tienda en su celular y recibir notificaciones cuando cambie el estado de sus pedidos.

### Tareas
- [ ] Instalar `vite-plugin-pwa`
- [ ] Configurar manifest con colores de marca
- [ ] Service Worker para cache de landing
- [ ] Push notifications para cambios de estado

---

## Issue 6: 📊 Dashboard de Analytics para Admin

**Labels:** `feature`, `admin`  
**Priority:** Baja

### Descripción
El panel de admin necesita métricas visuales: pedidos por día, servicios más solicitados, ingresos estimados.

### Tareas
- [ ] Crear componente `AnalyticsPanel.jsx`
- [ ] Gráficos con datos de tabla `pedidos`
- [ ] Filtros por rango de fecha
- [ ] Cards de KPIs principales
