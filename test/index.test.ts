import { beforeEach, describe, expect, it, jest } from 'bun:test';

import MicrosoftStrategy from '../src';

describe('@hexadrop/remix-auth-microsoft', () => {
	const verify = jest.fn();

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should allow changing the scope', async () => {
		const strategy = new MicrosoftStrategy(
			{
				clientId: 'CLIENT_ID',
				clientSecret: 'CLIENT_SECRET',
				redirectURI: 'https://example.app/callback',
				scopes: ['custom'],
			},
			verify
		);

		const request = new Request('https://example.app/auth/microsoft');

		try {
			await strategy.authenticate(request);
		} catch (error) {
			if (!(error instanceof Response)) {
				throw error;
			}
			const location = error.headers.get('Location');

			if (!location) {
				throw new Error('No redirect header');
			}

			const redirectUrl = new URL(location);

			expect(redirectUrl.searchParams.get('scope')).toBe('custom');
		}
	});

	it('should have the scope `openid profile email` as default', async () => {
		const strategy = new MicrosoftStrategy(
			{
				clientId: 'CLIENT_ID',
				clientSecret: 'CLIENT_SECRET',
				redirectURI: 'https://example.app/callback',
			},
			verify
		);

		const request = new Request('https://example.app/auth/microsoft');

		try {
			await strategy.authenticate(request);
		} catch (error) {
			if (!(error instanceof Response)) {
				throw error;
			}
			const location = error.headers.get('Location');

			if (!location) {
				throw new Error('No redirect header');
			}

			const redirectUrl = new URL(location);

			expect(redirectUrl.searchParams.get('scope')).toBe('openid profile email');
		}
	});

	it('should correctly format the authorization URL', async () => {
		const strategy = new MicrosoftStrategy(
			{
				clientId: 'CLIENT_ID',
				clientSecret: 'CLIENT_SECRET',
				redirectURI: 'https://example.app/callback',
			},
			verify
		);

		const request = new Request('https://example.app/auth/microsoft');

		try {
			await strategy.authenticate(request);
		} catch (error) {
			if (!(error instanceof Response)) {
				throw error;
			}

			const location = error.headers.get('Location');

			if (!location) {
				throw new Error('No redirect header');
			}

			const redirectUrl = new URL(location);

			expect(redirectUrl.hostname).toBe('login.microsoftonline.com');
			expect(redirectUrl.pathname).toBe('/common/oauth2/v2.0/authorize');
		}
	});

	it('should allow changing tenant', async () => {
		const strategy = new MicrosoftStrategy(
			{
				clientId: 'CLIENT_ID',
				clientSecret: 'CLIENT_SECRET',
				redirectURI: 'https://example.app/callback',
				tenantId: 'custom',
			},
			verify
		);

		const request = new Request('https://example.app/auth/microsoft');

		try {
			await strategy.authenticate(request);
		} catch (error) {
			if (!(error instanceof Response)) {
				throw error;
			}

			const location = error.headers.get('Location');

			if (!location) {
				throw new Error('No redirect header');
			}

			const redirectUrl = new URL(location);

			expect(redirectUrl.pathname).toBe('/custom/oauth2/v2.0/authorize');
		}
	});
});
