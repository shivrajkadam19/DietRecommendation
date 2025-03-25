import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const sections = {
  diet_types: "Diet Recommendations",
  workouts: "Workout Options",
  breakfasts: "Breakfast Ideas",
  lunches: "Lunch Options",
  dinners: "Dinner Options",
  additional_tips: "Additional Tips"
};

const Recommendations = ({ recommendations }: { recommendations: any }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (recommendations && Object.keys(recommendations).length > 0) {
      setState(recommendations);
      setIsLoading(false);
    }
  }, [recommendations]);

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('Personalized Recommendations', 10, 10);

    let y = 20;
    Object.keys(sections).forEach((section) => {
      if (state[section]?.length) {
        pdf.setFontSize(14);
        pdf.text(sections[section], 10, y);
        y += 8;

        pdf.setFontSize(12);
        state[section].forEach((item: string, index: number) => {
          const splitText = pdf.splitTextToSize(`- ${item}`, 180);
          splitText.forEach((line) => {
            pdf.text(line, 12, y);
            y += 6;
            if (y > 280) {
              pdf.addPage();
              y = 10;
            }
          });
        });
        y += 8;
      }
    });

    pdf.save('Diet_Plan_Recommendations.pdf');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <button onClick={() => navigate(-1)} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">Go Back</button>
      <button onClick={handleDownloadPDF} className="bg-green-500 text-white px-4 py-2 rounded-md ml-4">Download as PDF</button>

      <h2 className="text-2xl font-semibold text-center text-blue-600">Personalized Recommendations</h2>
      <div id="recommendation-content">
        {isLoading ? (
          <p className="text-center text-gray-600 mt-4">Loading recommendations...</p>
        ) : state ? (
          Object.keys(sections).map((section) =>
            state[section]?.length ? (
              <div key={section} className="bg-gray-100 p-4 rounded-lg mt-4 shadow-md">
                <h3 className="text-lg font-semibold text-blue-600">{sections[section]}</h3>
                <ul className="mt-2 space-y-2">
                  {state[section].map((item: string, index: number) => (
                    <li key={index} className="p-2 bg-blue-50 rounded-md">{item}</li>
                  ))}
                </ul>
              </div>
            ) : null
          )
        ) : (
          <p className="text-center text-gray-600 mt-4">No recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;