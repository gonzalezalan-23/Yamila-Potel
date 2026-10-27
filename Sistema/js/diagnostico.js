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

  function buildMessage() {
    var data = collectFormData();
    var lines = ['Hola Yamila, completé el Diagnóstico Inicial en tu web.', ''];

    STEPS.forEach(function (step) {
      step.fields.forEach(function (name) {
        var value = displayValue(name, data);

        if (!value) {
          return;
        }

        lines.push('- ' + (FIELD_LABELS[name] || name) + ': ' + value);
      });
    });

    return lines.join('\n');
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

    if (!WHATSAPP_NUMBER) {
      console.warn(
        '[Yamila Potel] Falta configurar WHATSAPP_NUMBER en js/diagnostico.js. ' +
        'Se abre el selector de chats de WhatsApp con el mensaje listo.'
      );
    }

    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

    formData = {};
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('[Yamila Potel] No se pudo limpiar el borrador:', error);
    }

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
     Arranque: restaurar borrador y pintar el estado inicial
     ------------------------------------------------------- */

  restoreDraft();
  goToStep(1, false);
});
