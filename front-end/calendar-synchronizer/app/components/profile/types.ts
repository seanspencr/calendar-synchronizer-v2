/**
 * Types for the Profile page.
 * Derived from the OpenAPI CreateUserDto with additional response fields.
 */

/** User profile DTO — mirrors CreateUserDto with response-only fields */
export interface UserProfileDto {
  id: string;
  username: string;
  email: string;
  google_email?: string | null;
  microsoft_email?: string | null;
  avatarUrl?: string | null;
}
