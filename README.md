# 🏥 MediCore — Sistema de Gestión Clínica

> Aplicación web para la gestión integral del flujo de atención de una clínica o consultorio médico. Desarrollada con HTML, CSS y JavaScript puro, sin frameworks ni librerías externas. Los datos se almacenan localmente en el navegador mediante `localStorage`.

---

## 👥 Integrantes

| Nombre | Rol |
|---|---|
| **Milena** | Líder del proyecto · Código base · Módulo 3 (Sala de Espera) · Módulo 5 (Reportes) |
| **José Cenccho** | Módulo 1 — Registro de Pacientes |
| **Joel** | Módulo 2 — Programación de Citas |
| **Lidia** | Módulo 4 — Historial de Consultas |

---

## 📋 Descripción del Sistema

**MediCore** es una plataforma web de gestión clínica que permite administrar el ciclo completo de atención médica: desde el registro del paciente hasta el historial de su consulta. El sistema está diseñado con una estética médica profesional (fondos blancos, azules corporativos, tipografía limpia) e integra todos sus módulos a través de `localStorage`, garantizando que los datos persistan entre sesiones sin necesidad de un servidor.

### Características principales
- Registro y gestión completa de pacientes con validaciones en tiempo real
- Programación de citas con detección de conflictos de horario
- Sala de espera virtual con orden de prioridad automático
- Historial clínico por paciente con medicamentos y seguimiento
- Reportes con gráficos y exportación CSV
- Navegación integrada entre todos los módulos
- 100% funcional en el navegador, sin instalación requerida

---

## 📁 Estructura de Archivos del Proyecto

Cada módulo fue desarrollado en **tres archivos separados** (`.html`, `.css`, `.js`) para facilitar el trabajo colaborativo por integrante. Los archivos de código base son compartidos por todo el sistema y no fueron modificados por los integrantes.

```
medicore/
│
│── README.md
│
├── ── CÓDIGO BASE (Milena) ──────────────────────────────────
├── index.html                ← Página de inicio del sistema
├── shared.css                ← Estilos globales compartidos por todos los módulos
├── shared.js                 ← Utilidades JS: localStorage, validaciones, toast, reloj
│
├── ── MÓDULO 1 (José Cenccho) ──────────────────────────────
├── pacientes.html            ← Estructura HTML del módulo
├── pacientes.css             ← Estilos específicos del módulo
├── pacientes.js              ← Lógica, validaciones y CRUD de pacientes
│
├── ── MÓDULO 2 (Joel) ──────────────────────────────────────
├── citas.html                ← Estructura HTML del módulo
├── citas.css                 ← Estilos específicos del módulo
├── citas.js                  ← Lógica, validaciones y gestión de citas
│
├── ── MÓDULO 3 (Milena) ────────────────────────────────────
├── sala-espera.html          ← Estructura HTML del módulo
├── sala-espera.css           ← Estilos específicos del módulo
├── sala-espera.js            ← Lógica de turnos, prioridades y estados
│
├── ── MÓDULO 4 (Lidia) ─────────────────────────────────────
├── historial.html            ← Estructura HTML del módulo
├── historial.css             ← Estilos específicos del módulo
├── historial.js              ← Lógica del expediente clínico y medicamentos
│
└── ── MÓDULO 5 (Milena) ────────────────────────────────────
    ├── reportes.html         ← Estructura HTML del módulo
    ├── reportes.css          ← Estilos específicos del módulo
    └── reportes.js           ← Lógica de gráficos, filtros y exportación CSV
```

> **Convención adoptada:** cada integrante recibió el archivo HTML base de su módulo y lo separó en tres archivos independientes (`.html` / `.css` / `.js`), enlazándolos dentro del HTML con `<link rel="stylesheet" href="modulo.css">` y `<script src="modulo.js">`, además de mantener el enlace a `shared.css` y `shared.js` en todos los módulos.

---

## 🗂️ Módulos Desarrollados

### Módulo 01 — Registro de Pacientes
**Archivos:** `pacientes.html` · `pacientes.css` · `pacientes.js`
**Responsable:** José Cenccho

Gestión completa del alta de pacientes con los siguientes campos y validaciones:
- **Código de paciente** autogenerado (PAC001, PAC002…)
- **Nombres y apellidos** — obligatorio, mínimo 2 caracteres, no permite solo números
- **Tipo y número de documento** — DNI (exactamente 8 dígitos) o Pasaporte/CE (6–15 caracteres); no permite duplicados
- **Fecha de nacimiento** — no permite fechas futuras; calcula la edad automáticamente; si el paciente es menor de 18 años, habilita el campo de apoderado
- **Teléfono** — obligatorio, exactamente 9 dígitos numéricos
- **Correo electrónico** — opcional, valida formato con @ y dominio
- **Dirección** — opcional, máximo 150 caracteres
- **Alergias** — selección múltiple mediante pills interactivas: Penicilina, Ibuprofeno, Paracetamol, Mariscos, Lactosa, Polen, Otro (con campo de texto libre). "Ninguna" desactiva las demás opciones
- **Contacto de emergencia** — nombre (mínimo 3 caracteres), parentesco desde lista, teléfono (9 dígitos)
- Funciones disponibles: registrar, listar, buscar por nombre/apellido/documento, editar y eliminar

