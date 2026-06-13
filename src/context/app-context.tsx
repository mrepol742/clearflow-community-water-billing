import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type Role = 'admin' | 'resident';
export type ApprovalStatus = 'approved' | 'pending' | 'rejected';
export type ThemePreference = 'light' | 'dark' | 'system';

export type Resident = {
  id: string;
  email: string;
  password: string;
  phone: string;
  firstName: string;
  middleName: string;
  lastName: string;
  block: string;
  lot: string;
  street: string;
  recentBillingId: string;
  status: ApprovalStatus;
  role: Role;
  joinedAt: string;
};

export type Bill = {
  id: string;
  residentId: string;
  billingId: string;
  period: string;
  previousReading: number;
  currentReading: number;
  consumption: number;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  paidAt?: string;
};

export type SignupInput = Omit<Resident, 'id' | 'status' | 'role' | 'joinedAt'>;
export type BillImport = Omit<Bill, 'id' | 'residentId' | 'status'> & { email: string };

export const palettes = {
  light: {
    background: '#F4F7F8',
    surface: '#FFFFFF',
    surfaceAlt: '#EAF1F2',
    text: '#122326',
    textMuted: '#64777B',
    border: '#D8E2E4',
    primary: '#087E8B',
    primaryStrong: '#05616B',
    primarySoft: '#DDF3F3',
    accent: '#F2B84B',
    success: '#18845B',
    successSoft: '#E2F5EC',
    danger: '#C44848',
    dangerSoft: '#FCE8E8',
    warning: '#A96708',
    warningSoft: '#FFF3D8',
    shadow: '#0C3338',
    white: '#FFFFFF',
  },
  dark: {
    background: '#0D1517',
    surface: '#162124',
    surfaceAlt: '#1D2B2E',
    text: '#F0F7F7',
    textMuted: '#9EB0B3',
    border: '#304044',
    primary: '#48BCC4',
    primaryStrong: '#73D0D5',
    primarySoft: '#173B3F',
    accent: '#F3BF5B',
    success: '#58C997',
    successSoft: '#193A2E',
    danger: '#F07C7C',
    dangerSoft: '#402324',
    warning: '#F0B957',
    warningSoft: '#3A3020',
    shadow: '#000000',
    white: '#FFFFFF',
  },
} as const;

const residentsSeed: Resident[] = [
  {
    id: 'admin-1',
    email: 'admin@example.com',
    password: 'admin',
    phone: '0917 555 0100',
    firstName: 'Maya',
    middleName: 'Santos',
    lastName: 'Reyes',
    block: 'HOA',
    lot: 'Office',
    street: 'Community Hall',
    recentBillingId: 'ADMIN',
    status: 'approved',
    role: 'admin',
    joinedAt: '2024-01-10',
  },
  {
    id: 'resident-1',
    email: 'resident@example.com',
    password: 'resident',
    phone: '0917 204 8891',
    firstName: 'Daniel',
    middleName: 'Cruz',
    lastName: 'Garcia',
    block: '8',
    lot: '14',
    street: 'Acacia Street',
    recentBillingId: 'WB-2026-00418',
    status: 'approved',
    role: 'resident',
    joinedAt: '2024-08-18',
  },
  {
    id: 'resident-2',
    email: 'liza@example.com',
    password: 'resident123',
    phone: '0918 445 1209',
    firstName: 'Liza',
    middleName: 'Flores',
    lastName: 'Mendoza',
    block: '3',
    lot: '22',
    street: 'Narra Street',
    recentBillingId: 'WB-2026-00398',
    status: 'pending',
    role: 'resident',
    joinedAt: '2026-06-12',
  },
  {
    id: 'resident-3',
    email: 'paolo@example.com',
    password: 'resident123',
    phone: '0998 620 1132',
    firstName: 'Paolo',
    middleName: 'Lim',
    lastName: 'Torres',
    block: '5',
    lot: '9',
    street: 'Molave Street',
    recentBillingId: 'WB-2026-00405',
    status: 'pending',
    role: 'resident',
    joinedAt: '2026-06-11',
  },
];

