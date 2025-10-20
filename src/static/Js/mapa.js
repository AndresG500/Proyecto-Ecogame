// ==================== VARIABLES GLOBALES ====================

// Coordenadas del ESP32 (se reemplazan desde el servidor)


// Variables del mapa y marcadores
let map;
let esp32Marker;
let userMarker;
let routeLine;
let accuracyCircle;

// ==================== INICIALIZACIÓN DEL MAPA ====================

function initMap() {
    // Crear el mapa centrado en la ubicación del ESP32
    map = L.map('map').setView([ESP32_LAT, ESP32_LON], 16);
    
    // Agregar tiles del mapa (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Crear icono personalizado para ESP32
    const esp32Icon = L.divIcon({
        html: '<div class="custom-marker marker-esp32"><span class="marker-icon">🎯</span></div>',
        className: '',
        iconSize: [35, 35],
        iconAnchor: [17, 35]
    });
    
    // Agregar marcador del ESP32
    esp32Marker = L.marker([ESP32_LAT, ESP32_LON], { icon: esp32Icon })
        .addTo(map)
        .bindPopup(`
            <strong>🎯 ESP32 - Objetivo</strong><br>
            <small>Lat: ${ESP32_LAT.toFixed(6)}</small><br>
            <small>Lon: ${ESP32_LON.toFixed(6)}</small><br>
            <em>¡Encuéntrame!</em>
        `);
}

// ==================== CÁLCULOS GEOGRÁFICOS ====================

// Calcular distancia usando fórmula de Haversine
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distancia en metros
}

// Calcular dirección (bearing) entre dos puntos
function calculateBearing(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    
    const bearing = (θ * 180 / Math.PI + 360) % 360;
    const directions = ['Norte', 'Noreste', 'Este', 'Sureste', 'Sur', 'Suroeste', 'Oeste', 'Noroeste'];
    const directionIndex = Math.round(bearing / 45) % 8;
    
    return directions[directionIndex];
}

// ==================== ACTUALIZACIÓN DE POSICIÓN ====================

function updatePosition(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    // Actualizar información en pantalla
    document.getElementById('user-lat').textContent = userLat.toFixed(6);
    document.getElementById('user-lon').textContent = userLon.toFixed(6);
    document.getElementById('accuracy').textContent = Math.round(accuracy);

    // Calcular distancia y dirección
    const distance = calculateDistance(userLat, userLon, ESP32_LAT, ESP32_LON);
    document.getElementById('distance').textContent = Math.round(distance);
    const direction = calculateBearing(userLat, userLon, ESP32_LAT, ESP32_LON);

    // Actualizar marcador del usuario en el mapa
    updateUserMarker(userLat, userLon, accuracy);
    
    // Actualizar línea de ruta
    updateRouteLine(userLat, userLon);
    
    // Actualizar estado según distancia
    updateStatus(distance, direction);
    
    // Centrar mapa automáticamente la primera vez
    if (!window.mapCentered) {
        centerOnBoth();
        window.mapCentered = true;
    }
}

// ==================== ACTUALIZACIÓN DE ELEMENTOS DEL MAPA ====================

function updateUserMarker(lat, lon, accuracy) {
    if (!userMarker) {
        // Crear icono para el usuario
        const userIcon = L.divIcon({
            html: '<div class="custom-marker marker-user"><span class="marker-icon">📍</span></div>',
            className: '',
            iconSize: [35, 35],
            iconAnchor: [17, 35]
        });
        
        // Crear marcador
        userMarker = L.marker([lat, lon], { icon: userIcon })
            .addTo(map)
            .bindPopup(getUserPopupContent(lat, lon, accuracy));
    } else {
        // Actualizar posición y popup
        userMarker.setLatLng([lat, lon]);
        userMarker.setPopupContent(getUserPopupContent(lat, lon, accuracy));
    }
    
    // Círculo de precisión GPS
    if (accuracyCircle) {
        map.removeLayer(accuracyCircle);
    }
    accuracyCircle = L.circle([lat, lon], {
        radius: accuracy,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.1,
        weight: 2
    }).addTo(map);
}

function getUserPopupContent(lat, lon, accuracy) {
    return `
        <strong>📍 Tu Ubicación</strong><br>
        <small>Lat: ${lat.toFixed(6)}</small><br>
        <small>Lon: ${lon.toFixed(6)}</small><br>
        <small>Precisión: ±${Math.round(accuracy)}m</small>
    `;
}

