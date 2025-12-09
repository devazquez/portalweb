#!/bin/sh

# Script para inyectar variables de entorno en archivos HTML/JS
# Reemplaza placeholders en los archivos construidos

cd /app/dist

# Buscar archivos JS y reemplazar las URLs de API
find . -name "*.js" -type f | while read file; do
  if grep -q "import.meta.env" "$file"; then
    # Reemplazar placeholders si existen
    sed -i "s|__VITE_OMEKA_API_URL__|${VITE_OMEKA_API_URL:-http://localhost:8081/api}|g" "$file"
    sed -i "s|__VITE_CMS_API_URL__|${VITE_CMS_API_URL:-http://localhost:1337/api}|g" "$file"
  fi
done

# Iniciar el servidor
exec serve -s dist -l 3000
