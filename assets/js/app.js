// ============================================
// SANGRE Y CENIZA - E-COMMERCE VIKINGO
// JavaScript Principal - Gestión de Carrito
// ============================================

// === DATOS DE PRODUCTOS ===
const productos = [
    {
        id: 1,
        nombre: "Martillo de Thor - Mjölnir",
        precio: 45000,
        imagen: "assets/img/amuleto.PNG",
        descripcion: "Un símbolo de protección contra el caos, con intrincados entrelazados que representan la fuerza del trueno.",
        material: "Plata de ley con pátina envejecida",
        categoria: "Amuletos",
        stock: 15
    },
    {
        id: 2,
        nombre: "Hacha de Barba Grabada",
        precio: 85000,
        imagen: "assets/img/axe.PNG",
        descripcion: "El diseño 'barbudo' permite enganchar el escudo del oponente, siendo una herramienta letal y versátil en el campo de batalla.",
        material: "Acero al carbono con grabados rúnicos",
        categoria: "Armas",
        stock: 8
    },
    {
        id: 3,
        nombre: "Escudo de Dracón",
        precio: 95000,
        imagen: "assets/img/escudo.PNG",
        descripcion: "El muro de escudos cobra vida con este diseño que combina ligereza para el combate y arte tradicional vikingo.",
        material: "Madera de roble reforzada con umbo de hierro",
        categoria: "Defensa",
        stock: 10
    },
    {
        id: 4,
        nombre: "Espada Sajona de Acero Damasquino",
        precio: 150000,
        imagen: "assets/img/espada.PNG",
        descripcion: "Una pieza de prestigio que muestra el patrón ondulado característico del acero plegado, símbolo de estatus entre los sajones.",
        material: "Acero de Damasco con empuñadura de nogal",
        categoria: "Armas",
        stock: 5
    },
    {
        id: 5,
        nombre: "Yelmo Vikingo de Cresta",
        precio: 120000,
        imagen: "assets/img/healmet.PNG",
        descripcion: "Inspirado en los hallazgos de Gjermundbu, este casco ofrece protección facial completa y una estética de noble guerrero nórdico.",
        material: "Acero forjado con detalles en latón",
        categoria: "Armadura",
        stock: 12
    },
    {
        id: 6,
        nombre: "Fíbula de Penanular con Ámbar",
        precio: 38000,
        imagen: "assets/img/pasador.PNG",
        descripcion: "Utilizada por normandos y sajones para sujetar capas pesadas, esta pieza de joyería muestra la sofisticación de la orfebrería medieval.",
        material: "Bronce dorado con incrustaciones de ámbar báltico",
        categoria: "Accesorios",
        stock: 20
    }
];

// === GESTIÓN DEL CARRITO ===
class CarritoCompras {
    constructor() {
        this.items = this.cargarCarrito();
        this.actualizarContador();
    }

    // Cargar carrito desde localStorage
    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carritoSangreYCeniza');
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }

    // Guardar carrito en localStorage
    guardarCarrito() {
        localStorage.setItem('carritoSangreYCeniza', JSON.stringify(this.items));
    }

    // Agregar producto al carrito
    agregar(productoId) {
        const producto = productos.find(p => p.id === productoId);
        if (!producto) return;

        const itemExistente = this.items.find(item => item.id === productoId);

        if (itemExistente) {
            if (itemExistente.cantidad < producto.stock) {
                itemExistente.cantidad++;
            } else {
                this.mostrarNotificacion('¡Stock máximo alcanzado!', 'warning');
                return;
            }
        } else {
            this.items.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1
            });
        }

        this.guardarCarrito();
        this.actualizarContador();
        this.mostrarNotificacion('¡Agregado al Botín de Guerra!', 'success');
    }

    // Eliminar producto del carrito
    eliminar(productoId) {
        this.items = this.items.filter(item => item.id !== productoId);
        this.guardarCarrito();
        this.actualizarContador();
        if (window.location.pathname.includes('carrito.html')) {
            this.renderizarCarrito();
        }
    }

    // Actualizar cantidad de un producto
    actualizarCantidad(productoId, nuevaCantidad) {
        const item = this.items.find(item => item.id === productoId);
        const producto = productos.find(p => p.id === productoId);

        if (item && producto) {
            if (nuevaCantidad > 0 && nuevaCantidad <= producto.stock) {
                item.cantidad = nuevaCantidad;
                this.guardarCarrito();
                this.actualizarContador();
                if (window.location.pathname.includes('carrito.html')) {
                    this.renderizarCarrito();
                }
            }
        }
    }

    // Obtener total de items en el carrito
    obtenerTotalItems() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }

    // Calcular subtotal
    calcularSubtotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    // Actualizar contador en navbar
    actualizarContador() {
        const contador = document.getElementById('cart-count');
        if (contador) {
            const total = this.obtenerTotalItems();
            contador.textContent = total;
            contador.style.display = total > 0 ? 'inline-block' : 'none';
        }
    }

    // Renderizar carrito en la página de carrito
    renderizarCarrito() {
        const contenedor = document.getElementById('cart-items');
        const resumen = document.getElementById('cart-summary');

        if (!contenedor) return;

        if (this.items.length === 0) {
            contenedor.innerHTML = `
                <div class="empty-cart">
                    <i class="bi bi-cart-x" style="font-size: 4rem; color: var(--oro-oscuro);"></i>
                    <p class="mt-3">Tu Botín de Guerra está vacío</p>
                    <a href="index.html" class="btn arc-btn-primary mt-3">Explorar Tesoros</a>
                </div>
            `;
            if (resumen) resumen.style.display = 'none';
            return;
        }

        // Renderizar items
        contenedor.innerHTML = this.items.map(item => `
            <tr>
                <td>
                    <img src="${item.imagen}" alt="${item.nombre}" class="product-img">
                </td>
                <td>
                    <span class="d-block fw-bold cart-title">${item.nombre}</span>
                </td>
                <td>
                    <input type="number" 
                           value="${item.cantidad}" 
                           min="1" 
                           max="99" 
                           class="quantity-control" 
                           data-id="${item.id}">
                </td>
                <td class="text-gold">$${this.formatearPrecio(item.precio)}</td>
                <td class="text-gold fw-bold">$${this.formatearPrecio(item.precio * item.cantidad)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="carrito.eliminar(${item.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Actualizar resumen
        if (resumen) {
            const subtotal = this.calcularSubtotal();
            const envio = 5000;
            const total = subtotal + envio;

            document.getElementById('subtotal').textContent = `$${this.formatearPrecio(subtotal)}`;
            document.getElementById('envio').textContent = `$${this.formatearPrecio(envio)}`;
            document.getElementById('total').textContent = `$${this.formatearPrecio(total)}`;
        }

        // Agregar event listeners a los inputs de cantidad
        document.querySelectorAll('.quantity-control').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                const cantidad = parseInt(e.target.value);
                this.actualizarCantidad(id, cantidad);
            });
        });
    }

    // Formatear precio
    formatearPrecio(precio) {
        return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo = 'success') {
        // Crear notificación temporal
        const notif = document.createElement('div');
        notif.className = `alert alert-${tipo === 'success' ? 'success' : 'warning'} position-fixed top-0 start-50 translate-middle-x mt-3`;
        notif.style.zIndex = '9999';
        notif.style.minWidth = '300px';
        notif.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
                ${mensaje}
            </div>
        `;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.remove();
        }, 2000);
    }
}

