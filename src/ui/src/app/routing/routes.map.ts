export const ROUTE_MAP = {
  TABLES: {
    PATH: '/tables',
    BROWSE: {
      PATH: '/tables/:table/browse',
    },
    INDICES: {
      PATH: '/tables/:table/indices',
    },
    SCHEMA: {
      PATH: '/tables/:table/schema',
    },
    EDIT: {
      PATH: '/tables/:table/edit/pk/:pk/sk/:sk',
    },
  },
  GUIDE: {
    MAIN: {
      PATH: '/guide/main',
    },
    BASICS: {
      PATH: '/guide/basics',
    },
    PYTHON: {
      PATH: '/guide/python',
    },
    CDK: {
      PATH: '/guide/cdk',
    },
    ABOUT: {
      PATH: '/guide/about',
    },
  },
  SAMPLE_APP: {
    PATH: '/sample-app',
  },
};
