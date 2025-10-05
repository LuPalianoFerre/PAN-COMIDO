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

