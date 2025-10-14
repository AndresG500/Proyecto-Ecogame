document.addEventListener("DOMContentLoaded", function() {
    const toggleBtn = document.querySelector(".toggle-btn");
    const sidebar = document.querySelector(".sidebar");

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", function() {
          
            const isCollapsed = sidebar.classList.toggle("collapsed");
            toggleBtn.setAttribute("aria-expanded", !isCollapsed);
        });
    }
});

// ===== FUNCIONALIDAD DE LOS MODALES =====
document.addEventListener("DOMContentLoaded", () => {
  const openModalButtons = document.querySelectorAll(".open-modal")

  // Seleccionamos los botones de cierre de los modales
  const modalCloseButtons = document.querySelectorAll(".modal-close")

  // Función para abrir el modal
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.add("is-open") // Añade la clase 'is-open' para mostrar el modal
      modal.setAttribute("aria-hidden", "false") // Actualiza el estado de accesibilidad
      document.body.style.overflow = "hidden" // Evita que se haga scroll mientras el modal está abierto
    }
  }

  // Función para cerrar el modal
  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.remove("is-open") // Elimina la clase 'is-open' para ocultar el modal
      modal.setAttribute("aria-hidden", "true") // Actualiza el estado de accesibilidad
      document.body.style.overflow = "" // Permite el scroll nuevamente
    }
  }

  // Esto ahora incluye los items del sidebar, bottom-bar y sidebar-footer
  openModalButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault() // Previene el comportamiento por defecto de los enlaces
      const modalId = button.getAttribute("data-modal") // Obtiene el ID del modal
      if (modalId) {
        openModal(modalId) // Llama a la función para abrir el modal
      }
    })
  })

  // Asignamos el evento de cerrar a los botones de cierre de cada modal
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.getAttribute("data-modal") // Obtiene el ID del modal
      if (modalId) {
        closeModal(modalId) // Llama a la función para cerrar el modal
      }
    })
  })

  // Cerrar el modal cuando se hace clic fuera de él (en el overlay)
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        // Verifica si el clic fue en el overlay (fuera del modal)
        const modalId = overlay.id // Obtiene el ID del modal
        closeModal(modalId) // Cierra el modal
      }
    })
  })

  // Cerrar el modal con la tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // Cierra todos los modales abiertos cuando se presiona ESC
      document.querySelectorAll(".modal-overlay.is-open").forEach((modal) => {
        closeModal(modal.id)
      })
    }
  })
})
// ===== FIN FUNCIONALIDAD DE LOS MODALES =====