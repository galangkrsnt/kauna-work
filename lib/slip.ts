// Shared slip gaji calculation logic

export type SlipItem = { id: string; nama: string; jumlah: number };

export const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export const PTKP: Record<string, number> = {
  "TK/0": 54_000_000,
  "TK/1": 58_500_000,
  "TK/2": 63_000_000,
  "TK/3": 67_500_000,
  "K/0":  58_500_000,
  "K/1":  63_000_000,
  "K/2":  67_500_000,
  "K/3":  72_000_000,
};

export const BPJS_KES_MAX = 12_000_000;
export const BPJS_JP_MAX  = 9_559_600;

export function formatRp(n: number): string {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export function calcPPh21(totalBulanan: number, ptkpKey: string, punyaNPWP: boolean): number {
  const annual   = totalBulanan * 12;
  const biayaJab = Math.min(annual * 0.05, 6_000_000);
  const netAnnual = annual - biayaJab;
  const pkp      = Math.max(0, netAnnual - (PTKP[ptkpKey] ?? PTKP["TK/0"]));
  const pkpRounded = Math.floor(pkp / 1_000) * 1_000;

  const brackets = [
    { limit: 60_000_000,    rate: 0.05 },
    { limit: 250_000_000,   rate: 0.15 },
    { limit: 500_000_000,   rate: 0.25 },
    { limit: 5_000_000_000, rate: 0.30 },
    { limit: Infinity,      rate: 0.35 },
  ];

  let tax = 0;
  let remaining = pkpRounded;
  let prev = 0;
  for (const b of brackets) {
    if (remaining <= 0) break;
    const slice = Math.min(remaining, b.limit - prev);
    tax += slice * b.rate;
    remaining -= slice;
    prev = b.limit;
  }

  const monthlyTax = tax / 12;
  return punyaNPWP ? monthlyTax : monthlyTax * 1.2;
}

export type CalcInput = {
  gajiPokok: number;
  tunjangan: SlipItem[];
  statusPTKP: string;
  punyaNPWP: boolean;
  includeBpjsKes: boolean;
  includeBpjsJHT: boolean;
  includeBpjsJP: boolean;
  includePph21: boolean;
  potonganManual: SlipItem[];
};

export function calcAll(f: CalcInput) {
  const totalTunjangan   = f.tunjangan.reduce((s, t) => s + (t.jumlah || 0), 0);
  const totalPenghasilan = (f.gajiPokok || 0) + totalTunjangan;

  const bpjsKes = f.includeBpjsKes ? Math.min(totalPenghasilan, BPJS_KES_MAX) * 0.01 : 0;
  const bpjsJHT = f.includeBpjsJHT ? totalPenghasilan * 0.02 : 0;
  const bpjsJP  = f.includeBpjsJP  ? Math.min(totalPenghasilan, BPJS_JP_MAX) * 0.01 : 0;
  const pph21   = f.includePph21   ? calcPPh21(totalPenghasilan, f.statusPTKP, f.punyaNPWP) : 0;

  const totalPotonganManual = f.potonganManual.reduce((s, p) => s + (p.jumlah || 0), 0);
  const totalPotongan       = bpjsKes + bpjsJHT + bpjsJP + pph21 + totalPotonganManual;
  const gajiBersih          = totalPenghasilan - totalPotongan;

  return { totalTunjangan, totalPenghasilan, bpjsKes, bpjsJHT, bpjsJP, pph21, totalPotonganManual, totalPotongan, gajiBersih };
}
