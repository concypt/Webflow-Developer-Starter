// import autoComplete from 'src/thirdparty/autocomplete.js';
declare const autoComplete: any;
declare const AddyComplete: any;

//memberstack stuff goes here
//console.log('ppapi chooooolo');
//memberstack stuff ends here

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
  //console.log(thisValue);
  const buyingEntityNameElement = document.querySelector('[data-element="Buying Entity Name"]');
  if (thisValue !== 'Named above') buyingEntityNameElement?.classList.remove('hide');
  if (thisValue === 'Named above' || thisValue === '')
    buyingEntityNameElement?.classList.add('hide');
});

// Get available listings
const properties: object[] = [];
document.querySelectorAll('[data-element="listing-item"]').forEach((value: Element) => {
  const listingAddress = value.querySelector('[data-element="listing-address"]')?.textContent;
  const listingAirtable = value.querySelector('[data-element="listing-airtable"]')?.textContent;
  const property = { address: listingAddress, airtable: listingAirtable };

  if (property) properties.push(property);
});
//console.log(properties)
// Create autoComplete instance
const autoCompleteJS = new autoComplete({
  placeHolder: 'Search for listing...',
  data: {
    src: properties,
    keys: ['address'],
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
  const feedback = event.detail;
  autoCompleteJS.input.blur();
  // Prepare User's Selected Value
  const selection = feedback.selection.value[feedback.selection.key];
  // Replace Input value with the selected value
  autoCompleteJS.input.value = selection;
  // Console log autoComplete data feedback
  const tableName = feedback.selection.value['airtable'];

  getPropertyData(tableName).then((data) => processData(data));
});

// Second autoComplte for agent selection
// Get available agents
const agents: string[] = [];
document.querySelectorAll('[data-element="agent-item"]').forEach((value: Element) => {
  const agentFullName =
    value.querySelector('[data-element="agent-first-name"]')?.textContent +
    ' ' +
    value.querySelector('[data-element="agent-last-name"]')?.textContent;

  if (agentFullName) agents.push(agentFullName);
});

const autoCompleteJSAgents = new autoComplete({
  selector: '#Purchaser-Agent',
  placeHolder: 'Search for Agents...',
  data: {
    src: agents,
    cache: true,
  },
  resultItem: {
    highlight: true,
  },
  events: {
    input: {
      selection: (event: any) => {
        const selection = event.detail.selection.value;
        autoCompleteJSAgents.input.value = selection;
      },
    },
  },
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
  //console.log(dataRecords);
  //Unit string to Unit integer in data
  const dataUnits: string[] = [];

  if (!dataRecords) return;
  dataRecords.forEach((obj: any) => {
    const newText =
      'Unit ' +
      obj.fields['Unit/Lot'] +
      ' - $' +
      numberWithCommas(obj.fields.Price) +
      ' / ' +
      (obj.fields.Land ? obj.fields.Land : '') +
      (obj.fields.Land ? 'sqm / ' : '') +
      obj.fields.Beds +
      ' / ' +
      obj.fields.Baths +
      ' / ' +
      obj.fields['Car Park'];
    dataUnits.push(newText); // use `+` to convert your string to a number
  });
  dataUnits.sort(naturalCompare);

  //console.log(dataUnits);
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

  //console.log(radioType);
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
      ') ';
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

function numberWithCommas(x: string | number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function naturalCompare(a, b) {
  const ax = [],
    bx = [];

  a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
    ax.push([$1 || Infinity, $2 || '']);
  });
  b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
    bx.push([$1 || Infinity, $2 || '']);
  });

  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();
    const nn = an[0] - bn[0] || an[1].localeCompare(bn[1]);
    if (nn) return nn;
  }

  return ax.length - bx.length;
}

//document ready
$(() => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
  const value = params.address; // "some_value"
  const inputAddress = document.querySelector('[data-element="Listing"]');
  (inputAddress as HTMLInputElement).value = value;
  let tableName = '';
  properties.forEach((property) => {
    if (property.address === value) {
      tableName = property.airtable;
    }
  });
  if (tableName) {
    getPropertyData(tableName).then((data) => processData(data));
  }
});
