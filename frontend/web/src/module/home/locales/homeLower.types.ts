export type HomeLowerTestimonial = {
  id: number;
  stars: number;
  text: string;
  name: string;
  location: string;
  avatar: string;
};

export type HomeLowerGalleryItem = {
  label: string;
  img: string;
  tall?: boolean;
};

export type HomeLowerExploreItem = {
  label: string;
  img: string;
  size: "large" | "medium" | "small";
};

export type HomeLowerGuide = {
  id: number;
  title: string;
  date: string;
  image: string;
};

export type HomeLowerNews = {
  id: number;
  title: string;
  date: string;
  thumb: string;
};
