//import { restartWebflow } from '@finsweet/ts-utils';
import type { CMSList } from 'src/types/CMSList';

import type { CMSFilters } from '../../types/CMSFilters';

//import type { Product } from './types';

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  async (filterInstances: CMSFilters[]) => {
    // Get the filters instance
    const [filterInstance] = filterInstances;

    // Get the list instance
    const { listInstance } = filterInstance;
    if (!listInstance) return;

    // Get the filter criteria for completion dropdown
    const completionFilterCriterias = getFilterCriteria(listInstance, 'Completion');
    if (!completionFilterCriterias) return;

    // Get the dropdown template element for completion filter
    const filtersDropdownTemplateElement = filterInstance.form.querySelector<HTMLSelectElement>(
      '[data-element="completion"]'
    );
    if (!filtersDropdownTemplateElement) return;

    // Populate options for completion dropdown inside dropdown template
    populateOptions(filtersDropdownTemplateElement, completionFilterCriterias);

    // Increments of $100k, starting from $400,000 all the way to $1,500,000
    const priceFilterCriterias: string[] = [];
    for (let i = 400000; i <= 1500000; i = i + 100000) {
      priceFilterCriterias.push(i.toString());
    }
    if (!priceFilterCriterias) return;

    // Get the dropdown template element for price filter
    const priceMinDropdownTemplateElement = filterInstance.form.querySelector<HTMLSelectElement>(
      '[data-element="price-dropdown-min"]'
    );
    if (!priceMinDropdownTemplateElement) return;
    const priceMaxDropdownTemplateElement = filterInstance.form.querySelector<HTMLSelectElement>(
      '[data-element="price-dropdown-max"]'
    );
    if (!priceMaxDropdownTemplateElement) return;

    //  // Populate options for price dropdown inside dropdown template
    populateOptions(priceMinDropdownTemplateElement, priceFilterCriterias);
    populateOptions(priceMaxDropdownTemplateElement, priceFilterCriterias);

    // Get criteria for checkboxes for beds
    const bedsCheckBoxOptions = getChecksCriteria(
      listInstance,
      'criteria-beds',
      'min-beds',
      'max-beds'
    );
    if (!bedsCheckBoxOptions) return;

    // Get criteria for checkboxes for baths
    const bathsCheckBoxOptions = getChecksCriteria(
      listInstance,
      'criteria-baths',
      'min-baths',
      'max-baths'
    );
    if (!bathsCheckBoxOptions) return;

    // Get the beds checkbox template element
    const bedsFilterTemplateElement = filterInstance.form.querySelector<HTMLLabelElement>(
      '[data-element="beds-filter"]'
    );
    if (!bedsFilterTemplateElement) return;

    // Get the baths checkbox template element
    const bathsFilterTemplateElement = filterInstance.form.querySelector<HTMLLabelElement>(
      '[data-element="baths-filter"]'
    );
    if (!bathsFilterTemplateElement) return;

    // Get the parent for beds checkbox
    const bedsFilterParent = bedsFilterTemplateElement.parentElement;
    if (!bedsFilterParent) return;

    // Get the parent for beds checkbox
    const bathsFilterParent = bathsFilterTemplateElement.parentElement;
    if (!bathsFilterParent) return;

    // Remove beds filter template
    bedsFilterTemplateElement.remove();

    // Remove baths filter template
    bathsFilterTemplateElement.remove();

    // Add Beds checkbox into the parent
    for (const bedsCheckBoxOption of bedsCheckBoxOptions) {
      const bedsFilter = createCheckboxesFilter(bedsCheckBoxOption, bedsFilterTemplateElement);
      if (!bedsFilter) continue;

      bedsFilterParent.append(bedsFilter);
    }

    // Add Baths checkbox into the parent
    for (const bathsCheckBoxOption of bathsCheckBoxOptions) {
      const bathsFilter = createCheckboxesFilter(bathsCheckBoxOption, bathsFilterTemplateElement);
      if (!bathsFilter) continue;

      bathsFilterParent.append(bathsFilter);
    }

    // Sync the CMSFilters instance to read the new filters data
    const newListItems = listInstance.items.map((item) => item.element);
    listInstance.clearItems();
    listInstance.addItems(newListItems);

    filterInstance.storeFiltersData();

    const minPriceSelect = document.querySelector('#min-price');
    if (!minPriceSelect) return;
    const maxPriceSelect = document.querySelector('#max-price');
    if (!maxPriceSelect) return;

    minPriceSelect.addEventListener('change', (event) => {
      const eventTarget = (event.target as HTMLSelectElement).value;
      if (!eventTarget) return;
      console.log(eventTarget);

      document.querySelectorAll('#max-price option').forEach((opt) => {
        opt.style.display = 'block';
      });
      document.querySelectorAll('#max-price option').forEach((opt) => {
        if (Number(opt.value) <= Number(eventTarget)) {
          opt.style.display = 'none';
        }
      });
      filterPrice();
    });
    maxPriceSelect.addEventListener('change', (event) => {
      filterPrice();
    });

    const filterPrice = () => {
      listInstance.clearItems();
      listInstance.addItems(newListItems);
      const changedListItems = applyPriceFilter(listInstance);
      if (!changedListItems) return;
      //console.log(changedListItems);
      listInstance.clearItems();
      listInstance.addItems(changedListItems);
    };
  },
]);
/**
 * Apply custom price range filter
 * @param listInstance The listInstance
 * @returns The modified listInstance item elements
 */