---

### Módulo 02 — Programación de Citas Médicas
**Archivos:** `citas.html` · `citas.css` · `citas.js`
**Responsable:** Joel

Registro y gestión de citas médicas con control de disponibilidad:
- **Código de cita** autogenerado (CITA001, CITA002…)
- **Paciente** — seleccionado desde la lista de registrados; muestra datos principales y alergias como alerta visual al seleccionar
- **Especialidad médica** — Medicina general, Pediatría, Cardiología, Dermatología, Traumatología, Ginecología, Odontología
- **Médico** — lista filtrada dinámicamente según la especialidad elegida
- **Fecha** — no permite fechas pasadas
- **Hora** — selección dentro del horario de atención 08:00–18:00 en intervalos de 30 minutos
- **Motivo de consulta** — obligatorio, entre 10 y 200 caracteres
- **Prioridad** — Normal / Preferencial / Urgente; si es Urgente, requiere justificación de mínimo 10 caracteres
- **Estados del ciclo de vida:** Programada → Confirmada → En espera → En atención → Atendida / Cancelada / No asistió
- **Detección de conflictos:** no permite registrar dos citas para el mismo médico o el mismo paciente en idéntica fecha y hora
- Filtros disponibles: por fecha, estado, especialidad y prioridad

---

### Módulo 03 — Sala de Espera Virtual
**Archivos:** `sala-espera.html` · `sala-espera.css` · `sala-espera.js`
**Responsable:** Milena

Gestión en tiempo real del orden de atención de los pacientes que llegaron a la clínica:
- Solo muestra citas en estado **En espera**, **En atención**, **Atendida** o **No asistió**; las canceladas no aparecen
- **Orden automático de atención:** Urgente → Preferencial → Normal; ante igual prioridad, se atiende primero al de menor hora de llegada y luego al de menor hora de cita programada
- Registra automáticamente la **hora de llegada** al ingresar el paciente a la sala
- Registra la **hora de inicio de atención** al marcar "Atender"
- Acciones por estado: **En espera** → pasar a atención o marcar no asistió; **En atención** → finalizar consulta
- Validaciones: no se puede atender a un paciente si el mismo médico ya tiene otro en atención; no se puede finalizar sin haber pasado por atención
- Panel lateral con ticker del turno actual en atención, resumen del día y lista de próximos en cola
- Filtros por médico y por especialidad
- Auto-actualización cada 30 segundos
- Al finalizar una atención, ofrece enlace directo para registrar el historial clínico

---

### Módulo 04 — Historial de Consultas
**Archivos:** `historial.html` · `historial.css` · `historial.js`
**Responsable:** Lidia

Expediente clínico generado a partir de citas atendidas:
- Solo permite registrar historial de citas con estado **Atendida**; no se puede duplicar el historial de una misma cita
- **Código de historial** autogenerado (HIST001, HIST002…)
- Médico tratante, especialidad y fecha de atención se heredan automáticamente de la cita
- **Síntomas reportados** — obligatorio, entre 10 y 300 caracteres
- **Diagnóstico** — obligatorio, entre 10 y 300 caracteres; rechaza respuestas demasiado vagas
- **Tratamiento / indicaciones** — obligatorio, entre 10 y 400 caracteres
- **Medicamentos recetados** — opcionales, se agregan dinámicamente: nombre (obligatorio si se agrega), dosis, frecuencia y duración
- **Observaciones adicionales** — opcionales, máximo 300 caracteres con contador en tiempo real que cambia de color al acercarse al límite (naranja en 240+, rojo en 280+)
- **Próxima cita recomendada** — opcional, debe ser una fecha futura
- Vista de expediente completo por paciente con todas las consultas anteriores y alergias visibles

---

### Módulo 05 — Reportes
**Archivos:** `reportes.html` · `reportes.css` · `reportes.js`
**Responsable:** Milena

Panel de estadísticas y análisis clínico del sistema:
- **KPIs en tiempo real:** total de pacientes, consultas atendidas, citas programadas, canceladas/no asistidas e historiales registrados
- **Gráficos de barras:** citas por especialidad, citas por prioridad, alergias más frecuentes en pacientes
- **Gráfico de dona SVG** nativo: distribución porcentual de citas por estado
- **Ranking de médicos** por número de atenciones completadas
- **Top de pacientes** con mayor número de consultas registradas
- **Filtros por período:** hoy / esta semana / este mes / todo el historial / rango de fechas personalizado
- **Tabla detalle** con todas las citas del período filtrado, búsqueda por texto y filtro por estado
- **Exportación a CSV** compatible con Excel, con nombre de archivo que incluye la fecha

