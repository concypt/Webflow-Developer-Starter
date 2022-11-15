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

// Create Radios for lawyers
const lawyerDataElement = document.querySelectorAll('[data-element="Lawyer Item"]');
const radioElementTemplate = document.querySelector<HTMLLabelElement>('[data-element="Radio"]');
const radioElementParent = radioElementTemplate?.parentElement;
radioElementTemplate?.remove();
//if (!radioElementTemplate) return;

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

lawyerDataElement.forEach((value, key, array) => {
  const lawyerText =
    'Yes - ' +
    value.querySelector('[data-element="Lawyer Location"]')?.textContent +
    ': ' +
    value.querySelector('[data-element="Lawyer Name"]')?.textContent +
    ' at ' +
    value.querySelector('[data-element="Lawyer Firm"]')?.textContent +
    ' (' +
    value.querySelector('[data-element="Lawyer Email"]')?.textContent +
    ' / ' +
    value.querySelector('[data-element="Lawyer Phone"]')?.textContent +
    ' )';
  const lawyerValue =
    value.querySelector('[data-element="Lawyer Location"]')?.textContent +
    ': ' +
    value.querySelector('[data-element="Lawyer Name"]')?.textContent +
    ' at ' +
    value.querySelector('[data-element="Lawyer Firm"]')?.textContent;

  if (radioElementTemplate) {
    const newRadioElement = createRadioElement(radioElementTemplate, lawyerText, lawyerValue);
    if (newRadioElement) radioElementParent?.append(newRadioElement);

    if (key === array.length - 1) {
      const lastRadioElement = createRadioElement(
        radioElementTemplate,
        'No - please fill in purchaser solicitors section below',
        'No'
      );
      if (lastRadioElement) radioElementParent?.append(lastRadioElement);
    }
  }
});
// const lastRadio = radioElementTemplate?.cloneNode(true) as HTMLLabelElement;

// // Query inner elements
// const lastLabel = lastRadio.querySelector('span');
// const lastRadioInput = lastRadio.querySelector('input');
// if (!lastLabel || !lastRadioInput) return;
// lastLabel.textContent = 'No - please fill in purchaser solicitors section below';
// lastRadioInput.value = 'No';
// radioElementParent?.append(lastRadio);
//}

// //   DOM elements
// const searchInput = document.querySelector('[data-element="Listing"]');
// const suggestions = document.querySelector('[data-element="Suggestions"]');

// // Event listeners
// searchInput?.addEventListener('change', displayMatches);
// searchInput?.addEventListener('keyup', displayMatches);

// document.addEventListener('click', function (e) {
//   console.log('clicked');
//   const targetElement = e.target as Element;
//   if (targetElement.classList.contains('property-name')) {
//     if (suggestions) suggestions.innerHTML = '';
//     if (searchInput && targetElement.textContent)
//       (searchInput as HTMLInputElement).value = targetElement.textContent;
//   }
// });

// // function selectProperty(e: Event) {
// // }

// function findMatches(wordToMatch: string, properties: string[]) {
//   // use filter function
//   return properties.filter((property) => {
//     // here we need to figure out if the city or state matches what was searched
//     //         return  property.state.match/wordToMatch/i) // Well this syntax won't work with variables
//     const regex = new RegExp(wordToMatch, 'gi'); //g = global, i = insensitive
//     return property.match(regex);
//   });
// }

// // Display matches
// function displayMatches(e: Event) {
//   //    console(this.value)
//   const inputValue = (e.target as HTMLInputElement).value;
//   if (inputValue.trim() === '') {
//     if (suggestions) suggestions.innerHTML = '';
//     return;
//   }
//   // Get your data first, then worry about the rest.
//   const matchArray = findMatches(inputValue, properties);
//   // console.log(matchArray)
//   // Build your html
//   const html = matchArray
//     .map((property) => {
//       const regex = new RegExp(inputValue, 'gi');
//       // Use replace() and template literals to change the found word to new dom element function and pick up highlighted styles
//       const propertyName = property.replace(regex, `<span class="hl">${inputValue}</span>`);
//       // Use template literals. Newlines and spaces are added. Use ${} to execute variables or functions
//       // You couls skip the above and just return `<li><span class="population">${place.population}</span></li>` to test
//       return `
//       <li>
//         <span class="property-name">${propertyName}</span>
//       </li>
//       `;
//     })
//     .join(''); // map returns an array, so do this to turn it into a string
//   if (suggestions) suggestions.innerHTML = html;
// }
