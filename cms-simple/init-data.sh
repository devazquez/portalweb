#!/bin/sh
# Script para inicializar data.json con UTF-8 correcto

cat > /app/data.json << 'EOF'
{
  "articulos": [
    {
      "id": 1,
      "title": "Bienvenido al CMS",
      "description": "Tu primer artículo",
      "body": "Este es un ejemplo de artículo. Puedes editar, crear y eliminar artículos desde la API.",
      "createdAt": "2025-12-09T19:47:39.715Z",
      "updatedAt": "2025-12-09T19:47:39.716Z"
    },
    {
      "id": 2,
      "title": "Introducción a la Inteligencia Artificial",
      "description": "Una guía para entender los conceptos básicos de IA",
      "body": "La inteligencia artificial es un campo de la informática que se ocupa de crear máquinas inteligentes capaces de realizar tareas que típicamente requieren inteligencia humana. Estos incluyen el aprendizaje, el razonamiento y la autocorrección.",
      "createdAt": "2025-12-09T19:49:19.841Z",
      "updatedAt": "2025-12-09T19:49:19.841Z"
    },
    {
      "id": 3,
      "title": "Historia de la Máquina de las Emociones",
      "description": "Análisis profundo del clásico de Descartes",
      "body": "La máquina de las emociones es una obra conceptual que explora la posibilidad de reproducir artificialmente las emociones humanas. Este ensayo examina cómo los autómatas y máquinas podrían eventualmente capturar la complejidad emocional del ser humano.",
      "createdAt": "2025-12-09T19:49:24.687Z",
      "updatedAt": "2025-12-09T19:49:24.687Z"
    }
  ]
}
EOF

echo "data.json inicializado con UTF-8 correcto"