---

## 🚀 Instrucciones para Ejecutar el Proyecto

### Requisitos
- Navegador web moderno (Google Chrome, Firefox, Edge o Safari)
- No requiere instalación, servidor, base de datos ni conexión a internet

### Pasos

**1. Clonar o descargar el repositorio:**
```bash
git clone <url-del-repositorio>
cd medicore
```

**2. Verificar que todos los archivos estén en la misma carpeta** (sin subcarpetas). La estructura debe verse exactamente como se muestra en la sección "Estructura de Archivos".

**3. Abrir `index.html` en el navegador:**
- Windows: doble clic sobre `index.html`
- Mac: clic derecho → Abrir con → Google Chrome (u otro navegador)
- O arrastrar el archivo directamente a la ventana del navegador

**4. Usar el menú superior** para navegar entre los módulos del sistema.

### Flujo de uso recomendado
```
PASO 1 → Módulo 01: Registrar al menos un paciente
PASO 2 → Módulo 02: Crear una cita para ese paciente y confirmarla
PASO 3 → Módulo 02: Enviar la cita confirmada a sala de espera
PASO 4 → Módulo 03: Llamar al paciente y marcarlo "En atención"
PASO 5 → Módulo 03: Finalizar la consulta (estado: "Atendida")
PASO 6 → Módulo 04: Registrar el historial clínico de esa consulta
PASO 7 → Módulo 05: Revisar estadísticas y exportar el reporte en CSV
```

### Limpiar todos los datos del sistema
Abrir la consola del navegador con `F12` → pestaña **Consola**, y ejecutar:
```javascript
Object.keys(localStorage)
  .filter(k => k.startsWith('medicore_'))
  .forEach(k => localStorage.removeItem(k));
location.reload();
```

---

## 🗃️ División de Responsabilidades

### 👩‍💻 Milena — Líder del Proyecto
| Archivos | Descripción |
|---|---|
| `index.html` | Página de inicio con hero, acceso rápido y tarjetas de módulos |
| `shared.css` | Variables CSS, reset, header, nav, botones, tablas, modales, toasts, badges |
| `shared.js` | Funciones de localStorage, validaciones, toasts, reloj, helpers de fecha y paciente |
| `sala-espera.html / .css / .js` | Módulo 3 completo: turnos, prioridades, estados, panel lateral, filtros |
| `reportes.html / .css / .js` | Módulo 5 completo: KPIs, gráficos SVG, rankings, filtros, exportación CSV |

### 👨‍💻 José Cenccho
| Archivos | Descripción |
|---|---|
| `pacientes.html / .css / .js` | Módulo 1 completo: formulario con todas las validaciones, alergias múltiples, apoderado para menores, contacto de emergencia, CRUD completo |

### 👨‍💻 Joel
| Archivos | Descripción |
|---|---|
| `citas.html / .css / .js` | Módulo 2 completo: programación de citas, médicos por especialidad, conflictos de horario, ciclo de estados, cancelaciones |

### 👩‍💻 Lidia
| Archivos | Descripción |
|---|---|
| `historial.html / .css / .js` | Módulo 4 completo: expediente clínico, medicamentos dinámicos, validaciones, contador de observaciones, vista por paciente |

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Descripción |
|---|---|
| HTML5 | Estructura semántica de todas las páginas |
| CSS3 | Estilos propios, animaciones, diseño responsive (sin frameworks) |
| JavaScript ES6+ | Lógica de negocio, validaciones, manipulación del DOM, localStorage |
| localStorage API | Persistencia de datos en el navegador del cliente |
| SVG nativo | Gráfico de dona en el módulo de reportes |
| Google Fonts | Tipografía: Plus Jakarta Sans |
| Git | Control de versiones y trabajo colaborativo por ramas |

---

## 📦 Estructura de Datos en localStorage

| Clave | Tipo | Contenido |
|---|---|---|
| `medicore_pacientes` | Array de objetos | Código, nombres, apellidos, documento, nacimiento, edad, teléfono, email, dirección, alergias, apoderado, contacto de emergencia |
| `medicore_citas` | Array de objetos | Código, paciente, especialidad, médico, fecha, hora, prioridad, motivo, justificación, estado, hora de llegada, hora de atención |
| `medicore_historial` | Array de objetos | Código, código de cita, paciente, médico, especialidad, fecha, síntomas, diagnóstico, tratamiento, medicamentos, observaciones, próxima cita |

---

*Proyecto desarrollado para el curso de Sistemas de Información — Parcial Grupo 1*