// 🔹 Persona 1: Funciones del navbar o scroll del hero
// (ejemplo: animaciones del banner al cargar)


// 🔹 Persona 2: Funciones para productos y agregar al carrito
// (ejemplo: manejar clicks en botones de productos)


// 🔹 Persona 3: Lógica del carrito
// (agregar, eliminar, calcular total)
// Variables globales
const carrito = [];
let cartModal;
let goalModal;
const costoEnvio = 12000; // Costo fijo de envío
let cuponAplicado = null; // Para almacenar el cupón aplicado

// Cupones disponibles
const cupones = {
  'DEPORTE10': { tipo: 'descuento', valor: 0.1, descripcion: '10% de descuento' },
  'ENVIOGRATIS': { tipo: 'envio', valor: 0, descripcion: 'Envío gratis' },
  'PROMO20': { tipo: 'descuento', valor: 0.2, descripcion: '20% de descuento' }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar los modales de Bootstrap
  cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
  goalModal = new bootstrap.Modal(document.getElementById('modal-gol'));
});

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, tipo, precio) {
  // Definir las tallas disponibles según el tipo de producto
  let tallas = [];
  
  switch(tipo) {
    case 'zapato':
      tallas = Array.from({length: 9}, (_, i) => 36 + i);
      break;
    case 'camiseta':
      tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      break;
    case 'short':
      tallas = ['S', 'M', 'L', 'XL', 'XXL'];
      break;
  }
  
  // Crear el objeto del producto
  const item = {
    id: Date.now(), // ID único para cada producto
    nombre,
    tipo,
    precio,
    cantidad: 1,
    talla: tallas[0], // Talla por defecto
    tallas, // Todas las tallas disponibles
    genero: 'Hombre' // Género por defecto
  };
  
  // Agregar al carrito
  carrito.push(item);
  
  // Actualizar la visualización
  actualizarContadorCarrito();
  
  // Mostrar una notificación
  mostrarNotificacion(`${nombre} añadido al carrito`);
}

// Función para mostrar una notificación temporal
function mostrarNotificacion(mensaje) {
  // Crear el elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = 'position-fixed top-0 end-0 p-3';
  notificacion.style.zIndex = '1080';
  
  // Estructura Toast de Bootstrap
  notificacion.innerHTML = `
    <div class="toast show bg-success text-white" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-success text-white">
        <i class="fas fa-check-circle me-2"></i>
        <strong class="me-auto">Carrito actualizado</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${mensaje}
      </div>
    </div>
  `;
  
  // Agregar al DOM
  document.body.appendChild(notificacion);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  const contador = document.getElementById('cart-counter');
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  contador.textContent = totalItems;
}

// Función para abrir el modal del carrito
function abrirModalCarrito() {
  renderizarCarrito();
  cartModal.show();
}

