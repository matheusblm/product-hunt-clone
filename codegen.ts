import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: {
    'https://api.producthunt.com/v2/api/graphql': {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_PRODUCT_HUNT_TOKEN}`
      }
    }
  },
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/': {
      preset: 'client',
      config: {
        documentMode: 'string'
      }
    },
    './schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true
      }
    }
  }
}
 
export default config