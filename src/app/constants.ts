/**
 * A selection of various sound zones in the Soundtrack Stockholm office.
 * At least one of these zones should be playing music at any given time.
 * The value represents the "short ID" of the zone, which can be used to get
 * playback history without being authenticated.
 */
export const SOUNDTRACK_ZONES = {
  Lounge: 'BRGJFA',
  Listen: 'ODJECD',
  'Glass Room': 'SNLETO',
} as const
