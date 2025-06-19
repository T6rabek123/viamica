import {
  useState,
  FC,
  FormEvent,
  ChangeEvent,
  ReactNode,
  useEffect,
} from 'react';

// --- HELPER & UI COMPONENTS ---
const StarIcon: FC<{ className?: string }> = ({
  className = 'w-5 h-5 text-yellow-400',
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Spinner: FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
    <p className="text-lg text-gray-700">Crafting your perfect journey...</p>
  </div>
);

// --- DASHBOARD COMPONENTS ---
const StatCard: FC<{ title: string; value: string; icon: ReactNode }> = ({
  title,
  value,
  icon,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4">
    <div className="bg-indigo-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const BarChart: FC<{ data: { name: string; value: number }[] }> = ({
  data,
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Trips by Interest
      </h3>
      <div className="space-y-4">
        {data.map(item => (
          <div key={item.name} className="flex items-center">
            <span className="w-24 text-gray-600">{item.name}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6">
              <div
                className="bg-indigo-500 h-6 rounded-full text-white text-sm flex items-center justify-center"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              >
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- HOME PAGE COMPONENTS ---
const DestinationCard: FC<{ name: string; image: string }> = ({
  name,
  image,
}) => (
  <div className="relative overflow-hidden rounded-xl shadow-lg group">
    <img
      src={image}
      alt={name}
      className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white">
      {name}
    </h3>
  </div>
);

const TourCard: FC<{
  image: string;
  title: string;
  duration: string;
  price: string;
  rating: number;
}> = ({ image, title, duration, price, rating }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <img className="w-full h-56 object-cover" src={image} alt={title} />
    <div className="p-6">
      <h4 className="text-xl font-semibold text-gray-800 mb-2">{title}</h4>
      <div className="flex items-center justify-between text-gray-600">
        <span>{duration}</span>
        <div className="flex items-center">
          <StarIcon />
          <span className="ml-1">{rating}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-4">{price}</p>
    </div>
  </div>
);

const TestimonialCard: FC<{
  quote: string;
  author: string;
  location: string;
  avatar: string;
}> = ({ quote, author, location, avatar }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg">
    <div className="flex items-center mb-4">
      <img
        className="w-14 h-14 rounded-full object-cover mr-4"
        src={avatar}
        alt={author}
      />
      <div>
        <p className="font-bold text-gray-800">{author}</p>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </div>
    <p className="text-gray-600 italic">"{quote}"</p>
  </div>
);

// --- PLAN MY TRIP COMPONENTS ---
const initialFormData = {
  destination: 'Uzbekistan',
  days: 7,
  budget: 'Mid-range',
  interests: [] as string[],
  travelPace: 'Moderate',
  accommodation: 'Boutique Hotels',
  companions: 'Couple',
  transport: 'High-speed Train',
  mustSeeCities: ['Tashkent', 'Samarkand', 'Bukhara'] as string[],
  dietary: 'No specific needs',
};

type FormData = typeof initialFormData;

const StepInput: FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <label className="text-xl font-semibold text-gray-700 block text-left mb-4">
      {label}
    </label>
    {children}
  </div>
);

const MultiSelectButton: FC<{
  text: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ text, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-4 w-full rounded-lg text-lg transition-colors duration-200 border-2 ${
      isSelected
        ? 'bg-indigo-600 text-white font-bold border-indigo-600'
        : 'bg-gray-100 hover:bg-gray-200 border-transparent'
    }`}
  >
    {text}
  </button>
);

const PlanMyTripPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 4;

  const handleMultiSelect = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(i => i !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const generatePrompt = () => {
    return `
        Act as an expert travel agent for Viamica, a premium travel company specializing in Central Asia.
        A client has provided the following preferences for a trip to Uzbekistan. Generate a highly detailed, inspiring, and practical day-by-day itinerary.
        
        **Client's Trip Preferences:**
        - **Duration:** ${formData.days} days
        - **Destination:** ${formData.destination}
        - **Must-See Cities:** ${formData.mustSeeCities.join(', ')}
        - **Travel Style:**
          - **Pace:** ${formData.travelPace}
          - **Companions:** Traveling as a ${formData.companions}
          - **Budget:** ${formData.budget}
          - **Accommodation Preference:** ${formData.accommodation}
        - **Interests:** ${formData.interests.join(', ')}
        - **Internal Transport:** Prefers to travel by ${formData.transport}
        - **Dietary Notes:** ${formData.dietary}

        **Your Task:**
        Create a Markdown-formatted itinerary that feels personal and expertly curated. For each day, include:
        1.  **A catchy title** for the day (e.g., "Day 1: Tashkent's Modern Heartbeat").
        2.  **Morning, Afternoon, and Evening activities.** Mention specific landmarks (like Registan Square, Amir Temur Square, Chorsu Bazaar, Lyabi-Hauz, Kalon Minaret, Ichan-Kala).
        3.  **Dining suggestions** that match the client's budget (e.g., "for a luxury experience, try...", "for authentic local food, visit...", "a great mid-range option is...").
        4.  **Logistical notes,** like travel between cities (e.g., "Take the Afrosiyob high-speed train to Samarkand...").
        5.  **Viamica's special touch:** Add small, unique experience suggestions based on their interests (e.g., if they like 'Food', suggest a plov-making class; if 'Culture', suggest a visit to a local artisan's workshop; if 'Photography', mention the best time for photos at a certain spot).
        6.  Start with a friendly, welcoming introduction and end with an encouraging closing statement.
        `;
  };

  const generateItinerary = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    const prompt = generatePrompt();

    try {
      const chatHistory = [{ role: 'user', parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = ''; // Leave blank, handled by environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setItinerary(text);
      } else {
        throw new Error('No itinerary was generated. Please try again.');
      }
    } catch (err: any) {
      setError(
        err.message ||
          'Failed to generate itinerary. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <StepInput label="1. Which cities are on your must-see list?">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  'Tashkent',
                  'Samarkand',
                  'Bukhara',
                  'Khiva',
                  'Fergana Valley',
                  'Nukus',
                ].map(city => (
                  <MultiSelectButton
                    key={city}
                    text={city}
                    isSelected={formData.mustSeeCities.includes(city)}
                    onClick={() => handleMultiSelect('mustSeeCities', city)}
                  />
                ))}
              </div>
            </StepInput>
            <StepInput label="2. How many days are you planning to travel?">
              <div className="flex items-center">
                <input
                  type="range"
                  id="days"
                  name="days"
                  min="5"
                  max="21"
                  value={formData.days}
                  onChange={e =>
                    setFormData({ ...formData, days: Number(e.target.value) })
                  }
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb-indigo"
                />
                <span className="ml-4 text-lg font-bold text-indigo-600 w-20 text-center">
                  {formData.days} days
                </span>
              </div>
            </StepInput>
          </>
        );
      case 2:
        return (
          <>
            <StepInput label="3. What's your desired travel pace?">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Relaxed', 'Moderate', 'Fast-paced'].map(p => (
                  <MultiSelectButton
                    key={p}
                    text={p}
                    isSelected={formData.travelPace === p}
                    onClick={() => setFormData({ ...formData, travelPace: p })}
                  />
                ))}
              </div>
            </StepInput>
            <StepInput label="4. What kind of accommodation do you prefer?">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Hostels', 'Boutique Hotels', 'Luxury Hotels'].map(a => (
                  <MultiSelectButton
                    key={a}
                    text={a}
                    isSelected={formData.accommodation === a}
                    onClick={() =>
                      setFormData({ ...formData, accommodation: a })
                    }
                  />
                ))}
              </div>
            </StepInput>
            <StepInput label="5. And what's your approximate budget?">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Budget', 'Mid-range', 'Luxury'].map(b => (
                  <MultiSelectButton
                    key={b}
                    text={b}
                    isSelected={formData.budget === b}
                    onClick={() => setFormData({ ...formData, budget: b })}
                  />
                ))}
              </div>
            </StepInput>
          </>
        );
      case 3:
        return (
          <>
            <StepInput label="6. What are your main interests? (select up to 4)">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  'Culture',
                  'History',
                  'Food',
                  'Adventure',
                  'Nature',
                  'Photography',
                  'Shopping',
                  'Relaxation',
                ].map(interest => (
                  <MultiSelectButton
                    key={interest}
                    text={interest}
                    isSelected={formData.interests.includes(interest)}
                    onClick={() => handleMultiSelect('interests', interest)}
                  />
                ))}
              </div>
            </StepInput>
            <StepInput label="7. How do you prefer to travel between cities?">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['High-speed Train', 'Private Car', 'Domestic Flights'].map(
                  t => (
                    <MultiSelectButton
                      key={t}
                      text={t}
                      isSelected={formData.transport === t}
                      onClick={() => setFormData({ ...formData, transport: t })}
                    />
                  )
                )}
              </div>
            </StepInput>
          </>
        );
      case 4:
        return (
          <>
            <StepInput label="8. Who are you traveling with?">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Solo', 'Couple', 'Family', 'Friends'].map(c => (
                  <MultiSelectButton
                    key={c}
                    text={c}
                    isSelected={formData.companions === c}
                    onClick={() => setFormData({ ...formData, companions: c })}
                  />
                ))}
              </div>
            </StepInput>
            <StepInput label="9. Any dietary needs or preferences?">
              <input
                type="text"
                name="dietary"
                value={formData.dietary}
                onChange={e =>
                  setFormData({ ...formData, dietary: e.target.value })
                }
                className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                placeholder="e.g., Vegetarian, Gluten-free..."
              />
            </StepInput>
            <StepInput label="10. Your Destination">
              <select
                name="destination"
                value={formData.destination}
                onChange={e =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                className="w-full p-4 border border-gray-300 rounded-lg text-lg"
              >
                <option>Uzbekistan</option>
              </select>
              <p className="text-sm text-gray-500 mt-2 text-left">
                More destinations coming soon!
              </p>
            </StepInput>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div id="plan-trip" className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900">
          Let's Craft Your Dream Trip
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          This smart itinerary planner will create a personalized journey just
          for you.
        </p>

        <div className="mt-12 max-w-4xl mx-auto">
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-left">
              <p className="font-bold">Oops! Something went wrong.</p>
              <p>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(false);
                }}
                className="mt-4 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : itinerary ? (
            <div className="bg-white p-8 rounded-2xl shadow-xl text-left prose lg:prose-xl max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: itinerary
                    .replace(/\n/g, '<br />')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(
                      /### (.*)/g,
                      '<h3 class="text-2xl font-bold text-gray-900 mt-6 mb-2">$1</h3>'
                    )
                    .replace(
                      /#### (.*)/g,
                      '<h4 class="text-xl font-semibold text-indigo-700 mt-4 mb-2">$1</h4>'
                    ),
                }}
              />
              <button
                onClick={() => {
                  setItinerary(null);
                  setFormData(initialFormData);
                  setStep(1);
                }}
                className="mt-8 w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-800 transition duration-300 no-prose"
              >
                Plan Another Trip
              </button>
            </div>
          ) : (
            <form
              onSubmit={generateItinerary}
              className="bg-white p-8 rounded-2xl shadow-xl space-y-8"
            >
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
              </div>

              {renderFormStep()}

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  disabled={step === 1}
                  className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-700 transition duration-300 disabled:bg-gray-300"
                >
                  Back
                </button>
                {step === totalSteps ? (
                  <button
                    type="submit"
                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition duration-300"
                  >
                    Generate My Itinerary!
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(s => s + 1)}
                    disabled={step === totalSteps}
                    className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition duration-300"
                  >
                    Next
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// --- "PAGES" ---
const HomePage: FC<{ setPage: (page: string) => void }> = ({ setPage }) => (
  <>
    <section className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <img
        src="https://images.unsplash.com/photo-1615438833314-5141d6364b63?q=80&w=2070&auto=format&fit=crop"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Mountain landscape"
      />
      <div className="relative z-10 text-center text-white px-4">
        <h2 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">
          Travel Smart. Travel Soulfully.
        </h2>
        <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-md">
          Discover the heart of Central Asia with curated experiences by
          Viamica.
        </p>
        <button
          onClick={() => setPage('plan-trip')}
          className="mt-10 inline-block bg-indigo-600 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
        >
          Start Planning Your Adventure
        </button>
      </div>
    </section>
    <section id="destinations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center">
          Top Destinations
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <DestinationCard
            name="Uzbekistan"
            image="https://images.unsplash.com/photo-1597088274342-35e6a849312c?q=80&w=1964&auto=format&fit=crop"
          />
          <DestinationCard
            name="Tajikistan"
            image="https://images.unsplash.com/photo-1589311384414-727957774012?q=80&w=1974&auto=format&fit=crop"
          />
          <DestinationCard
            name="Kyrgyzstan"
            image="https://images.unsplash.com/photo-1598994233633-91185a4a5843?q=80&w=1974&auto=format&fit=crop"
          />
          <DestinationCard
            name="Kazakhstan"
            image="https://images.unsplash.com/photo-1551829142-d6c5b59f3458?q=80&w=1974&auto=format&fit=crop"
          />
        </div>
      </div>
    </section>
    <section id="tours" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center">
          Featured Experiences
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <TourCard
            image="https://images.unsplash.com/photo-1576472499149-88fee581a949?q=80&w=1935&auto=format&fit=crop"
            title="Samarkand's Silk Road Wonders"
            duration="5 Days"
            price="$1,200"
            rating={4.9}
          />
          <TourCard
            image="https://images.unsplash.com/photo-1601728232427-4632a514d3a6?q=80&w=2070&auto=format&fit=crop"
            title="Fann Mountains Trekking Adventure"
            duration="10 Days"
            price="$2,500"
            rating={5.0}
          />
          <TourCard
            image="https://images.unsplash.com/photo-1631846313888-2374e53b4792?q=80&w=1974&auto=format&fit=crop"
            title="Nomad's Life in Issyk-Kul"
            duration="7 Days"
            price="$1,800"
            rating={4.8}
          />
        </div>
      </div>
    </section>
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center">
          What Our Travelers Say
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          <TestimonialCard
            quote="Viamica organized the most seamless and enriching trip to Uzbekistan. Every detail was perfect, from the guides to the accommodation."
            author="Jessica L."
            location="New York, USA"
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
          />
          <TestimonialCard
            quote="The trekking tour in Tajikistan was breathtaking. The Viamica team was professional, knowledgeable, and made us feel safe and welcome."
            author="David C."
            location="London, UK"
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
          />
        </div>
      </div>
    </section>
  </>
);

const DashboardPage: FC<{ setPage: (page: string) => void }> = ({
  setPage,
}) => {
  const chartData = [
    { name: 'Culture', value: 8 },
    { name: 'History', value: 12 },
    { name: 'Food', value: 5 },
    { name: 'Adventure', value: 3 },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome Back, Alex!
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Here's your travel dashboard.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Trips Planned"
            value="4"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10h6"
                />
              </svg>
            }
          />
          <StatCard
            title="Countries Visited"
            value="1"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.8 14.945l.245.245a2 2 0 002.828 0l.245-.245M12 12a3 3 0 100-6 3 3 0 000 6z"
                />
              </svg>
            }
          />
          <StatCard
            title="Next Trip"
            value="Bukhara"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BarChart data={chartData} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setPage('plan-trip')}
                className="w-full text-left p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition"
              >
                Plan a New Trip
              </button>
              <button className="w-full text-left p-4 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold transition">
                View My Profile
              </button>
              <button className="w-full text-left p-4 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold transition">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            My Saved Itineraries
          </h3>
          <div className="space-y-4">
            {/* Placeholder for saved itineraries */}
            <div className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg">
                  Uzbekistan Silk Road Journey
                </h4>
                <p className="text-sm text-gray-500">
                  10 Days | Samarkand, Bukhara, Khiva
                </p>
              </div>
              <button className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700">
                View
              </button>
            </div>
            <div className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg">Tashkent Cultural Weekend</h4>
                <p className="text-sm text-gray-500">3 Days | Tashkent</p>
              </div>
              <button className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700">
                View
              </button>
            </div>
            <div className="text-center text-gray-500 p-4">
              More saved itineraries will appear here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP CONTAINER ---
export default function ViamicaLandingPage() {
  const [page, setPage] = useState('home'); // 'home', 'plan-trip', 'dashboard'

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const NavLink: FC<{ pageName: string; children: ReactNode }> = ({
    pageName,
    children,
  }) => (
    <button
      onClick={() => setPage(pageName)}
      className="text-white hover:text-gray-200 transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white">
      <style>{`
                .range-thumb-indigo::-webkit-slider-thumb { appearance: none; width: 24px; height: 24px; background: #4f46e5; cursor: pointer; border-radius: 50%; }
                .range-thumb-indigo::-moz-range-thumb { width: 24px; height: 24px; background: #4f46e5; cursor: pointer; border-radius: 50%; border: none; }
            `}</style>

      <header
        className={`py-4 z-20 ${
          page === 'home'
            ? 'absolute top-0 left-0 right-0'
            : 'sticky top-0 bg-gray-900 shadow-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <button
            onClick={() => setPage('home')}
            className="text-3xl font-bold text-white"
          >
            Viamica
          </button>
          <nav className="hidden md:flex space-x-8 items-center">
            <NavLink pageName="home">Home</NavLink>
            <NavLink pageName="plan-trip">Plan My Trip</NavLink>
            <NavLink pageName="dashboard">Dashboard</NavLink>
          </nav>
          <button className="bg-white text-indigo-600 font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition">
            Contact Us
          </button>
        </div>
      </header>

      <main>
        {page === 'home' && <HomePage setPage={setPage} />}
        {page === 'plan-trip' && <PlanMyTripPage />}
        {page === 'dashboard' && <DashboardPage setPage={setPage} />}
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold">Viamica</h3>
              <p className="mt-2 text-gray-400">
                Travel Smart. Travel Soulfully.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Explore</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <button
                    onClick={() => setPage('home')}
                    className="text-gray-400 hover:text-white"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('plan-trip')}
                    className="text-gray-400 hover:text-white"
                  >
                    Plan Your Trip
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('dashboard')}
                    className="text-gray-400 hover:text-white"
                  >
                    Dashboard
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Connect</h3>
              {/* Social Icons here */}
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Viamica. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
