// ============================================
// MODAL DE INVENTARIO (Botón de Camiseta)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el botón del inventario (primer botón con ícono de camiseta)
    const inventoryButton = document.querySelectorAll('.container-event button')[0];
    
    // Crear el modal del inventario
    const inventoryModal = createInventoryModal();
    document.body.appendChild(inventoryModal);
    
    // Abrir modal al hacer clic en el botón de inventario
    inventoryButton.addEventListener('click', function() {
        updateInventoryDisplay();
        inventoryModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar modal al hacer clic en la X
    const closeBtn = inventoryModal.querySelector('.modal-close');
    closeBtn.addEventListener('click', function() {
        inventoryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    inventoryModal.addEventListener('click', function(e) {
        if (e.target === inventoryModal) {
            inventoryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// ============================================
// DATOS DE LOS ITEMS (mismo que en shop-modal.js)
// ============================================

const AllItems = [
    {   
        id: 1,
        name: 'Personaje con gafas',
        img: '../static/Img/PersonajeGafas.png',
        precio: 500
    },
    {   
        id: 2,
        name: 'Personaje con flores',
        img: '../static/Img/PersonajeFlores.png',
        precio: 250
    },
    {   
        id: 3,
        name: 'Pirata',
        img: '../static/Img/pirata.png',
        precio: 300
    },
    {
        id: 4,
        name: 'Policia',
        img: '../static/Img/policia.png',
        precio: 400
    },
    {
        id: 5,
        name: 'Perro',
        img: '../static/Img/perro.png',
        precio: 200
    },
    {
        id: 6,
        name: 'Gato',
        img: '../static/Img/gato.png',
        precio: 150
    }
];

// ============================================
// FUNCIONES AUXILIARES
// ============================================

// Obtener datos del localStorage
function obtenerDatosUsuario() {
    const datos = localStorage.getItem('ecoGameUser');
    if (datos) {
        return JSON.parse(datos);
    }
    return {
        puntos: 1250,
        inventario: [],
        skinEquipada: null
    };
}

// Guardar datos en localStorage
function guardarDatosUsuario(datos) {
    localStorage.setItem('ecoGameUser', JSON.stringify(datos));
}

// Obtener items que el usuario ha comprado
function obtenerItemsComprados() {
    const datos = obtenerDatosUsuario();
    return AllItems.filter(item => datos.inventario.includes(item.id));
}

// Equipar una skin
function equiparSkin(itemId) {
    const datos = obtenerDatosUsuario();
    
    // Verificar que el usuario tenga ese item
    if (!datos.inventario.includes(itemId)) {
        showInventoryNotification('No tienes este item', 'error');
        return false;
    }
    
    // Equipar la skin
    datos.skinEquipada = itemId;
    guardarDatosUsuario(datos);
    
    // Cambiar el personaje en la pantalla principal
    cambiarPersonajePrincipal(itemId);
    
    // Actualizar botones en el inventario
    updateInventoryDisplay();
    
    showInventoryNotification('¡Skin equipada exitosamente!', 'success');
    return true;
}

// Cambiar el personaje principal en la pantalla
function cambiarPersonajePrincipal(itemId) {
    const personajeImg = document.querySelector('.figuraone');
    if (!personajeImg) return;
    
    const item = AllItems.find(i => i.id === itemId);
    if (item) {
        personajeImg.src = item.img;
        personajeImg.alt = item.name;
    }
}

// Desequipar skin (volver al personaje por defecto)
function desequiparSkin() {
    const datos = obtenerDatosUsuario();
    datos.skinEquipada = null;
    guardarDatosUsuario(datos);
    
    // Volver al personaje por defecto
    const personajeImg = document.querySelector('.figuraone');
    if (personajeImg) {
        personajeImg.src = '../static/Img/figura.png';
        personajeImg.alt = 'figura';
    }
    
    updateInventoryDisplay();
    showInventoryNotification('Skin desequipada', 'success');
}

// ============================================
// CREAR MODAL
// ============================================

function createInventoryModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'inventoryModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">
                <i class="fa-solid fa-xmark"></i>
            </button>
            
            <div class="container-clothe">
                <h2>Mi Inventario</h2>
                
                <div id="inventoryContainer" class="container-image">
                    <!-- Se genera dinámicamente -->
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

// ============================================
// ACTUALIZAR INVENTARIO
// ============================================

function updateInventoryDisplay() {
    const container = document.getElementById('inventoryContainer');
    if (!container) return;
    
    const itemsComprados = obtenerItemsComprados();
    const datos = obtenerDatosUsuario();
    
    // Si no tiene items
    if (itemsComprados.length === 0) {
        container.innerHTML = `
            <div class="empty-inventory">
                <i class="fa-solid fa-box-open"></i>
                <p>No tienes items aún</p>
                <p class="empty-text">¡Visita la tienda para comprar skins!</p>
            </div>
        `;
        return;
    }
    
    // Generar items del inventario
    container.innerHTML = itemsComprados.map(item => {
        const isEquipped = datos.skinEquipada === item.id;
        
        return `
            <div class="item-clothe">
                <img src="${item.img}" alt="${item.name}" class="Ropa">
                
                ${isEquipped ? '<div class="equipped-badge"><i class="fa-solid fa-check"></i> Equipada</div>' : ''}
                
                <span class="item-name">${item.name}</span>
                
                ${isEquipped 
                    ? `<button class="btn-unequip" data-item-id="${item.id}">Desequipar</button>`
                    : `<button class="btn-equip" data-item-id="${item.id}">Equipar</button>`
                }
            </div>
        `;
    }).join('');
}

// ============================================
// NOTIFICACIONES
// ============================================

function showInventoryNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('click', function(e) {
    // Equipar skin
    if (e.target.classList.contains('btn-equip')) {
        e.preventDefault();
        const itemId = parseInt(e.target.getAttribute('data-item-id'));
        equiparSkin(itemId);
    }
    
    // Desequipar skin
    if (e.target.classList.contains('btn-unequip')) {
        e.preventDefault();
        desequiparSkin();
    }
});

// ============================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ============================================

// Al cargar la página, verificar si hay una skin equipada
window.addEventListener('DOMContentLoaded', function() {
    const datos = obtenerDatosUsuario();
    if (datos.skinEquipada) {
        cambiarPersonajePrincipal(datos.skinEquipada);
    }
});