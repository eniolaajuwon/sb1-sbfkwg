import { DateGenerator } from './components/DateGenerator';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-4 text-purple-900">Perfect Date Generator</h1>
        <p className="text-center text-purple-600 mb-8">Let's plan your perfect date</p>
        <DateGenerator />
      </div>
    </div>
  );
}