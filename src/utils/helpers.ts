export function calcDailyGoal(weightKg: number, hotClimate = false, hasWatch = false): number {
  return Math.round(weightKg * 35 + (hotClimate ? 300 : 0) + (hasWatch ? 150 : 0));
}

export function formatVolume(ml: number): string {
  return ml < 1000 ? `${ml} ml` : `${(ml / 1000).toFixed(1).replace('.', ',')} L`;
}

export function getGreeting(name: string): string {
  const h = new Date().getHours();
  const prefix = h >= 5 && h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  return `${prefix}, ${name}`;
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}
