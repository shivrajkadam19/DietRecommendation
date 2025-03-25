import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FormPage } from "./FormPage";
import Recommendations from "./Recommendations";

const Header = () => (
  <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 text-center">
    <h1 className="text-3xl font-semibold">Welcome to FitLife</h1>
    <p>Your Personalized Diet & Workout Companion</p>
  </header>
);

const Content = () => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <h2 className="text-2xl font-semibold">Transform Your Health & Fitness</h2>
    <p className="text-gray-600 mt-2">
      Get customized diet plans and workout recommendations tailored to your lifestyle, goals, and dietary needs.
    </p>
    <Link to="/form" className="inline-block mt-4 px-6 py-3 bg-blue-500 text-white rounded-md text-lg transition hover:bg-blue-600">
      Get Started
    </Link>
  </div>
);

type TabsProps = {
  setActiveTab: (tab: string) => void;
};

const Tabs = ({ setActiveTab }: TabsProps) => (
  <div className="flex justify-center space-x-4 mt-4">
    <button onClick={() => setActiveTab("about")} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
      About Us
    </button>
    <button onClick={() => setActiveTab("features")} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
      Features
    </button>
  </div>
);

const About = () => (
  <div className="bg-gray-100 p-4 rounded-lg mt-4">
    <h3 className="text-xl font-semibold">About FitLife</h3>
    <p className="text-gray-700 mt-2">
      FitLife is designed to provide personalized diet and fitness plans based on your unique health conditions,
      lifestyle, and goals. Whether you're looking to lose weight, gain muscle, or maintain a healthy lifestyle, we have
      the right plan for you.
    </p>
  </div>
);

const Features = () => (
  <div className="bg-gray-100 p-4 rounded-lg mt-4">
    <h3 className="text-xl font-semibold">Key Features</h3>
    <ul className="list-disc list-inside text-gray-700 mt-2">
      <li>Customized diet plans based on your preferences</li>
      <li>Tailored workout recommendations for all fitness levels</li>
      <li>Healthy meal suggestions including breakfast, lunch, and dinner</li>
      <li>Additional wellness tips for hydration, supplements, and snacking</li>
    </ul>
  </div>
);

const Home = () => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Content />
      <Tabs setActiveTab={setActiveTab} />
      {activeTab === "about" ? <About /> : <Features />}
    </div>
  );
};

// export default function App() {
//   return (
//     <Router>
//       <div className="font-poppins bg-blue-50 min-h-screen">
//         <Header />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/form" element={<FormPage onSubmit={function (data: any): void {
//             throw new Error("Function not implemented.");
//           }} />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

const App = () => {
  const [recommendations, setRecommendations] = useState<any>(null);

  return (
    <Router>
      <div className="font-poppins bg-blue-50 min-h-screen">
        <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 text-center">
          <h1 className="text-3xl font-semibold">Welcome to FitLife</h1>
          <p>Your Personalized Diet & Workout Companion</p>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<FormPage onSubmit={setRecommendations} />} />
          <Route path="/recommendations" element={<Recommendations recommendations={recommendations} />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;

