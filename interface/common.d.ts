import * as history from 'history';

export interface Location extends history.Location {
  query: any
}

export interface Match{
  isExact: boolean
  params: any
  path: string
  url: string
}

export type History = history.History;

