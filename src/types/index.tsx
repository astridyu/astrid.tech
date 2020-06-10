export interface WorkExperience {
  organization: string
  position: string
  location: string
  website: string
  startDate: string
  endDate?: string
  highlights: string[]
  tags: TagWrapper[]
  summary?: string
}

export interface Project {
  title: string
  status: null | "wip" | "complete" | "scrapped"
  description: string
  startDate: Date
  endDate: Date | null
  tags: TagWrapper[]
  url: string
  source: string[]
  thumbnailPublicPath?: string
}

export interface BlogPost {
  title: string
  date: Date
  description: string
  tags: TagWrapper[]
  content: string
}

export interface TagWrapper {
  slug?: string
  tag?: Tag
}

export interface Tag {
  name: string
  color: string
  textColor: string
  slug: string
}
