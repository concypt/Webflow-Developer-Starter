import autoComplete from '@tarekraafat/autocomplete.js';

// Show / Hide Purchaser 2 based on Joint or Singl
const purchaserSelect = document.querySelector('[data-element="Purchaser"]');
purchaserSelect?.addEventListener('change', (e: Event) => {
  e.preventDefault();
  const thisValue = (e.target as HTMLSelectElement).value;
  const jointElement = document.querySelector('[data-purchaser="Joint"]');
  if (thisValue === 'Joint') jointElement?.classList.remove('hide');
  if (thisValue === 'Single') jointElement?.classList.add('hide');
});

// Show / Hide Purchaser 2 based on Joint or Singl
const buyingEntityTypeSelect = document.querySelector('[data-element="Buying Entity Type"]');
buyingEntityTypeSelect?.addEventListener('change', (e: Event) => {
  e.preventDefault();
  const thisValue = (e.target as HTMLSelectElement).value;
  console.log(thisValue);
  const buyingEntityNameElement = document.querySelector('[data-element="Buying Entity Name"]');
  if (thisValue !== 'Named above') buyingEntityNameElement?.classList.remove('hide');
  if (thisValue === 'Named above' || thisValue === '')
    buyingEntityNameElement?.classList.add('hide');
});

// Get available listings
const properties: string[] = [];
document.querySelectorAll('.property-list-item').forEach((value: Element) => {
  if (value.textContent) properties.push(value.textContent);
});

// Create autoComplete instance
const autoCompleteJS = new autoComplete({
  placeHolder: 'Search for listing...',
  data: {
    src: properties,
    cache: true,
  },
  resultItem: {
    highlight: true,
  },
  events: {
    input: {
      selection: (event: Event) => {
        const selection = event.detail.selection.value;
        autoCompleteJS.input.value = selection;
      },
    },
  },
});

// User selected a value
document.querySelector('#autoComplete')?.addEventListener('selection', function (event) {
  // "event.detail" carries the autoComplete.js "feedback" object
  const tableName = event.detail.selection.value;
  getPropertyData(tableName).then((data) => processData(data));
});

// Load required Airtable
async function getPropertyData(tableName: string) {
  const tableURL =
    'https://api.airtable.com/v0/appWNf6XfqAR6n0oT/' + tableName + '?api_key=keyUxdcC40qxNrt1Y';
  const response = await fetch(tableURL);
  const responseJson = await response.json();
  return responseJson;
}

// Show loaded Airtables and utilise it in the dropdown for Unit selection
const processData = (data: any) => {
  const targetDropDown = document.querySelector<HTMLSelectElement>(
    '[data-element="AvailableUnits"]'
  );
  if (!targetDropDown) return;
  const optionsLength = targetDropDown.options.length - 1;
  let i;

  for (i = optionsLength; i >= 1; i--) {
    targetDropDown.remove(i);
  }

  const dataRecords = data['records'];
  console.log(dataRecords);
  //Unit string to Unit integer in data
  const dataUnits: string[] = [];

  dataRecords.forEach((obj) => {
    const newText =
      'Unit ' +
      obj.fields.Unit +
      ' - $' +
      obj.fields.Price +
      ' / ' +
      obj.fields.Land +
      'sqm / ' +
      obj.fields.Beds +
      ' / ' +
      obj.fields.Baths +
      ' / ' +
      obj.fields['Car Park'];
    dataUnits.push(newText); // use `+` to convert your string to a number
  });
  dataUnits.sort();
  dataUnits.forEach((unit) => {
    const newOption = document.createElement('option');
    newOption.text = unit + '';
    newOption.value = unit + '';
    targetDropDown?.add(newOption);
  });
};
//Addy address autocomplete
const addyKey = 'a95d779bec144d448ebcafccdec4ce61';
function initAddy() {
  const addyComplete = new AddyComplete(document.getElementById('main-address'));
  addyComplete.options.excludePostBox = false;
  addyComplete.fields = {
    address1: document.getElementById('main-address'),
    address2: document.getElementById('main-address2'),
    city: document.getElementById('main-city'),
    postcode: document.getElementById('main-postcode'),
    suburb: document.getElementById('main-suburb'),
  };
}

(function (d, w) {
  // Add the address autocomplete JavaScript
  const s = d.createElement('script');
  const addyUrl = 'https://www.addysolutions.com/address-lookup/1.6.2/js/addy.min.js';
  s.src = addyUrl + '?loadcss=true&enableLocation=false&country=nz&nzKey=' + addyKey;
  s.type = 'text/javascript';
  s.async = 1;
  s.onload = initAddy;
  d.body.appendChild(s);
})(document, window);

