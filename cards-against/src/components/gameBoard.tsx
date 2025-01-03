import React from "react";

const GameBoard = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-[3] flex justify-center">
        <div className="container flex items-center border align-center">
          <div className="flex flex-col gap-2">
            <div className="">
              <div className="w-[200px] p-4 bg-black text-white h-[240px] border-2 border-slate-900 rounded hover:scale-110">
                The boy who sucks the farts out of my sweatpants.
              </div>
            </div>
            <div className="flex flex-row gap-2 ">
              <div className="w-[200px] h-[240px] p-4 border-2 border-slate-900 rounded hover:scale-110">
                The boy who sucks the farts out of my sweatpants.
              </div>
              <div className="w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded hover:scale-110">
                The boy who sucks the farts out of my sweatpants.
              </div>
              <div className="w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded hover:scale-110">
                The boy who sucks the farts out of my sweatpants.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-[1] flex flex-row gap-4">
        <div className="w-[250px] p-4 border border-slate bg-red-400">
          <ul>
            <ol>anders</ol>
            <ol>anders</ol>
            <ol>anders</ol>
          </ul>
        </div>
        <div className="flex flex-row gap-2">
          <div className="w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded hover:scale-110">
            The boy who sucks the farts out of my sweatpants.
          </div>
          <div className="w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded hover:scale-110">
            The boy who sucks the farts out of my sweatpants.
          </div>
          <div className="w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded hover:scale-110">
            The boy who sucks the farts out of my sweatpants.
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
