import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type User = Profile & { subscription?: Subscription }

