import type { MicrosoftStrategyPrompt } from './microsoft-strategy.prompt';
import type { MicrosoftStrategyScope } from './microsoft-strategy.scopes';

export interface MicrosoftStrategyOptions {
	clientId: string;
	clientSecret: string;
	domain?: string;
	policy?: string;
	prompt?: MicrosoftStrategyPrompt;
	redirectURI: string;
	scopes?: MicrosoftStrategyScope[];
	tenantId?: string;
}
