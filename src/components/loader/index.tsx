import { useEffect, useState } from "react";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary-100">
        {/* Loader */}
        <div className="w-16 h-16 rounded-full border-4 border-primary-300 border-t-primary-600 animate-spin"></div>
      </div>
    );
  }

};

export default App;
