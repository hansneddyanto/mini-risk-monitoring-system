function calculateMarginStatus(portfolioValue, loanAmount, mmr) {
  // Ensure all inputs are numbers
  const pv = parseFloat(portfolioValue);
  const loan = parseFloat(loanAmount);
  const required = parseFloat(mmr);

  const netEquity = pv - loan;
  const marginRequirement = required * pv;
  const marginShortfall = marginRequirement - netEquity;
  const marginCall = marginShortfall > 0;

  return {
    portfolioValue: pv,
    loanAmount: loan,
    netEquity,
    marginRequirement,
    marginShortfall,
    marginCall
  };
}

module.exports = { calculateMarginStatus };
