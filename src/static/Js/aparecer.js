document.addEventListener("DOMContentLoaded", () => {
    const userButton = document.getElementById("userButton")
    const dropdownMenu = document.getElementById("dropdownMenu")

    // Toggle del menú al hacer clic en el botón Usuario
    userButton.addEventListener("click", (e) => {
        e.stopPropagation()
        dropdownMenu.classList.toggle("ocultar")
    })

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener("click", (e) => {
        if (!dropdownMenu.contains(e.target) && e.target !== userButton) {
        dropdownMenu.classList.add("ocultar")
        }
    })

    // Prevenir que el menú se cierre al hacer clic dentro de él
    dropdownMenu.addEventListener("click", (e) => {
        e.stopPropagation()
    })

    // Animación suave para el botón de play
    const playButton = document.getElementById("playButton")
    playButton.addEventListener("click", () => {
        console.log("¡Iniciando juego!")
        // Aquí puedes agregar la lógica para iniciar el juego
    })
})
