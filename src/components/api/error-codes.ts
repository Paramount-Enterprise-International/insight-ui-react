/**
 * Known API error codes surfaced by the platform services (mirrors the
 * iam-user-api error catalog — see `iam-user-api/src/common/errors/user-errors.ts`).
 *
 * Consumers branch on these to tailor UX (e.g. showing the "Access Unavailable"
 * page when the current user has no application mapping).
 */
export const USER_APPLICATION_MAPPING_NOT_FOUND = 'USER_APPLICATION_MAPPING_NOT_FOUND' as const;

/** Union of error codes the @insight/ui consumers may need to branch on. */
export type KnownErrorCode = typeof USER_APPLICATION_MAPPING_NOT_FOUND;
