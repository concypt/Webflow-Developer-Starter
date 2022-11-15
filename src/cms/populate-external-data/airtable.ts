//const tableName = encodeURI('24 Devonport lane - growcott freer');

declare const tableName: string;
//console.log(tableName);

async function getPropertyData(tableName: string) {
  const tableURL =
    'https://api.airtable.com/v0/appWNf6XfqAR6n0oT/' + tableName + '?api_key=keyUxdcC40qxNrt1Y';
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
  //Unit string to Unit integer in data
  dataRecords.forEach(obj => {
    obj.fields.Unit = parseInt(obj.fields.Unit); // use `+` to convert your string to a number
  });

  // clone table row element template
  const rowElementTemplate = document.querySelector<HTMLDivElement>(
    '[data-element="stocklist-row"]'
  );
  if (!rowElementTemplate) return;

  // get table row parent element
  const rowParentElement = rowElementTemplate?.parentElement;
  if (!rowParentElement) return;

  renderTable(dataRecords, rowElementTemplate, rowParentElement, 'Defualt', 'Defualt');

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
          'asc'
        );
        node.classList.add('selected', 'asc');
        node.classList.remove('desc');
      } else {
        renderTable(
          dataRecords,
          rowElementTemplate,
          rowParentElement,
          node.dataset.sortelement,
          'desc'
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
  sortOrder: string
) => {
  // remove rows from parent
  rowParentElement.innerHTML = '';

  // create and append row in parent element
  let even = false;

  const sortedDataRecords = sortData(dataRecords, sortByField, sortOrder);

  for (const key in sortedDataRecords) {
    if (sortedDataRecords.hasOwnProperty(key)) {
      const dataRecord = sortedDataRecords[key]['fields'];
      const newRow = createRow(rowElementTemplate, dataRecord);
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
const createRow = (rowTemplate: HTMLDivElement, rowData: any) => {
  const newItem = rowTemplate.cloneNode(true) as HTMLDivElement;

  const address = newItem.querySelector<HTMLDivElement>('[data-element="address"]');
  const unit = newItem.querySelector<HTMLDivElement>('[data-element="unit"]');
  const price = newItem.querySelector<HTMLDivElement>('[data-element="price"]');
  const beds = newItem.querySelector<HTMLDivElement>('[data-element="beds"]');
  const baths = newItem.querySelector<HTMLDivElement>('[data-element="baths"]');
  const carpark = newItem.querySelector<HTMLDivElement>('[data-element="carpark"]');
  const status = newItem.querySelector<HTMLDivElement>('[data-element="status"]');
  const internal = newItem.querySelector<HTMLDivElement>('[data-element="internal"]');
  const external = newItem.querySelector<HTMLDivElement>('[data-element="external"]');

  if (address) address.textContent = rowData['Unit/Lot Number and Address'];
  if (unit) unit.textContent = rowData['Unit'];
  if (price) price.textContent = rowData['Price'];
  if (beds) beds.textContent = rowData['Beds'];
  if (baths) baths.textContent = rowData['Baths'];
  if (carpark) carpark.textContent = rowData['Car Park'];
  if (status) status.textContent = rowData['Status'];
  if (internal) internal.textContent = rowData['Internal'];
  if (external) external.textContent = rowData['Land Size'];

  return newItem;
};
const sortData = (data: any, sortByField: string, sortOrder: string) => {
  if (sortByField === 'Default') {
    return data;
  }
  //console.log(data);
  // use slice() to copy the array and not just make a reference
  const sortType: string = typeof data[0].fields[sortByField];
  if (!sortType) return;
  const sortedData = data.slice(0);
  if (sortType === 'number') {
    console.log('number');
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
    console.log('string');
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
