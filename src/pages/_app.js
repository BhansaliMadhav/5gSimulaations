import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

// components/Footer.js
const Footer = () => {
  return (
    <footer className="w-full py-4 bg-gray-800 text-white text-center mt-8">
      <p>Made in hurry by Madhav Bhansali 😆, Roll Number: 621206 </p>
    </footer>
  );
};
