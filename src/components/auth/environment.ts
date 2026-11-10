/** BFF/session and IAM service URLs, separate from application business APIs. */
export interface IPlatformApi {
  /** This application's session backend/BFF; IAM itself uses its identity service. No default host. */
  identity: string;
  /** IAM user, menu and authorization service URL. Required for every consumer. */
  user: string;
  /** IAM configuration/error-catalog service URL. Required for every consumer. */
  configuration: string;
  /** Additional platform service URLs, such as application, apim or notification. */
  [service: string]: string;
}

/** Shared consumer configuration. Optional feature fields only affect code that reads them. */
export interface IEnvironment {
  /** Deployment stage, for example local, development, staging or production. No default. */
  releaseStage: string;
  /** Required BFF/session and IAM endpoints. These are passed to the auth runtime. */
  platformApi: IPlatformApi;
  /** Business endpoints owned by this application. Omit when none are needed; URLs do not activate features. */
  api?: { [service: string]: string };
  /** This application's sign-in page or BFF login URL. No default. */
  signinUrl: string;
  /** Registered application key used by the existing platform and business transports. No default. */
  apiKey: string;
  /** Registered application identifier used by application-scoped services. No default. */
  appId: string;
  /** Host or standalone shell profile destination. Omit to keep the sidebar's existing fallback. */
  personalProfileUrl?: string;
  /** Auth redirect allowlist override. Omit to allow the current origin; does not modify another runtime. */
  allowedReturnOrigins?: string[];
  /** Auth timing overrides in seconds. Omitted values use library defaults (3600, 7200, 54000). */
  tokenLifespan?: {
    /** Access-token fallback lifetime. Default: 3600 seconds. */
    accessTokenSeconds?: number;
    /** Refresh-token fallback lifetime. Default: 7200 seconds. */
    refreshTokenSeconds?: number;
    /** Maximum SSO session lifetime. Default: 54000 seconds. */
    ssoSessionMaxSeconds?: number;
  };
  /** CSRF cache lifetime override in seconds. Omit for the library default of 7170. */
  csrfTokenMaxAgeSeconds?: number;
  /** Standalone router basename; omitted uses '/'. Supplying it does not change a host's mount path. */
  basePath?: string;
  /** Docs SSO content base URL/path; omitted uses the current origin. Does not register documentation routes. */
  docsContentBase?: string;
  /** Venus preview storage isolation flag; omitted is false. Supplying it does not enable mock mode. */
  preview?: boolean;
  /** Atlas notification controller settings; omitted leaves notifications unconfigured. Supplying them does not start a controller. */
  notification?: {
    /** Destination opened by notification navigation. Required when the controller is enabled. */
    centralNotificationUrl: string;
    /** Polling interval used by the notification controller, in milliseconds. */
    refreshIntervalMs: number;
    /** Notification snackbar duration, in milliseconds. */
    snackbarDurationMs: number;
  };
  /** IAM password-policy fallback flag; omitted uses true (strict policy). Supplying it does not enable IAM flows. */
  securityMode?: boolean;
  /** IAM MFA challenge timeout override. Omit for the existing 300-second fallback. */
  mfaChallengeSessionTimeoutSeconds?: number;
  /** IAM reCAPTCHA site keys; IAM requires both keys. Omitted means unconfigured in other consumers; keys do not activate the feature. */
  recaptcha?: {
    /** Site key read by IAM's reCAPTCHA v3 flow. */
    v3SiteKey: string;
    /** Site key read by IAM's reCAPTCHA v2 fallback flow. */
    v2SiteKey: string;
  };
  /** IAM opt-in feature settings; omitted keeps the test header disabled. Supplying them does not activate features in other consumers. */
  features?: {
    /** Enables IAM's existing application-key test header only. Omit/false leaves it disabled. */
    enableApiKeyHeader: boolean;
  };
  /** IAM manual test credential, used only with features.enableApiKeyHeader. No default. */
  applicationApiKeyForTesting?: string;
  /** Finance business storage namespace. Required by Finance; does not create storage automatically. */
  storageNamespace?: string;
  /** Finance legacy uploaded-asset base URL, separate from API endpoints. No default. */
  legacyAssetBaseUrl?: string;
  /** Existing business audit username mapping. Empty/omitted keeps the owning feature unavailable. */
  auditUsernameSource?: string;
  /** Venus FMS username mapping. Empty/omitted keeps the owning feature unavailable. */
  fmsUsernameSource?: string;
  /** BOQ/Venus secondary credential realm. Empty/omitted keeps realm-dependent operations unavailable. */
  realmId?: string;
  /** BOQ mapping from IAM company IDs to business company codes; omitted leaves mappings unavailable. Supplying it does not grant access. */
  companyCodeByIamId?: Readonly<Record<string, string>>;
}
