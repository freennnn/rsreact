export interface Country {
  name: string;
  population: number;
  region: string;
  flag: string;
}

export interface CountryApiResponse {
  name: {
    common: string;
  };
  population: number;
  region: string;
  flags: {
    png: string;
  };
}
