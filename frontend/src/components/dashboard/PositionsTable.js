import React from "react";

function PositionsTable({ positions }) {
  return (
    <>
      <h3 className="text-lg font-bold mb-2 text-gray-700">Positions</h3>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border rounded bg-white shadow">
          <thead className="bg-gray-200 text-sm text-left">
            <tr>
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Cost Basis</th>
              <th className="px-4 py-2">Current Price</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, i) => (
              <tr key={i} className="border-t text-sm">
                <td className="px-4 py-2">{pos.symbol}</td>
                <td className="px-4 py-2">{pos.quantity}</td>
                <td className="px-4 py-2">${pos.cost_basis}</td>
                <td className="px-4 py-2">${pos.current_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PositionsTable;
