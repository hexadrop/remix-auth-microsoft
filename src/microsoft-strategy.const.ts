import type { MicrosoftStrategyScope } from './microsoft-strategy.scopes';

const MicrosoftStrategyDefaultScopes: MicrosoftStrategyScope[] = ['openid', 'profile', 'email'];
const MicrosoftStrategyDefaultName = 'microsoft';
const MicrosoftStrategyScopeSeparator = ' ';
const MicrosoftUserInfoURL = 'https://graph.microsoft.com/oidc/userinfo';
const MicrosoftLoginDomain = 'login.microsoftonline.com';

export {
	MicrosoftLoginDomain,
	MicrosoftStrategyDefaultName,
	MicrosoftStrategyDefaultScopes,
	MicrosoftStrategyScopeSeparator,
	MicrosoftUserInfoURL,
};
