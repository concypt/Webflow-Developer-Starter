//const tableName = encodeURI('24 Devonport lane - growcott freer');
import { removeChildElements } from "@finsweet/ts-utils";
console.log('loval');
//script for protecting the page
const memberstack = window.$memberstackDom;
const thisListing = window.location.href.split('/').pop();

memberstack.getCurrentMember().then(({ data: member }) => {
  if (!member) {
    protectPage();
  }
});

const protectPage = () => {
  let redirect = true;
  const reffererName = document.referrer.split('/').pop();

  const reffererCollectionItems = document.querySelectorAll('[data-element="refferer-item"]');
  if (!reffererCollectionItems) return;

  reffererCollectionItems.forEach((value) => {
    const name = value.querySelector('[data-element="refferer-name"]')?.textContent;
    const listing = value.querySelector('[data-element="refferer-listing"]')?.textContent;
    if (name === reffererName && listing === thisListing) {
      redirect = false;
    }
  });
  if (redirect) window.location.href = '/';
};
//end script for protecting the page

//Scrtipt for sharing the URL
const shareSlug = createString(21);
const newURL = 'https://' + window.location.hostname + '/fdiautvtnzxynmp/' + shareSlug;
const inputURL = document.querySelector<HTMLInputElement>('#input-url');
const inputShareSlug = document.querySelector<HTMLInputElement>('#input-share-slug');
const inputListing = document.querySelector<HTMLInputElement>('#input-listing');

if (inputURL) inputURL.value = newURL;
if (inputShareSlug) inputShareSlug.value = shareSlug;
if (inputListing && thisListing) inputListing.value = thisListing;

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      //success
    },
    function (err) {
      //err
      console.log(err);
    }
  );
}

const btnCopyURL = document.querySelector('#btn-copy-url');

btnCopyURL?.addEventListener('click', function (event) {
  copyTextToClipboard(newURL);
});

function createString(length: number) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//end Script for sharing the URL

declare const tableName: string;
//console.log(tableName);

async function getPropertyData(tableName: string) {
  const tableURL =
    'https://api.airtable.com/v0/appWNf6XfqAR6n0oT/' + tableName + '?api_key=keyUxdcC40qxNrt1Y&view=Website+View';
  const response = await fetch(tableURL);
  const responseJson = await response.json();
  return responseJson;
}

getPropertyData(tableName).then((data) => processData(data));

/**
 *
 * @param data
 * @returns
 */
const processData = (data: any) => {
  const dataRecords = data['records'];
  //console.log(dataRecords);
  dataRecords.forEach(obj => {
    if (obj.fields['Unit/Lot']) obj.fields['Unit/Lot'] = parseInt(obj.fields['Unit/Lot']); // use `+` to convert your string to a number
    if (obj.fields.Price) obj.fields.Price = '$' + numberWithCommas(obj.fields.Price);
  });

  //Get headers for columns
  const dataFirstRow = dataRecords[0].fields;
  const foundHeaders = Object.keys(dataFirstRow);
  const colHeaders = ['Unit/Lot', 'Price', 'Beds', 'Baths', 'Car Park', 'Status', 'Internal'];
  const difference = foundHeaders.filter((x) => colHeaders.indexOf(x) === -1);

  difference.forEach((item) => {
    if (item !== 'Discount') colHeaders.push(item);
  });

  //Get/Set tableRowElement
  const tableHeaderRow = document.querySelector<HTMLDivElement>('[data-element="table-row"]');
  const tableHeaderCell = tableHeaderRow?.firstChild;
  if (tableHeaderRow?.innerHTML) tableHeaderRow.innerHTML = '';

  let styleString = 'grid-template-columns: ';
  colHeaders.forEach((value) => {
    const newColHeader = tableHeaderCell?.cloneNode(true) as HTMLDivElement;
    newColHeader.textContent = value;
    newColHeader.setAttribute('data-sortelement', value);
    tableHeaderRow?.append(newColHeader);
    styleString = styleString + '1fr ';
  });

  document.querySelectorAll('.s-table-row-inner').forEach((value) => {
    value.setAttribute('style', styleString);
  });

  // clone table row element template
  const rowElementTemplate = document.querySelector<HTMLDivElement>(
    '[data-element="stocklist-row"]'
  );
  if (!rowElementTemplate) return;

  // get table row parent element
  const rowParentElement = rowElementTemplate?.parentElement;
  if (!rowParentElement) return;

  renderTable(dataRecords, rowElementTemplate, rowParentElement, 'Unit/Lot', 'asc', colHeaders);

  const tableHeaders = document.querySelectorAll('.s-table-head-item');
  tableHeaders.forEach((node) => {
    node.addEventListener('click', (e: Event) => {
      e.preventDefault();
      if (!node.classList.contains('selected')) {
        document.querySelector('.selected')?.classList.remove('asc');
        document.querySelector('.selected')?.classList.remove('desc');
        document.querySelector('.selected')?.classList.remove('selected');
      }
      //console.log(node.classList);
      if (node.classList.contains('desc') && !node.classList.contains('first')) {
        renderTable(
          dataRecords,
          rowElementTemplate,
          rowParentElement,
          node.dataset.sortelement,
          'asc',
          colHeaders
        );
        node.classList.add('selected', 'asc');
        node.classList.remove('desc');
      } else {
        renderTable(
          dataRecords,
          rowElementTemplate,
          rowParentElement,
          node.dataset.sortelement,
          'desc',
          colHeaders
        );
        if (!node.classList.contains('first')) {
          node.classList.add('selected', 'desc');
          node.classList.remove('asc');
        }
      }
    });
  });
};

