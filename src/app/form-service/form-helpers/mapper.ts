import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';

import { AdapterMapper, ArrayField, FieldMapper } from './types';

/**
 * Builds view from a BE object, patching the form without emitting events to avoid side effects.
 *
 * For `FormArray` controls: first tries to replicate the first control found, if none it just pushes new ones for every value
 * @param backendObject from which the data is extracted
 * @param form to which the data is patched
 * @param isReadAccess if `true`, `FormArray's` are left empty if has no values from BE. If `false`, they will keep its first line for editing
 * @param mapperObject mapper use to find the correct controls
 * @param [adapterFunctionsMapper] `Optional` adapter mapper containing the functions to apply to every value
 */
export function buildViewFromBEObject<T, P>(
  backendObject: T | Partial<T>,
  form: FormGroup,
  isReadAccess: boolean,
  mapperObject: FieldMapper<T, P>,
  adapterFunctionsMapper?: AdapterMapper<T>
): void {
  
  Object.keys(backendObject as object).forEach(field => {
    const backendValue = adapterFunctionsMapper
      ? applyAdapter(
        field,
        (backendObject as Record<string, any>)[field],
        adapterFunctionsMapper
      ) //* If adapter is available we apply it
      : (backendObject as Record<string, any>)[field]; //* Value not adapted
    const controls = getViewModelControls(field, form, mapperObject); //* We retrieve the controls for every field of the BE object

    controls.forEach(control => {
      if (control instanceof FormArray) {
        //* We make sure the BE value is an array
        const arrayBEValue = Array.isArray(backendValue) ? backendValue : [backendValue];
        //* We are dealing with an Array
        if (control.length > 0) {
          //* We already have a initial control present, so we are gonna use it as reference for setting the values
          const initialFormGroup = cloneDeep(control.at(0));

          if (isReadAccess || arrayBEValue.length) {
            //* If accessing as readonly view or having values coming from BE, we do not want the initial empty line
            control.removeAt(0);
          }

          arrayBEValue.forEach(value => {
            const newItem = cloneDeep(initialFormGroup);
            newItem.enable({ emitEvent: false });
            newItem.patchValue(value, { emitEvent: false });
            control.push(newItem);
          });
        } else {
          //* Since the array is empty, we just push one control for every value
          arrayBEValue.forEach(value => {
            control.push(new FormControl(value));
          });
        }
      }

      if (control instanceof FormGroup) {
        control.patchValue(backendValue || {}, { emitEvent: false });
      }

      if (control instanceof FormControl) {
        control.setValue(backendValue, { emitEvent: false });
      }
    });
  });
}

/**
 * Generates BE object from existing data in a form. It also applies adapters to every value.
 *
 * @param form from which extract the data
 * @param mapperObject mapper use to find the correct controls
 * @param [adapterFunctionsMapper] `Optional` adapter mapper containing the functions to apply to every value
 * @returns BE object ready to be sent
 */
export function generateBEObject<T, P>(
  form: FormGroup,
  mapperObject: FieldMapper<T, P>,
  adapterFunctionsMapper?: AdapterMapper<T>
): T {
  const result: Partial<T> = {};

  //* Using the mapper keys we build the BE object
  Object.keys(mapperObject).forEach(key => {
    result[key as keyof T] = applyAdapter(key, getViewModelValue(key, form, mapperObject), adapterFunctionsMapper);
  });

  return result as T;
}

/**
 * When errors, BE sends a path that points to the invalid field. This method resolves this path, returning the correct control.
 *
 * If the mapper is pointing to several controls, we return the first one.
 *
 * @param path BE path (ex: `taxMiscellaneousFees[2].type`)
 * @param form form on which the control is to be obtained
 * @param mapperObject mapper use to find the expected control
 * @returns view model control
 */
