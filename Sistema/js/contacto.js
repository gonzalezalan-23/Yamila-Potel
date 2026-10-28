'use strict';

console.log('[Yamila Potel] contacto.js cargado correctamente.');

/* =========================================================
   Configuración: campos extra por servicio
   ---------------------------------------------------------
   Cada clave coincide con el value del <option> del select
   #ayuda y con el parámetro ?servicio=... que llega desde
   la página de Servicios.

   Tipos de campo disponibles:
   - 'text'   : input de una línea
   - 'area'   : textarea
   - 'select' : desplegable (primeras opciones con valor '')
   - 'checks' : grupo de checkbox con tarjetas (.option-card)

   Ninguno de estos campos es obligatorio: el único campo
   requerido del formulario sigue siendo el mensaje final.
   ========================================================= */

var SERVICIOS_CONTACTO = {

  impositiva: {
    titulo: 'Asesoría Impositiva y Contable',
    intro: 'Contame un poco más sobre tu situación impositiva para que la consulta llegue más clara. Todos los campos son opcionales:',
    campos: [
      {
        tipo: 'select',
        nombre: 'situacion_fiscal',
        label: 'Situación fiscal actual',
        opciones: [
          { valor: '', texto: 'Seleccioná una opción (opcional)' },
          { valor: 'no_inscripto', texto: 'No estoy inscripto/inscripta aún' },
          { valor: 'monotributo', texto: 'Monotributo' },
          { valor: 'responsable_inscripto', texto: 'Responsable Inscripto' },
          { valor: 'no_seguro', texto: 'No estoy seguro/a' }
        ]
      },
      {
        tipo: 'select',
        nombre: 'objetivo_impositivo',
        label: '¿Qué querés lograr?',
        opciones: [
          { valor: '', texto: 'Seleccioná una opción (opcional)' },
          { valor: 'poner_al_dia', texto: 'Poner mi situación al día' },
          { valor: 'planificar', texto: 'Planificar y pagar lo que corresponde' },
          { valor: 'cambiar_regimen', texto: 'Cambiar de régimen o categoría' },
          { valor: 'orientacion', texto: 'No sé por dónde empezar' }
        ]
      },
      {
        tipo: 'area',
        nombre: 'detalle_impositivo',
        label: '¿Qué impuestos o presentaciones necesitás?',
        filas: 3,
        placeholder: 'Ej: inscripción en AFIP, declaraciones juradas, poner al día deudas...'
      }
    ]
  },

  costos: {
    titulo: 'Análisis de Costos y Rentabilidad',
    intro: 'Contame un poco más sobre tu negocio para que el análisis arranque con datos concretos. Todos los campos son opcionales:',
    campos: [
      {
        tipo: 'text',
        nombre: 'producto_analisis',
        label: '¿Qué producto o servicio querés analizar?',
        placeholder: 'Ej: mi línea de productos, el servicio de catering, el local...'
      },
      {
        tipo: 'select',
        nombre: 'calculo_precios',
        label: '¿Cómo calculás hoy tus precios de venta?',
        opciones: [
          { valor: '', texto: 'Seleccioná una opción (opcional)' },
          { valor: 'a_ojo', texto: 'A ojo, comparándome con el mercado' },
          { valor: 'sobre_costo', texto: 'Sumando un margen sobre el costo' },
          { valor: 'desactualizados', texto: 'Los definí hace tiempo y no los revisé' },
          { valor: 'no_se', texto: 'No sé cómo se calculan' }
        ]
      },
      {
        tipo: 'select',
        nombre: 'punto_equilibrio',
        label: '¿Sabés cuál es tu punto de equilibrio?',
        opciones: [
          { valor: '', texto: 'Seleccioná una opción (opcional)' },
          { valor: 'si', texto: 'Sí, lo tengo calculado' },
          { valor: 'mas_o_menos', texto: 'Más o menos' },
          { valor: 'no', texto: 'No' }
        ]
      }
    ]
  },

  flujo: {
    titulo: 'Gestión de Flujo de Caja y Bancos',
    intro: 'Contame cómo manejás hoy el dinero del negocio. Todos los campos son opcionales:',
    campos: [
      {
        tipo: 'checks',
        nombre: 'medios_cobro',
        label: '¿Por qué canales cobrás y pagás?',
        opciones: [
          { valor: 'efectivo', texto: 'Efectivo' },
          { valor: 'transferencias', texto: 'Transferencias' },
          { valor: 'mercado_pago', texto: 'Mercado Pago' },
          { valor: 'tarjetas', texto: 'Tarjetas de crédito / débito' }
        ]
      },
      {
        tipo: 'select',
        nombre: 'registro_movimientos',
        label: '¿Llevás registro de tus ingresos y egresos?',
        opciones: [
          { valor: '', texto: 'Seleccioná una opción (opcional)' },
          { valor: 'excel_papel', texto: 'Sí, en Excel o en papel' },
          { valor: 'aplicacion', texto: 'Sí, con una aplicación' },
          { valor: 'no_empezar', texto: 'No, pero quiero empezar' },
          { valor: 'no', texto: 'No' }
        ]
      },
      {
        tipo: 'area',
        nombre: 'complicacion_caja',
        label: '¿Qué es lo que más se te complica controlar?',
        filas: 3,
        placeholder: 'Ej: no sé cuánto tengo disponible, se mezclan gastos personales con los del negocio...'
      }
    ]
  },

  importaciones: {
    titulo: 'Costeo de Importaciones y Courier',
    intro: 'Contame los datos de tu operación de exterior para costearla con precisión. Todos los campos son opcionales:',
    campos: [
      {
        tipo: 'text',
        nombre: 'producto_importacion',
        label: '¿Qué mercadería comprás o querés comprar en el exterior?',
        placeholder: 'Ej: indumentaria, insumos, repuestos...'
      },
      {
        tipo: 'text',
        nombre: 'pais_origen',
        label: '¿De qué país importás?',
        placeholder: 'Ej: China, Brasil, Uruguay...'
      },
      {
        tipo: 'select',
        nombre: 'courier_asignado',
        label: '¿Ya tenés courier o despacho asignado?',
        opciones: [
          { valor: '', texto: 'Seleccioná una opción (opcional)' },
          { valor: 'si', texto: 'Sí' },
          { valor: 'no_orientacion', texto: 'No, necesito orientación' },
          { valor: 'no_se', texto: 'No sé cómo funciona' }
        ]
      },
      {
        tipo: 'select',
        nombre: 'moneda_operacion',
        label: '¿En qué moneda cotizan tus compras?',
        opciones: [
          { valor: '', texto: 'Seleccioná una opción (opcional)' },
          { valor: 'usd', texto: 'USD' },
          { valor: 'eur', texto: 'EUR' },
          { valor: 'otra', texto: 'Otra moneda' },
          { valor: 'no_defini', texto: 'Aún no definí' }
        ]
      }
    ]
  },

  'diagnostico-inicial': {
    titulo: 'Diagnóstico Inicial',
    promoDiagnostico: {
      titulo: '¿Antes de escribir, me contás tu situación?',
      texto: 'Podés completar el Cuestionario Diagnóstico (5 minutos) en lugar del mensaje: con tus respuestas preparo un relevamiento inicial y cuando nos contactemos ya arrancamos con datos concretos.',
      url: 'diagnostico.html',
      textoAcepta: 'Sí, quiero hacer el diagnóstico',
      textoRechaza: 'No, prefiero escribir mi consulta'
    },
    campos: []
  }

  // 'otras-consultas' no tiene campos extra ni avisos: si no está en
  // este objeto, el formulario no se extiende.

};

