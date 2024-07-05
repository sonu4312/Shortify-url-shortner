import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div>
      <main className="min-h-screen container">
        <Header />

        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        @ 2024 Shortify Inc. All rights reserved.
        {/* <div className="flex gap-10 justify-center items-center mt-3">
          <div className=" rounded-lg outline-none outline-slate-300">
            fac
          </div>
          <div className=" rounded-lg outline-none outline-slate-300">
            facebook
          </div>
          <div className=" rounded-lg outline-none outline-slate-300">
            facebook
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default AppLayout;
