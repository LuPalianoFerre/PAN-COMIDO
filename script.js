// Cargar navbar y footer en todas las páginas
document.addEventListener("DOMContentLoaded", () => {
  fetch('nav_bar.html')
    .then(resp => {
      if (!resp.ok) throw new Error('No se pudo cargar nav_bar.html');
      return resp.text();
    })
    .then(html => {
      document.getElementById('navbar-container').innerHTML = html;
    })
    .catch(e => console.error('Error cargando navbar:', e));

  fetch('footer.html')
    .then(resp => resp.ok ? resp.text() : Promise.reject('Error al cargar footer.html'))
    .then(html => {
      const d = document.createElement('div');
      d.innerHTML = html;
      document.body.appendChild(d);
    })
    .catch(e => console.error('Error cargando footer:', e));
});

// Obtener parámetros URL
function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

// Mostrar categorías Plum Cakes con imágenes específicas
async function cargarCategoriasPlumCakes(contenedorId) {
  try {
    const res = await fetch('productos.json');
    const data = await res.json();

    const categorias = Object.keys(data.plum_cakes);
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) { console.warn(`No se encontró contenedor con id ${contenedorId}`); return; }

    const imagenesPorCategoria = {
      'ingles': 'img/budin_ingles.png',
      'frutales': 'img/budin_frutales.png',
      'clasicos': 'img/budin_clasico.png'
    };

    contenedor.innerHTML = '';

    categorias.forEach(cat => {
      const nombreCat = cat.charAt(0).toUpperCase() + cat.slice(1);
      const imgSrc = imagenesPorCategoria[cat] || 'img/plum_cakes_default.jpg';

      const col = document.createElement('div');
      col.className = 'col';

      col.innerHTML = `
  <div class="card h-100 shadow-sm dark-card clickable-image double-height" data-category-id="${cat}">
    <div class="img-container">
      <img src="${imgSrc}" alt="${nombreCat}" class="card-img-top"/>
      <div class="overlay"></div>
    </div>
    <div class="card-body text-center">
      <h5 class="card-title">${nombreCat}</h5>
    </div>
  </div>`;

      col.querySelector('.clickable-image').addEventListener('click', () => {
        window.location.href = `plum_cakes_category.html?cat=${cat}`;
      });

      contenedor.appendChild(col);
    });
  } catch (error) {
    console.error('Error cargando categorías plum cakes:', error);
  }
}

// Cargar productos para arrays planos (empanadas, cookies, etc)
async function cargarProductos(tipo, contenedorId) {
  try {
    const res = await fetch('productos.json');
    const data = await res.json();

    if (!data.hasOwnProperty(tipo) || !Array.isArray(data[tipo])) {
      document.getElementById(contenedorId).innerHTML = `<p>Categoría inválida o no encontrada: ${tipo}</p>`;
      console.warn(`La categoría "${tipo}" no existe o no es un array en el JSON.`);
      return;
    }

    const productos = data[tipo];
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return console.warn(`No se encontró contenedor con id ${contenedorId}`);

    contenedor.innerHTML = '';

    productos.forEach(p => {
      const imgSrc = p.imagen || 'img/default_product.png';
      const altText = p.alt || p.titulo || 'Producto';

      const col = document.createElement('div');
      col.className = 'col';

      col.innerHTML = `
        <div class="card h-100 shadow-sm dark-card clickable-image">
          <div class="img-container">
            <img src="${imgSrc}" alt="${altText}" class="card-img-top"/>
            <div class="overlay"></div>
          </div>
          <div class="card-body">
            <h5 class="card-title">${p.titulo || ''}</h5>
            <p class="card-text">${p.descripcion || ''}</p>
          </div>
        </div>`;

      contenedor.appendChild(col);
    });
  } catch (error) {
    console.error('Error cargando productos:', error);
    document.getElementById(contenedorId).innerHTML = '<p>Error cargando productos.</p>';
  }
}

