import React from 'react'

interface HelpOverlayProps {
  onClose: () => void
}

export default function HelpOverlay({ onClose }: HelpOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-gray-800">
        <h2 className="text-xl font-bold mb-4 text-center">How to Use</h2>
        <p className="mb-2">Select letters below to cycle through available (blue), required (green) and excluded (red). Matching words appear instantly.</p>
        <p className="mb-4">Use the dropdown to sort results. Only the first 1000 words are shown.</p>
        <button
          aria-label="Close help"
          onClick={onClose}
          className="mx-auto mt-2 block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  )
}
