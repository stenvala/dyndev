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
      PATH: '/tables/:table/edit/pk/:pkKey/:pk/sk/:skKey/:sk',
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
    RULES: {
      PATH: '/guide/rules',
    },
  },
  SAMPLE_APP: {
    PATH: '/sample-app',
    CATEGORY: {
      PATH: '/sample-app/category/:categoryId',
    },
    STATUS: {
      PATH: '/sample-app/status/:status',
    },
  },
  ABOUT: {
    PATH: '/about',
  },
};
