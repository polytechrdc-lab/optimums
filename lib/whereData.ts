export type CountryData = {
  id: string;
  name: string;
  sites?: number;
  cities?: number;
  slas?: string;
  cta?: string;
  status: 'active' | 'related' | 'rest';
};

export const whereData: Record<string, CountryData> = {
  CD: { id: 'CD', name: 'RDC', sites: 3250, cities: 18, slas: '98,9%', cta: '#empreinte-rdc', status: 'active' },
  AO: { id: 'AO', name: 'Angola', sites: 420, cities: 6, slas: '98,1%', cta: '/empreinte/ao', status: 'related' },
  CG: { id: 'CG', name: 'Congo (Brazzaville)', sites: 180, cities: 4, slas: '97,9%', cta: '/empreinte/cg', status: 'related' },
  ZM: { id: 'ZM', name: 'Zambie', sites: 260, cities: 8, slas: '98,2%', cta: '/empreinte/zm', status: 'related' },
  TZ: { id: 'TZ', name: 'Tanzanie', sites: 380, cities: 10, slas: '98,4%', cta: '/empreinte/tz', status: 'related' },
  SS: { id: 'SS', name: 'Soudan du Sud', sites: 60, cities: 3, slas: '97,5%', cta: '/empreinte/ss', status: 'related' },
  CF: { id: 'CF', name: 'RCA', sites: 40, cities: 2, slas: '97,0%', cta: '/empreinte/cf', status: 'related' },
  UG: { id: 'UG', name: 'Ouganda', sites: 300, cities: 7, slas: '98,0%', cta: '/empreinte/ug', status: 'related' },
  RW: { id: 'RW', name: 'Rwanda', sites: 120, cities: 5, slas: '98,6%', cta: '/empreinte/rw', status: 'related' },
  BI: { id: 'BI', name: 'Burundi', sites: 90, cities: 3, slas: '98,1%', cta: '/empreinte/bi', status: 'related' },
  NG: { id: 'NG', name: 'Nigéria', sites: 2800, cities: 24, slas: '98,5%', cta: '/empreinte/ng', status: 'rest' },
  KE: { id: 'KE', name: 'Kenya', sites: 950, cities: 12, slas: '98,6%', cta: '/empreinte/ke', status: 'rest' },
  ET: { id: 'ET', name: 'Éthiopie', sites: 1200, cities: 14, slas: '98,2%', cta: '/empreinte/et', status: 'rest' },
  GH: { id: 'GH', name: 'Ghana', sites: 540, cities: 9, slas: '98,4%', cta: '/empreinte/gh', status: 'rest' },
  SN: { id: 'SN', name: 'Sénégal', sites: 360, cities: 7, slas: '98,3%', cta: '/empreinte/sn', status: 'rest' },
  ZA: { id: 'ZA', name: 'Afrique du Sud', sites: 3100, cities: 26, slas: '99,0%', cta: '/empreinte/za', status: 'rest' },
  MA: { id: 'MA', name: 'Maroc', sites: 860, cities: 11, slas: '98,7%', cta: '/empreinte/ma', status: 'rest' },
  EG: { id: 'EG', name: 'Égypte', sites: 2100, cities: 22, slas: '98,8%', cta: '/empreinte/eg', status: 'rest' },
};
