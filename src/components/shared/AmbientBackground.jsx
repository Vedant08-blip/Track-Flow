import React from 'react';

const AmbientBackground = () => {
  return (
    <>
      <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/20 dark:bg-primary/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed top-[40%] right-[-10%] w-[400px] h-[400px] bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-purple-500/10 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
    </>
  );
};

export default AmbientBackground;