// Cargar productos según categoría específica de Plum Cakes
async function cargarProductosPorCategoria(categoria, contenedorId) {
  try {
    const res = await fetch('productos.json');
    const data = await res.json();

    if (!data.plum_cakes.hasOwnProperty(categoria)) {
      document.getElementById(contenedorId).innerHTML = `<p>Categoría inválida: ${categoria}</p>`;
      return console.warn(`Categoría "${categoria}" no existe en plum_cakes JSON.`);
    }

    const productos = data.plum_cakes[categoria];
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return console.warn(`No se encontró contenedor con id ${contenedorId}`);

    contenedor.innerHTML = '';

    productos.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col';

      col.innerHTML = `
        <div class="card h-100 shadow-sm dark-card clickable-image" data-product-id="${p.id}">
          <div class="img-container">
            <img src="img/plum_cakes_default.jpg" alt="${p.titulo}" class="card-img-top"/>
            <div class="overlay"></div>
          </div>
          <div class="card-body">
            <h5 class="card-title">${p.titulo}</h5>
            ${p.precio ? `<p class="card-text">$${p.precio}</p>` : ''}
          </div>
        </div>`;

      col.querySelector('.clickable-image').addEventListener('click', () => {
        window.location.href = `plum_cakes_product.html?product=${p.id}`;
      });

      contenedor.appendChild(col);
    });
  } catch (error) {
    console.error('Error cargando productos por categoría:', error);
  }
}

// Cargar detalle producto y toppings
async function cargarDetalleProducto(productId, contenedorDetalleId, contenedorToppingsId) {
  try {
    const res = await fetch('productos.json');
    const data = await res.json();

    let producto = null;
    for (const cat in data.plum_cakes) {
      producto = data.plum_cakes[cat].find(p => p.id === productId);
      if (producto) break;
    }

    if (!producto) {
      document.getElementById(contenedorDetalleId).innerHTML = '<p>Producto no encontrado.</p>';
      return;
    }

    const detalleDiv = document.getElementById(contenedorDetalleId);
    detalleDiv.innerHTML = `
      <div class="card h-100 shadow-sm dark-card">
        <div class="img-container">
          <img src="img/plum_cakes_default.jpg" alt="${producto.titulo}" class="card-img-top"/>
          <div class="overlay"></div>
        </div>
        <div class="card-body">
          <h3 class="card-title">${producto.titulo}</h3>
          ${producto.precio ? `<p><strong>Precio:</strong> $${producto.precio}</p>` : ''}
        </div>
      </div>`;

    const toppingsContenedor = document.getElementById(contenedorToppingsId);
    toppingsContenedor.innerHTML = '';

    data.toppings.forEach(topping => {
      const col = document.createElement('div');
      col.className = 'col';

      col.innerHTML = `
        <div class="card h-100 shadow-sm dark-card">
          <div class="card-body">
            <h5 class="card-title">${topping.titulo}</h5>
            <p class="card-text">$${topping.precio}</p>
          </div>
        </div>`;

      toppingsContenedor.appendChild(col);
    });
  } catch (error) {
    console.error('Error cargando detalle producto y toppings:', error);
    document.getElementById(contenedorDetalleId).innerHTML = '<p>Error cargando el producto.</p>';
  }
}

// Modal imagen y navegación con teclado si existe
const imageModal = document.getElementById('imageModal');
if (imageModal) {
  imageModal.addEventListener('show.bs.modal', event => {
    const img = event.relatedTarget;
    const src = img.getAttribute('data-bs-image');
    const modalImg = imageModal.querySelector('#modalImage');
    modalImg.src = src;
    modalImg.alt = img.alt;
  });

  const modalImage = document.getElementById('modalImage');
  let currentIndex = 0;
  let navigationEnabled = false;

  document.querySelectorAll('.clickable-image').forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      modalImage.src = img.src;
      navigationEnabled = true;
    });
  });

  document.addEventListener('keydown', event => {
    if (!navigationEnabled) return;
    if (!imageModal.classList.contains('show')) return;

    if (event.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % document.querySelectorAll('.clickable-image').length;
      modalImage.src = document.querySelectorAll('.clickable-image')[currentIndex].src;
    } else if (event.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + document.querySelectorAll('.clickable-image').length) % document.querySelectorAll('.clickable-image').length;
      modalImage.src = document.querySelectorAll('.clickable-image')[currentIndex].src;
    }
  });

  imageModal.addEventListener('hidden.bs.modal', () => {
    navigationEnabled = false;
  });
}