const applyPriceFilter = (listInstance: CMSList) => {
  const minRange = Number(
    document.querySelector<HTMLSelectElement>('#min-price')?.value.replace(/,/g, '')
  );
  if (!minRange) return;

  const maxRange = Number(
    document.querySelector<HTMLSelectElement>('#max-price')?.value.replace(/,/g, '')
  );
  if (!maxRange) return;

  const newListItems = listInstance.items.filter((item) => {
    // Get current item's min max price
    const itemMinPrice = Number(
      item.element
        .querySelector<HTMLDivElement>('[data-element="min-price"]')
        ?.innerText.replace(/,/g, '')
    );
    if (!itemMinPrice) return;
    const itemMaxPrice = Number(
      item.element
        .querySelector<HTMLDivElement>('[data-element="max-price"]')
        ?.innerText.replace(/,/g, '')
    );

    // console.log('min range: ' + minRange);
    // console.log('max ramge: ' + maxRange);
    // console.log('Item min price: ' + itemMinPrice);
    // console.log('Item max price: ' + itemMaxPrice);

    if (itemMaxPrice) {
      //console.log('item is a range');
      // minRange 500000 - maxRange 900000
      // price 649  - 899
      // check if min price is more then equal to min range
      // check if max price is less then equal to max range
      if (itemMinPrice >= minRange && itemMaxPrice <= maxRange) {
        //console.log('min max within the range');
        return true;
      }
    } else {
      //console.log('item is not a range');
      // check if min price big from min and less from max
      if (itemMinPrice >= minRange && itemMinPrice <= maxRange) {
        //console.log('min within the range');
        return true;
      }
    }
    return;
  });
  return newListItems.map((item) => item.element);
};

//dropdown on change trigger a function
//get changed value
//each lop on listInstance
//
/**
 * Create and return new option.
 * @param selectOption The select or dropdown option text / value.
 * @param templateElement The template for the option.
 * @returns The new option element.
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
 * Get posible filter criteria values from the CMSList.
 * @param listInstance The listInstance of CMSList.
 * @param filterValueSelector The selector for inner element containing the values.
 * @returns The new filter criteria as array.
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
    newFilterCriteria.push(innerElement.innerText);
  }

  if (!newFilterCriteria) return;
  return newFilterCriteria;
};

/**
 * Render new options in the dropdown.
 * @param dropDownElement element in which options will be rendered.
 * @param dropDownOptions options to be rendered.
 */
