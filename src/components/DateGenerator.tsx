import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { MapPin, Clock, Car, Bus, Umbrella, CalendarCheck } from 'lucide-react';

interface DateInput {
  location: string;
  date: string;
  timeOfDay: string;
  interests: string;
  personality: string;
}

interface Activity {
  title: string;
  time: string;
  location: string;
  description: string;
  weather: 'Indoor' | 'Outdoor' | 'Both';
  transport: string[];
  tips: string[];
}

interface DateItinerary {
  title: string;
  activities: Activity[];
}

export function DateGenerator() {
  const [inputs, setInputs] = useState<DateInput>({
    location: '',
    date: '',
    timeOfDay: '',
    interests: '',
    personality: ''
  });
  const [dateItinerary, setDateItinerary] = useState<DateItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setInputs({ ...inputs, timeOfDay: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful date planning assistant. Generate creative and detailed date ideas based on the provided information.',
            },
            {
              role: 'user',
              content: `Plan a date in ${inputs.location} for ${inputs.date} during the ${inputs.timeOfDay}. 
                       My partner's interests: ${inputs.interests}
                       My partner's personality: ${inputs.personality}
                       Format the response as a JSON object with this structure:
                       {
                         "title": "string",
                         "activities": [
                           {
                             "title": "string",
                             "time": "string",
                             "location": "string",
                             "description": "string",
                             "weather": "Indoor" | "Outdoor" | "Both",
                             "transport": ["string"],
                             "tips": ["string"]
                           }
                         ]
                       }`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate date plan');
      }

      const data = await response.json();
      const parsedItinerary = JSON.parse(data.choices[0].message.content);
      setDateItinerary(parsedItinerary);
    } catch (error) {
      console.error('Error:', error);
      // Fallback to demo data
      setDateItinerary({
        title: "Perfect Evening Date in London",
        activities: [
          {
            title: "Sunset Dinner at Sky Garden",
            time: "6:30 PM",
            location: "20 Fenchurch Street, London",
            description: "Enjoy a romantic dinner with panoramic views of London's skyline",
            weather: "Indoor",
            transport: ["Underground", "Bus"],
            tips: [
              "Book a table in advance",
              "Smart casual dress code",
              "Arrive 15 minutes early for security check"
            ]
          },
          {
            title: "Thames River Evening Cruise",
            time: "8:30 PM",
            location: "Tower Pier, London",
            description: "Take a romantic cruise along the Thames with city lights",
            weather: "Both",
            transport: ["Walking", "Taxi"],
            tips: [
              "Bring a light jacket",
              "Pre-book tickets online",
              "Walking distance from Sky Garden"
            ]
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ActivityCard = ({ activity }: { activity: Activity }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-xl text-purple-800">{activity.title}</CardTitle>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{activity.time}</span>
          <MapPin className="h-4 w-4 ml-2" />
          <span>{activity.location}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{activity.description}</p>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">View Details</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl text-purple-800 mb-4">{activity.title}</DialogTitle>
              <DialogDescription>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-purple-700 mb-2">
                      <CalendarCheck className="h-5 w-5" />
                      <h3 className="font-semibold">Time & Location</h3>
                    </div>
                    <p className="text-gray-600">{activity.time} at {activity.location}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-purple-700 mb-2">
                      <Umbrella className="h-5 w-5" />
                      <h3 className="font-semibold">Setting</h3>
                    </div>
                    <p className="text-gray-600">{activity.weather} Activity</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-purple-700 mb-2">
                      <Car className="h-5 w-5" />
                      <h3 className="font-semibold">Transport Options</h3>
                    </div>
                    <div className="flex space-x-2">
                      {activity.transport.map((mode, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                          {mode === 'Underground' && <Bus className="h-4 w-4 mr-1" />}
                          {mode === 'Bus' && <Bus className="h-4 w-4 mr-1" />}
                          {mode}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-purple-700 mb-2">
                      <h3 className="font-semibold">Tips & Information</h3>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {activity.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  return (
    <Card className="backdrop-blur-sm bg-white/90">
      <CardHeader>
        <CardTitle>Plan Your Date</CardTitle>
        <CardDescription>Fill in the details to generate your perfect date plan</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Enter city or area"
              value={inputs.location}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={inputs.date}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeOfDay">Time of Day</Label>
            <Select onValueChange={handleSelectChange} value={inputs.timeOfDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select time of day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Partner's Interests</Label>
            <Textarea
              id="interests"
              name="interests"
              placeholder="What does your partner enjoy?"
              value={inputs.interests}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personality">Partner's Personality</Label>
            <Textarea
              id="personality"
              name="personality"
              placeholder="How would you describe your partner?"
              value={inputs.personality}
              onChange={handleInputChange}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Date Plan'}
        </Button>
      </CardFooter>

      {dateItinerary && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">{dateItinerary.title}</h2>
          {dateItinerary.activities.map((activity, index) => (
            <ActivityCard key={index} activity={activity} />
          ))}
        </div>
      )}
    </Card>
  );
}