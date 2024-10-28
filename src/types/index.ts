export interface DateInput {
  location: string;
  date: string;
  timeOfDay: string;
  interests: string;
  personality: string;
}

export interface Activity {
  title: string;
  time: string;
  location: string;
  description: string;
  considerations: string;
  weather: string;
  travel: string;
}

export interface DateItinerary {
  title: string;
  activities: Activity[];
}

export type FormStep = 'location' | 'timing' | 'preferences' | 'review';