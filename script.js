// BASE DE DATOS DE PRODUCTOS (ROPA Y ZAPATOS)
const productos = [
    {
        id: 1,
        nombre: "Chaqueta Oversize Cyber",
        categoria: "ropa",
        precio: 45.00,
        tallas: ["S", "M", "L", "XL"],
        tags: "chaqueta abrigo negro urbano streetwear frio",
        imagen: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        nombre: "Sneakers Neon Pulse",
        categoria: "zapatos",
        precio: 68.00,
        tallas: ["37", "38", "39", "40", "41"],
        tags: "zapatos tenis deportivos sneakers blanco urbano",
        imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        nombre: "Top Corset Satinado",
        categoria: "ropa",
        precio: 28.00,
        tallas: ["XS", "S", "M", "L"],
        tags: "blusa top fiesta noche elegante rosa",
        imagen: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        nombre: "Botas Plataforma Goth",
        categoria: "zapatos",
        precio: 75.00,
        tallas: ["36", "37", "38", "39"],
        tags: "botas negras plataforma cuero invierno alto",
        imagen: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        nombre: "Pantalón Cargo Street",
        categoria: "ropa",
        precio: 40.00,
        tallas: ["S", "M", "L"],
        tags: "pantalon cargo bolsillos urbano ancho",
        imagen: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        nombre: "Tacones Stiletto Crystal",
        categoria: "zapatos",
        precio: 62.00,
        tallas: ["36", "37", "38", "39", "40"],
        tags: "tacones sandalias fiesta elegante brillo",
        imagen: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
    }
];

// ESTADO DEL CARRITO (CARGADO DESDE LOCALSTORAGE)
let carrito = JSON.parse(localStorage.getItem("idols_cart")) || [];

// REFERENCIAS AL DOM
const productsGrid = document.getElementById("products-grid");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotalPrice = document.getElementById("cart-total-price");
const stylePrompt = document.getElementById("style-prompt");
const promptBtn = document.getElementById("prompt-btn");
const clearPromptBtn = document.getElementById("clear-prompt");
const searchStatus = document.getElementById("search-status");

// RENDERIZAR PRODUCTOS EN EL CATÁLOGO
function renderProductos(lista) {
    productsGrid.innerHTML = "";

    if (lista.length === 0) {
        productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#a0a0ab;">No encontramos prendas o zapatos con esa descripción. Intenta con otra palabra clave.</p>`;
        return;
    }

    lista.forEach(prod => {
        const opcionesTalla = prod.tallas.map(t => `<option value="${t}">${t}</option>`).join("");

        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" class="product-img">
            <div class="product-info">
                <span class="product-category">${prod.categoria}</span>
                <h3 class="product-title">${prod.nombre}</h3>
                <p class="product-price">$${prod.precio.toFixed(2)}</p>
                <div class="product-controls">
                    <select id="size-${prod.id}" class="size-select">
                        ${opcionesTalla}
                    </select>
                    <button class="add-to-cart-btn" onclick="agregarAlCarrito(${prod.id})">
                        Agregar
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// LÓGICA DEL PROMPT DE BÚSQUEDA
function ejecutarPrompt() {
    const query = stylePrompt.value.trim().toLowerCase();
    
    if (!query) {
        renderProductos(productos);
        searchStatus.textContent = "";
        clearPromptBtn.style.display = "none";
        return;
    }

    clearPromptBtn.style.display = "inline-block";
    const palabras = query.split(" ");

    const filtrados = productos.filter(prod => {
        const textoCompleto = `${prod.nombre} ${prod.categoria} ${prod.tags}`.toLowerCase();
        return palabras.some(palabra => textoCompleto.includes(palabra));
    });

    searchStatus.textContent = `Resultados para tu prompt: "${stylePrompt.value}" (${filtrados.length} encontrados)`;
    renderProductos(filtrados);
    document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
}

promptBtn.addEventListener("click", ejecutarPrompt);
stylePrompt.addEventListener("keypress", (e) => {
    if (e.key === "Enter") ejecutarPrompt();
});

clearPromptBtn.addEventListener("click", () => {
    stylePrompt.value = "";
    searchStatus.textContent = "";
    clearPromptBtn.style.display = "none";
    renderProductos(productos);
});

// FILTROS POR CATEGORÍA (TODOS / ROPA / ZAPATOS)
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const cat = btn.dataset.category;
        searchStatus.textContent = "";
        if (cat === "todos") {
            renderProductos(productos);
        } else {
            renderProductos(productos.filter(p => p.categoria === cat));
        }
    });
});

// FUNCIONES DEL CARRITO DINÁMICO
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const tallaSeleccionada = document.getElementById(`size-${id}`).value;

    const itemExistente = carrito.find(item => item.id === id && item.talla === tallaSeleccionada);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            talla: tallaSeleccionada,
            cantidad: 1
        });
    }

    actualizarCarrito();
    abrirCarrito();
}

function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    actualizarCarrito();
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    localStorage.setItem("idols_cart", JSON.stringify(carrito));
    cartItemsContainer.innerHTML = "";

    let totalItems = 0;
    let totalPrecio = 0;

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align:center; color:#a0a0ab; margin-top:2rem;">Tu carrito está vacío.</p>`;
    } else {
        carrito.forEach((item, index) => {
            totalItems += item.cantidad;
            totalPrecio += item.precio * item.cantidad;

            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="cart-item-details">
                    <h4>${item.nombre}</h4>
                    <span class="cart-item-meta">Talla: ${item.talla} | $${(item.precio * item.cantidad).toFixed(2)}</span>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="cambiarCantidad(${index}, -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button class="qty-btn" onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="eliminarItem(${index})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(div);
        });
    }

    cartCount.textContent = totalItems;
    cartTotalPrice.textContent = `$${totalPrecio.toFixed(2)}`;
}

// ENVIAR PEDIDO A WHATSAPP
document.getElementById("checkout-whatsapp").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Agrega productos al carrito antes de realizar el pedido.");
        return;
    }

    let mensaje = "Hola *Idols Cosmetics*, quiero realizar el siguiente pedido:%0A%0A";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `• ${item.cantidad}x ${item.nombre} (Talla: ${item.talla}) - $${subtotal.toFixed(2)}%0A`;
    });

    mensaje += `%0A*Total a pagar: $${total.toFixed(2)}*`;
    
    // Reemplaza el número por el WhatsApp real de la tienda
    const telefonoTienda = "584120000000";
    window.open(`https://wa.me/${telefonoTienda}?text=${mensaje}`, "_blank");
});

document.getElementById("clear-cart").addEventListener("click", () => {
    carrito = [];
    actualizarCarrito();
});

// ABRIR / CERRAR CARRITO Y MENÚ MÓVIL
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");

function abrirCarrito() {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
}

function cerrarCarrito() {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
}

document.getElementById("open-cart").addEventListener("click", abrirCarrito);
document.getElementById("close-cart").addEventListener("click", cerrarCarrito);
cartOverlay.addEventListener("click", cerrarCarrito);

document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("navbar").classList.toggle("active");
});

// INICIALIZAR PÁGINA
renderProductos(productos);
actualizarCarrito();