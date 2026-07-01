# 📋 Reporte de Fallas y Mejoras — Grafiplot Enterprise

Este reporte detalla las fallas críticas de seguridad, bugs de lógica, enlaces rotos e inconsistencias de código encontradas en el repositorio de **Grafiplot Enterprise**, junto con sus respectivas soluciones recomendadas.

---

## 🚨 Resumen de Gravedad

| ID | Componente / Área | Tipo de Falla | Severidad | Descripción Corta |
|---|---|---|---|---|
| **1** | Autenticación (`Login.jsx` / `Register.jsx`) | **Bug Crítico / Bloqueo** | 🔥 Alta | Los usuarios registrados con teléfono no pueden iniciar sesión (no hay campo de contraseña ni OTP viable). |
| **2** | Rutas y Navegación (`App.jsx` / `Sidebar.jsx` / `Home.jsx`) | **Enlace Roto** | 🔴 Media-Alta | El cotizador e historial redirigen a páginas inexistentes ("Próximamente"). |
| **3** | Seguridad de Base de Datos (`storage_policies_admin.sql`) | **Vulnerabilidad** | 🔥 Alta | Política pública permite a cualquier usuario anónimo eliminar todos los archivos del bucket. |
| **4** | Gestión de Archivos (`update_schema_v2.sql` / `StorageManager.jsx`) | **Bug de Permisos** | 🔴 Media | Falta política `DELETE` para admins en RLS, impidiendo borrar archivos desde el Panel Admin. |
| **5** | Motor de Precios (`pricing.js` / `cartStore.jsx`) | **Inconsistencia** | 🟡 Media-Baja | Cálculos de anillados no coinciden entre la cotización y el carrito de compras. |
| **6** | Seguridad de Datos / RLS (`Home.jsx` / `Historial.jsx`) | **Bad Practice / Leak** | 🟡 Media-Baja | Consultas SQL sin filtro de `user_id` en el cliente. |
| **7** | Redirecciones de WhatsApp (`WhatsAppWidget.jsx` / `NuevoPedido.jsx`) | **Bug de Integración** | 🟡 Media-Baja | Enlaces de WhatsApp sin código de país (`51`), lo que puede fallar en ciertos navegadores. |
| **8** | Robustez de Código (`supabaseClient.js` + Vistas) | **Crash potencial** | 🟡 Media-Baja | Falta de control de nulos en variables de entorno de Supabase. |
| **9** | Deuda Técnica (`catalog.js`) | **Código Muerto** | 🟢 Baja | Matriz de precios `PRICE_MATRIX` duplicada y sin uso. |
| **10** | Lógica Incompleta (`UsersList.jsx`) | **Funcionalidad Rota** | 🟢 Baja | El control de almacenamiento (`storage_used`) siempre muestra 0 porque no se actualiza. |
| **11** | Lógica Incompleta (`SmtpSettings.jsx`) | **Inseguridad / Fake Feature** | 🔴 Media | El sistema de envío de correos SMTP no está implementado y expone la contraseña en texto plano en el cliente. |

---

## 🔍 Detalle de Fallas y Mejoras Propuestas

