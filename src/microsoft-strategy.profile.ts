export interface MicrosoftProfile {
	_json: {
		email: string;
		family_name: string;
		given_name: string;
		name: string;
		sub: string;
	};
	displayName: string;
	emails: [{ value: string }];
	id: string;
	name: {
		familyName: string;
		givenName: string;
	};
}