const renderTable = (
  dataRecords: any,
  rowElementTemplate: HTMLDivElement,
  rowParentElement: HTMLElement,
  sortByField: string,
  sortOrder: string,
  colHeaders: string[]
) => {
  // remove rows from parent
  rowParentElement.innerHTML = '';

  // create and append row in parent element
  let even = false;

  const sortedDataRecords = sortData(dataRecords, sortByField, sortOrder);
  //console.log(sortedDataRecords);

  for (const key in sortedDataRecords) {
    if (sortedDataRecords.hasOwnProperty(key)) {
      const dataRecord = sortedDataRecords[key]['fields'];
      const newRow = createRow(rowElementTemplate, dataRecord, colHeaders);
      if (!newRow) return;
      if (even) newRow.classList.add('colored');
      even = !even;
      rowParentElement.append(newRow);
    }
  }
};

/**
 *
 * @param rowTemplate
 * @param rowData
 * @returns
 */
const createRow = (rowTemplate: HTMLDivElement, rowData: any, colHeaders: string[]) => {
  const newItem = rowTemplate.cloneNode(true) as HTMLDivElement;
  const tableCell = newItem.querySelector('.s-table-cell-item');
  const tableCellContainer = tableCell?.parentElement;
  if (!tableCellContainer) return;

  if (!tableCell) return;

  tableCellContainer.innerHTML = '';
  newItem.innerHTML = '';

  colHeaders.forEach((value) => {
    const newTableCell = tableCell.cloneNode(true) as HTMLDivElement;
    newTableCell.setAttribute('data-element', value);
    newTableCell.textContent = rowData[value];
    if (value === 'Internal' || value === 'Land') {
      newTableCell.innerHTML = rowData[value] + 'm <sup>2</sup>';
    }
    tableCellContainer.append(newTableCell);
  });
  newItem.append(tableCellContainer);

  return newItem;
};
const sortData = (data: any, sortByField: string, sortOrder: string) => {
  if (sortByField === 'Default') {
    return data;
  }
  //console.log(data);
  //use slice() to copy the array and not just make a reference
  const sortType: string = typeof data[0].fields[sortByField];
  if (!sortType) return;
  const sortedData = data.slice(0);
  if (sortType === 'number') {

    sortedData.sort(function (a: any, b: any) {
      let rValue;
      if (sortOrder === 'desc') {
        rValue = b.fields[sortByField] - a.fields[sortByField];
      } else if (sortOrder === 'asc') {
        rValue = a.fields[sortByField] - b.fields[sortByField];
      }
      return rValue;
    });
    //console.log('by date:');
  } else if (sortType === 'string' || sortType === 'Default') {
    //console.log('string');
    sortedData.sort(function (a: any, b: any) {
      const x = a.fields[sortByField].toLowerCase();
      const y = b.fields[sortByField].toLowerCase();
      let rValue;
      if (sortOrder === 'desc') {
        rValue = y < x ? -1 : y > x ? 1 : 0;
      } else if (sortOrder === 'asc') {
        rValue = x < y ? -1 : x > y ? 1 : 0;
      }
      return rValue;
    });
    //console.log('by name:');
  }
  //console.log(sortedData);
  return sortedData;
};

function numberWithCommas(x: string | number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Script for request a contract
document
  .querySelector<HTMLLinkElement>('#btn-request-a-contract')
  ?.addEventListener('click', (e) => {
    e.preventDefault();
    const propertyAddress = document.querySelector('[data-element="address"]')?.textContent;
    if (!propertyAddress) return;
    const baseURL = '/request-a-contract?address=' + encodeURIComponent(propertyAddress);
    window.location.href = baseURL;
  });
// end script request a contract
