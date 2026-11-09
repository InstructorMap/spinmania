# Café Zodíaco Android

Aplicación móvil de Café Zodíaco: una experiencia de cafetería y universo zodiacal, empaquetada para Android mediante WebView.

## Experiencia actual — versión 2.1.0
- Identidad visual nocturna con órbitas, planeta central, cielo estrellado animado y microanimaciones.
- Perfil de los doce signos y bebida astral personalizada.
- Misión diaria de cinco estrellas con recompensa de polvo estelar.
- Atlas coleccionable de los doce signos.
- Carta visual conceptual del café.
- Navegación inferior y diseño adaptable a móviles.
- Progreso guardado localmente en el dispositivo.

## Límites de esta versión
No requiere cuenta ni backend. Todavía no incluye sincronización entre dispositivos, pedidos, pagos, precios reales ni promociones comerciales activas. El polvo estelar es gratuito, no comprable, no retirable y no canjeable por dinero o productos. La carta es demostrativa.

## Compilación
Abrir en Android Studio con JDK 17+ y Android SDK 35. La APK se genera en `app/build/outputs/apk/debug/app-debug.apk`. GitHub Actions compila, verifica firma/alineación y prueba instalación y arranque en un emulador Android 14.
