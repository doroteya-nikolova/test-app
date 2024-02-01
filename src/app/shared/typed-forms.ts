import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * This type generates Angular Forms appropriate structure type,
 * it accepts raw object and splits it recursively by all use-cases of its properties
 */
export type Converted<T> = {
  [K in RequiredNotNullKeysOnly<T>]: FormControl<T[K]>;
} & {
  [K in RequiredObjectKeys<T>]: CheckObject<T[K]>;
} & {
  [K in UndefinedOrNullKeys<Omit<T, RequiredNotNullKeysOnly<T>>>]: FormControl<Exclude<T[K], undefined> | null>;
} & {
  [K in UndefinedOrNullObjectKeys<T>]: CheckObject<Exclude<T[K], null>>;
} & {
  [K in UndefinedArrayKeys<T>]: CheckObject<T[K]>;
};

/* non-object */

/* required and not object and not null */
type RequiredNotNullKeysOnly<T> = ExistingValues<{
  [K in keyof Required<T>]: undefined extends T[K]
    ? never
    : null extends T[K]
    ? never
    : T[K] extends object
    ? never
    : K;
}>;

/* undetified + null */
type UndefinedOrNullKeys<T> = ExistingValues<{
  [K in keyof Required<T>]: T[K] extends object | undefined | null ? never : K;
}>;

/* object  */

/* required object */
type RequiredObjectKeys<T> = ExistingValues<{
  [K in keyof Required<T>]: T[K] extends object ? K : never;
}>;

/* object + undefinded or null */
type UndefinedOrNullObjectKeys<T> = ExistingValues<{
  [K in keyof Required<T>]: null extends T[K] ? (T[K] extends object | undefined | null ? K : never) : never;
}>;

/* array */
type UndefinedArrayKeys<T> = ExistingValues<{
  [K in keyof Required<T>]: T[K] extends (infer U)[] | undefined ? K : never;
}>;

type ExistingValues<T> = T[keyof T];

type Primitive = string | number | bigint | boolean | symbol;

export type CheckObject<T> = T extends (infer U)[]
  ? U extends Primitive
    ? FormControl<T>
    : FormArray<U extends object ? FormGroup<Converted<U>> : FormControl<U>>
  : FormGroup<Converted<T>>;

type FlattenKeys<O extends object> = IntersectValues<{
  [K in keyof O]: K extends 'theForm'
    ? {}
    : O[K] extends object
    ? O[K] extends Safe<FormControl>
      ? Pick<O, K>
      : PrefixKeys<FlattenKeys<O[K]>, EnsureString<K>> & Pick<O, Exclude<K, undefined>>
    : Pick<O, K>;
}>;

type EnsureString<T> = T extends string ? T : never;

type PrefixKeys<O, P extends string> = { [K in keyof O as `${P}.${Exclude<K, symbol>}`]-?: O[K] };

/**
 * Converts each variant `v` of a union to the function type `v => void`.
 *
 * That is, converts `v1 | v2 | ...` to the union `(v1 => void) | (v2 => void) | ...`
 */
type AsFuncArg<T> = T extends any ? (_: T) => void : never

/**
 * Returns the intersection of all value types of the given object.
 *
 * That is, given an object `{ k1: v1, k2: v2, ... }`, produces the intersection `v1 & v2 & ...`.
 *
 * Compare with the `T[keyof T]` construction, which for the above object produces the _union_ of the values instead: `v1 | v2 | ...`
 */
type IntersectValues<T extends {[key: string]: object}> =
  AsFuncArg<T[keyof T]> extends (x: infer I) => void
    ? I : never;

/**
 * Use this function instead of angular form's get() method, which does not return the correct type
 *
 * @param control - the form
 * @param propertyString - keys of the raw object structures will appear here joined by . for each level
 * @returns the addressed FormGroup or FormControl by the property string
 */
export function get<C extends FormGroup, K extends keyof FlattenKeys<GetFormSkeleton<C>>>(
  control: C,
  propertyString: K
): FlattenKeys<GetFormSkeleton<C>>[K] extends { theForm: any }
  ? FlattenKeys<GetFormSkeleton<C>>[K]['theForm']
  : FlattenKeys<GetFormSkeleton<C>>[K] {
  const prime = (propertyString as string).split('.').reduce((acc, controlName) => {
    const innerGet = <
      D extends { [K in keyof C]: AbstractControl<any, any> },
      G extends FormGroup<D> = FormGroup<D>,
      L extends string = string
    >(
      form: G,
      property: L
    ) => {
      // @ts-ignore
      return form['controls'][property];
    };

    const result = innerGet(acc, controlName);

    return result;
  }, control) as FlattenKeys<GetFormSkeleton<C>>[K];

  // @ts-ignore
  if (prime.theForm) {
    // @ts-ignore
    return prime.theForm;
  }
  return prime;
}

/**
 * Generate the raw value structure of a form
 */
type GetFormSkeleton<T extends AbstractControl> = undefined extends keyof T
  ? never
  : T extends FormGroup
  ? { [K in keyof T['controls']]: GetFormSkeleton<T['controls'][K]> } & { theForm: T }
  : T;

type Safe<C extends AbstractControl> = Omit<C, 'root' | 'parent'>;
