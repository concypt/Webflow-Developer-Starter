//import { restartWebflow } from '@finsweet/ts-utils';
import type { CMSList } from 'src/types/CMSList';
import type { CMSFilters } from '../../types/CMSFilters';

//import type { Product } from './types';

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  async (filtersInstances: CMSFilters[]) => {
    // Get the filters instance
    const [filtersInstance] = filtersInstances;

    // Get the list instance
    const { listInstance } = filtersInstance;

    if (!listInstance) return;
    // Get the filter criteria for completion dropdown

    const completionFilterCriterias = getFilterCriteria(listInstance, 'Completion');

    console.log(completionFilterCriterias);

    // Get the dropdown template element
    const filtersDropdownTemplateElement = filtersInstance.form.querySelector<HTMLSelectElement>(
      '[data-element="completion"]'
    );

    if (!filtersDropdownTemplateElement) return;

    const filtersOptionTemplateElement = filtersDropdownTemplateElement.options[0];

    if (!filtersOptionTemplateElement) return;

    // Remove existing options
    const l = filtersDropdownTemplateElement.options.length - 1;
    let i;

    for (i = l; i >= 1; i--) {
      filtersDropdownTemplateElement.remove(i);
    }

    // Collect applicable dropdown options
    const quaters = ['Q1 2023', 'Q2 2023', 'Q3 2023'];

    // Create new dropdown and append it in the parent wrapper
    for (const quater of quaters) {
      const newFilter = createFilter(quater, filtersOptionTemplateElement);
      if (!newFilter) continue;

      filtersDropdownTemplateElement.append(newFilter);
    }

    // Sync the CMSFilters instance to read the new filters data
  },
]);

/**
 * Creates a new radio filter from the template element.
 * @param category The filter value.
 * @param templateElement The template element.
 *
 * @returns A new category radio filter.
 */
const createFilter = (selectOption: string, templateElement: HTMLOptionElement) => {
  // Clone the template element
  const newFilter = templateElement.cloneNode(true) as HTMLOptionElement;

  // Populate inner elements
  newFilter.textContent = selectOption;
  newFilter.value = selectOption;

  return newFilter;
};

/**
 * Get filter criteria values from CMSList
 * @param listInstance
 * @param filterValueSelector The template element.
 *
 * @returns Return array containing values.
 */
const getFilterCriteria = (listInstance: CMSList, filterValueSelector: string) => {
  const newFilterCriteria = [];
  const listInstanceItems = listInstance.items;

  if (!listInstance) return;

  for (const listInstanceItem of listInstanceItems) {

    const innerElement = listInstanceItem.element.querySelector<HTMLDivElement>(
      '[fs-cmsfilter-field="' + filterValueSelector + '"]'
    );
    if (!innerElement?.innerText) continue;
    newFilterCriteria.push(dateToQuater(innerElement.innerText));
  }
  //const newFilterCriteria = listInstance.items;

  if (!newFilterCriteria) return;
  return newFilterCriteria;
};

/**
 * Convert dates to quarters
 * @param d Date
 *
 * @returns Quarter.
 */
const dateToQuater = (d: string) => {
  const dateParts = d.split('-');

  const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  let m = Math.floor(date.getMonth() / 3) + 1;
  m -= m > 4 ? 4 : 0;
  const y = date.getFullYear();
  return 'Q' + m + ' ' + y;
};

/**
 * Get filter criteria values from CMSList
 * @param listInstance
 * @param filterValueSelector The template element.
 *
 * @returns Return array containing values.
 */
 const getFilterCriteria = (listInstance: CMSList, filterValueSelector: string) => {
  const newFilterCriteria = [];
  const listInstanceItems = listInstance.items;

  if (!listInstance) return;

  for (const listInstanceItem of listInstanceItems) {

    const innerElement = listInstanceItem.element.querySelector<HTMLDivElement>(
      '[fs-cmsfilter-field="' + filterValueSelector + '"]'
    );
    if (!innerElement?.innerText) continue;
    newFilterCriteria.push(dateToQuater(innerElement.innerText));
  }
  //const newFilterCriteria = listInstance.items;

  if (!newFilterCriteria) return;
  return newFilterCriteria;
};

// window.Webflow ||= [];
// window.Webflow.push(() => {
//   restartWebflow();
// });
