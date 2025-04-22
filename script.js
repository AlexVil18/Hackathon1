// 🔹 Persona 1: Funciones del navbar o scroll del hero
// (ejemplo: animaciones del banner al cargar)


// 🔹 Persona 2: Funciones para productos y agregar al carrito
// (ejemplo: manejar clicks en botones de productos)


// 🔹 Persona 3: Lógica del carrito
// (agregar, eliminar, calcular total)


// 🔹 Persona 4: Animaciones en secciones (scroll, aparición, etc)


// Contaco, llenar formulario de contacto, permite limpiar, evaluar que toda la info este ingresada correctamente

document.getElementById("contact-form").addEventListener("submit", function(e) { 
    e.preventDefault(); // asi no se recarga la página
  
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const status = document.getElementById("form-status");
  
    if (name && email && message) {
      status.textContent = "¡Gracias por tu mensaje, " + name + "!";
      this.reset();
    } else {
      status.textContent = "Por favor completa todos los campos.";
      status.style.color = "red";
    }
  });   