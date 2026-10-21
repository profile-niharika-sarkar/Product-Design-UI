/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ColumbusWidgetCard } from './components/ColumbusWidgetCard';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 sm:p-6 md:p-8 font-roboto selection:bg-[#39918d]/20 selection:text-[#0c2940]">
      {/* Columbus AI Voice Assistant Standalone Floating Modal Component */}
      <ColumbusWidgetCard />
    </div>
  );
}

