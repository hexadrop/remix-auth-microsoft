import { OAuth2Strategy } from 'remix-auth-oauth2';

import {
	MicrosoftLoginDomain,
	MicrosoftStrategyDefaultName,
	MicrosoftStrategyDefaultScopes,
	MicrosoftStrategyScopeSeparator,
	MicrosoftUserInfoURL,
} from './microsoft-strategy.const';
import type { MicrosoftStrategyOptions } from './microsoft-strategy.options';
import type { MicrosoftProfile } from './microsoft-strategy.profile';
import type { MicrosoftStrategyScope } from './microsoft-strategy.scopes';

export default class MicrosoftStrategy<User> extends OAuth2Strategy<User> {
	public override name = MicrosoftStrategyDefaultName;

	private readonly prompt?: string | undefined;
	private readonly scopes: MicrosoftStrategyScope[];

	constructor(
		{
			clientId,
			clientSecret,
			domain = MicrosoftLoginDomain,
			policy,
			prompt,
			redirectURI,
			scopes = MicrosoftStrategyDefaultScopes,
			tenantId = 'common',
		}: MicrosoftStrategyOptions,
		verify: OAuth2Strategy<User>['verify']
	) {
		super(
			{
				authorizationEndpoint: policy
					? `https://${domain}/${tenantId}/${policy}/oauth2/v2.0/authorize`
					: `https://${domain}/${tenantId}/oauth2/v2.0/authorize`,
				clientId,
				clientSecret,
				redirectURI,
				scopes,
				tokenEndpoint: policy
					? `https://${domain}/${tenantId}/${policy}/oauth2/v2.0/token`
					: `https://${domain}/${tenantId}/oauth2/v2.0/token`,
			},
			verify
		);

		this.scopes = scopes;
		this.prompt = prompt;
	}

	static async userProfile(accessToken: string, userInfoUrl = MicrosoftUserInfoURL): Promise<MicrosoftProfile> {
		const response = await fetch(userInfoUrl, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		const data = (await response.json()) as MicrosoftProfile['_json'];

		return {
			_json: data,
			displayName: data.name,
			emails: [{ value: data.email }],
			id: data.sub,
			name: {
				familyName: data.family_name,
				givenName: data.given_name,
			},
		};
	}

	protected override authorizationParams(parameters: URLSearchParams): URLSearchParams {
		parameters.set('scope', this.scopes.join(MicrosoftStrategyScopeSeparator));
		if (this.prompt) {
			parameters.set('prompt', this.prompt);
		}

		return parameters;
	}
}
