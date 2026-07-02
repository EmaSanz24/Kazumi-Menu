# Kazumi Menu

Aplicación web minimalista para mostrar y actualizar el menú PDF del restaurante Kazumi.

Dominio: https://menu.kazumi.emasanz.dev

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- JWT en cookie HttpOnly (sin base de datos)

## Requisitos

- Node.js 18.18 o superior

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Copiar variables de entorno:

```bash
cp .env.example .env.local
```

3. Editar `.env.local` con credenciales seguras:

```env
ADMIN_USER=admin
ADMIN_PASSWORD=password123
JWT_SECRET=una_clave_super_segura
```

4. Asegurarse de que exista el archivo `storage/menu.pdf` (se incluye uno de ejemplo al clonar).

## Desarrollo

```bash
npm run dev
```

- Menú público: http://localhost:3000
- Administración: http://localhost:3000/admin

## Producción

```bash
npm run build
npm start
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Visor del menú PDF a pantalla completa |
| `/admin` | Login y panel de administración |
| `GET /api/menu` | Sirve el PDF desde `storage/menu.pdf` |
| `POST /api/login` | Autenticación |
| `POST /api/logout` | Cierre de sesión |
| `POST /api/upload` | Reemplazo del menú (requiere sesión) |

## Almacenamiento

El PDF se guarda siempre en:

```
storage/menu.pdf
```

No se usa la carpeta `public`. El archivo se sirve mediante la API `/api/menu`.

## Despliegue

Compatible con cualquier hosting Node.js (VPS, Railway, Render, etc.).

Variables de entorno requeridas en producción:

- `ADMIN_USER`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `NODE_ENV=production`

Asegúrate de que la carpeta `storage/` sea persistente en el servidor para conservar el menú entre despliegues.
