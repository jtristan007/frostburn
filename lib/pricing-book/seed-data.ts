// Seeded into every new account's pricing_book_items at signup (see
// app/actions/account.ts). Categories match the DB check constraint on
// pricing_book_items.category exactly -- keep them in sync.

export const PRICING_BOOK_SEED: Array<{
  category: 'heating' | 'cooling' | 'indoor_air_quality' | 'emergency'
  name: string
  description: string
  price: number
}> = [
  // heating
  { category: 'heating', name: 'Furnace Tune-Up', description: 'Full inspection, filter check, burner clean, safety test.', price: 149 },
  { category: 'heating', name: 'Furnace Repair (Standard)', description: 'Diagnose and repair a non-emergency furnace fault.', price: 275 },
  { category: 'heating', name: 'Furnace Install', description: 'Full furnace replacement, standard efficiency unit, labor included.', price: 4200 },
  { category: 'heating', name: 'Heat Pump Tune-Up', description: 'Seasonal heat pump inspection and performance check.', price: 169 },
  { category: 'heating', name: 'Thermostat Install', description: 'Supply and install a programmable or smart thermostat.', price: 220 },

  // cooling
  { category: 'cooling', name: 'AC Tune-Up', description: 'Coil clean, refrigerant check, filter and airflow inspection.', price: 159 },
  { category: 'cooling', name: 'AC Repair (Standard)', description: 'Diagnose and repair a non-emergency AC fault.', price: 290 },
  { category: 'cooling', name: 'AC Unit Install', description: 'Full AC unit installation, labor and standard materials included.', price: 3800 },
  { category: 'cooling', name: 'Refrigerant Recharge', description: 'Leak check plus refrigerant top-up.', price: 340 },
  { category: 'cooling', name: 'Ductless Mini-Split Install', description: 'Single-zone ductless system, supply and install.', price: 3200 },

  // indoor_air_quality
  { category: 'indoor_air_quality', name: 'Duct Cleaning', description: 'Full duct system clean, standard residential home.', price: 450 },
  { category: 'indoor_air_quality', name: 'Whole-Home Air Purifier Install', description: 'Install an in-duct air purification unit.', price: 890 },
  { category: 'indoor_air_quality', name: 'Humidifier Install', description: 'Whole-home humidifier, supply and install.', price: 620 },
  { category: 'indoor_air_quality', name: 'Dehumidifier Install', description: 'Whole-home dehumidifier, supply and install.', price: 680 },
  { category: 'indoor_air_quality', name: 'Air Quality Inspection', description: 'On-site indoor air quality assessment and report.', price: 129 },

  // emergency
  { category: 'emergency', name: 'Emergency No-Heat Call', description: 'Same-day emergency callout, no heat.', price: 350 },
  { category: 'emergency', name: 'Emergency No-Cool Call', description: 'Same-day emergency callout, no cooling.', price: 350 },
  { category: 'emergency', name: 'After-Hours Callout', description: 'Emergency service outside standard business hours.', price: 450 },
  { category: 'emergency', name: 'Gas Leak Response', description: 'Emergency response and diagnostic for a suspected gas leak.', price: 500 },
  { category: 'emergency', name: 'Frozen Pipe / Coil Response', description: 'Emergency response for a frozen line or coil.', price: 380 },
]
