'use strict';

console.log('[Yamila Potel] diagnostico.js cargado correctamente.');

/* =========================================================
   Configuración general
   ========================================================= */

// Número de Yamila en formato internacional SIN "+" (ej: 5491122334455).
// Dejar vacío para abrir el selector de chats de WhatsApp con el mensaje listo.
var WHATSAPP_NUMBER = '1139053672';

// Clave de persistencia del borrador en localStorage
var STORAGE_KEY = 'yp_diagnostico_draft';

// Estado del cierre: fecha de envío y último mensaje armado
// (para mostrar la tarjeta y poder reenviar desde WhatsApp)
var STORAGE_ENVIADO_KEY = 'yp_diagnostico_enviado';

/* ------------------------------------------------------------
   MODO DE ENVÍO A WHATSAPP  (ver PLAN-BACKEND, sección 4.1)

     false (HOY, sin backend): manda el detalle COMPLETO de las
       respuestas con el formato prolijo agrupado por secciones.

     true (cuando G.A.S escriba en la planilla): manda solo la
       notificación corta "se actualizó la planilla..." con el
       link a la hoja. NO activar hasta conectar la Fase 2/3,
       porque hoy no se guarda nada y sería mentira.
   ------------------------------------------------------------ */
var MODO_NOTIFICACION = false;

// Link a la hoja de cálculo (solo se usa con MODO_NOTIFICACION
// = true). Dejar vacío hasta tener la hoja compartida.
var URL_PLANILLA = '';

/* =========================================================
   Estructura de los 6 pasos del cuestionario
   ========================================================= */

var STEPS = [
  {
    number: 1,
    id: 'datos-generales',
    title: 'Datos generales',
    fields: ['nombre', 'negocio', 'rubro', 'antiguedad', 'tipo_gestion']
  },
  {
    number: 2,
    id: 'organizacion-administrativa',
    title: 'Organización administrativa',
    fields: ['registro_movimientos', 'frecuencia_revision', 'sistema_registro']
  },
  {
    number: 3,
    id: 'ventas-facturacion',
    title: 'Ventas, facturación y cobranzas',
    fields: ['medios_cobro', 'pct_facturacion', 'nivel_facturacion']
  },
  {
    number: 4,
    id: 'bancos-dinero',
    title: 'Bancos y manejo del dinero',
    fields: ['cuenta_bancaria', 'cuenta_exclusiva', 'retiros_personales']
  },
  {
    number: 5,
    id: 'costos-finanzas',
    title: 'Costos y situación financiera',
    fields: ['punto_equilibrio', 'fondo_reserva', 'control_costos']
  },
  {
    number: 6,
    id: 'desafio-cierre',
    title: 'Principal desafío y cierre',
    fields: ['desafio_principal', 'comentarios']
  }
];

// Etiquetas legibles para el resumen y el mensaje de WhatsApp
var FIELD_LABELS = {
  nombre: 'Nombre',
  negocio: 'Emprendimiento',
  rubro: 'Rubro / Actividad',
  antiguedad: 'Antigüedad',
  tipo_gestion: 'Tipo de gestión',
  registro_movimientos: 'Registro de ingresos y egresos',
  frecuencia_revision: 'Frecuencia de revisión',
  sistema_registro: 'Sistema de registro',
  medios_cobro: 'Medios de cobro',
  pct_facturacion: 'Ventas que facturás',
  nivel_facturacion: 'Nivel de facturación',
  cuenta_bancaria: 'Cuenta bancaria',
  cuenta_exclusiva: 'Uso de la cuenta',
  retiros_personales: 'Retiros personales',
  punto_equilibrio: 'Punto de equilibrio',
  fondo_reserva: 'Fondo de reserva',
  control_costos: 'Control de costos',
  desafio_principal: 'Desafío principal',
  comentarios: 'Comentarios'
};