/* =========================================================
   Envío a WhatsApp — INTERIM (sin backend todavía)
   ---------------------------------------------------------
   Hoy el submit arma el mensaje (formato 4.1-C del plan) y
   abre wa.me con todo listo, dejando visible la tarjeta de
   cierre. Cuando entre G.A.S (Fase 2), primero se hará el
   POST (planilla + email de respaldo) y el WhatsApp se abrirá
   recién con la respuesta OK del servidor.
   ========================================================= */

var WHATSAPP_CONTACTO = '1139053672';
var STORAGE_CONTACTO_ENVIADO = 'yp_contacto_enviado';

// Etiquetas cortas de los campos dinámicos para el mensaje de
// WhatsApp. La clave es el "name" del campo; si falta, se usa
// la pregunta completa del formulario.
var CAMPO_CORTO = {
  situacion_fiscal: 'Situación fiscal',
  objetivo_impositivo: 'Objetivo',
  detalle_impositivo: 'Poner al día',
  producto_analisis: 'Producto',
  calculo_precios: 'Precios',
  punto_equilibrio: 'Punto de equilibrio',
  medios_cobro: 'Canales de cobro/pago',
  registro_movimientos: 'Registro',
  complicacion_caja: 'Me complica controlar',
  producto_importacion: 'Mercadería',
  pais_origen: 'País de origen',
  courier_asignado: 'Courier / despacho',
  moneda_operacion: 'Moneda'
};

