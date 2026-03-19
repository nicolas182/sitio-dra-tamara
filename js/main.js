/* ================================================================
   SITIO WEB — DRA. TAMARA VEGA ORTEGA
   Archivo: js/main.js
   Descripción: Interacciones del sitio.

   ÍNDICE:
   1. Selector de tema
   2. Header con fondo al hacer scroll
   3. Menú hamburguesa (móvil)
   4. Animaciones al hacer scroll (fade in)
   5. Manejo del formulario de contacto
================================================================ */


/* ================================================================
   1. SELECTOR DE TEMA
   Cambia el atributo data-theme en <body> al hacer clic en
   cada botón del panel. El CSS lee ese atributo y aplica los
   colores correspondientes.
================================================================ */

// Espera a que el HTML esté completamente cargado antes de ejecutar
document.addEventListener('DOMContentLoaded', function () {

  // Obtiene todos los botones del selector de tema
  const botonesTheme = document.querySelectorAll('.theme-btn');

  // Carga el tema guardado previamente (si el usuario ya eligió uno)
  // localStorage guarda datos en el navegador entre sesiones
  const temaGuardado = localStorage.getItem('tema-elegido') || 'rosa';
  aplicarTema(temaGuardado);

  // Agrega un evento de clic a cada botón
  botonesTheme.forEach(function (boton) {
    boton.addEventListener('click', function () {
      // Lee el atributo data-theme del botón clickeado
      const tema = boton.getAttribute('data-theme');
      aplicarTema(tema);
      // Guarda la elección en el navegador para que persista
      localStorage.setItem('tema-elegido', tema);
    });
  });

  /**
   * Aplica el tema al <body> y actualiza el botón activo.
   * @param {string} tema - Nombre del tema: 'azul', 'verde' o 'rosa'
   */
  function aplicarTema(tema) {
    // Cambia el atributo en <body> — el CSS reacciona a esto
    document.body.setAttribute('data-theme', tema);

    // Actualiza qué botón aparece como "activo"
    botonesTheme.forEach(function (btn) {
      // Si el data-theme del botón coincide con el tema elegido, activo
      btn.classList.toggle('active', btn.getAttribute('data-theme') === tema);
    });
  }


  /* ==============================================================
     2. HEADER CON FONDO AL HACER SCROLL
     Cuando el usuario baja más de 50px, agrega la clase "scrolled"
     al header, que en el CSS cambia el fondo a blanco.
  ============================================================== */

  const header = document.getElementById('header');

  // Se ejecuta cada vez que el usuario hace scroll
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  /* ==============================================================
     3. MENÚ HAMBURGUESA (MÓVIL)
     Muestra/oculta el menú en pantallas pequeñas.
     El botón alterna la clase "abierto" en el menú.
  ============================================================== */

  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  // Clic en el botón hamburguesa
  navToggle.addEventListener('click', function () {
    navMenu.classList.toggle('abierto');
    // Cambia el ícono entre ☰ (bars) y ✕ (times)
    const icono = navToggle.querySelector('i');
    icono.classList.toggle('fa-bars');
    icono.classList.toggle('fa-times');
  });

  // Cierra el menú al hacer clic en un link (en móvil)
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('abierto');
      // Restaura el ícono a hamburguesa
      const icono = navToggle.querySelector('i');
      icono.classList.add('fa-bars');
      icono.classList.remove('fa-times');
    });
  });


  /* ==============================================================
     4. ANIMACIONES AL HACER SCROLL (FADE IN)
     Detecta cuándo un elemento entra en la pantalla del usuario
     y le agrega la clase "visible" para animarlo.

     Los elementos que quieras animar deben tener la clase
     "fade-in-up" en el HTML.
  ============================================================== */

  // Agrega la clase fade-in-up a los elementos que queremos animar
  const elementosAnimados = document.querySelectorAll(
    '.area-card, .timeline-tarjeta, .formacion-item, .formacion-titulo-card'
  );

  elementosAnimados.forEach(function (el) {
    el.classList.add('fade-in-up');
  });

  // IntersectionObserver: detecta cuándo un elemento es visible
  // Es más eficiente que escuchar el evento scroll constantemente
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        // Si el elemento está visible en pantalla
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Deja de observar el elemento una vez animado
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15, // Se activa cuando el 15% del elemento es visible
    }
  );

  // Registra cada elemento para ser observado
  elementosAnimados.forEach(function (el) {
    observer.observe(el);
  });


  /* ==============================================================
     5. MANEJO DEL FORMULARIO DE CONTACTO
     Intercepta el envío del formulario para mostrar un mensaje
     de éxito después de enviar, sin recargar la página.

     IMPORTANTE: Formspree maneja el envío real del email.
     Recuerda reemplazar "TU_ID_DE_FORMSPREE" en el HTML con
     tu ID real de formspree.io.
  ============================================================== */

  const formulario    = document.getElementById('formulario-contacto');
  const mensajeExito  = document.getElementById('formulario-exito');

  if (formulario) {
    formulario.addEventListener('submit', async function (evento) {
      // Previene el comportamiento por defecto (recargar la página)
      evento.preventDefault();

      // Obtiene el botón de enviar para deshabilitarlo mientras envía
      const botonEnviar = formulario.querySelector('button[type="submit"]');
      const textoOriginal = botonEnviar.innerHTML;

      // Muestra estado de cargando
      botonEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      botonEnviar.disabled = true;

      try {
        // Envía los datos del formulario a Formspree
        const respuesta = await fetch(formulario.action, {
          method: 'POST',
          body: new FormData(formulario),
          headers: { 'Accept': 'application/json' },
        });

        if (respuesta.ok) {
          // Éxito: muestra el mensaje y oculta el formulario
          formulario.style.display = 'none';
          mensajeExito.classList.remove('oculto');
        } else {
          // Error del servidor
          alert('Hubo un problema al enviar. Por favor intenta de nuevo.');
          botonEnviar.innerHTML = textoOriginal;
          botonEnviar.disabled = false;
        }

      } catch (error) {
        // Error de red (sin conexión, etc.)
        alert('Error de conexión. Verifica tu internet e intenta de nuevo.');
        botonEnviar.innerHTML = textoOriginal;
        botonEnviar.disabled = false;
      }
    });
  }

}); // Fin de DOMContentLoaded
