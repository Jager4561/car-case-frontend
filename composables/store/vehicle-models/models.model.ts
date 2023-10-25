export interface ModelGeneration {
  model_id: number;
  generation_id: number;
  date_created: string;
  brand: Brand;
  model: string,
  generation: string,
  production_start: number,
  production_end: number,
  hull_types: HullType[],
  image: string,
  engines: Engine[],
  posts_count: number,
}

export interface Brand {
  date_created: string;
  id: number;
  name: string;
  logo: string;
}

export interface HullType {
  id: number;
  name: string;
}

export interface Fuel {
  id: number;
  name: string;
  color: string;
}

export interface Engine {
  id: number;
  name: string;
  capacity: number;
  horse_power: number;
  fuel: Fuel;
}