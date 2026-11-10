import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(file, stubs = {}) {
  const exports = {};
  const compiled = ts.transpileModule(
    readFileSync(
      new URL('../src/components/auth/' + file, import.meta.url),
      'utf8'
    ),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }
  );
  new Function('exports', 'require', 'window', compiled.outputText)(
    exports,
    (name) => stubs[name] ?? require(name),
    { location: { origin: 'https://application.invalid' } }
  );
  return exports;
}
const adapters = load('environment-config.ts');
const defaults = load('auth-defaults.ts').I_AUTH_DEFAULTS;
const auth = load('auth-config.ts', {
  './auth-defaults': { I_AUTH_DEFAULTS: defaults },
  '@angular/core': { InjectionToken: class {} },
});
const environment = {
  releaseStage: 'development',
  platformApi: {
    identity: 'https://app.invalid/bff',
    user: 'https://iam.invalid/users',
    configuration: 'https://iam.invalid/configuration',
  },
  api: { crm: 'https://app.invalid/crm' },
  signinUrl: 'https://app.invalid/login',
  apiKey: 'fixture-key',
  appId: 'fixture-app',
};

test('environment mapping isolates platform endpoints and omits unspecified auth overrides', () => {
  const config = adapters.getIEnvironmentAuthConfig(environment);
  assert.equal(config.api, environment.platformApi);
  assert.equal(config.api.crm, undefined);
  assert.equal(config.apiKey, environment.apiKey);
  for (const key of [
    'tokenLifespan',
    'csrfTokenMaxAgeSeconds',
    'allowedReturnOrigins',
  ])
    assert.equal(Object.hasOwn(config, key), false);
});
test('auth defaults preserve existing lifetimes and require the application BFF', () => {
  const config = auth.getDefaultIAuthConfig();
  assert.equal(config.api.identity, '');
  assert.equal(config.signinUrl, '');
  assert.deepEqual(config.tokenLifespan, {
    accessTokenSeconds: 3600,
    refreshTokenSeconds: 7200,
    ssoSessionMaxSeconds: 54000,
  });
  assert.equal(config.csrfTokenMaxAgeSeconds, 7170);
  assert.deepEqual(config.allowedReturnOrigins, [
    'https://application.invalid',
  ]);
  assert.throws(() => auth.validateIAuthConfig(config));
});
test('partial overrides omit undefined values and retain explicit settings', () => {
  const config = adapters.getIEnvironmentAuthConfig({
    ...environment,
    tokenLifespan: { accessTokenSeconds: 900, refreshTokenSeconds: undefined },
    csrfTokenMaxAgeSeconds: 30,
    allowedReturnOrigins: ['https://approved.invalid'],
  });
  assert.deepEqual(config.tokenLifespan, { accessTokenSeconds: 900 });
  assert.deepEqual(
    { ...defaults.tokenLifespan, ...config.tokenLifespan },
    {
      accessTokenSeconds: 900,
      refreshTokenSeconds: 7200,
      ssoSessionMaxSeconds: 54000,
    }
  );
  assert.equal(config.csrfTokenMaxAgeSeconds, 30);
  assert.deepEqual(config.allowedReturnOrigins, ['https://approved.invalid']);
});
test('business endpoint lookup never falls back to platform APIs', () => {
  assert.equal(
    adapters.requireIEnvironmentApi(environment, 'crm'),
    'https://app.invalid/crm'
  );
  for (const name of ['identity', 'missing', 'toString'])
    assert.throws(
      () => adapters.requireIEnvironmentApi(environment, name),
      /Missing application environment endpoint/
    );
  assert.throws(() =>
    adapters.requireIEnvironmentApi({ ...environment, api: undefined }, 'crm')
  );
});
