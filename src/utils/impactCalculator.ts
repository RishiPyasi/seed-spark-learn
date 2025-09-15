// Environmental Impact Calculator

export interface ImpactCalculation {
  co2Saved: number;
  waterSaved: number;
  energySaved: number;
  treesEquivalent: number;
}

// CO2 absorption rates and conversions
const CO2_PER_TREE_KG_YEAR = 22; // kg CO2 per tree per year
const WATER_PER_SHOWER_LITERS = 65; // average shower
const CO2_PER_KWH = 0.4; // kg CO2 per kWh (average)
const WATER_PER_LOAD_LAUNDRY = 150; // liters per load

export const calculateImpact = {
  // Water saving activities
  shortShower: (): ImpactCalculation => ({
    co2Saved: 0.5, // indirect from energy savings
    waterSaved: 30, // liters saved from shorter shower
    energySaved: 1.2, // kWh from water heating
    treesEquivalent: 0.02
  }),

  rainwaterHarvesting: (): ImpactCalculation => ({
    co2Saved: 2,
    waterSaved: 200,
    energySaved: 3,
    treesEquivalent: 0.09
  }),

  // Energy saving activities
  lightsOff: (): ImpactCalculation => ({
    co2Saved: 1.5,
    waterSaved: 0,
    energySaved: 3.75, // kWh saved
    treesEquivalent: 0.07
  }),

  useNaturalLight: (): ImpactCalculation => ({
    co2Saved: 2.5,
    waterSaved: 0,
    energySaved: 6.25,
    treesEquivalent: 0.11
  }),

  // Recycling activities
  paperRecycling: (): ImpactCalculation => ({
    co2Saved: 3.3,
    waterSaved: 60,
    energySaved: 4,
    treesEquivalent: 0.15
  }),

  plasticRecycling: (): ImpactCalculation => ({
    co2Saved: 2,
    waterSaved: 20,
    energySaved: 2.5,
    treesEquivalent: 0.09
  }),

  // Transport activities
  walkInsteadOfDrive: (distance: number = 5): ImpactCalculation => ({
    co2Saved: distance * 0.404, // kg CO2 per km for average car
    waterSaved: 0,
    energySaved: distance * 0.8, // equivalent energy
    treesEquivalent: (distance * 0.404) / CO2_PER_TREE_KG_YEAR
  }),

  publicTransport: (distance: number = 10): ImpactCalculation => ({
    co2Saved: distance * 0.3, // kg CO2 saved vs car
    waterSaved: 0,
    energySaved: distance * 0.6,
    treesEquivalent: (distance * 0.3) / CO2_PER_TREE_KG_YEAR
  }),

  // Learning activities
  completeLearningModule: (): ImpactCalculation => ({
    co2Saved: 0.5, // awareness leads to action
    waterSaved: 0,
    energySaved: 0,
    treesEquivalent: 0.02
  }),

  shareKnowledge: (): ImpactCalculation => ({
    co2Saved: 1, // multiplier effect
    waterSaved: 0,
    energySaved: 0,
    treesEquivalent: 0.04
  })
};

export const getRandomImpactFact = (): string => {
  const facts = [
    `🌳 One mature tree absorbs ${CO2_PER_TREE_KG_YEAR}kg of CO₂ per year!`,
    '💡 LED bulbs use 75% less energy than incandescent bulbs',
    '🚰 A 5-minute shower saves 30 liters compared to a 10-minute shower',
    '♻️ Recycling one ton of paper saves 17 trees',
    '🚲 Biking 5km saves 2kg of CO₂ compared to driving',
    '🌊 Fixing a leaky faucet can save 3,000 liters per month',
    '🏠 Proper insulation can reduce home energy use by 30%',
    '📱 Unplugging devices saves phantom energy consumption'
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
};

export const getTotalImpact = (activities: ImpactCalculation[]): ImpactCalculation => {
  return activities.reduce(
    (total, current) => ({
      co2Saved: total.co2Saved + current.co2Saved,
      waterSaved: total.waterSaved + current.waterSaved,
      energySaved: total.energySaved + current.energySaved,
      treesEquivalent: total.treesEquivalent + current.treesEquivalent
    }),
    { co2Saved: 0, waterSaved: 0, energySaved: 0, treesEquivalent: 0 }
  );
};