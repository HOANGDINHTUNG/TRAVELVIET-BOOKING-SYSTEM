export type DestinationMediaType = 'IMAGE' | 'VIDEO' | 'COVER' | 'BANNER' | string

export type DestinationMedia = {
  id: number
  mediaType?: DestinationMediaType
  mediaUrl?: string
  url: string
  altText?: string
  sortOrder?: number
  isActive?: boolean
}

export type DestinationFood = {
  id: number
  foodName: string
  description?: string
  isFeatured?: boolean
}

export type DestinationSpecialty = {
  id: number
  specialtyName: string
  description?: string
}

export type DestinationActivity = {
  id: number
  activityName: string
  description?: string
  activityScore?: number | string
}

export type DestinationTip = {
  id: number
  tipTitle: string
  tipContent?: string
  sortOrder?: number
}

export type DestinationEvent = {
  id: number
  eventName: string
  eventType?: string
  description?: string
  startsAt?: string
  endsAt?: string
  notifyAllFollowers?: boolean
  isActive?: boolean
}

export type BackendDestinationDetail = {
  uuid: string
  name: string
  slug?: string
  countryCode?: string
  province?: string
  district?: string
  region?: string
  address?: string
  latitude?: number | string
  longitude?: number | string
  shortDescription?: string
  description?: string
  bestTimeFromMonth?: number
  bestTimeToMonth?: number
  crowdLevelDefault?: string
  isFeatured?: boolean
  mediaList?: Array<Omit<DestinationMedia, 'url'>>
  foods?: DestinationFood[]
  specialties?: DestinationSpecialty[]
  activities?: DestinationActivity[]
  tips?: DestinationTip[]
  events?: DestinationEvent[]
}

export type DestinationDetail = Omit<BackendDestinationDetail, 'mediaList'> & {
  mediaList: DestinationMedia[]
  coverImage: string
  foods: DestinationFood[]
  specialties: DestinationSpecialty[]
  activities: DestinationActivity[]
  tips: DestinationTip[]
  events: DestinationEvent[]
}
