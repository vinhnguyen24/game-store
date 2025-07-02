export const getSuggestedPrice = (account: {
  vipLevel: number;
  speed: number;
  talent: number;
  equipment: number;
  tickets: number;
  keyRally: boolean;
}) => {
  let basePrice = 0;

  // VIP level
  if (account.vipLevel >= 20) basePrice += 60000000; // 60tr
  else if (account.vipLevel >= 19) basePrice += 30000000; // 30tr
  else if (account.vipLevel >= 18) basePrice += 10000000; // 10tr
  else if (account.vipLevel >= 17) basePrice += 5000000; // 5tr
  else if (account.vipLevel >= 16) basePrice += 3000000; // 3tr
  else if (account.vipLevel >= 15) basePrice += 1000000; // 1tr
  else basePrice += 500000;

  // Speedups (1000 speed = 1tr)
  basePrice +=
    (account.speed / 1000) *
    1_000_000 *
    (account.vipLevel >= 20 ? 3 : account.vipLevel >= 18 ? 2 : 1);

  // Equipment
  if (account.equipment >= 56) basePrice += 15000000; // 7 set: 15tr
  else if (account.equipment >= 48) basePrice += 8000000; // 6 set: 8tr
  else if (account.equipment >= 40) basePrice += 2000000; // 5 set: 2tr
  else basePrice += 0;

  if (account.talent >= 30) basePrice += 10000000; // 30 talent: 10tr
  else if (account.talent >= 20) basePrice += 5000000; // 20 talent: 5tr
  else if (account.talent >= 10) basePrice += 2000000; // 10 talent: 2tr
  else basePrice += 0;

  if (account.tickets >= 40)
    basePrice += account.vipLevel >= 18 ? 5000000 : 2000000;
  else if (account.talent >= 30)
    basePrice += account.vipLevel >= 18 ? 2000000 : 1000000;
  else basePrice += 0;
  if (account.keyRally) {
    if (account.vipLevel >= 20) basePrice += 20_000_000;
    else if (account.vipLevel >= 19) basePrice += 10_000_000;
    else if (account.vipLevel >= 18) basePrice += 5_000_000;
    else if (account.vipLevel >= 17) basePrice += 2_000_000;
  }
  return Math.round(basePrice / 1000) * 1000; // làm tròn ngàn
};
