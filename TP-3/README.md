
# Diseño UX-UI 2026 - FCyT
---
## 📋 Descripción General

Este repositorio contiene la resolución completa del trabajo práctico de **HTML y CSS** con 20 ejercicios progresivos, divididos en 3 niveles de dificultad:

- **Bloque 1 (Ejercicios 1-7)**: Nivel Básico
- **Bloque 2 (Ejercicios 8-14)**: Nivel Intermedio  
- **Bloque 3 (Ejercicios 15-20)**: Nivel Medio/Avanzado

---

## 📁 Estructura de Carpetas

```
proyecto-html-css/
│
├── ejercicio-1/
│   ├── index.html
│   └── styles.css
│
├── ejercicio-2/
│   ├── index.html
│   └── styles.css
│
├── ejercicio-3/
│   ├── index.html
│   └── styles.css
│
... (ejercicios 4 al 20)
│
└── README.md (este archivo)
```

Cada ejercicio tiene su propia carpeta con archivos **index.html** y **styles.css** separados.

---

---

## 🎨 Decisiones de Diseño Transversales

### **1. Estructura de Carpetas**
Cada ejercicio en su propia carpeta para claridad y modularidad. Facilita la evaluación individual y el entendimiento de la progresión.

### **2. HTML Semántico**
- Uso de etiquetas semánticas: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`
- Labels correctamente asociados en formularios
- Atributos `alt` en todas las imágenes
- Validación W3C sin errores

### **3. CSS Moderno**
- **CSS3**: Flexbox, Grid, variables, animaciones
- **Metodología**: BEM ligero para nombrar clases
- **Organización**: Comentarios dividiendo secciones lógicas
- **Reutilización**: Variables CSS para colores y espaciado

### **4. Responsividad**
- Enfoque Desktop First (en ej. 15+) o Mobile First (según contexto)
- Múltiples breakpoints (1200px, 768px, 480px)
- Imágenes fluidas (width: 100%)
- Viewport meta tag en todos los HTML

### **5. Accesibilidad**
- Contraste de colores adecuado
- Labels vinculados a inputs
- Orden lógico de elementos
- Navegación accesible

### **6. Paleta de Colores**
- Primario: #3498db (azul)
- Secundario: #2ecc71 (verde) / #667eea (púrpura)
- Neutros: #2c3e50 (gris oscuro), #ecf0f1 (gris claro)
- Funcional: #e74c3c (error rojo), #f39c12 (warning naranja)

### **7. Transiciones y Animaciones**
- Todas las transiciones con `transition: all 0.3s ease`
- Animaciones suaves (no abruptas)
- Timing functions apropiadas: ease, ease-in-out, linear

---
## ✨ Características Destacadas

### **Ejercicio 7**: Demuestra claramente la diferencia entre `box-sizing: content-box` y `box-sizing: border-box`

### **Ejercicio 11**: Múltiples ejemplos de pseudo-clases y pseudo-elementos con efecto visual

### **Ejercicio 14**: Tema oscuro dinámico usando variables CSS y localStorage

### **Ejercicio 17**: Menú hamburguesa completamente funcional SIN JavaScript

### **Ejercicio 18**: Galería masonry que se auto-distribuye sin espacios vacíos

### **Ejercicio 20**: Landing page profesional lista para ser publicada

---
## 👨‍💻 Decisiones Técnicas Relevantes

### **¿Por qué Desktop First en Ejercicio 15?**
El enfoque Desktop First es más natural cuando el sitio fue diseñado para desktop primero. Reduce el número de media queries innecesarias.

### **¿Por qué usar Checkbox para menú hamburguesa?**
Demuestra que la funcionalidad no siempre requiere JavaScript. La solución CSS pura es:
- Más rápida
- Sin dependencias
- Accesible
- Educativo

### **¿Por qué Grid Masonry con `dense`?**
`grid-auto-flow: dense` es la solución nativa de CSS para distribuir items de tamaños desiguales sin huecos, sin necesidad de librerías como Masonry.js
