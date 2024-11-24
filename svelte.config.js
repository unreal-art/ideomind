import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';



/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'@/*': './src/lib/*'
		}
	},
	build: {
		rollupOptions: {
			external: ['buffer']
		}
	}
};
const config = {
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
    vite: {
      plugins: [
        development &&
          nodePolyfills({
            include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')],
            http: true,
            crypto: true
          })
      ],
      resolve: {
        alias: {
          crypto: 'crypto-browserify',
          stream: 'stream-browserify',
          assert: 'assert',
          zlib: 'browserify-zlib'
        }
      },
      build: {
        rollupOptions: {
          external: ['@web3-onboard/*'],
          plugins: [nodePolyfills({ crypto: true, http: true })]
        },
        commonjsOptions: {
          transformMixedEsModules: true
        }
      },
      optimizeDeps: {
        exclude: ['@ethersproject/hash', 'wrtc', 'http'],
        include: [
          '@web3-onboard/core',
          '@web3-onboard/gas',
          '@web3-onboard/sequence',
          'js-sha3',
          '@ethersproject/bignumber'
        ]
      }
    }
  }
}

export default config;