### 1. Fallo Crítico en el Flujo de Autenticación (Bloqueo de Clientes)
* **Archivo de origen:** [Register.jsx](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/pages/auth/Register.jsx#L27-L38) y [Login.jsx](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/pages/auth/Login.jsx#L28-L62)
* **Descripción:** 
  Al registrarse, el sistema genera un correo ficticio basado en el teléfono del usuario (`${cleanPhone}@grafiplot.com`) y le asocia una contraseña elegida por el usuario. Sin embargo, la pantalla de inicio de sesión (`Login.jsx`) **únicamente** permite autenticación mediante OTP (One-Time Password) enviando un código al correo electrónico (`signInWithOtp`). 
* **Impacto:** 
  Un usuario registrado con su celular nunca podrá iniciar sesión, ya que:
  1. No tiene acceso al buzón del correo ficticio `@grafiplot.com` para leer el código OTP.
  2. La pantalla de Login no cuenta con un campo para ingresar la contraseña que estableció al registrarse.
* **Mejora:** 
  Implementar en `Login.jsx` un selector o pestaña de inicio de sesión dual:
  * **Por Teléfono / Contraseña:** Permitiendo ingresar el teléfono y contraseña, y usar `supabase.auth.signInWithPassword` transformando el teléfono ingresado a `${phone}@grafiplot.com` tras bambalinas.
  * **Por Correo (OTP):** Manteniendo el sistema actual sin contraseña para usuarios que prefieran Magic Link/OTP.

---

### 2. Enlaces Rotos y Redirecciones Incorrectas en la Navegación
* **Archivo de origen:** [Sidebar.jsx](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/components/layout/Sidebar.jsx#L9), [Home.jsx](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/pages/Home.jsx#L82) y [App.jsx](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/App.jsx#L70-L76)
* **Descripción:** 
  Tanto la barra lateral (`Sidebar.jsx`) como los accesos rápidos de la página de inicio (`Home.jsx`) redirigen al usuario a `/dashboard/nuevo-pedido` cuando intentan cotizar. Sin embargo, en el enrutador principal (`App.jsx`), la ruta definida para el componente de cotización (`NuevoPedido.jsx`) es `/cotizar`.
* **Impacto:** 
  Al hacer clic en "Nuevo Pedido" o "Impresión Rápida", la aplicación redirige a `/dashboard/nuevo-pedido`, el cual cae en la ruta comodín (`*`) de `/dashboard` y muestra el aviso de "Próximamente / Sección en desarrollo", bloqueando el acceso al cotizador principal. Adicionalmente, el enlace a "Catálogo" redirige a `/dashboard/catalogo`, el cual no está registrado en el router.
* **Mejora:** 
  1. Corregir las rutas en `Sidebar.jsx` e `Home.jsx` para que apunten a `/cotizar` (o reubicar la ruta dentro del enrutador de `/dashboard` si se prefiere).
  2. Implementar la vista del Catálogo o eliminar el botón de la barra lateral temporalmente si no está listo.

---

### 3. Vulnerabilidad Grave de Seguridad en Storage (Borrado Público)
* **Archivo de origen:** [storage_policies_admin.sql](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/storage_policies_admin.sql#L10-L13)
* **Descripción:** 
  El script SQL crea la política de eliminación en Supabase para el bucket `pedidos` asignada al rol `public`. 
  ```sql
  CREATE POLICY "Permitir eliminacion publica a pedidos" 
  ON storage.objects FOR DELETE TO public USING ( bucket_id = 'pedidos' );
  ```
* **Impacto:** 
  Cualquier persona en Internet (incluso un bot o un visitante no autenticado) puede enviar solicitudes HTTP `DELETE` directamente a la API de Supabase de la tienda y purgar por completo todos los archivos PDF cargados por los clientes legítimos.
* **Mejora:** 
  Modificar la política en Supabase para que solo los administradores autenticados puedan eliminar registros del bucket:
  ```sql
  CREATE POLICY "Solo administradores pueden eliminar archivos de pedidos" 
  ON storage.objects FOR DELETE 
  TO authenticated
  USING (
    bucket_id = 'pedidos' AND 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
  ```

---

### 4. Admin Panel no puede borrar archivos (RLS Incompleto)
* **Archivo de origen:** [update_schema_v2.sql](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/update_schema_v2.sql#L42-L73) y [StorageManager.jsx](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/pages/admin/components/StorageManager.jsx#L42-L60)
* **Descripción:** 
  El script de actualización de seguridad `update_schema_v2.sql` habilita RLS y define políticas de subida (`INSERT`) y visualización (`SELECT`) para clientes y administradores. Sin embargo, no declara ninguna política para la acción `DELETE` sobre el rol `authenticated`.
* **Impacto:** 
  Cuando el administrador entra al gestor de almacenamiento en el panel web (`StorageManager.jsx`) e intenta eliminar un archivo PDF llamando a `supabase.storage.from('pedidos').remove()`, la operation falla silenciosamente o con un error de permisos devuelto por Supabase, volviendo inútil el botón "Eliminar Permanente".
* **Mejora:** 
  Agregar al script de actualización la política de borrado seguro descrita en el punto anterior.

---

### 5. Inconsistencia de Precios en Acabados (Anillado Simple)
* **Archivo de origen:** [pricing.js](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/lib/pricing.js#L35-L52) vs [pricing.js (getAutoBindingTotal)](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/lib/pricing.js#L136-L148)
* **Descripción:** 
  Hay dos fórmulas de precios distintas y contradictorias para la encuadernación (anillado) en el mismo archivo:
  1. En el cotizador (`calculatePrice`), la lógica de `anillado_simple` utiliza la matriz `FINISH_PRICES.anillado_simple` basada en **Hojas físicas** (`cSheetsPerBook`):
     * Hasta 100 hojas: S/ 1.50
     * Hasta 300 hojas: S/ 2.50
     * Más de 300 hojas: S/ 5.00
  2. En el carrito de compras (`cartStore.jsx` mediante `getAutoBindingTotal`), la lógica utiliza rangos basados en **Páginas del PDF** (`item.quantity`):
     * Hasta 100 páginas: S/ 1.50
     * Hasta 200 páginas: S/ 2.00
     * Hasta 499 páginas: S/ 3.00
     * Más de 499 páginas: S/ 3.00 por cada factor.
* **Impacto:** 
  Un mismo trabajo de impresión cotizado a doble cara generará dos costos de anillado diferentes en la vista de cotización frente al desglose del carrito de compras, lo que confundirá al cliente y provocará reclamos.
* **Mejora:** 
  Unificar la función `getAutoBindingTotal(pages, isDuplex)` para que realice el cálculo de la misma forma que el motor principal, tomando en cuenta las hojas físicas reales (`isDuplex ? Math.ceil(pages/2) : pages`) y consumiendo los mismos valores de `FINISH_PRICES`.

---

### 6. Consultas de Clientes sin Filtro por ID de Usuario
* **Archivo de origen:** [Home.jsx](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/pages/Home.jsx#L25-L28) y [Historial.jsx](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/pages/Historial.jsx#L26-L29)
* **Descripción:** 
  En ambos componentes, el frontend realiza la consulta `supabase.from('pedidos').select('*')` sin aplicar un filtro explícito de `eq('user_id', user.id)`.
* **Impacto:** 
  Aunque las políticas RLS de Supabase a nivel de base de datos deberían evitar que los clientes obtengan datos ajenos, confiar exclusivamente en RLS es una mala práctica. Si por error se desactivan las RLS de la tabla `pedidos`, cualquier cliente cargará todos los pedidos de la base de datos de inmediato. Además, cuando un administrador navega en su cliente-panel de "Mis Trabajos", verá todos los pedidos del negocio mezclados en su sección personal de usuario en lugar de solo los suyos.
* **Mejora:** 
  Añadir el filtro `.eq('user_id', user.id)` en las llamadas `.select()` de ambos componentes frontend.

---

### 7. Enlaces a la API de WhatsApp sin Código de País
* **Archivo de origen:** [WhatsAppWidget.jsx](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/components/common/WhatsAppWidget.jsx#L16) y [NuevoPedido.jsx](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/pages/NuevoPedido.jsx#L194)
* **Descripción:** 
  Los enlaces de redirección a WhatsApp se configuran como `https://wa.me/952628844?...`. A diferencia de `ForgotPassword.jsx` que sí incluye el prefijo peruano `51` (`https://wa.me/51952628844`), en estas pantallas no se añade el código de país.
* **Impacto:** 
  La API de WhatsApp Web o de la app móvil puede fallar en redirigir y retornar un error de "número inválido" en ciertos dispositivos y sistemas operativos que requieren obligatoriamente la notación internacional completa.
* **Mejora:** 
  Cambiar el formato de la URL de WhatsApp a `https://wa.me/51952628844` en todas las referencias del proyecto.

---

### 8. Riesgo de Colapso (Crash) por Ausencia de Validación de Supabase
* **Archivo de origen:** [supabaseClient.js](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/lib/supabaseClient.js#L10-L16) y vistas del cliente.
* **Descripción:** 
  Si por algún motivo la aplicación se ejecuta localmente o se despliega sin las variables de entorno configuradas (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`), `supabase` se exporta como `null`. No obstante, componentes como `Home.jsx`, `Historial.jsx` y `NuevoPedido.jsx` llaman directamente a métodos de `supabase.auth` sin validaciones previas de existencia.
* **Impacto:** 
  La aplicación crasheará en cascada con errores del tipo `TypeError: Cannot read properties of null (reading 'auth')` en el renderizado inicial, impidiendo que cargue la interfaz.
* **Mejora:** 
  Implementar validaciones defensivas en las llamadas del frontend:
  ```js
  if (!supabase) {
    console.warn("Supabase no está inicializado.");
    return;
  }
  ```

---

### 9. Código Muerto en Catálogo (Matriz de Precios Duplicada)
* **Archivo de origen:** [catalog.js](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/data/catalog.js#L47-L86)
* **Descripción:** 
  El archivo contiene un objeto exportado llamado `PRICE_MATRIX` con tarifas por unidad y al por mayor para diferentes tamaños de papel. Este objeto no se importa ni se utiliza en ninguna parte de la aplicación.
* **Impacto:** 
  Dificulta el mantenimiento y genera confusión, ya que si un administrador modifica la matriz en `catalog.js` pensando que cambiará los precios del cotizador, no surtirá efecto porque el cotizador usa estrictamente `pricing.js`.
* **Mejora:** 
  Eliminar `PRICE_MATRIX` de `catalog.js` y asegurarse de que cualquier referencia explicativa de tarifas en la UI se alimente directamente de `pricing.js` para mantener una única fuente de verdad.

---

### 10. Indicador de Consumo de Almacenamiento "Fantasma"
* **Archivo de origen:** [UsersList.jsx](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/pages/admin/components/UsersList.jsx#L127-L135) y [supabase_schema.sql](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/supabase_schema.sql#L8)
* **Descripción:** 
  La tabla `profiles` cuenta con una columna `storage_used` e `UsersList.jsx` dibuja una barra de progreso que indica si el usuario está llegando al límite de `30 MB`. Sin embargo, no existe ninguna pieza de código (función del frontend, Edge Function o trigger de Postgres) que modifique este campo al subir o eliminar archivos.
* **Impacto:** 
  El consumo de almacenamiento de todos los usuarios siempre marcará `0 B / 30 MB` indefinidamente, impidiendo que el administrador controle el consumo de recursos de almacenamiento.
* **Mejora:** 
  Crear un trigger en PostgreSQL en la base de datos de Supabase que escuche eventos en `storage.objects` y sume/reste el tamaño de los archivos subidos al campo `storage_used` del perfil correspondiente:
  ```sql
  -- Ejemplo de lógica para el trigger en Supabase:
  CREATE OR REPLACE FUNCTION update_user_storage_on_upload() 
  RETURNS TRIGGER AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.profiles 
      SET storage_used = storage_used + NEW.metadata->>'size'::bigint
      WHERE id = NEW.owner;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.profiles 
      SET storage_used = GREATEST(0, storage_used - OLD.metadata->>'size'::bigint)
      WHERE id = OLD.owner;
    END IF;
    RETURN NULL;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```

---

### 11. Sistema SMTP Fantasma (Riesgo de Seguridad y Lógica Faltante)
* **Archivo de origen:** [SmtpSettings.jsx](file:///c:/Users/Grafiplot/Documents/webgrafiplot/grafiplot_enterprice/src/pages/admin/components/SmtpSettings.jsx)
* **Descripción:** 
  El Panel de Administración cuenta con una pantalla de configuración para un servidor SMTP (Guardando host, puerto, usuario y contraseña de aplicación). No obstante, el proyecto carece de backend y no hay ningún script o función Edge en Supabase que realice envíos de correos utilizando dicha configuración. Además, para recuperar la configuración guardada, el cliente React lee la contraseña directamente desde `system_settings` en texto plano.
* **Impacto:** 
  1. La función de envío de correos no existe; es una interfaz inoperativa.
  2. Guardar contraseñas de correos de Gmail/Outlook en texto plano en la tabla `system_settings` y exponerlas al cliente React que renderiza la pantalla de SMTP es una vulnerabilidad grave, permitiendo que cualquier administrador o atacante que consiga token del cliente robe la contraseña del correo institucional.
* **Mejora:** 
  1. Si se desea enviar correos, delegar la configuración SMTP a nivel de Supabase Auth (Dashboard de Supabase -> Provider Settings) en vez de manejar credenciales SMTP en base de datos.
  2. Encriptar las credenciales SMTP en base de datos si es obligatorio administrarlas dinámicamente, y procesar la llamada de envío de correos de forma exclusiva desde una Edge Function del lado del servidor sin revelar la contraseña al cliente.
  3. Si no se va a usar, retirar la pantalla de configuración SMTP para evitar riesgos de seguridad innecesarios.
