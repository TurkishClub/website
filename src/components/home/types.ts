export type Highlight = {
  _id: string;
  title: string;
  type?: string;
  description?: string;
  link?: string;
};

export type UpcomingEventData = {
  _id: string;
  name: string;
  embedUrl: string;
  time: string;
  location?: string;
};
