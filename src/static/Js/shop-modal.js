// ============================================
// SISTEMA DE ALMACENAMIENTO - LOCALSTORAGE
// ============================================

// Cargar datos del usuario desde localStorage
function cargarDatos() {
    const datos = localStorage.getItem('ecoGameUser');
    if (datos) {
        return JSON.parse(datos);
    }
    // Valores por defecto para nuevos usuarios
    return {
        puntos: 1250,              // Puntos iniciales (puedes cambiar esto)
        inventario: [],            // Items comprados (IDs)
        skinEquipada: null         // Skin actualmente en uso
    };
}

// Guardar datos del usuario en localStorage
function guardarDatos(datos) {
    localStorage.setItem('ecoGameUser', JSON.stringify(datos));
}

// Obtener puntos actuales
function getUserPoints() {
    const datos = cargarDatos();
    return datos.puntos;
}

// Actualizar puntos en el header y menú
function setUserPoints(newPoints) {
    const datos = cargarDatos();
    datos.puntos = newPoints;
    guardarDatos(datos);
    
    // Actualizar visualmente
    const pointsCounter = document.getElementById('pointsCounter');
    const menuPoints = document.getElementById('menuPoints');
    
    if (pointsCounter) pointsCounter.textContent = newPoints;
    if (menuPoints) menuPoints.textContent = newPoints;
    
    // Actualizar estado de botones
    updateShopButtons();
}

// Verificar si el usuario ya tiene un item
function tieneItem(itemId) {
    const datos = cargarDatos();
    return datos.inventario.includes(itemId);
}

// Agregar item al inventario
function agregarItemAlInventario(itemId) {
    const datos = cargarDatos();
    if (!datos.inventario.includes(itemId)) {
        datos.inventario.push(itemId);
        guardarDatos(datos);
    }
}

// ============================================
// CONFIGURACIÓN DE LA TIENDA
// ============================================

const ShopItems = [
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
// CREAR Y CONFIGURAR MODAL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar puntos al cargar la página
    const datosUsuario = cargarDatos();
    const pointsCounter = document.getElementById('pointsCounter');
    const menuPoints = document.getElementById('menuPoints');
    
    if (pointsCounter) pointsCounter.textContent = datosUsuario.puntos;
    if (menuPoints) menuPoints.textContent = datosUsuario.puntos;
    
    // Obtener el botón de la tienda
    const shopButton = document.querySelectorAll('.container-event button')[1];
    
    // Crear el modal de la tienda
    const shopModal = createShopModal();
    document.body.appendChild(shopModal);
    
    // Abrir modal
    shopButton.addEventListener('click', function() {
        shopModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateShopButtons();
    });
    
    // Cerrar modal con botón X
    const closeBtn = shopModal.querySelector('.modal-close');
    closeBtn.addEventListener('click', function() {
        shopModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Cerrar modal al hacer clic fuera
    shopModal.addEventListener('click', function(e) {
        if (e.target === shopModal) {
            shopModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

function createShopModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'shopModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">
                <i class="fa-solid fa-xmark"></i>
            </button>
            
            <div class="container-clothe">
                <h2>Tienda</h2>
                
                <div class="container-image">
                    ${generateShopItems(ShopItems)}
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

function generateShopItems(items) {
    return items.map(item => `
        <div class="item-clothe" data-item-id="${item.id}">
            <img src="${item.img}" alt="${item.name}" class="Ropa">
            
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#369e97" class="star" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
            </svg>

            <span class="item-precio">${item.precio}</span>
            <button class="btn-comprar" data-item-id="${item.id}" data-item-precio="${item.precio}" data-item-name="${item.name}">
                Comprar
            </button>
        </div>
    `).join('');
}

// ============================================
// LÓGICA DE COMPRA
// ============================================

function updateShopButtons() {
    const userPoints = getUserPoints();
    const buyButtons = document.querySelectorAll('.btn-comprar');
    
    buyButtons.forEach(button => {
        const itemId = parseInt(button.getAttribute('data-item-id'));
        const itemPrice = parseInt(button.getAttribute('data-item-precio'));
        
        // Verificar si ya tiene el item
        if (tieneItem(itemId)) {
            button.disabled = true;
            button.classList.add('btn-owned');
            button.innerHTML = '<i class="fa-solid fa-check"></i> Comprado';
        }
        // Verificar si tiene suficientes puntos
        else if (userPoints < itemPrice) {
            button.disabled = true;
            button.classList.add('btn-disabled');
            button.classList.remove('btn-owned');
            button.textContent = 'Sin puntos';
        }
        // Puede comprar
        else {
            button.disabled = false;
            button.classList.remove('btn-disabled', 'btn-owned');
            button.textContent = 'Comprar';
        }
    });
}

function purchaseItem(itemId, itemPrice, itemName) {
    // Verificar si ya tiene el item
    if (tieneItem(itemId)) {
        showNotification('¡Ya tienes este item!', 'error');
        return false;
    }
    
    const userPoints = getUserPoints();
    
    // Verificar puntos suficientes
    if (userPoints < itemPrice) {
        showNotification('No tienes suficientes puntos', 'error');
        return false;
    }
    
    // Realizar la compra
    const newPoints = userPoints - itemPrice;
    setUserPoints(newPoints);
    agregarItemAlInventario(itemId);
    
    showNotification(`¡${itemName} comprado exitosamente!`, 'success');
    return true;
}

// ============================================
// NOTIFICACIONES
// ============================================

function showNotification(message, type) {
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
    if (e.target.classList.contains('btn-comprar') && !e.target.disabled) {
        e.preventDefault();
        
        const itemId = parseInt(e.target.getAttribute('data-item-id'));
        const itemPrice = parseInt(e.target.getAttribute('data-item-precio'));
        const itemName = e.target.getAttribute('data-item-name');
        
        purchaseItem(itemId, itemPrice, itemName);
    }
});

// ============================================
// FUNCIONES AUXILIARES (Opcional - para debugging)
// ============================================

// Para ver los datos guardados (útil para desarrollo)
function verDatosGuardados() {
    console.log('Datos del usuario:', cargarDatos());
}

// Para resetear todo (útil para pruebas)
function resetearDatos() {
    localStorage.removeItem('ecoGameUser');
    location.reload();
}

// Para agregar puntos manualmente (útil para pruebas)
function agregarPuntos(cantidad) {
    const datos = cargarDatos();
    datos.puntos += cantidad;
    guardarDatos(datos);
    setUserPoints(datos.puntos);
    console.log(`Se agregaron ${cantidad} puntos. Total: ${datos.puntos}`);
}