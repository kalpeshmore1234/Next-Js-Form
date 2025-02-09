export default function ThankYou() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600">Thank You!</h1>
        <p className="mt-2 text-gray-600">Your form has been submitted successfully.</p>
        <a
          href="/contact"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Another
        </a>
      </div>
    </div>
  );
}
