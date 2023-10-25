export interface ModelsFilterRules {
  search: string | null;
  sort: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  brand: number | null;
  fuels: number[];
  hullTypes: number[];
}

export interface FiltersData {
  brands: BrandFilter[];
  fuels: Fuel[];
  hull_types: HullType[];
  authors: AuthorFilter[];
}

export interface BrandFilter {
  id: number;
  name: string;
  models: {
    id: number;
    name: string;
    generations: {
      id: number;
      name: string;
    }[];
  }[];
}

export interface AuthorFilter {
  id: number;
  name: string;
  avatar: string | null;
}

export interface PostsFilterRules {
  search: string | null;
  sort: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  brand: number | null;
  model: number | null;
  generation: number | null;
  author: string | null;
}

export interface PostsFiltersPayload extends PostsFilterRules {
  page: number;
}