import React from "react";

function MarginStatusCard({ margin }) {
  if (!margin) return null;

  const statusClass = margin.marginCall
    ? "bg-red-100 border border-red-400 text-red-800"
    : "bg-green-100 border border-green-400 text-green-800";

  return (
    <div className={`p-6 rounded shadow-md ${statusClass}`}>
      <h3 className="text-lg font-bold mb-2">Margin Status</h3>
      <ul className="text-sm space-y-1">
        <li><strong>Portfolio Value:</strong> ${margin.portfolioValue.toFixed(2)}</li>
        <li><strong>Loan Amount:</strong> ${margin.loanAmount.toFixed(2)}</li>
        <li><strong>Net Equity:</strong> ${margin.netEquity.toFixed(2)}</li>
        <li><strong>Margin Requirement:</strong> ${margin.marginRequirement.toFixed(2)}</li>
        <li><strong>Shortfall:</strong> ${margin.marginShortfall.toFixed(2)}</li>
      </ul>
      <p className="mt-4 font-semibold text-base">
        {margin.marginCall ? "⚠️ Margin Call Triggered!" : "✅ No Margin Call"}
      </p>
    </div>
  );
}

export default MarginStatusCard;