const billsSeed: Bill[] = [
  {
    id: 'bill-1',
    residentId: 'resident-1',
    billingId: 'WB-2026-00532',
    period: 'May 2026',
    previousReading: 341,
    currentReading: 357,
    consumption: 16,
    amount: 712,
    dueDate: '2026-06-20',
    status: 'unpaid',
  },
  {
    id: 'bill-2',
    residentId: 'resident-1',
    billingId: 'WB-2026-00418',
    period: 'April 2026',
    previousReading: 326,
    currentReading: 341,
    consumption: 15,
    amount: 675,
    dueDate: '2026-05-20',
    status: 'paid',
    paidAt: '2026-05-16',
  },
  {
    id: 'bill-3',
    residentId: 'resident-1',
    billingId: 'WB-2026-00301',
    period: 'March 2026',
    previousReading: 308,
    currentReading: 326,
    consumption: 18,
    amount: 786,
    dueDate: '2026-04-20',
    status: 'paid',
    paidAt: '2026-04-18',
  },
  {
    id: 'bill-4',
    residentId: 'resident-1',
    billingId: 'WB-2026-00196',
    period: 'February 2026',
    previousReading: 295,
    currentReading: 308,
    consumption: 13,
    amount: 601,
    dueDate: '2026-03-20',
    status: 'paid',
    paidAt: '2026-03-15',
  },
];

type AppContextValue = {
  colors: (typeof palettes)['light'];
  resolvedTheme: 'light' | 'dark';
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;
  currentUser: Resident | null;
  residents: Resident[];
  bills: Bill[];
  signIn: (email: string, password: string) => { ok: boolean; message: string };
  signUp: (input: SignupInput) => { ok: boolean; message: string };
  signOut: () => void;
  updateApproval: (residentId: string, status: ApprovalStatus) => void;
  payBill: (billId: string) => void;
  importBills: (rows: BillImport[]) => { added: number; skipped: number };
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const systemTheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');
  const [residents, setResidents] = useState(residentsSeed);
  const [bills, setBills] = useState(billsSeed);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const resolvedTheme =
    themePreference === 'system' ? (systemTheme === 'dark' ? 'dark' : 'light') : themePreference;
  const colors = palettes[resolvedTheme] as (typeof palettes)['light'];
  const currentUser = residents.find((resident) => resident.id === currentUserId) ?? null;

  const value = useMemo<AppContextValue>(
    () => ({
      colors,
      resolvedTheme,
      themePreference,
      setThemePreference,
      currentUser,
      residents,
      bills,
      signIn(email, password) {
        const match = residents.find(
          (resident) => resident.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (!match || match.password !== password) {
          return { ok: false, message: 'Email or password is incorrect.' };
        }
        if (match.status === 'pending') {
          return { ok: false, message: 'Your registration is still awaiting HOA approval.' };
        }
        if (match.status === 'rejected') {
          return { ok: false, message: 'This registration was not approved. Contact the HOA.' };
        }
        setCurrentUserId(match.id);
        return { ok: true, message: '' };
      },
      signUp(input) {
        const exists = residents.some(
          (resident) => resident.email.toLowerCase() === input.email.trim().toLowerCase(),
        );
        if (exists) return { ok: false, message: 'An account already uses this email address.' };
        setResidents((current) => [
          ...current,
          {
            ...input,
            id: `resident-${Date.now()}`,
            email: input.email.trim().toLowerCase(),
            status: 'pending',
            role: 'resident',
            joinedAt: new Date().toISOString().slice(0, 10),
          },
        ]);
        return {
          ok: true,
          message: 'Registration submitted. The HOA admin will review your account.',
        };
      },
      signOut() {
        setCurrentUserId(null);
      },
      updateApproval(residentId, status) {
        setResidents((current) =>
          current.map((resident) =>
            resident.id === residentId ? { ...resident, status } : resident,
          ),
        );
      },
      payBill(billId) {
        setBills((current) =>
          current.map((bill) =>
            bill.id === billId
              ? { ...bill, status: 'paid', paidAt: new Date().toISOString().slice(0, 10) }
              : bill,
          ),
        );
      },
      importBills(rows) {
        let added = 0;
        let skipped = 0;
        const newBills: Bill[] = [];
        rows.forEach((row, index) => {
          const resident = residents.find(
            (item) => item.email.toLowerCase() === row.email.trim().toLowerCase(),
          );
          if (!resident || bills.some((bill) => bill.billingId === row.billingId)) {
            skipped += 1;
            return;
          }
          newBills.push({
            ...row,
            id: `import-${Date.now()}-${index}`,
            residentId: resident.id,
            status: 'unpaid',
          });
          added += 1;
        });
        if (newBills.length) setBills((current) => [...newBills, ...current]);
        return { added, skipped };
      },
    }),
    [bills, colors, currentUser, residents, resolvedTheme, themePreference],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