// === RENDERIZAR PRODUCTOS EN HOME ===
function renderizarProductos() {
    const contenedor = document.getElementById('productos-container');
    if (!contenedor) return;

    contenedor.innerHTML = productos.map(producto => `
        <div class="col">
            <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text flex-grow-1">${producto.descripcion}</p>
                    <p class="product-price">$${carrito.formatearPrecio(producto.precio)}</p>
                    <div class="d-grid gap-2">
                        <a href="detalle.html?id=${producto.id}" class="btn btn-outline-gold">
                            <i class="bi bi-eye me-2"></i>Ver Detalles
                        </a>
                        <button class="btn arc-btn-primary" onclick="carrito.agregar(${producto.id})">
                            <i class="bi bi-cart-plus me-2"></i>Agregar al Botín
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// === RENDERIZAR DETALLE DE PRODUCTO ===
function renderizarDetalle() {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = parseInt(urlParams.get('id'));
    const producto = productos.find(p => p.id === productoId);

    if (!producto) {
        window.location.href = '../index.html';
        return;
    }

    const contenedor = document.getElementById('producto-detalle');
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="row">
            <div class="col-md-6 mb-4">
                <img src="../${producto.imagen}" alt="${producto.nombre}" class="detail-img">
            </div>
            <div class="col-md-6">
                <h1 class="detail-title">${producto.nombre}</h1>
                <p class="product-price">$${carrito.formatearPrecio(producto.precio)}</p>
                
                <p class="detail-description">${producto.descripcion}</p>
                
                <h3 class="text-gold mt-4 mb-3">Especificaciones</h3>
                <ul class="specs-list">
                    <li><strong>Material:</strong> ${producto.material}</li>
                    <li><strong>Categoría:</strong> ${producto.categoria}</li>
                    <li><strong>Stock disponible:</strong> ${producto.stock} unidades</li>
                    <li><strong>Garantía:</strong> Fabricación artesanal certificada</li>
                </ul>
                
                <div class="d-grid gap-3 mt-4">
                    <button class="btn arc-btn-primary btn-lg" onclick="agregarYRedirigir(${producto.id})">
                        <i class="bi bi-cart-plus me-2"></i>Agregar al Botín de Guerra
                    </button>
                    <a href="../index.html" class="btn btn-outline-gold">
                        <i class="bi bi-arrow-left me-2"></i>Volver a la Gran Sala
                    </a>
                </div>
            </div>
        </div>
    `;
}

// === FUNCIÓN AUXILIAR PARA AGREGAR Y REDIRIGIR ===
function agregarYRedirigir(id) {
    carrito.agregar(id);
}

// === INICIALIZACIÓN ===
const carrito = new CarritoCompras();

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Renderizar productos en home
    if (document.getElementById('productos-container')) {
        renderizarProductos();
    }

    // Renderizar detalle de producto
    if (document.getElementById('producto-detalle')) {
        renderizarDetalle();
    }

    // Renderizar carrito
    if (document.getElementById('cart-items')) {
        carrito.renderizarCarrito();
    }

    // Botón finalizar compra
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            if (carrito.items.length === 0) {
                carrito.mostrarNotificacion('Tu carrito está vacío', 'warning');
                return;
            }
            alert('¡Gracias por tu compra, guerrero!');
            // Aquí iría la lógica de checkout real
        });
    }
});