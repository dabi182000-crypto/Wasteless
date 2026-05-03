// Multi-factor demand-based pricing engine.
//
// Inputs every vendor already provides on the listing form. Outputs a
// recommended price plus a transparent breakdown so the vendor understands
// the AI's reasoning rather than seeing a black-box number.
//
// Hard guardrails:
//   - never below breakeven (with a 5% safety buffer)
//   - never at or above original price
//
// Soft signals (each shifts price by a percentage of the spread between
// breakeven and original):
//   1. Pickup time-of-day      — dinner peak commands more, late-night less
//   2. Window urgency          — short windows price aggressively
//   3. Distance from city core — prime areas premium, outer areas discount
//   4. Inventory pressure      — high stock discounts, low stock premium
//   5. Category demand         — restaurants > bakeries > supermarkets in QA
//   6. Day of week             — Fri/Sat (Qatar weekend) bumps demand
//
// All factors return a delta in QAR. The base is `breakeven + spread * 0.20`
// — a strong rescue offer (~70% off) that still clears breakeven by a margin.

function pad(h) { return h.toString().padStart(2, '0'); }

function parseHHMM(s) {
  if (!s || typeof s !== 'string') return null;
  const [h, m] = s.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function isWeekendQatar(date = new Date()) {
  // Qatar weekend = Friday (5) and Saturday (6)
  const d = date.getDay();
  return d === 5 || d === 6;
}

const CATEGORY_DEMAND = {
  restaurant: 0.04,    // hottest segment
  bakery: 0.02,        // moderate
  supermarket: -0.02,  // less rescue urgency, longer shelf life
};

export function recommendPriceWithBreakdown({
  originalPrice,
  breakevenPrice,
  pickupStart,
  pickupEnd,
  distanceKm,
  quantity,
  category,
  now = new Date(),
}) {
  const op = Number(originalPrice);
  const be = Number(breakevenPrice);
  if (!op || !be || op <= 0 || be <= 0 || be >= op) return null;

  const spread = op - be;
  const baseRaw = be + spread * 0.20;
  const factors = [];

  // 1 & 2 — Pickup window analysis
  const startMin = parseHHMM(pickupStart);
  const endMin = parseHHMM(pickupEnd);
  const windowMin = startMin != null && endMin != null ? endMin - startMin : null;
  const startHour = startMin != null ? Math.floor(startMin / 60) : null;

  let timeAdjust = 0;
  let timeLabel = 'Off-peak window';
  if (startHour != null) {
    if (startHour >= 18 && startHour <= 21) {
      timeAdjust = spread * 0.05;
      timeLabel = 'Dinner peak (18:00–21:00)';
    } else if (startHour >= 22 || startHour <= 6) {
      timeAdjust = -spread * 0.04;
      timeLabel = 'Late-night window';
    } else if (startHour >= 11 && startHour <= 14) {
      timeAdjust = spread * 0.03;
      timeLabel = 'Lunch peak';
    } else {
      timeAdjust = 0;
      timeLabel = 'Standard window';
    }
  }
  factors.push({
    id: 'time',
    icon: 'Clock',
    label: timeLabel,
    delta: timeAdjust,
  });

  if (windowMin != null) {
    let urgencyAdjust = 0;
    let urgencyLabel = 'Comfortable window';
    if (windowMin <= 30) {
      urgencyAdjust = -spread * 0.06;
      urgencyLabel = `Tight ${windowMin}-min window`;
    } else if (windowMin <= 60) {
      urgencyAdjust = -spread * 0.03;
      urgencyLabel = `Short ${windowMin}-min window`;
    } else if (windowMin >= 180) {
      urgencyAdjust = spread * 0.02;
      urgencyLabel = `Long ${Math.round(windowMin / 60)}-hr window`;
    }
    if (urgencyAdjust !== 0) {
      factors.push({
        id: 'urgency',
        icon: 'Hourglass',
        label: urgencyLabel,
        delta: urgencyAdjust,
      });
    }
  }

  // 3 — Distance
  const dist = Number(distanceKm);
  let distAdjust = 0;
  let distLabel = 'Standard distance';
  if (!Number.isNaN(dist) && dist > 0) {
    if (dist < 1.5) {
      distAdjust = spread * 0.05;
      distLabel = `Prime area (${dist.toFixed(1)} km)`;
    } else if (dist > 3) {
      distAdjust = -spread * 0.05;
      distLabel = `Outer area (${dist.toFixed(1)} km)`;
    } else {
      distLabel = `Mid-range (${dist.toFixed(1)} km)`;
    }
  }
  factors.push({
    id: 'distance',
    icon: 'MapPin',
    label: distLabel,
    delta: distAdjust,
  });

  // 4 — Inventory pressure
  const qty = Number(quantity);
  let qtyAdjust = 0;
  let qtyLabel = 'Healthy inventory';
  if (!Number.isNaN(qty) && qty > 0) {
    if (qty >= 10) {
      qtyAdjust = -spread * 0.06;
      qtyLabel = `High inventory (${qty} bags)`;
    } else if (qty <= 3) {
      qtyAdjust = spread * 0.05;
      qtyLabel = `Limited stock (${qty} bags)`;
    } else {
      qtyLabel = `Healthy stock (${qty} bags)`;
    }
  }
  factors.push({
    id: 'inventory',
    icon: 'Package',
    label: qtyLabel,
    delta: qtyAdjust,
  });

  // 5 — Category demand
  const catKey = (category || '').toLowerCase();
  const catRate = CATEGORY_DEMAND[catKey] ?? 0;
  const catAdjust = spread * catRate;
  if (catKey) {
    const niceCat = catKey.charAt(0).toUpperCase() + catKey.slice(1);
    factors.push({
      id: 'category',
      icon: 'Tag',
      label:
        catRate > 0
          ? `${niceCat}s — high demand`
          : catRate < 0
          ? `${niceCat}s — moderate demand`
          : `${niceCat} category`,
      delta: catAdjust,
    });
  }

  // 6 — Day of week (Qatar weekend = Fri/Sat)
  const weekendBoost = isWeekendQatar(now);
  if (weekendBoost) {
    factors.push({
      id: 'weekend',
      icon: 'CalendarDays',
      label: 'Qatar weekend — demand boost',
      delta: spread * 0.03,
    });
  }

  // Sum deltas
  const deltaTotal = factors.reduce((s, f) => s + f.delta, 0);
  let recommended = baseRaw + deltaTotal;

  // Hard guardrails
  const safeFloor = Math.ceil(be * 1.05);
  const safeCeil = Math.max(safeFloor, op - 1);

  let clamped = false;
  if (recommended < safeFloor) {
    recommended = safeFloor;
    clamped = true;
  }
  if (recommended > safeCeil) {
    recommended = safeCeil;
    clamped = true;
  }

  const suggested = Math.round(recommended);
  const baseRounded = Math.round(baseRaw);

  // Confidence: how many soft signals fired with non-zero delta?
  const signalCount = factors.filter((f) => Math.abs(f.delta) > 0.5).length;
  const confidence =
    signalCount >= 4 ? 'high' : signalCount >= 2 ? 'medium' : 'low';

  return {
    suggested,
    base: baseRounded,
    factors: factors.map((f) => ({ ...f, delta: Math.round(f.delta) })),
    clamped,
    confidence,
    breakeven: be,
    original: op,
    discountPct: Math.round(((op - suggested) / op) * 100),
  };
}
