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