function updateRouteLine(userLat, userLon) {
    // Eliminar línea anterior si existe
    if (routeLine) {
        map.removeLayer(routeLine);
    }
    
    // Crear nueva línea de ruta
    routeLine = L.polyline([
        [userLat, userLon],
        [ESP32_LAT, ESP32_LON]
    ], {
        color: '#667eea',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);
}

// ==================== ACTUALIZACIÓN DE ESTADO ====================

function updateStatus(distance, direction) {
    const statusDiv = document.getElementById('status');

    if (distance < 10) {
        statusDiv.style.background = '#10b981';
        statusDiv.style.color = 'white';
        statusDiv.textContent = '🎉 ¡ENCONTRADO! ¡Felicidades!';
    } else if (distance < 50) {
        statusDiv.style.background = '#f59e0b';
        statusDiv.style.color = 'white';
        statusDiv.textContent = `🔥 ¡Muy cerca! (${direction})`;
    } else if (distance < 200) {
        statusDiv.style.background = '#ffd93d';
        statusDiv.style.color = '#333';
        statusDiv.textContent = `🚶 Estás cerca - Ve hacia el ${direction}`;
    } else {
        statusDiv.style.background = '#6b7280';
        statusDiv.style.color = 'white';
        statusDiv.textContent = `🧭 Sigue buscando hacia el ${direction}`;
    }
}

// ==================== CONTROLES DEL MAPA ====================

function centerOnBoth() {
    if (userMarker) {
        const bounds = L.latLngBounds([
            [ESP32_LAT, ESP32_LON],
            userMarker.getLatLng()
        ]);
        map.fitBounds(bounds, { padding: [50, 50] });
    } else {
        map.setView([ESP32_LAT, ESP32_LON], 16);
    }
}

function centerOnESP32() {
    map.setView([ESP32_LAT, ESP32_LON], 18);
    esp32Marker.openPopup();
}

function centerOnUser() {
    if (userMarker) {
        map.setView(userMarker.getLatLng(), 18);
        userMarker.openPopup();
    } else {
        alert('⚠️ Esperando tu ubicación...');
    }
}

// ==================== MANEJO DE ERRORES ====================

function handleError(error) {
    let msg = '';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            msg = 'Permiso denegado. Por favor permite el acceso a tu ubicación.';
            break;
        case error.POSITION_UNAVAILABLE:
            msg = 'Ubicación no disponible. Verifica tu GPS.';
            break;
        case error.TIMEOUT:
            msg = 'Tiempo de espera agotado. Intenta nuevamente.';
            break;
        default:
            msg = 'Error desconocido al obtener ubicación.';
    }
    
    const statusDiv = document.getElementById('status');
    statusDiv.style.background = '#ef4444';
    statusDiv.style.color = 'white';
    statusDiv.textContent = '❌ ' + msg;
    
    console.error('Error de geolocalización:', error);
}

// ==================== INICIALIZACIÓN DE LA APLICACIÓN ====================

window.onload = function() {
    console.log('🎯 Iniciando Juego de Búsqueda ESP32...');
    
    // Inicializar mapa
    initMap();
    console.log('✓ Mapa inicializado');
    
    // Verificar soporte de geolocalización
    if ("geolocation" in navigator) {
        console.log('✓ Geolocalización soportada');
        
        // Iniciar seguimiento de ubicación
        const watchId = navigator.geolocation.watchPosition(
            updatePosition,
            handleError,
            {
                enableHighAccuracy: true,  // Usar GPS de alta precisión
                timeout: 10000,             // Timeout de 10 segundos
                maximumAge: 1000            // Cache máximo de 1 segundo
            }
        );
        
        console.log('✓ Seguimiento de ubicación iniciado (ID:', watchId, ')');
        
        // Guardar watchId para poder detenerlo si es necesario
        window.geolocationWatchId = watchId;
    } else {
        console.error('❌ Geolocalización no soportada');
        const statusDiv = document.getElementById('status');
        statusDiv.style.background = '#ef4444';
        statusDiv.style.color = 'white';
        statusDiv.textContent = '❌ Tu navegador no soporta geolocalización';
    }
    
    // Agregar clase fade-in a elementos principales
    document.querySelectorAll('.info-panel, .map-container, .legend').forEach(el => {
        el.classList.add('fade-in');
    });
};

// ==================== LIMPIEZA AL CERRAR ====================

window.onbeforeunload = function() {
    // Detener seguimiento de ubicación
    if (window.geolocationWatchId) {
        navigator.geolocation.clearWatch(window.geolocationWatchId);
        console.log('✓ Seguimiento de ubicación detenido');
    }
};

// ==================== FUNCIONES AUXILIARES ====================

// Formatear distancia de manera legible
function formatDistance(meters) {
    if (meters < 1000) {
        return Math.round(meters) + 'm';
    } else {
        return (meters / 1000).toFixed(2) + 'km';
    }
}

// Obtener calidad de señal GPS
function getGPSQuality(accuracy) {
    if (accuracy < 10) return '🟢 Excelente';
    if (accuracy < 30) return '🟡 Buena';
    if (accuracy < 100) return '🟠 Regular';
    return '🔴 Baja';
}

// Log de debug (solo si está en modo desarrollo)
function debugLog(message, data) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[DEBUG] ${message}`, data || '');
    }
}

// ==================== EVENTOS ADICIONALES ====================

// Detectar cambios de conexión
window.addEventListener('online', function() {
    console.log('✓ Conexión restaurada');
});

window.addEventListener('offline', function() {
    console.warn('⚠️ Conexión perdida');
    const statusDiv = document.getElementById('status');
    statusDiv.style.background = '#f59e0b';
    statusDiv.style.color = 'white';
    statusDiv.textContent = '⚠️ Sin conexión a Internet';
});

// Detectar cambios de orientación en dispositivos móviles
window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        map.invalidateSize();
        console.log('✓ Mapa redimensionado');
    }, 100);
});

// Detectar cambios de tamaño de ventana
window.addEventListener('resize', function() {
    setTimeout(function() {
        map.invalidateSize();
    }, 100);
});

// ==================== CONSOLA DE DEBUG ====================

console.log('%c🎯 Juego de Búsqueda ESP32', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cCoordenadas ESP32:', 'font-weight: bold;', `Lat: ${ESP32_LAT}, Lon: ${ESP32_LON}`);
console.log('%cDesarrollado con Leaflet.js y Geolocation API', 'color: #666;');