// Etiquetas CORTAS para el mensaje de WhatsApp (formato 4.1).
// Un valor vacío ("") muestra solo el dato sin etiqueta.
var SHORT_LABELS = {
  nombre: 'Nombre',
  negocio: 'Emprendimiento',
  rubro: 'Rubro',
  antiguedad: '',
  tipo_gestion: 'Gestión',
  registro_movimientos: 'Registro',
  frecuencia_revision: 'Revisión',
  sistema_registro: 'Sistema',
  medios_cobro: 'Cobros',
  pct_facturacion: 'Facturación',
  nivel_facturacion: 'Nivel',
  cuenta_bancaria: 'Cuenta',
  cuenta_exclusiva: 'Uso',
  retiros_personales: 'Retiros',
  punto_equilibrio: 'Punto de equilibrio',
  fondo_reserva: 'Fondo de reserva',
  control_costos: 'Control de costos',
  desafio_principal: 'Desafío principal',
  comentarios: 'Comentarios'
};

// Agrupación del mensaje por secciones. Cada "linea" junta varios
// campos con " · " y se omite completa si todos están vacíos.
var SECCIONES_MENSAJE = [
  {
    titulo: 'Datos',
    lineas: [
      ['rubro', 'antiguedad'],
      ['tipo_gestion']
    ]
  },
  {
    titulo: 'Organización',
    lineas: [
      ['registro_movimientos', 'frecuencia_revision', 'sistema_registro'],
      ['medios_cobro', 'pct_facturacion', 'nivel_facturacion']
    ]
  },
  {
    titulo: 'Dinero',
    lineas: [
      ['cuenta_bancaria', 'cuenta_exclusiva', 'retiros_personales'],
      ['punto_equilibrio', 'fondo_reserva', 'control_costos']
    ]
  }
];

// Estado global del wizard
var currentStep = 1;
var formData = {};

