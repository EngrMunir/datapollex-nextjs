'use client';

import Link from "next/link";

const Topbar = () => {
 

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <p>Welcome</p>
    <Link href="/">  <button className="bg-red-500 text-white px-4 py-1 rounded">Logout</button></Link>
    </div>
  );
};

export default Topbar;
