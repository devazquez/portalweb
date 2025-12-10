const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json({ charset: 'utf-8' }));
app.use(express.text({ charset: 'utf-8' }));
app.use(express.static(path.join(__dirname, 'public')));

// Header de charset UTF-8 para todas las respuestas
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Helper: leer datos
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { articulos: [] };
  }
}

// Helper: escribir datos
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ENDPOINTS DE API

// GET /api/articulos - Listar todos los artículos
app.get('/api/articulos', async (req, res) => {
  try {
    const data = await readData();
    res.json({
      data: data.articulos || [],
      meta: {
        count: data.articulos ? data.articulos.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al leer artículos' });
  }
});

// GET /api/articulos/:id - Obtener artículo por ID
app.get('/api/articulos/:id', async (req, res) => {
  try {
    const data = await readData();
    const articulo = data.articulos?.find(a => a.id === parseInt(req.params.id));
    
    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    res.json({ data: articulo });
  } catch (error) {
    res.status(500).json({ error: 'Error al leer artículo' });
  }
});

// GET /api/articulos?search=query - Buscar artículos
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    const data = await readData();
    
    if (!query) {
      return res.json({ data: data.articulos || [] });
    }
    
    const searchTerm = query.toLowerCase();
    const results = data.articulos?.filter(a => 
      // Buscar en campos españoles
      a.titulo?.toLowerCase().includes(searchTerm) ||
      a.descripcion?.toLowerCase().includes(searchTerm) ||
      a.cuerpo?.toLowerCase().includes(searchTerm) ||
      // Y también en campos ingleses por compatibilidad
      a.title?.toLowerCase().includes(searchTerm) ||
      a.body?.toLowerCase().includes(searchTerm) ||
      a.description?.toLowerCase().includes(searchTerm)
    ) || [];
    
    res.json({
      data: results,
      meta: { count: results.length }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en búsqueda' });
  }
});

// POST /api/articulos - Crear artículo
app.post('/api/articulos', async (req, res) => {
  try {
    // Aceptar ambos formatos (inglés y español)
    const titulo = req.body.titulo || req.body.title;
    const descripcion = req.body.descripcion || req.body.description;
    const cuerpo = req.body.cuerpo || req.body.body;
    const autor = req.body.autor || req.body.author || 'Administrador';
    const fecha = req.body.fecha || new Date().toISOString();
    
    const data = await readData();
    
    if (!titulo) {
      return res.status(400).json({ error: 'Título requerido' });
    }
    
    const id = Math.max(0, ...data.articulos?.map(a => a.id) || [0]) + 1;
    const articulo = {
      id,
      titulo: titulo || '',
      descripcion: descripcion || '',
      cuerpo: cuerpo || '',
      autor: autor || 'Administrador',
      fecha: fecha,
      // También mantener en inglés para compatibilidad
      title: titulo,
      description: descripcion,
      body: cuerpo
    };
    
    if (!data.articulos) data.articulos = [];
    data.articulos.push(articulo);
    await writeData(data);
    
    console.log('✅ Artículo creado:', articulo.id);
    res.status(201).json({ data: articulo });
  } catch (error) {
    console.error('❌ Error al crear artículo:', error);
    res.status(500).json({ error: 'Error al crear artículo', details: error.message });
  }
});

// PUT /api/articulos/:id - Actualizar artículo
app.put('/api/articulos/:id', async (req, res) => {
  try {
    // Aceptar ambos formatos (inglés y español)
    const titulo = req.body.titulo || req.body.title;
    const descripcion = req.body.descripcion || req.body.description;
    const cuerpo = req.body.cuerpo || req.body.body;
    const autor = req.body.autor || req.body.author;
    const fecha = req.body.fecha;
    
    const data = await readData();
    const index = data.articulos?.findIndex(a => a.id === parseInt(req.params.id));
    
    if (index === undefined || index === -1) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    // Actualizar con valores nuevos o mantener los existentes
    data.articulos[index] = {
      ...data.articulos[index],
      titulo: titulo || data.articulos[index].titulo,
      descripcion: descripcion !== undefined ? descripcion : data.articulos[index].descripcion,
      cuerpo: cuerpo !== undefined ? cuerpo : data.articulos[index].cuerpo,
      autor: autor || data.articulos[index].autor,
      fecha: fecha || data.articulos[index].fecha,
      // También mantener en inglés para compatibilidad
      title: titulo || data.articulos[index].title,
      description: descripcion || data.articulos[index].description,
      body: cuerpo || data.articulos[index].body,
      updatedAt: new Date().toISOString()
    };
    
    await writeData(data);
    console.log('✅ Artículo actualizado:', data.articulos[index].id);
    res.json({ data: data.articulos[index] });
  } catch (error) {
    console.error('❌ Error al actualizar artículo:', error);
    res.status(500).json({ error: 'Error al actualizar artículo', details: error.message });
  }
});

// DELETE /api/articulos/:id - Eliminar artículo
app.delete('/api/articulos/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.articulos?.findIndex(a => a.id === parseInt(req.params.id));
    
    if (index === undefined || index === -1) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    const deleted = data.articulos.splice(index, 1);
    await writeData(data);
    
    console.log('✅ Artículo eliminado:', deleted[0].id);
    res.json({ data: deleted[0] });
  } catch (error) {
    console.error('❌ Error al eliminar artículo:', error);
    res.status(500).json({ error: 'Error al eliminar artículo', details: error.message });
  }
});

// Inicializar archivo de datos si no existe
async function initializeData() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const initialData = {
      articulos: [
        {
          id: 1,
          title: 'Bienvenido al CMS',
          description: 'Tu primer artículo',
          body: 'Este es un ejemplo de artículo. Puedes editar, crear y eliminar artículos desde la API.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
    await writeData(initialData);
  }
}

// Ruta para servir el panel administrativo
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`CMS API ejecutándose en http://localhost:${PORT}`);
    console.log(`Endpoints:`);
    console.log(`  GET  /api/articulos`);
    console.log(`  GET  /api/articulos/:id`);
    console.log(`  GET  /api/search?query=...`);
    console.log(`  POST /api/articulos`);
    console.log(`  PUT  /api/articulos/:id`);
    console.log(`  DELETE /api/articulos/:id`);
  });
});