/* =========================================================
   Inicialización
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  var wizard = document.getElementById('form-wizard');

  if (!wizard) {
    return;
  }

  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  var stepKicker = document.getElementById('wizard-step-kicker');
  var summaryBox = document.getElementById('resumen-box');
  var summaryList = document.getElementById('resumen-lista');

  var panes = slice(wizard.querySelectorAll('.step-pane'));
  var steps = slice(document.querySelectorAll('.stepper-bar .step'));

  if (!panes.length) {
    return;
  }

  function slice(list) {
    return Array.prototype.slice.call(list);
  }

  function fieldContainer(field) {
    return field.closest('.form-field, .form-fieldset') || field;
  }

  /* -------------------------------------------------------
     Navegación y stepper
     ------------------------------------------------------- */

  function goToStep(stepNumber, shouldScroll) {
    if (stepNumber < 1 || stepNumber > STEPS.length) {
      return;
    }

    currentStep = stepNumber;

    panes.forEach(function (pane, index) {
      pane.classList.toggle('is-active', index === stepNumber - 1);
    });

    steps.forEach(function (step, index) {
      var isCompleted = index < stepNumber - 1;
      var isActive = index === stepNumber - 1;

      step.classList.toggle('completed', isCompleted);
      step.classList.toggle('active', isActive);
      step.classList.toggle('pending', index > stepNumber - 1);

      var number = step.querySelector('.step-number');
      if (number) {
        number.textContent = isCompleted ? '\u2713' : String(index + 1);
      }

      if (isActive) {
        step.setAttribute('aria-current', 'step');
      } else {
        step.removeAttribute('aria-current');
      }
    });

    if (stepKicker) {
      stepKicker.textContent = 'Paso ' + stepNumber + ' de ' + STEPS.length;
    }

    if (btnPrev) {
      btnPrev.disabled = stepNumber === 1;
    }

    if (btnNext) {
      btnNext.textContent = stepNumber === STEPS.length ? 'Enviar relevamiento' : 'Continuar';
    }

    if (stepNumber === STEPS.length) {
      renderSummary();
    }

    if (shouldScroll !== false) {
      wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* -------------------------------------------------------
     Tarjetas de opción (.option-card)
     ------------------------------------------------------- */

  function syncOptionCards() {
    slice(wizard.querySelectorAll('.option-card')).forEach(function (card) {
      var input = card.querySelector('input');
      if (input) {
        card.classList.toggle('selected', Boolean(input.checked));
      }
    });
  }

  slice(wizard.querySelectorAll('.option-card')).forEach(function (card) {
    card.addEventListener('click', function (event) {
      var input = card.querySelector('input');

      if (!input) {
        return;
      }

      // Controlamos el estado a mano para evitar la doble conmutación
      // que produce el mecanismo por defecto del <label>.
      event.preventDefault();

      if (input.type === 'checkbox') {
        input.checked = !input.checked;
      } else {
        input.checked = true;
      }

      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.focus();
    });
  });

  /* -------------------------------------------------------
     Persistencia en localStorage
     ------------------------------------------------------- */

  function collectFormData() {
    var data = {};
    var seen = {};

    slice(wizard.querySelectorAll('input[name], select[name], textarea[name]')).forEach(function (field) {
      var name = field.name;
      var type = (field.type || '').toLowerCase();

      if (type === 'radio') {
        if (seen['radio:' + name]) {
          return;
        }
        seen['radio:' + name] = true;
        var checkedRadio = wizard.querySelector('input[name="' + name + '"]:checked');
        if (checkedRadio) {
          data[name] = checkedRadio.value;
        }
        return;
      }

      if (type === 'checkbox') {
        if (seen['checkbox:' + name]) {
          return;
        }
        seen['checkbox:' + name] = true;
        var checkedBoxes = slice(wizard.querySelectorAll('input[name="' + name + '"]:checked'));
        if (checkedBoxes.length) {
          data[name] = checkedBoxes.map(function (box) {
            return box.value;
          });
        }
        return;
      }

      data[name] = field.value;
    });

    return data;
  }

  function saveDraft() {
    formData = collectFormData();

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.warn('[Yamila Potel] No se pudo guardar el borrador:', error);
    }
  }

  function restoreDraft() {
    var raw = null;

    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return;
    }

    if (!raw) {
      return;
    }

    try {
      formData = JSON.parse(raw) || {};
    } catch (error) {
      formData = {};
      return;
    }

    Object.keys(formData).forEach(function (name) {
      var value = formData[name];
      var fields = slice(wizard.querySelectorAll('[name="' + name + '"]'));

      if (!fields.length) {
        return;
      }

      fields.forEach(function (field) {
        var type = (field.type || '').toLowerCase();

        if (type === 'radio') {
          field.checked = field.value === value;
        } else if (type === 'checkbox') {
          field.checked = Array.isArray(value)
            ? value.indexOf(field.value) !== -1
            : value === field.value;
        } else {
          field.value = value;
        }
      });
    });

    syncOptionCards();
  }

  function handleFieldChange(event) {
    var field = event.target;

    if (!field || !field.name) {
      return;
    }

    if (event.type === 'change') {
      syncOptionCards();
    }

    clearFieldError(field);
    saveDraft();

    if (currentStep === STEPS.length) {
      renderSummary();
    }
  }

  wizard.addEventListener('input', handleFieldChange);
  wizard.addEventListener('change', handleFieldChange);

  /* -------------------------------------------------------
     Validaciones
     ------------------------------------------------------- */

  function collectInvalidFields(pane) {
    var invalid = [];
    var seen = {};

    slice(pane.querySelectorAll('[required]')).forEach(function (field) {
      var name = field.name;
      var type = (field.type || '').toLowerCase();

      if (type === 'radio' || type === 'checkbox') {
        if (seen[name]) {
          return;
        }
        seen[name] = true;

        var group = slice(pane.querySelectorAll('input[name="' + name + '"]'));
        var anyChecked = group.some(function (input) {
          return input.checked;
        });

        if (!anyChecked && group.length) {
          invalid.push({
            field: group[0],
            container: fieldContainer(group[0]),
            message: 'Seleccioná una opción para continuar.'
          });
        }
        return;
      }

      if (String(field.value || '').trim() === '') {
        invalid.push({
          field: field,
          container: fieldContainer(field),
          message: field.tagName === 'SELECT'
            ? 'Seleccioná una opción para continuar.'
            : 'Completá este campo para continuar.'
        });
      }
    });

    return invalid;
  }

  function clearFieldError(field) {
    if (!field) {
      return;
    }

    var container = fieldContainer(field);
    container.classList.remove('is-invalid');
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');

    var message = container.querySelector('.field-error');
    if (message && message.parentNode) {
      message.parentNode.removeChild(message);
    }
  }

  function clearStepErrors(pane) {
    slice(pane.querySelectorAll('.is-invalid')).forEach(function (element) {
      element.classList.remove('is-invalid');
    });
    slice(pane.querySelectorAll('.field-error')).forEach(function (message) {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    });
  }

  function showStepErrors(stepNumber) {
    var pane = panes[stepNumber - 1];
    var invalid = collectInvalidFields(pane);

    clearStepErrors(pane);

    if (!invalid.length) {
      return true;
    }

    invalid.forEach(function (item) {
      item.container.classList.add('is-invalid');
      item.field.classList.add('is-invalid');
      item.field.setAttribute('aria-invalid', 'true');

      var message = document.createElement('p');
      message.className = 'field-error';
      message.setAttribute('role', 'alert');
      message.textContent = item.message;
      item.container.appendChild(message);
    });

    invalid[0].field.focus();
    return false;
  }

  /* -------------------------------------------------------
     Resumen (paso 6)
     ------------------------------------------------------- */

  function optionText(name, value) {
    var group = slice(wizard.querySelectorAll('input[name="' + name + '"]'));

    for (var i = 0; i < group.length; i++) {
      if (group[i].value === value) {
        var card = group[i].closest('.option-card');
        var title = card && card.querySelector('.option-title');
        if (title) {
          return title.textContent.trim();
        }
      }
    }

    var select = wizard.querySelector('select[name="' + name + '"]');
    if (select) {
      for (var j = 0; j < select.options.length; j++) {
        if (select.options[j].value === value) {
          return select.options[j].text;
        }
      }
    }

    return value;
  }

  function displayValue(name, data) {
    var value = data[name];

    if (value === undefined || value === null || value === '') {
      return '';
    }

    if (Array.isArray(value)) {
      return value
        .map(function (item) {
          return optionText(name, item);
        })
        .join(' · ');
    }

    return optionText(name, value);
  }

  function renderSummary() {
    if (!summaryBox || !summaryList) {
      return;
    }

    var data = collectFormData();
    var count = 0;

    summaryList.textContent = '';

    STEPS.forEach(function (step) {
      step.fields.forEach(function (name) {
        var value = displayValue(name, data);

        if (!value) {
          return;
        }

        var row = document.createElement('div');

        var term = document.createElement('dt');
        term.textContent = FIELD_LABELS[name] || name;

        var description = document.createElement('dd');
        description.textContent = value;

        row.appendChild(term);
        row.appendChild(description);
        summaryList.appendChild(row);
        count++;
      });
    });

    summaryBox.hidden = count === 0;
  }

  /* -------------------------------------------------------
     Envío final por WhatsApp
     ------------------------------------------------------- */

  function fechaCorta() {
    var ahora = new Date();

    function p(n) {
      return n < 10 ? '0' + n : String(n);
    }

    return p(ahora.getDate()) + '/' + p(ahora.getMonth() + 1) + '/' +
      ahora.getFullYear() + ' ' + p(ahora.getHours()) + ':' + p(ahora.getMinutes());
  }

  function lineaCampo(name, data) {
    var value = displayValue(name, data);

    if (!value) {
      return '';
    }

    var label = SHORT_LABELS[name] !== undefined
      ? SHORT_LABELS[name]
      : (FIELD_LABELS[name] || name);

    return label ? label + ': ' + value : value;
  }

  // Detalle completo, agrupado por secciones (interim, MODO_NOTIFICACION = false)
  function buildMensajeDetalle(data) {
    var nombre = displayValue('nombre', data);
    var negocio = displayValue('negocio', data);

    var titulo = 'Diagnóstico Inicial';

    if (nombre && negocio) {
      titulo += ' — ' + nombre + ' (' + negocio + ')';
    } else if (nombre || negocio) {
      titulo += ' — ' + (nombre || negocio);
    }

    var lines = ['🟠 *' + titulo + '*'];

    SECCIONES_MENSAJE.forEach(function (seccion) {
      var cuerpo = [];

      seccion.lineas.forEach(function (campos) {
        var partes = [];

        campos.forEach(function (name) {
          var parte = lineaCampo(name, data);

          if (parte) {
            partes.push(parte);
          }
        });

        if (partes.length) {
          cuerpo.push('- ' + partes.join(' · '));
        }
      });

      if (cuerpo.length) {
        lines.push('', '*' + seccion.titulo + '*');

        cuerpo.forEach(function (linea) {
          lines.push(linea);
        });
      }
    });

    var desafio = displayValue('desafio_principal', data);
    if (desafio) {
      lines.push('', '⚠️ *Desafío principal*', '"' + desafio + '"');
    }

    var comentarios = displayValue('comentarios', data);
    if (comentarios) {
      lines.push('', '💬 *Comentarios*', '"' + comentarios + '"');
    }

    lines.push('', '_' + fechaCorta() + '_');
    return lines.join('\n');
  }

  // Notificación corta (MODO_NOTIFICACION = true, con G.A.S conectado)
  function buildNotificacion(data) {
    var nombre = displayValue('nombre', data);
    var negocio = displayValue('negocio', data);

    var lines = [
      '🔔 *Nueva consulta desde tu web*',
      'La planilla de clientes se actualizó con un nuevo *Diagnóstico Inicial*.',
      ''
    ];

    if (nombre || negocio) {
      var persona = [];

      if (nombre) {
        persona.push('*' + nombre + '*');
      }

      if (negocio) {
        persona.push(negocio);
      }

      lines.push('👤 ' + persona.join(' — '));
    }

    var contexto = [];
    var rubro = lineaCampo('rubro', data);
    var antiguedad = lineaCampo('antiguedad', data);

    if (rubro) {
      contexto.push(rubro);
    }

    if (antiguedad) {
      contexto.push(antiguedad);
    }

    if (contexto.length) {
      lines.push(contexto.join(' · '));
    }

    if (data.desafio_principal) {
      lines.push('⚠️ Desafío principal: "' + data.desafio_principal + '"');
    }

    if (URL_PLANILLA) {
      lines.push('', '📋 Planilla: ' + URL_PLANILLA);
    } else {
      console.warn('[Yamila Potel] Falta cargar URL_PLANILLA en js/diagnostico.js para la notificación.');
    }

    lines.push('', '_' + fechaCorta() + '_');
    return lines.join('\n');
  }

  function buildMessage() {
    var data = collectFormData();

    return MODO_NOTIFICACION ? buildNotificacion(data) : buildMensajeDetalle(data);
  }

  function submitSurvey() {
    for (var i = 1; i <= STEPS.length; i++) {
      if (collectInvalidFields(panes[i - 1]).length) {
        goToStep(i);
        showStepErrors(i);
        return;
      }
    }

    var message = buildMessage();
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

    if (!WHATSAPP_NUMBER) {
      console.warn(
        '[Yamila Potel] Falta configurar WHATSAPP_NUMBER en js/diagnostico.js. ' +
        'Se abre el selector de chats de WhatsApp con el mensaje listo.'
      );
    }

    // Guardamos el estado de "enviado" y el último mensaje para
    // la tarjeta de cierre (se ve al volver de WhatsApp o si el
    // enlace no llega a abrirse).
    var datosParaCierre = collectFormData();
    guardarEnviado(message, displayValue('nombre', datosParaCierre));

    formData = {};
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('[Yamila Potel] No se pudo limpiar el borrador:', error);
    }

    mostrarCierre();
    window.location.href = url;
  }

  /* -------------------------------------------------------
     Acciones del wizard
     ------------------------------------------------------- */

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      if (!showStepErrors(currentStep)) {
        return;
      }

      if (currentStep === STEPS.length) {
        submitSurvey();
        return;
      }

      goToStep(currentStep + 1);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      goToStep(currentStep - 1);
    });
  }

  /* -------------------------------------------------------
     Tarjeta de cierre (post-envío) — plan 4.1
     ------------------------------------------------------- */

  function guardarEnviado(mensaje, nombre) {
    try {
      window.localStorage.setItem(STORAGE_ENVIADO_KEY, JSON.stringify({
        fecha: new Date().toISOString(),
        nombre: nombre || '',
        mensaje: mensaje || ''
      }));
    } catch (error) {
      console.warn('[Yamila Potel] No se pudo guardar el estado de envío:', error);
    }
  }

  function leerEnviado() {
    try {
      var raw = window.localStorage.getItem(STORAGE_ENVIADO_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function limpiarEnviado() {
    try {
      window.localStorage.removeItem(STORAGE_ENVIADO_KEY);
    } catch (error) {
      console.warn('[Yamila Potel] No se pudo limpiar el estado de envío:', error);
    }
  }

  function mostrarCierre() {
    var enviado = leerEnviado();

    if (!enviado) {
      return false;
    }

    var stepper = document.querySelector('.stepper-container');
    var layout = document.querySelector('.diagnostico-layout');

    if (!layout || !layout.parentNode) {
      return false;
    }

    if (stepper) {
      stepper.hidden = true;
    }
    layout.hidden = true;

    var vieja = document.getElementById('diagnostico-cierre');
    if (vieja && vieja.parentNode) {
      vieja.parentNode.removeChild(vieja);
    }

    var card = document.createElement('div');
    card.className = 'cierre-card';
    card.id = 'diagnostico-cierre';

    var icono = document.createElement('span');
    icono.className = 'cierre-icono';
    icono.setAttribute('aria-hidden', 'true');
    icono.textContent = '✅';
    card.appendChild(icono);

    var titulo = document.createElement('h2');
    titulo.className = 'cierre-card-title';
    titulo.textContent = 'Relevamiento enviado';
    card.appendChild(titulo);

    var texto = document.createElement('p');
    texto.className = 'cierre-card-text';
    texto.textContent = 'Gracias' + (enviado.nombre ? ', ' + enviado.nombre : '') +
      '. Recibí tus respuestas del Cuestionario Diagnóstico. ' +
      'Yamila las revisa y te contacta a la brevedad.';
    card.appendChild(texto);

    var acciones = document.createElement('div');
    acciones.className = 'cierre-actions';

    var whatsapp = document.createElement('a');
    whatsapp.className = 'btn btn-primary';
    whatsapp.href = enviado.mensaje
      ? 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(enviado.mensaje)
      : 'https://wa.me/' + WHATSAPP_NUMBER;
    whatsapp.textContent = 'Escribir por WhatsApp \u2192';
    acciones.appendChild(whatsapp);

    var servicios = document.createElement('a');
    servicios.className = 'btn btn-secondary';
    servicios.href = 'servicios.html';
    servicios.textContent = 'Ver servicios \u2192';
    acciones.appendChild(servicios);

    card.appendChild(acciones);

    var nota = document.createElement('p');
    nota.className = 'cierre-nota';
    nota.appendChild(document.createTextNode('¿No se abrió WhatsApp? Escribime al '));

    var tel = document.createElement('a');
    tel.href = 'https://wa.me/549' + WHATSAPP_NUMBER;
    tel.textContent = WHATSAPP_NUMBER;
    nota.appendChild(tel);
    nota.appendChild(document.createTextNode('.'));
    card.appendChild(nota);

    var repetir = document.createElement('button');
    repetir.className = 'cierre-repetir';
    repetir.type = 'button';
    repetir.textContent = 'Hacer el cuestionario de nuevo';
    repetir.addEventListener('click', function () {
      limpiarEnviado();
      window.location.reload();
    });
    card.appendChild(repetir);

    layout.parentNode.insertBefore(card, stepper || layout);
    return true;
  }

  /* -------------------------------------------------------
     Arranque: restaurar borrador y pintar el estado inicial
     ------------------------------------------------------- */

  restoreDraft();
  goToStep(1, false);

  // Si ya envió antes (volvió de WhatsApp o reingresó a la
  // página), mostramos la tarjeta de cierre en vez del wizard.
  mostrarCierre();

  window.addEventListener('pageshow', function () {
    mostrarCierre();
  });
});
