// AÑADIR EL NAV A TODOS LOS HTML
document.addEventListener("DOMContentLoaded", () => {
  fetch('nav_bar.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar nav_bar.html');
      }
      return response.text();
    })
    .then(html => {
      document.getElementById('navbar-container').innerHTML = html;
    })
    .catch(error => {
      console.error('Error cargando barra de navegación:', error);
    });
});

//añadir footer
document.addEventListener("DOMContentLoaded", () => {
  // Cargar navbar
  fetch('footer.html')
    .then(response => response.ok ? response.text() : Promise.reject('Error al cargar footer.html'))
    .then(html => {
      const footerDiv = document.createElement('div');
      footerDiv.innerHTML = html;
      document.body.appendChild(footerDiv);
    })
    .catch(error => {
      console.error('Error cargando footer:', error);
    });
});


// Cambia la imagen del modal al abrir en menu.html
var imageModal = document.getElementById('imageModal')
imageModal.addEventListener('show.bs.modal', function (event) {
  var img = event.relatedTarget; // Imagen que disparó el modal
  var src = img.getAttribute('data-bs-image');
  var modalImg = imageModal.querySelector('#modalImage');
  modalImg.src = src;
  modalImg.alt = img.alt;
});

//agregar las cards dinamicas segun los datos del json
async function cargarProductos(tipo, contenedorId) {
  try {
    const response = await fetch('productos.json');
    const data = await response.json();
    const productos = data[tipo];
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    contenedor.innerHTML = ''; // limpiar

    productos.forEach(producto => {
      const col = document.createElement('div');
      col.className = 'col';

      col.innerHTML = `
        <div class="card h-100 shadow-sm dark-card">
          <div class="img-container">
            <img src="${producto.imagen}" class="card-img-top" alt="${producto.alt}" />
            <div class="overlay"></div>
          </div>
          <div class="card-body">
            <h5 class="card-title">${producto.titulo}</h5>
            <p class="card-text">${producto.descripcion}</p>
          </div>
        </div>`;

      contenedor.appendChild(col);
    });
  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}

//script boludito pa que al clickear el menu, y se abra modal, se pueda correr de imagen con el teclado
// Lista de imágenes
document.addEventListener('DOMContentLoaded', () => {
  const images = ['img/14.jpg', 'img/13.jpg', 'img/12.jpg'];
  let currentIndex = 0;
  let navigationEnabled = false;

  const modalImage = document.getElementById('modalImage');
  const imageModal = document.getElementById('imageModal');

  // Abrir modal y activar navegación
  document.querySelectorAll('.clickable-image').forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      modalImage.src = images[currentIndex];
      navigationEnabled = true;
    });
  });

  // Actualizar imagen en modal
  function updateModalImage() {
    modalImage.src = images[currentIndex];
  }

  // Navegación con teclado solo si modal está abierto y navegación activada
  document.addEventListener('keydown', (event) => {
    if (!navigationEnabled) return;
    // Solo si el modal está visible
    if (!imageModal.classList.contains('show')) return;

    if (event.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      updateModalImage();
    } else if (event.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateModalImage();
    }
  });

  // Al cerrar el modal, desactivar navegación
  imageModal.addEventListener('hidden.bs.modal', () => {
    navigationEnabled = false;
  });
});