// Create Radios for lawyers and mortgage brokers

const createRadioElement = (
  radioElementTemplate: HTMLLabelElement,
  radioText: string,
  radioValue: string
) => {
  // Clone the template element
  const newRadio = radioElementTemplate?.cloneNode(true) as HTMLLabelElement;

  // Query inner elements
  const label = newRadio.querySelector('span');
  const radioInput = newRadio.querySelector('input');

  if (!label || !radioInput) return;
  // Populate inner elements
  label.textContent = radioText.toString();
  radioInput.value = radioValue.toString();
  return newRadio;
};
const renderRadio = (
  dataElement: NodeList,
  radioElementTemplate: HTMLLabelElement,
  radioType: string
) => {
  const radioElementParent = radioElementTemplate?.parentElement;
  radioElementTemplate?.remove();

  console.log(radioType);
  dataElement.forEach((value, key, array) => {
    const valuElement = value as HTMLDivElement;
    const radioText =
      'Yes - ' +
      valuElement.querySelector('[data-element="' + radioType + ' Location"]')?.textContent +
      (radioType !== 'Lawyer' ? ' ' : ': ') +
      valuElement.querySelector('[data-element="' + radioType + ' Name"]')?.textContent +
      ' at ' +
      valuElement.querySelector('[data-element="' + radioType + ' Firm"]')?.textContent +
      ' (' +
      valuElement.querySelector('[data-element="' + radioType + ' Email"]')?.textContent +
      ' / ' +
      valuElement.querySelector('[data-element="' + radioType + ' Phone"]')?.textContent +
      ' )';
    const radioValue =
      valuElement.querySelector('[data-element="' + radioType + ' Location"]')?.textContent +
      ': ' +
      valuElement.querySelector('[data-element="' + radioType + ' Name"]')?.textContent +
      ' at ' +
      valuElement.querySelector('[data-element="' + radioType + ' Firm"]')?.textContent;

    if (radioElementTemplate) {
      const newRadioElement = createRadioElement(radioElementTemplate, radioText, radioValue);

      if (newRadioElement) radioElementParent?.append(newRadioElement);

      if (key === array.length - 1) {
        let lastRadioElement;
        if (radioType === 'Lawyer') {
          lastRadioElement = createRadioElement(
            radioElementTemplate,
            'No - please fill in purchaser solicitors section below',
            'Custom Lawyer'
          );
        } else {
          lastRadioElement = createRadioElement(
            radioElementTemplate,
            'No - please fill in purchaser broker section below',
            'Custom Broker'
          );
        }

        if (lastRadioElement) radioElementParent?.append(lastRadioElement);
        const firstRadio = radioElementParent?.querySelector('.w-form-formradioinput:first-child');
        if (firstRadio) (firstRadio as HTMLInputElement).checked = true;
      }
    }
  });
};

const lawyerDataElement = document.querySelectorAll('[data-element="Lawyer Item"]');
const lawyerRadioTemplate = document.querySelector<HTMLLabelElement>(
  '[data-element="Lawyer Radio"]'
);
if (lawyerRadioTemplate) renderRadio(lawyerDataElement, lawyerRadioTemplate, 'Lawyer');

const brokerDataElement = document.querySelectorAll('[data-element="Broker Item"]');
const brokerRadioTemplate = document.querySelector<HTMLLabelElement>(
  '[data-element="Broker Radio"]'
);
if (brokerRadioTemplate) renderRadio(brokerDataElement, brokerRadioTemplate, 'Broker');

document.addEventListener('click', function (e) {
  const targetElement = e.target as HTMLInputElement;
  if (targetElement.classList.contains('lawyer-radio')) {
    if (targetElement.value === 'Custom Lawyer') {
      document.querySelector('[data-element="Custom Lawyer"]')?.classList.remove('hide');
    } else {
      document.querySelector('[data-element="Custom Lawyer"]')?.classList.add('hide');
    }
  }
  if (targetElement.classList.contains('broker-radio')) {
    if (targetElement.value === 'Custom Broker') {
      document.querySelector('[data-element="Custom Broker"]')?.classList.remove('hide');
    } else {
      document.querySelector('[data-element="Custom Broker"]')?.classList.add('hide');
    }
  }
});