/* =========================================================
   Lógica del formulario de contacto
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contact-form');
  var selectAyuda = document.getElementById('ayuda');
  var contenedor = document.getElementById('servicio-campos');

  if (!form || !selectAyuda || !contenedor) {
    return;
  }

  // Lo que la persona fue escribiendo en cada servicio, para no
  // perderlo si cambia de opción y vuelve atrás.
  // Formato: { impositiva: { situacion_fiscal: 'monotributo', ... } }
  var valoresGuardados = {};

  // Si la persona rechaza la sugerencia de hacer el diagnóstico,
  // no se le vuelve a mostrar mientras siga en la página.
  var diagnosticoRechazado = false;

  var servicioActual = '';

  /* -------------------------------------------------------
     Utilidades
     ------------------------------------------------------- */

  function slice(list) {
    return Array.prototype.slice.call(list);
  }

  function leerParametroServicio() {
    var query = window.location.search.replace(/^\?/, '');

    if (!query) {
      return '';
    }

    var pares = query.split('&');

    for (var i = 0; i < pares.length; i++) {
      var partes = pares[i].split('=');

      if (decodeURIComponent(partes[0]) === 'servicio') {
        return decodeURIComponent((partes[1] || '').replace(/\+/g, ' '));
      }
    }

    return '';
  }

  function servicioTieneCampos(clave) {
    return Boolean(
      SERVICIOS_CONTACTO[clave] &&
      SERVICIOS_CONTACTO[clave].campos &&
      SERVICIOS_CONTACTO[clave].campos.length
    );
  }

  function servicioTieneContenido(clave) {
    var config = SERVICIOS_CONTACTO[clave];

    return Boolean(config && (config.promoDiagnostico || servicioTieneCampos(clave)));
  }

  /* -------------------------------------------------------
     Creación de campos
     ------------------------------------------------------- */

  function crearEtiqueta(texto) {
    var label = document.createElement('label');

    label.appendChild(document.createTextNode(texto + ' '));

    var opcional = document.createElement('span');
    opcional.className = 'form-optional';
    opcional.textContent = '(opcional)';
    label.appendChild(opcional);

    return label;
  }

  function crearCampoTexto(field) {
    var wrap = document.createElement('div');
    wrap.className = 'form-field';

    var label = crearEtiqueta(field.label);
    label.setAttribute('for', field.nombre);

    var input = document.createElement('input');
    input.type = 'text';
    input.id = field.nombre;
    input.name = field.nombre;

    if (field.placeholder) {
      input.placeholder = field.placeholder;
    }

    wrap.appendChild(label);
    wrap.appendChild(input);
    return wrap;
  }

  function crearCampoArea(field) {
    var wrap = document.createElement('div');
    wrap.className = 'form-field';

    var label = crearEtiqueta(field.label);
    label.setAttribute('for', field.nombre);

    var textarea = document.createElement('textarea');
    textarea.id = field.nombre;
    textarea.name = field.nombre;
    textarea.rows = field.filas || 3;

    if (field.placeholder) {
      textarea.placeholder = field.placeholder;
    }

    wrap.appendChild(label);
    wrap.appendChild(textarea);
    return wrap;
  }

  function crearCampoSelect(field) {
    var wrap = document.createElement('div');
    wrap.className = 'form-field';

    var label = crearEtiqueta(field.label);
    label.setAttribute('for', field.nombre);

    var select = document.createElement('select');
    select.id = field.nombre;
    select.name = field.nombre;

    (field.opciones || []).forEach(function (opcion) {
      var option = document.createElement('option');
      option.value = opcion.valor;
      option.textContent = opcion.texto;
      select.appendChild(option);
    });

    wrap.appendChild(label);
    wrap.appendChild(select);
    return wrap;
  }

  function crearCampoChecks(field) {
    var fieldset = document.createElement('fieldset');
    fieldset.className = 'form-fieldset';

    var legend = document.createElement('legend');
    legend.appendChild(document.createTextNode(field.label + ' '));

    var opcional = document.createElement('span');
    opcional.className = 'form-optional';
    opcional.textContent = '(opcional)';
    legend.appendChild(opcional);

    fieldset.appendChild(legend);

    var grupo = document.createElement('div');
    grupo.className = 'option-group option-group--2';

    (field.opciones || []).forEach(function (opcion) {
      var label = document.createElement('label');
      label.className = 'option-card option-card--check';

      var input = document.createElement('input');
      input.type = 'checkbox';
      input.name = field.nombre;
      input.value = opcion.valor;

      var titulo = document.createElement('span');
      titulo.className = 'option-title';
      titulo.textContent = opcion.texto;

      label.appendChild(input);
      label.appendChild(titulo);
      grupo.appendChild(label);
    });

    fieldset.appendChild(grupo);
    return fieldset;
  }

  function crearCampo(field) {
    if (field.tipo === 'select') {
      return crearCampoSelect(field);
    }

    if (field.tipo === 'checks') {
      return crearCampoChecks(field);
    }

    if (field.tipo === 'area') {
      return crearCampoArea(field);
    }

    return crearCampoTexto(field);
  }

  /* -------------------------------------------------------
     Sugerencia opcional del Cuestionario Diagnóstico
     ------------------------------------------------------- */

  function crearPromoDiagnostico(promo) {
    var wrap = document.createElement('div');
    wrap.className = 'contacto-promo';

    var titulo = document.createElement('h3');
    titulo.className = 'contacto-promo-title';
    titulo.textContent = promo.titulo;
    wrap.appendChild(titulo);

    var texto = document.createElement('p');
    texto.className = 'contacto-promo-text';
    texto.textContent = promo.texto;
    wrap.appendChild(texto);

    var acciones = document.createElement('div');
    acciones.className = 'contacto-promo-actions';

    var aceptar = document.createElement('a');
    aceptar.className = 'btn btn-primary';
    aceptar.href = promo.url;
    aceptar.textContent = promo.textoAcepta + ' →';
    acciones.appendChild(aceptar);

    var rechazar = document.createElement('button');
    rechazar.className = 'btn btn-outline contacto-promo-rechazar';
    rechazar.type = 'button';
    rechazar.textContent = promo.textoRechaza;
    acciones.appendChild(rechazar);

    wrap.appendChild(acciones);
    return wrap;
  }

  function crearNotaDiagnostico() {
    var nota = document.createElement('p');
    nota.className = 'contacto-promo-nota';

    nota.appendChild(document.createTextNode('Si cambiás de idea, el '));

    var enlace = document.createElement('a');
    enlace.href = 'diagnostico.html';
    enlace.textContent = 'Cuestionario Diagnóstico';
    nota.appendChild(enlace);

    nota.appendChild(document.createTextNode(' sigue disponible cuando quieras.'));

    return nota;
  }

  /* -------------------------------------------------------
     Tarjetas de opción (.option-card) — mismo criterio que
     diagnostico.js: el estado visual se maneja con la clase
     .selected para no depender de :has().
     ------------------------------------------------------- */

  function sincronizarCards() {
    slice(contenedor.querySelectorAll('.option-card')).forEach(function (card) {
      var input = card.querySelector('input');

      if (input) {
        card.classList.toggle('selected', Boolean(input.checked));
      }
    });
  }

  /* -------------------------------------------------------
     Guardar y restaurar lo que la persona fue completando
     ------------------------------------------------------- */

  function guardarValores() {
    if (!servicioTieneCampos(servicioActual)) {
      return;
    }

    var datos = {};

    slice(contenedor.querySelectorAll('input[type="checkbox"][name]')).forEach(function (box) {
      if (!Array.isArray(datos[box.name])) {
        datos[box.name] = [];
      }

      if (box.checked) {
        datos[box.name].push(box.value);
      }
    });

    slice(contenedor.querySelectorAll('input[type="text"][name], select[name], textarea[name]'))
      .forEach(function (campo) {
        datos[campo.name] = campo.value;
      });

    valoresGuardados[servicioActual] = datos;
  }

  function restaurarValores(clave) {
    var datos = valoresGuardados[clave];

    if (!datos) {
      return;
    }

    Object.keys(datos).forEach(function (nombre) {
      var valor = datos[nombre];
      var campos = slice(contenedor.querySelectorAll('[name="' + nombre + '"]'));

      campos.forEach(function (campo) {
        if (campo.type === 'checkbox') {
          campo.checked = Array.isArray(valor) && valor.indexOf(campo.value) !== -1;
        } else {
          campo.value = valor;
        }
      });
    });

    sincronizarCards();
  }

  /* -------------------------------------------------------
     Render de los campos según el servicio elegido
     ------------------------------------------------------- */

  function renderCampos() {
    var clave = selectAyuda.value;
    servicioActual = servicioTieneContenido(clave) ? clave : '';

    contenedor.textContent = '';

    if (!servicioActual) {
      contenedor.hidden = true;
      return;
    }

    var config = SERVICIOS_CONTACTO[servicioActual];

    if (config.intro) {
      var intro = document.createElement('p');
      intro.className = 'servicio-campos-intro';
      intro.textContent = config.intro;
      contenedor.appendChild(intro);
    }

    if (config.promoDiagnostico) {
      if (diagnosticoRechazado) {
        contenedor.appendChild(crearNotaDiagnostico());
      } else {
        contenedor.appendChild(crearPromoDiagnostico(config.promoDiagnostico));
      }
    }

    config.campos.forEach(function (field) {
      contenedor.appendChild(crearCampo(field));
    });

    contenedor.hidden = false;
    restaurarValores(servicioActual);
  }

  /* -------------------------------------------------------
     Eventos
     ------------------------------------------------------- */

  selectAyuda.addEventListener('change', function () {
    guardarValores();
    renderCampos();
  });

  contenedor.addEventListener('click', function (event) {
    var objetivo = event.target;

    if (!objetivo || !contenedor.contains(objetivo)) {
      return;
    }

    // Botón "No, prefiero escribir mi consulta": se oculta la
    // sugerencia y el formulario de contacto sigue intacto.
    if (objetivo.closest && objetivo.closest('.contacto-promo-rechazar')) {
      diagnosticoRechazado = true;
      renderCampos();
      return;
    }

    // Clic en las tarjetas de opción: mismo manejo manual que en
    // diagnostico.js para evitar la doble conmutación del <label>.
    var card = objetivo.closest ? objetivo.closest('.option-card') : null;

    if (!card) {
      return;
    }

    var input = card.querySelector('input');

    if (!input) {
      return;
    }

    event.preventDefault();

    if (input.type === 'checkbox') {
      input.checked = !input.checked;
    } else {
      input.checked = true;
    }

    input.dispatchEvent(new Event('change', { bubbles: true }));
    sincronizarCards();
    input.focus();
  });

  /* -------------------------------------------------------
     Arranque: ?servicio=... desde la página de Servicios
     ------------------------------------------------------- */

  var parametro = leerParametroServicio();

  if (parametro) {
    if (!SERVICIOS_CONTACTO[parametro]) {
      console.warn('[Yamila Potel] Servicio desconocido en ?servicio=' + parametro + '. Se muestra el formulario genérico.');
    } else {
      selectAyuda.value = parametro;

      if (selectAyuda.value === parametro) {
        renderCampos();
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(
          '[Yamila Potel] El servicio "' + parametro + '" existe en js/contacto.js ' +
          'pero no tiene su <option> en el select #ayuda de contacto.html.'
        );
      }
    }
  } else {
    contenedor.hidden = true;
  }

  /* -------------------------------------------------------
     Mensaje de la consulta (formato 4.1-C del plan)
     ------------------------------------------------------- */

  function fechaCorta() {
    var ahora = new Date();

    function p(n) {
      return n < 10 ? '0' + n : String(n);
    }

    return p(ahora.getDate()) + '/' + p(ahora.getMonth() + 1) + '/' +
      ahora.getFullYear() + ' ' + p(ahora.getHours()) + ':' + p(ahora.getMinutes());
  }

  function tituloServicio() {
    var clave = selectAyuda.value;

    if (SERVICIOS_CONTACTO[clave] && SERVICIOS_CONTACTO[clave].titulo) {
      return SERVICIOS_CONTACTO[clave].titulo;
    }

    if (selectAyuda.selectedIndex > -1) {
      return selectAyuda.options[selectAyuda.selectedIndex].text;
    }

    return 'Consulta general';
  }

  function etiquetaDinamica(nombre) {
    return CAMPO_CORTO[nombre] || nombre;
  }

  function lineasCamposDinamicos() {
    var lineas = [];
    var gruposVistos = {};

    // Se recorre en orden DOM = orden visual del formulario
    slice(contenedor.querySelectorAll('[name]')).forEach(function (campo) {
      var tipo = (campo.type || '').toLowerCase();

      if (tipo === 'checkbox') {
        if (gruposVistos[campo.name]) {
          return;
        }
        gruposVistos[campo.name] = true;

        var grupo = slice(contenedor.querySelectorAll('input[type="checkbox"][name="' + campo.name + '"]'));
        var tildeados = grupo.filter(function (item) {
          return item.checked;
        });

        if (!tildeados.length) {
          return;
        }

        var textos = tildeados.map(function (item) {
          var card = item.closest ? item.closest('.option-card') : null;
          var titulo = card ? card.querySelector('.option-title') : null;
          return titulo ? titulo.textContent.trim() : item.value;
        });

        lineas.push('- ' + etiquetaDinamica(campo.name) + ': ' + textos.join(', '));
        return;
      }

      if (campo.tagName === 'SELECT') {
        if (!campo.value) {
          return;
        }

        var opcion = campo.options[campo.selectedIndex];
        lineas.push('- ' + etiquetaDinamica(campo.name) + ': ' + (opcion ? opcion.text : campo.value));
        return;
      }

      var valor = String(campo.value || '').trim();
      if (valor) {
        lineas.push('- ' + etiquetaDinamica(campo.name) + ': ' + valor);
      }
    });

    return lineas;
  }

  function armarMensajeConsulta() {
    var nombre = (document.getElementById('nombre').value || '').trim();
    var email = (document.getElementById('email').value || '').trim();
    var telefono = (document.getElementById('telefono').value || '').trim();
    var mensaje = (document.getElementById('mensaje').value || '').trim();

    var lines = ['🟠 *Nueva consulta — ' + tituloServicio() + '*', ''];

    var persona = [];
    if (nombre) {
      persona.push('*' + nombre + '*');
    }
    if (telefono) {
      persona.push(telefono);
    }
    if (persona.length) {
      lines.push(persona.join(' · '));
    }
    if (email) {
      lines.push(email);
    }

    var campos = lineasCamposDinamicos();
    if (campos.length) {
      lines.push('', '*Del formulario*');
      campos.forEach(function (linea) {
        lines.push(linea);
      });
    }

    if (mensaje) {
      lines.push('', '💬 *Mensaje*', '"' + mensaje + '"');
    }

    lines.push('', '_Enviado desde la web · ' + fechaCorta() + '_');
    return lines.join('\n');
  }

  /* -------------------------------------------------------
     Tarjeta de cierre del contacto (plan 4.1)
     ------------------------------------------------------- */

  function guardarContactoEnviado(mensaje, servicio) {
    try {
      window.localStorage.setItem(STORAGE_CONTACTO_ENVIADO, JSON.stringify({
        fecha: new Date().toISOString(),
        servicio: servicio,
        mensaje: mensaje
      }));
    } catch (error) {
      console.warn('[Yamila Potel] No se pudo guardar el estado del envío:', error);
    }
  }

  function leerContactoEnviado() {
    try {
      var raw = window.localStorage.getItem(STORAGE_CONTACTO_ENVIADO);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function mostrarCierreConsulta(enviado) {
    if (!form || !form.parentNode || !enviado) {
      return false;
    }

    form.hidden = true;

    var vieja = document.getElementById('contacto-cierre');
    if (vieja && vieja.parentNode) {
      vieja.parentNode.removeChild(vieja);
    }

    var card = document.createElement('div');
    card.className = 'cierre-card';
    card.id = 'contacto-cierre';

    var icono = document.createElement('span');
    icono.className = 'cierre-icono';
    icono.setAttribute('aria-hidden', 'true');
    icono.textContent = '✅';
    card.appendChild(icono);

    var titulo = document.createElement('h2');
    titulo.className = 'cierre-card-title';
    titulo.textContent = 'Consulta enviada';
    card.appendChild(titulo);

    var texto = document.createElement('p');
    texto.className = 'cierre-card-text';
    texto.textContent = 'Gracias por escribir. Tu consulta por "' + (enviado.servicio || '') +
      '" llegó bien: Yamila te contacta a la brevedad.';
    card.appendChild(texto);

    var acciones = document.createElement('div');
    acciones.className = 'cierre-actions';

    var whatsapp = document.createElement('a');
    whatsapp.className = 'btn btn-primary';
    whatsapp.href = enviado.mensaje
      ? 'https://wa.me/' + WHATSAPP_CONTACTO + '?text=' + encodeURIComponent(enviado.mensaje)
      : 'https://wa.me/' + WHATSAPP_CONTACTO;
    whatsapp.textContent = 'También por WhatsApp \u2192';
    acciones.appendChild(whatsapp);

    var servicios = document.createElement('a');
    servicios.className = 'btn btn-secondary';
    servicios.href = 'servicios.html';
    servicios.textContent = 'Ver servicios \u2192';
    acciones.appendChild(servicios);

    card.appendChild(acciones);

    var repetir = document.createElement('button');
    repetir.className = 'cierre-repetir';
    repetir.type = 'button';
    repetir.textContent = 'Hacer otra consulta';
    repetir.addEventListener('click', function () {
      try {
        window.localStorage.removeItem(STORAGE_CONTACTO_ENVIADO);
      } catch (error) {
        console.warn('[Yamila Potel] No se pudo limpiar el estado del envío:', error);
      }
      window.location.reload();
    });
    card.appendChild(repetir);

    form.parentNode.insertBefore(card, form);
    return true;
  }

  /* -------------------------------------------------------
     Envío (INTERIM: solo WhatsApp, sin backend todavía)
     ------------------------------------------------------- */

  form.addEventListener('submit', function (event) {
    // La validación nativa (campos required) ya corrió antes
    // de que llegue este evento.
    event.preventDefault();

    var servicio = tituloServicio();
    var mensaje = armarMensajeConsulta();

    guardarContactoEnviado(mensaje, servicio);
    mostrarCierreConsulta(leerContactoEnviado());

    window.location.href = 'https://wa.me/' + WHATSAPP_CONTACTO + '?text=' + encodeURIComponent(mensaje);
  });

  // Si ya envió antes (volvió de WhatsApp o reingresó), la
  // tarjeta de cierre reemplaza al formulario.
  var contactoPrevio = leerContactoEnviado();
  if (contactoPrevio) {
    mostrarCierreConsulta(contactoPrevio);
  }

  window.addEventListener('pageshow', function () {
    var estado = leerContactoEnviado();
    if (estado) {
      mostrarCierreConsulta(estado);
    }
  });
});