// Función para renderizar los productos en el carrito
function renderizarCarrito() {
  const contenedor = document.getElementById('lista-carrito');
  const carritoVacio = document.getElementById('carrito-vacio');
  const carritoResumen = document.getElementById('carrito-resumen');
  
  // Limpiar el contenedor
  contenedor.innerHTML = '';
  
  // Mostrar mensaje si el carrito está vacío
  if (carrito.length === 0) {
    carritoVacio.style.display = 'block';
    carritoResumen.style.display = 'none';
    return;
  }
  
  // Ocultar mensaje de carrito vacío y mostrar el resumen
  carritoVacio.style.display = 'none';
  carritoResumen.style.display = 'block';
  
  // Renderizar cada producto
  carrito.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="row align-items-center">
        <!-- Icono del producto -->
        <div class="col-md-2 text-center mb-2 mb-md-0">
          <i class="fas fa-${iconoProducto(item.tipo)} fa-2x text-burnt-amber"></i>
        </div>
        
        <!-- Información del producto -->
        <div class="col-md-4 mb-2 mb-md-0">
          <h5 class="mb-0">${item.nombre}</h5>
          <p class="text-muted mb-0">${formatearPrecio(item.precio)}</p>
        </div>
        
        <!-- Opciones del producto -->
        <div class="col-md-5 mb-2 mb-md-0">
          <div class="row g-2">
            <!-- Selector de talla -->
            <div class="col-sm-4">
              <select class="form-select form-select-sm" onchange="cambiarTalla(${index}, this.value)">
                ${item.tallas.map(t => `
                  <option value="${t}" ${item.talla === t ? 'selected' : ''}>${t}</option>
                `).join('')}
              </select>
              <label class="form-text">Talla</label>
            </div>
            
            <!-- Selector de cantidad -->
            <div class="col-sm-4">
              <input type="number" class="form-control form-control-sm" min="1" max="10" value="${item.cantidad}" 
                onchange="cambiarCantidad(${index}, this.value)">
              <label class="form-text">Cantidad</label>
            </div>
            
            <!-- Selector de género -->
            <div class="col-sm-4">
              <select class="form-select form-select-sm" onchange="cambiarGenero(${index}, this.value)">
                <option value="Hombre" ${item.genero === 'Hombre' ? 'selected' : ''}>Hombre</option>
                <option value="Mujer" ${item.genero === 'Mujer' ? 'selected' : ''}>Mujer</option>
              </select>
              <label class="form-text">Género</label>
            </div>
          </div>
        </div>
        
        <!-- Botón eliminar -->
        <div class="col-md-1 text-end">
          <i class="fas fa-trash cart-item-remove" onclick="eliminarDelCarrito(${index})"></i>
        </div>
      </div>
    `;
    contenedor.appendChild(div);
  });
  
  // Actualizar los precios
  actualizarTotal();
}

// Función para obtener el icono según el tipo de producto
function iconoProducto(tipo) {
  switch(tipo) {
    case 'zapato': return 'shoe-prints';
    case 'camiseta': return 'tshirt';
    case 'short': return 'socks';
    default: return 'tag';
  }
}

// Función para formatear el precio
function formatearPrecio(precio) {
  return '$' + precio.toLocaleString('es-CO');
}

// Función para cambiar la talla
function cambiarTalla(index, talla) {
  carrito[index].talla = talla;
}

// Función para cambiar la cantidad
function cambiarCantidad(index, cantidad) {
  carrito[index].cantidad = parseInt(cantidad) || 1;
  actualizarContadorCarrito();
  actualizarTotal();
}

// Función para cambiar el género
function cambiarGenero(index, genero) {
  carrito[index].genero = genero;
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarContadorCarrito();
  renderizarCarrito();
}

// Función para actualizar el precio total, incluyendo descuentos y envío
function actualizarTotal() {
  const subtotalElement = document.getElementById('subtotal-precio');
  const descuentoElement = document.getElementById('descuento-precio');
  const descuentoRow = document.getElementById('descuento-row');
  const envioElement = document.getElementById('envio-precio');
  const totalElement = document.getElementById('total-precio');
  
  // Calcular el subtotal
  const subtotal = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
  subtotalElement.textContent = formatearPrecio(subtotal);
  
  // Calcular descuento si hay cupón aplicado
  let descuento = 0;
  if (cuponAplicado && cuponAplicado.tipo === 'descuento') {
    descuento = subtotal * cuponAplicado.valor;
    descuentoElement.textContent = '-' + formatearPrecio(descuento);
    descuentoRow.style.display = 'flex';
  } else {
    descuentoRow.style.display = 'none';
  }
  
  // Calcular costo de envío
  let envio = costoEnvio;
  if (cuponAplicado && cuponAplicado.tipo === 'envio') {
    envio = 0;
    envioElement.textContent = 'Gratis';
  } else {
    envioElement.textContent = formatearPrecio(envio);
  }
  
  // Calcular y mostrar el total
  const total = subtotal - descuento + envio;
  totalElement.textContent = formatearPrecio(total);
}

// Función para aplicar cupón con manejo de errores
function aplicarCupon() {
  const cuponInput = document.getElementById('cupon');
  const cuponValue = cuponInput.value.trim().toUpperCase();
  
  // Limpiar mensajes previos
  ocultarMensajes();
  
  // Validar que se haya ingresado un cupón
  if (!cuponValue) {
    mostrarError('Por favor ingresa un código de cupón');
    return;
  }
  
  // Validar si ya hay un cupón aplicado
  if (cuponAplicado) {
    mostrarError('Ya tienes un cupón aplicado. Solo puedes usar un cupón por compra.');
    return;
  }
  
  // Validar si el cupón existe
  if (!cupones[cuponValue]) {
    mostrarError('El cupón ingresado no es válido o ha expirado');
    return;
  }
  
  // Aplicar el cupón
  cuponAplicado = cupones[cuponValue];
  
  // Actualizar la interfaz
  mostrarCuponAplicado();
  mostrarExito(`¡Cupón aplicado! ${cuponAplicado.descripcion}`);
  cuponInput.value = '';
  
  // Actualizar el total
  actualizarTotal();
}

// Función para remover el cupón aplicado
function removerCupon() {
  cuponAplicado = null;
  
  // Actualizar la interfaz
  ocultarCuponAplicado();
  mostrarExito('Cupón removido exitosamente');
  
  // Actualizar el total
  actualizarTotal();
}

// Funciones para manejar la interfaz de cupones
function mostrarError(mensaje) {
  const errorElement = document.getElementById('cupon-error');
  const mensajeElement = document.getElementById('error-mensaje');
  mensajeElement.textContent = mensaje;
  errorElement.style.display = 'block';
}

function mostrarExito(mensaje) {
  const successElement = document.getElementById('cupon-success');
  const mensajeElement = document.getElementById('success-mensaje');
  mensajeElement.textContent = mensaje;
  successElement.style.display = 'block';
}

function ocultarMensajes() {
  document.getElementById('cupon-error').style.display = 'none';
  document.getElementById('cupon-success').style.display = 'none';
}

function mostrarCuponAplicado() {
  document.getElementById('cupon-aplicado').style.display = 'block';
  document.getElementById('cupon-input-group').style.display = 'none';
  document.getElementById('cupon-descripcion').textContent = cuponAplicado.descripcion;
}

function ocultarCuponAplicado() {
  document.getElementById('cupon-aplicado').style.display = 'none';
  document.getElementById('cupon-input-group').style.display = 'flex';
}

// Función para mostrar el modal de compra exitosa
function mostrarModalCompra() {
  if (carrito.length === 0) {
    mostrarError('Tu carrito está vacío');
    return;
  }
  
  // Ocultar el modal del carrito antes de mostrar el de confirmación
  cartModal.hide();
  
  // Mostrar el modal de gol después de un pequeño retraso
  setTimeout(() => {
    goalModal.show();
  }, 500);
}

// Función para finalizar la compra
function finalizarCompra() {
  // Vaciar el carrito
  carrito.length = 0;
  
  // Resetear cupón aplicado
  cuponAplicado = null;
  
  // Actualizar la UI
  actualizarContadorCarrito();
}

// 🔹 Persona 4: Animaciones en secciones (scroll, aparición, etc)


// 🔹 Persona 5: Funciones generales, validaciones, o scroll suave
