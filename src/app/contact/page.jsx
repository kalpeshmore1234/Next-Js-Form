"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie

export default function ContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
  const [remainingDigits, setRemainingDigits] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Effect to submit form automatically when mobile reaches 10 digits
  useEffect(() => {
    if (formData.mobile.length === 10) {
      handleSubmit();
    }
  }, [formData.mobile]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData((prev) => ({ ...prev, mobile: value }));
        setRemainingDigits(10 - value.length);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    // Validate mobile number (must start with 6-9 and have exactly 10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setMessage("Invalid mobile number.");
      setLoading(false);
      return;
    }

    // Get stored mobile numbers from cookies
    const storedNumbers = Cookies.get("submittedNumbers");
    const submittedNumbers = storedNumbers ? JSON.parse(storedNumbers) : [];

    // Check if the number is already submitted within the last 7 days
    if (submittedNumbers.includes(formData.mobile)) {
      setMessage("This mobile number has already been used in the past week.");
      setLoading(false);
      return;
    }

    try {
      // Store the number in cookies with an expiry of 7 days
      const updatedNumbers = [...submittedNumbers, formData.mobile];
      Cookies.set("submittedNumbers", JSON.stringify(updatedNumbers), { expires: 7 });

      setMessage("Form submitted successfully!");
      
      setTimeout(() => {
        router.push("/thank-you");
      }, 1000);
    } catch (error) {
      setMessage("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-3">
      {loading && (
        <div className="loading-overlay">
          <img src="./loader.gif" alt="Loading..." className="loading-gif" />
        </div>
      )}

      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h2 className="text-2xl font-bold text-center mb-4">Contact Us</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              pattern="\d{10}"
              maxLength="10"
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {remainingDigits > 0 && (
              <p className="text-sm text-gray-500">{remainingDigits} digits remaining</p>
            )}
          </div>
        </form>
        {message && <p className="text-center text-red-600">{message}</p>}
      </div>

      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .loading-gif {
          width: 80px;
        }
      `}</style>
    </div>
  );
}
