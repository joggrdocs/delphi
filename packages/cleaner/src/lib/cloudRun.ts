import { v2, protos } from '@google-cloud/run';

const { ServicesClient } = v2;
const runClient = new ServicesClient();

/*
|==========================================================================
| cloudRun
|==========================================================================
|
| Cloud Run Utilities
|
*/

/*
|------------------
| Utils
|------------------
*/

/**
 * Coalesces a value to undefined if it is null or undefined
 * 
 * @param value A value of any type
 * @returns The value or undefined if Nil
 */
export function coalesce<T>(value: T): Exclude<T, null | undefined> | undefined {
  if (value === null || value === undefined) {
    return undefined;
  } else {
    return value as Exclude<T, null | undefined>;
  }
}

/**
 * Builds the parent of a service
 * 
 * @param projectId The GCP project ID
 * @param location The GCP location
 * @returns A parent string
 */
export function buildParent(projectId: string, location = 'us-central1') {
  return `projects/${projectId}/locations/${location}`;
}

/**
 * Converts a date to a protobuf timestamp
 * 
 * @link https://googleapis.dev/nodejs/firestore/3.3.3/timestamp.js.html
 * 
 * @param timestamp A protobuf timestamp
 * @returns A date
 */
export function transformTimestampToDate(timestamp?: protos.google.protobuf.ITimestamp): Date | null {
  if (!timestamp || !timestamp.seconds || !timestamp.nanos) {
    return null;
  }

  return new Date((Number(timestamp.seconds) * 1000) + Math.round(timestamp.nanos / 1000000));
}

/*
|------------------
| Delete
|------------------
*/

/**
 * Deletes a service
 * 
 * @param parent The parent of the service
 * @param name The name of the service to delete
 */
export async function deleteService(name: string) {
  const request = {
    name,
  } satisfies protos.google.cloud.run.v2.IDeleteServiceRequest;

  await runClient.deleteService(request);
}

/**
 * Deletes a list of services
 * 
 * @param parent The parent of the services
 * @param serviceNames The names of the services to delete
 */
export async function deleteServices(serviceNames: string[]) {
  for (const serviceName of serviceNames) {
    await deleteService(serviceName);
  }
}

/*
|----------------------------------
| List Services
|----------------------------------
|
| List services and filter them by: name, labels, and creation timestamp.
|
*/

export type FilterOperation =
  | 'greaterThanOrEqualTo'
  | 'lessThanOrEqualTo'
  | 'greaterThan'
  | 'lessThan'
  | 'equalTo';

export interface FilterCreatedAt {
  field: 'age';
  operation: FilterOperation;
  value: `${number} ${'days' | 'hours' | 'min' | 'seconds'}`;
}

export interface FilterName {
  field: 'serviceName';
  operation: 'equalTo';
  value: string;
}

export interface FilterLabels {
  field: 'labels';
  label: string;
  operation: 'equalTo';
  value: string;
}

export type Filter =
  | FilterCreatedAt
  | FilterName
  | FilterLabels;

export interface Service {
  name: string;
  serviceName: string;
  labels?: {
    [key: string]: string;
  };
  createdAt: Date;
  creationTimestamp: number;
  creationAgeMilliseconds: number;
}

/**
 * Applies a filter to a service
 * 
 * @param value A filter value
 * @returns A age value in milliseconds 
 */
export function getCreationAgeValue(value: FilterCreatedAt['value']): number {
  const [duration, unit] = value.split(' ');
  const multiplier = {
    days: 86400000,
    hours: 3600000,
    min: 60000,
    seconds: 1000,
  }[unit];

  if (!multiplier) {
    throw new Error(`Invalid duration unit: ${unit}`);
  }

  return Number(duration) * multiplier;
}

/**
 * Gets the filter field from a service
 * 
 * @param filter A filter
 * @param service A service
 * @returns The field value
 */
export function getFilterField(filter: Filter, service: Partial<Service>) {
  switch (filter.field) {
    case 'age':
      return service.creationAgeMilliseconds ?? 0;
    case 'labels':
      return service.labels?.[filter.label] ?? '';
    case 'serviceName':
      return service.serviceName ?? '';
  }
}

/**
 * Gets the filter value from a filter
 * 
 * @param filter A filter
 * @returns A filter value
 */
export function getFilterValue(filter: Filter) {
  switch (filter.field) {
    case 'age':
      return getCreationAgeValue(filter.value);
    default:
      return filter.value;
  }
}

/**
 * Applies a filter to a service 
 * 
 * @param payload A filter payload
 * @param service A service
 * @returns A boolean indicating whether the service matches the filter
 */
export function matchFilter(payload: Filter, service: Partial<Service>): boolean {
  switch (payload.operation) {
    case 'greaterThanOrEqualTo':
      return getFilterField(payload, service) >= getFilterValue(payload);
    case 'lessThanOrEqualTo':
      return getFilterField(payload, service) <= getFilterValue(payload);
    case 'greaterThan':
      return getFilterField(payload, service) > getFilterValue(payload);
    case 'lessThan':
      return getFilterField(payload, service) < getFilterValue(payload);
    case 'equalTo':
      return getFilterField(payload, service) == getFilterValue(payload);
    default:
      return false;
  }
}

/**
 * Extracts the service name from a service name
 * 
 * @param name A service name, e.g. projects/durable-utility-269718/locations/us-central1/services/preview-frontend
 * @returns the service name, e.g. preview-frontend
 */
export function extractServiceName(name?: string): string | undefined {
  if (!name) {
    return undefined
  }

  const parts = name.split('/');
  return parts[parts.length - 1];
}

/**
 * Lists services
 * 
 * @param filters A list of filters to apply
 * @param logicOperator A logic operator to apply to the filters
 * @param limit A limit to the number of results to return
 * @returns A list of services
 */
export async function listServices(
  parent: string,
  filters: Filter[],
  logicOperator: 'AND' | 'OR' = 'AND',
  limit: number = 100
): Promise<Service[]> {
  const request = {
    parent,
    pageSize: limit,
  } as protos.google.cloud.run.v2.IListServicesRequest;

  if (filters.length === 0) {
    throw new Error('At least one filter is required');
  }

  const [response] = await runClient.listServices(request);

  return response
    .map((service) => {
      const createdAt = transformTimestampToDate(coalesce(service.createTime));
      return {
        name: coalesce(service.name),
        serviceName: extractServiceName(coalesce(service.name)),
        labels: service.labels ?? undefined,
        createdAt: createdAt?.toISOString(),
        creationTimestamp: createdAt?.getTime(),
        creationAgeMilliseconds: createdAt ? Date.now() - createdAt.getTime() : 0,
      } as Partial<Service>;
    })
    .filter((service) => [
      service.name,
      service.serviceName,
      service.createdAt,
      service.creationTimestamp,
      service.labels,
    ].every((field) => field !== undefined))
    .filter(service => {
      const matches = filters.map(filter => matchFilter(filter, service));
      if (logicOperator === 'AND') {
        return matches.every(match => match);
      } else {
        return matches.some(match => match);
      }
    }) as Service[];
}
