/* ============================================================
   FundaDron — datos de marca y catálogo
   Edita precios, textos y configuración AQUÍ.
   ============================================================ */
(function () {
  "use strict";

  window.__FUNDADRON__ = {
    name: "FundaDron",
    tagline: "Protección impresa en 3D para tu dron DJI.",

    config: {
      /* Client ID de PayPal (developer.paypal.com → Apps & Credentials).
         AHORA: Client ID de LIVE (cobros reales).
         Para volver a pruebas, pon aquí el Client ID de la pestaña "Sandbox".
         Mientras esté vacío, el carrito mostrará un aviso de configuración. */
      paypalClientId: "ATI1hjDn2DTJQexeNuf8b5Jar4SKrgHHOI1zKs6asHGkP2hqG6S4NQxK0JdHjJLeMcplSqgH3GlHR7TT",
      currency: "EUR",
      /* Envío */
      shippingPickup: 3.95,         /* punto de recogida / locker InPost (único método) */
      freeShippingFrom: 49,         /* envío gratis a partir de */
      pickupMapUrl: "https://www.inpost.es/encuentra-tu-punto",
      /* Código de comercio del widget de puntos Mondial Relay / InPost.
         "BDTEST13" es el código de PRUEBAS oficial (el mapa y los puntos son
         reales). Cuando te registres gratis como comercio en mondialrelay.com
         o inpost.es, sustitúyelo por tu código propio. */
      mondialRelayBrand: "BDTEST13",
      email: "fundadron@gmail.com",
      instagram: "",                /* p.ej. "https://instagram.com/fundadron" */
      makerworld: "https://makerworld.com/@LUCKYCO"
    },

    products: [
      {
        id: "funda-neo2-completa",
        gallery: 4,
        name: "Funda DJI Neo 2 completa",
        sub: "Dron + cargador + mando RC",
        price: 34.95,
        oldPrice: null,
        model: "neo2",
        art: "case-full",
        badge: "Más vendida",
        star: true,
        desc: "Estuche rígido a medida con espacio para el dron DJI Neo 2, el cargador con las baterías y el mando RC. Cierre de cremallera, impermeable y resistente a golpes. Se vende solo la funda.",
        features: ["Hueco a medida para el dron", "Compartimento cargador + baterías", "Espacio para el mando RC", "Material impermeable antigolpes"]
      },
      {
        id: "funda-neo2-cargador",
        gallery: 4,
        name: "Funda DJI Neo 2 + cargador",
        sub: "Dron + soporte de cargador",
        price: 21.95,
        oldPrice: null,
        model: "neo2",
        art: "case",
        badge: null,
        desc: "Funda de transporte para el DJI Neo 2 con soporte integrado para el cargador y las baterías. Compacta, resistente y con compartimentos para hélices y accesorios.",
        features: ["Espacio a medida para el dron", "Soporte para cargador y baterías", "Compartimento para hélices", "Cierre seguro de cremallera"]
      },
      {
        id: "funda-neo2-baterias",
        gallery: 4,
        name: "Funda DJI Neo 2",
        sub: "Dron + baterías",
        price: 21.95,
        oldPrice: null,
        model: "neo2",
        art: "case",
        badge: null,
        desc: "Estuche rígido compacto diseñado a medida para proteger tu DJI Neo 2 y sus baterías. Ligero, resistente a golpes y arañazos, fácil de llevar a cualquier parte.",
        features: ["Espacio a medida para el dron", "Compartimentos para baterías", "Resistente a golpes y arañazos", "Compacto y ligero"]
      },
      {
        id: "funda-neo",
        gallery: 3,
        name: "Funda DJI Neo",
        sub: "Primer modelo",
        price: 18.95,
        oldPrice: null,
        model: "neo",
        art: "case",
        badge: null,
        desc: "Funda de transporte a medida para el dron DJI Neo (primer modelo). Impermeable, resistente y compacta: protege contra golpes, arañazos, polvo y humedad.",
        features: ["Ajuste exacto al DJI Neo", "Impermeable y antigolpes", "Cierre seguro", "Protege de polvo y humedad"]
      },
      {
        id: "soporte-magsafe",
        gallery: 6,
        name: "Soporte MagSafe mando DJI RC",
        sub: "Brazo articulado para móvil",
        price: 14.95,
        oldPrice: null,
        model: "rc",
        art: "magsafe",
        badge: "Imán incluido",
        desc: "Soporte articulado con imán MagSafe súper fuerte para colocar el teléfono en el mando DJI RC. Ajusta el ángulo de pantalla, se pliega para transportarlo y deja libres todos los botones.",
        features: ["Imán MagSafe de sujeción firme", "Brazo articulado y plegable", "Acceso libre a los botones", "Mejora la visibilidad al volar"]
      },
      {
        id: "cinturon-neo",
        gallery: 5,
        name: "Soporte cinturón DJI Neo",
        sub: "Clip de transporte + fijación bici",
        price: 12.95,
        oldPrice: null,
        model: "neo",
        art: "belt",
        badge: null,
        desc: "Clip de transporte para llevar el DJI Neo en el cinturón, bolsillo o mochila. El dron se pone y quita en segundos, con protección de cámara integrada e incluye fijación para bici o tubo.",
        features: ["Se clipa y retira en segundos", "Protección de cámara integrada", "Cinturón, bolsillo o mochila", "Incluye fijación para bici"]
      },
      {
        id: "cinturon-neo2",
        gallery: 6,
        name: "Soporte cinturón DJI Neo 2",
        sub: "Clip de transporte + fijación bici",
        price: 12.95,
        oldPrice: null,
        model: "neo2",
        art: "belt",
        badge: null,
        desc: "Soporte de transporte para el DJI Neo 2 con sujeción firme por cuatro puntos. Se clipa con una mano, protege la cámara y es compatible con o sin rejillas de protección.",
        features: ["Sujeción firme en 4 puntos", "Se clipa con una mano", "Protección de cámara integrada", "Incluye fijación para bici"]
      },
      {
        id: "protector-antenas",
        gallery: 6,
        name: "Protector de antenas DJI Neo 2",
        sub: "Para el mando RC",
        price: 6.95,
        oldPrice: null,
        model: "neo2",
        art: "antenna",
        badge: "Top regalo",
        desc: "Protector rígido que se clipa al instante sobre el módulo de antenas del mando RC del DJI Neo 2. Evita dobleces y roturas al llevar el mando en el bolsillo o la bolsa.",
        features: ["Protege de dobleces y roturas", "Se clipa sin herramientas", "Monta y desmonta sin quitarlo", "Ultraligero y compacto"]
      }
    ],

    bundle: {
      id: "pack-neo2",
      name: "Pack completo DJI Neo 2",
      items: ["Funda completa (dron + cargador + mando)", "Soporte de cinturón Neo 2", "Protector de antenas"],
      price: 44.95,
      separate: 54.85,
      desc: "Todo lo que tu Neo 2 necesita para salir de casa: la funda completa, el clip de cinturón y el protector de antenas. Ahorra 9,90 € frente a comprarlos por separado."
    },

    faqs: [
      {
        q: "¿Cuánto tarda el envío?",
        a: "Imprimimos y preparamos tu pedido en 24-48 h. Lo recibes en el punto de recogida o locker InPost que elijas (3,95 €, ~3 días, con aviso por SMS). Envío gratis a partir de 49 €. Siempre con seguimiento."
      },
      {
        q: "¿Puedo pagar con tarjeta sin tener PayPal?",
        a: "Sí. Al pulsar el botón de pago, PayPal te ofrece la opción «Tarjeta de débito o crédito»: puedes pagar como invitado sin crear ninguna cuenta."
      },
      {
        q: "¿De qué material están hechas las fundas?",
        a: "Se imprimen en 3D con filamento PLA+ 2.0 de alta resistencia: rígido, ligero y muy resistente a golpes. Cada pieza se revisa a mano antes de enviarse."
      },
      {
        q: "¿Sirven para mi dron?",
        a: "Cada funda está diseñada a medida para su modelo exacto (DJI Neo, DJI Neo 2 o mando RC). Si tienes dudas sobre compatibilidad, escríbenos antes de comprar y te lo confirmamos."
      },
      {
        q: "¿Puedo devolver mi pedido?",
        a: "Tienes 14 días naturales desde la entrega para desistir de tu compra, sin necesidad de justificación, según la ley de consumidores. Consulta la política de devoluciones para los detalles."
      },
      {
        q: "¿Los diseños son originales?",
        a: "Sí. Vendemos piezas impresas a partir de diseños originales de LUCKYCO (makerworld.com/@LUCKYCO), con licencia para su venta. No somos DJI ni estamos afiliados a DJI."
      }
    ]
  };
})();