export function getViewModelControlFromBEPath<T, P>(
  path: string,
  form: FormGroup,
  mapperObject: FieldMapper<T, P>
): AbstractControl | null {
  const fields: string[] = path.split('.'); //* Splitting: nameOfField.nameOfChild
  let viewControl: AbstractControl | null = null;

  fields.forEach((field, index) => {
    //* Some fields are actually arrays: nameOfField[1]
    let extractedField: any = extractArrayField(field);
    const isArrayField = extractedField !== null;

    if (!isArrayField) {
      extractedField = field;
    }

    if (index === 0) {
      //* First field in a path is always mapped to a view abstract control, so we retrieve it
      viewControl = getViewModelControls(extractedField, form, mapperObject)[0]; //* We prioritize the first control found as reference
    } else if (viewControl) {
      //* viewControl is null at the end, so we need to check it first to avoid overwritting
      viewControl = isArrayField
        ? (viewControl.get(extractedField.fieldName) as FormArray).controls[extractedField.index] //* ArrayField: we get the specific index
        : viewControl.get(extractedField); //* Regular field: we just call get
    }
  });

  return viewControl;
}

//* PRIVATE FUNCTIONS SECTION

/**
 * Gets view model value that corresponds to a BE field
 * @param field the BE field
 * @param form the form to look for the value
 * @param mapperObject mapper use to find the expected control
 * @returns value corresponding to the BE field, `null` if not found
 */
function getViewModelValue(field: any, form: FormGroup, mapperObject: any): any {
  const viewModelControl = getViewModelControls(field, form, mapperObject)[0]; //* We prioritize the first control found for getting value

  return viewModelControl && viewModelControl.enabled ? viewModelControl.value : null;
}

/**
 * Gets array of view model controls depending on the field passed as param
 * @param field the BE field
 * @param form the form to look for the value
 * @param mapperObject mapper use to find the expected control
 * @returns array of view model controls
 */
function getViewModelControls(field: string | ArrayField, form: AbstractControl, mapperObject: any): AbstractControl[] {
  const viewControls: any[] = [];
  const fieldIsArray = typeof field !== 'string';
  const fieldName = fieldIsArray ? (field as ArrayField).fieldName : (field as string);

  //* In the mapper we can have an Object (points to only one control) or an Array of Objects (the field points to several controls)
  //* We anyway treat any case as an Array to use the forEach below
  const fieldsFromMapper = Array.isArray(mapperObject[fieldName]) ? mapperObject[fieldName] : [mapperObject[fieldName]];

  fieldsFromMapper.forEach((fieldFromMapper: any) => {
    //* If fieldFromMapper is null, means the field is at the root of the form -> we just get it from the form
    //* If it is not null, we retrieve it recursively calling findViewModelControl
    let viewControl = fieldFromMapper ? findViewModelControl(form, fieldFromMapper) : form.get(fieldName);

    if (fieldIsArray) {
      const index = (field as ArrayField).index;
      viewControl = (viewControl as FormArray).controls[index];
    }

    viewControls.push(viewControl);
  });

  return viewControls;
}

/**
 * Finds recursively the view model control
 * @param form the form to look for the value
 * @param mapperObject mapper use to find the expected control
 * @returns the view model control
 */
function findViewModelControl(form: AbstractControl, mapperObject: any): AbstractControl {
  let viewControl: AbstractControl | null = form;

  //* Base case happens when mapperObject gets reduced to null (that is why is neccesary to end the mapper objects in null)
  if (mapperObject) {
    const nextField = Object.keys(mapperObject)[0];
    viewControl = findViewModelControl((form.get(nextField) as AbstractControl), mapperObject[nextField]);
  }

  return viewControl;
}

/**
 * Extracts array field (fieldName and index). It parses the field trying to find the array brackets
 * @param field string to parse
 * @returns `ArrayField` object or null if it is not an `ArrayField`
 */
function extractArrayField(field: string): ArrayField | null {
  let result = null;
  const bracketsIndex = [field.indexOf('['), field.indexOf(']')];

  if (bracketsIndex[0] !== -1) {
    const arrayIndex = Number(field.substring(bracketsIndex[0] + 1, bracketsIndex[1]));
    result = { fieldName: field.slice(0, bracketsIndex[0]), index: arrayIndex };
  }

  return result;
}

/**
 * Applys adapter function, returning a transformed value
 * @param field field name used to find the correct adapter in the mapper
 * @param value value to be adapted
 * @param functionsMapper map of functions (fieldName -> function)
 * @returns value transformed after applying the corresponding adapter || default provided || internal default
 */
function applyAdapter(field: any, value: any, functionsMapper: any) {
  const adapterFunction = functionsMapper[field];
  const defaultAdapterFunction = functionsMapper.default || ((val: any) => val);

  return adapterFunction ? adapterFunction(value) : defaultAdapterFunction(value);
}
