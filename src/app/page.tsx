'use client';

import Link from 'next/link';
import Image from 'next/image';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="bg-blue-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn. Grow. Succeed.</h1>
        <p className="text-lg md:text-xl mb-8">
          Your journey to knowledge starts here.
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-white text-blue-700 px-6 py-3 font-semibold rounded hover:bg-gray-200"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white text-blue-700 px-6 py-3 font-semibold rounded hover:bg-gray-200"
          >
            Register
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3 text-center">
          <div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-gray-600">Visualize your learning journey with progress bars and completions.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Learn Anytime</h3>
            <p className="text-gray-600">Access lectures and notes 24/7 from anywhere in the world.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Expert Instructors</h3>
            <p className="text-gray-600">Learn from experienced educators with real-world insights.</p>
          </div>
        </div>
      </section>

      {/* Sample Courses */}
      <section className="py-16 px-6">
        <h2 className="text-2xl font-bold text-center mb-10">Popular Courses</h2>
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((course) => (
            <div key={course} className="border rounded shadow p-4">
              <Image
                // src={`https://source.unsplash.com/400x250/?learning,education,tech&sig=${course}`}
                src={`https://i.ibb.co/zVVPLhFJ/thumbnail.jpg`}
                alt="Course thumbnail"
                width={400}
                height={250}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="font-semibold text-lg mb-1">Course Title {course}</h3>
              <p className="text-sm text-gray-600">Learn the fundamentals of tech and improve your career today.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 border-t mt-auto">
        &copy; {new Date().getFullYear()} Minimal LMS by Datapollex. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
