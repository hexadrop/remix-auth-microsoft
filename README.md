<h1 align="center">
  Remix Auth Microsoft
</h1>

<p align="center">
  Microsoft strategy for <a href="https://github.com/sergiodxa/remix-auth">remix-auth</a>.
</p>

## Supported runtimes

| Runtime    | Has Support |
|------------|-------------|
| Node.js    | ✅           |
| Cloudflare | ✅           |

## How to use

### Create an OAuth application

Follow the steps on [the Microsoft documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) to create a new App Registration. You should select **Web** as the platform, configure a **Redirect URI** and add a client secret.

> [!TIP]
> If you want to support login with both personal Microsoft accounts and school/work accounts, you might need to configure the supported account types by editing the manifest file. Set `signInAudience` value to `MicrosoftADandPersonalMicrosoftAccount` to allow login also with personal accounts.

Change your redirect URI to `https://example.com/auth/microsoft/callback` or `http://localhost:4200/auth/microsoft/callback` if you run it locally.

Be sure to copy the client secret, redirect URI, Tenant ID and the Application (client) ID (under Overview) because you will need them later.

### Install dependencies

```bash
npm install @hexadrop/remix-auth-microsoft remix-auth remix-auth-oauth2"
```

### Create the strategy instance

```ts
// app/services/auth.server.ts
import { Authenticator } from 'remix-auth';
import { MicrosoftStrategy } from 'remix-auth-microsoft';

const authenticator = new Authenticator<User>(); // User is a custom user types you can define as you want

const microsoftStrategy = new MicrosoftStrategy(
  {
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    prompt: 'login', // optional
    redirectURI: 'https://example.com/auth/microsoft/callback',
    scopes: ['openid', 'profile', 'email'], // optional
    tenantId: 'YOUR_TENANT_ID', // optional - necessary for organization without multitenant (see below)
  },
  async ({ request, tokens }) => {
    // Here you can fetch the user from database or return a user object based on profile
    const accessToken = tokens.accessToken();
    const idToken = tokens.idToken();
    const profile = await MicrosoftStrategy.userProfile(accessToken);

    // The returned object is stored in the session storage you are using by the authenticator

    // If you're using cookieSessionStorage, be aware that cookies have a size limit of 4kb

    // Retrieve or create user using id received from userinfo endpoint
    // https://graph.microsoft.com/oidc/userinfo

    // DO NOT USE EMAIL ADDRESS TO IDENTIFY USERS
    // The email address received from Microsoft Entra ID is not validated and can be changed to anything from Azure Portal.
    // If you use the email address to identify users and allow signing in from any tenant (`tenantId` is not set)
    // it opens up a possibility of spoofing users!

    return User.findOrCreate({ id: profile.id });
  }
);

authenticator.use(microsoftStrategy);

export default authenticator;
```

See [Microsoft docs](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow) for more information on `scope` and `prompt` parameters.

### Applications with single-tenant authentication (no multitenant allowed)

If you want to allow login only for users from a single organization, you should add the `tenantId` attribute to the configuration passed to `MicrosoftStrategy`.
The value of `tenantId` should be the **Directory (tenant) ID** found under **Overview** in your App Registration page.

You must also select **Accounts in this organizational directory** as Supported account types in your App Registration.

### Next steps

See the [Remix Auth documentation](https://sergiodxa.github.io/remix-auth/) on how to configure your routes, persist the session in a cookie, etc.

## Hexadrop Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

-   Respect **Semantic Versioning**: No breaking changes in patch or minor versions
-   No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
-   **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
-   **Tests** as documentation and usage examples
-   **Well documented README** showing how to install and use
-   **License favoring Open Source** and collaboration
