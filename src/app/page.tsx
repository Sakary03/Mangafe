import Footer from '../components/Footer';
import Header from '../components/Header';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <h1 className="text-4xl font-bold mt-10">Welcome to Mangaka website</h1>
      </main>
      <Footer />
    </>
  );
}
