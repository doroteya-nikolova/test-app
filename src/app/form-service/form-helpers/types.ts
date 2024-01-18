export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

export interface ArrayField {
  fieldName: string;
  index: number;
}

//* Generic T would represent the origin Object type, while P would be the destination Object type
export type FieldMapper<T, P> = { [key in keyof T]: RecursivePartial<P> | Array<RecursivePartial<P>> };

//* Type for adapter mapper object. It should contain any key of the object plus 'default' use for apply a default function
export type AdapterMapper<T> = { [key in keyof T | 'default']?: Function };

export type MappingConfig<T> = {
  [K in keyof T]: string;
};

export function mapNestedProperty<T, U>(data: T, mappingConfig: MappingConfig<T>, excludedProperties: string[] = []): U {
  const result: any = { ...data };

  for (const backendProperty in mappingConfig) {
    if (mappingConfig.hasOwnProperty(backendProperty)) {
      const frontendProperty = mappingConfig[backendProperty as keyof T];
      const nestedProperties = backendProperty.split('.');

      let value: any = data;


      for (const nestedProperty of nestedProperties) {
        if (value && typeof value === 'object' && nestedProperty in value) {
          value = value[nestedProperty];
        } else {
          value = undefined;
          break;
        }
      }

      result[frontendProperty] = value;
    }
  }

  // Remove excluded properties
  for (const excludedProperty of excludedProperties) {
    if (excludedProperty in result) {
      delete result[excludedProperty];
    }
  }

  return result;
}