const populateOptions = (dropDownElement: HTMLSelectElement, dropDownOptions: string[]) => {
  const filtersOptionTemplateElement = dropDownElement.options[0];

  if (!filtersOptionTemplateElement) return;

  // Remove existing options
  const optionsLength = dropDownElement.options.length - 1;
  let i;

  for (i = optionsLength; i >= 1; i--) {
    dropDownElement.remove(i);
  }

  const finalDropDownOptions: string[] = [];
  dropDownOptions.forEach((string) => {
    !finalDropDownOptions.includes(string) && finalDropDownOptions.push(string);
  });

  for (const dropDownOption of finalDropDownOptions) {
    const newFilter = createFilter(dropDownOption, filtersOptionTemplateElement);
    if (!newFilter) continue;

    dropDownElement.append(newFilter);
  }
};

/**
 * For getting criteria from the list instance and return it in unique and sorted array
 * @param listInstance The CMSList Instance
 * @param filterValueSelector The filter criteria value selector
 * @param filterMinSelector The minimum number
 * @param filterMaxSelector The maximum number
 * @returns The array containing all the values/options
 */
const getChecksCriteria = (
  listInstance: CMSList,
  filterValueSelector: string,
  filterMinSelector: string,
  filterMaxSelector: string
) => {
  //const newChecksCriteria = [];
  const listInstanceItems = listInstance.items;
  let rangeUnique: number[] = [];

  if (!listInstance) return;

  for (const listInstanceItem of listInstanceItems) {
    // Get min value
    const minValue = listInstanceItem.element.querySelector<HTMLDivElement>(
      '[data-element="' + filterMinSelector + '"]'
    );
    if (!minValue) return;
    const minInt = parseInt(minValue.innerText);

    // Get max value
    const maxValue = listInstanceItem.element.querySelector<HTMLDivElement>(
      '[data-element="' + filterMaxSelector + '"]'
    );
    if (!maxValue) return;
    const maxInt = parseInt(maxValue.innerText);

    // Create array with min to max values
    let range: number[] = [];
    if (maxInt) {
      range = Array.from({ length: maxInt - minInt + 1 }, (_, i) => minInt + i);
      rangeUnique.push(...range);
    } else {
      range.push(minInt);
      rangeUnique.push(...range);
    }

    // Clone element template for real element for filter
    const criteriaDivElement = listInstanceItem.element.querySelector<HTMLDivElement>(
      '[data-element="' + filterValueSelector + '"]'
    );
    if (!criteriaDivElement) return;

    // Get parent element
    const filterDivParentElement = criteriaDivElement.parentElement;
    if (!filterDivParentElement) return;

    // Remove existing element
    criteriaDivElement.remove();

    // Populate new elements inside parent
    for (const option of range) {
      const newCriteriaDiv = createFilterCriteriaDiv(option, criteriaDivElement);
      if (!newCriteriaDiv) continue;

      filterDivParentElement.append(newCriteriaDiv);
    }
  }

  rangeUnique = rangeUnique.filter((v, i, a) => a.indexOf(v) === i);
  rangeUnique = rangeUnique.sort(function (a, b) {
    return a - b;
  });

  if (!rangeUnique) return;
  return rangeUnique;
};

/**
 * For creating criteria div element inside the list
 * @param option The new criteria option
 * @param templateElement The div for criteria option text
 * @returns The div element for criteria option
 */
const createFilterCriteriaDiv = (option: number, templateElement: HTMLDivElement) => {
  // Clone the template element
  const newFilterCriteriaDiv = templateElement.cloneNode(true) as HTMLDivElement;

  // Populate inner elements
  newFilterCriteriaDiv.textContent = option.toString();
  return newFilterCriteriaDiv;
};

/**
 * Create checkbox for filters
 * @param option The option for the checkbox
 * @param templateElement The template for checkbox
 * @returns The new checkbox
 */
const createCheckboxesFilter = (option: number, templateElement: HTMLLabelElement) => {
  // Clone the template element
  const newCheckbox = templateElement.cloneNode(true) as HTMLLabelElement;

  // Query inner elements
  const label = newCheckbox.querySelector('span');
  const check = newCheckbox.querySelector('input');

  if (!label || !check) return;

  // Populate inner elements
  label.textContent = option.toString();
  check.value = option.toString();

  return newCheckbox;
};
