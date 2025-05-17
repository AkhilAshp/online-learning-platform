import React from 'react';

function WelcomeBanner() {
  return (
    <div className="rounded-2xl p-6 text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 shadow-xl mb-6">
      <h1 className="text-4xl font-black tracking-tight mb-2">
        Welcome Back! 👋
      </h1>
      <p className="text-lg font-semibold tracking-normal">
        Explore your dashboard, continue learning, and unlock powerful AI tools built for you.
      </p>
    </div>
  );
}

export default WelcomeBanner;
