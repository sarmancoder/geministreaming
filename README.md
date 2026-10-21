# Gemini Streaming Experiment

Aplicación web experimental que conecta Gemini con una base de datos MySQL/MariaDB de muestra. Permite hacer preguntas en lenguaje natural sobre pagos y películas; la IA consulta los datos de Sakila y devuelve respuestas en formato Markdown, transmitidas progresivamente en la interfaz.

## Demo
[ver demostración](demo.mp4)

## Puesta en marcha

### Requisitos

- Node.js 20.9 o superior y npm.
- MySQL o MariaDB en ejecución. Para estos pasos puedes usar XAMPP, que incluye phpMyAdmin.
- Una clave de API de Gemini.

### 1. Preparar la base de datos

1. Inicia MySQL/MariaDB y Apache desde XAMPP (o inicia los servicios equivalentes).
2. Abre [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Crea una base de datos llamada `sakila` (por ejemplo, con cotejamiento `utf8mb4_general_ci`).
4. Selecciona `sakila` en el panel lateral y abre la pestaña **Importar**.
5. Elige el archivo `sakila.sql` de este proyecto y pulsa **Importar** o **Continuar**.

El archivo `sakila.sql` contiene el esquema y registros de demostración de Sakila; no crea la base de datos por sí mismo, por eso hay que crearla y seleccionarla antes de importarlo. Esos registros son datos de muestra, no datos reales.

### 2. Configurar las variables de entorno

Crea el archivo local `.env` a partir de la plantilla:

```powershell
Copy-Item .env.example .env
```

Edita `.env` y comprueba estos valores para que coincidan con tu instalación:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sakila
DB_USER=root
DB_PASSWORD=
GEMINI_API_KEY=tu_clave_de_api_de_gemini
```

Si tu servidor usa otro usuario, contraseña, host o puerto, cámbialos aquí. Sustituye `GEMINI_API_KEY` por una clave válida propia. Los valores de `.env.example` son solo una plantilla de demostración: no son credenciales ni una base de datos real. No publiques tu `.env` ni tu clave de API.

### 3. Instalar y ejecutar

Desde la carpeta del proyecto:

```powershell
npm ci
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Para detener el servidor, pulsa `Ctrl+C` en la terminal.

## Solución de problemas

- **No se puede conectar a la base de datos:** comprueba que MySQL/MariaDB esté iniciado y que `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD` en `.env` sean correctos.
- **Faltan tablas o datos:** confirma que creaste y seleccionaste `sakila` antes de importar `sakila.sql` desde phpMyAdmin.
- **Error de Gemini:** comprueba que `GEMINI_API_KEY` contiene una clave válida y que la terminal del servidor se ha reiniciado después de editar `.env`.
