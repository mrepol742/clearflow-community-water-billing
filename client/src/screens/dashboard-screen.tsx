import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as XLSX from "xlsx";

import {
  AppText,
  Badge,
  Button,
  Card,
  EmptyState,
  Icon,
} from "@/components/ui";
import {
  Bill,
  BillImport,
  Resident,
  ThemePreference,
  useApp,
} from "@/context/app-context";

const icons = {
  drop: { ios: "drop.fill", android: "water_drop", web: "water_drop" } as any,
  home: {
    ios: "square.grid.2x2",
    android: "dashboard",
    web: "dashboard",
  } as any,
  bills: {
    ios: "doc.text",
    android: "receipt_long",
    web: "receipt_long",
  } as any,
  users: { ios: "person.2", android: "group", web: "group" } as any,
  approvals: {
    ios: "person.badge.clock",
    android: "how_to_reg",
    web: "how_to_reg",
  } as any,
  upload: {
    ios: "arrow.up.doc",
    android: "upload_file",
    web: "upload_file",
  } as any,
  settings: { ios: "gearshape", android: "settings", web: "settings" } as any,
  logout: {
    ios: "rectangle.portrait.and.arrow.right",
    android: "logout",
    web: "logout",
  } as any,
  sun: { ios: "sun.max", android: "light_mode", web: "light_mode" } as any,
  moon: { ios: "moon", android: "dark_mode", web: "dark_mode" } as any,
  system: {
    ios: "circle.lefthalf.filled",
    android: "contrast",
    web: "contrast",
  } as any,
  check: { ios: "checkmark", android: "check", web: "check" } as any,
  close: { ios: "xmark", android: "close", web: "close" } as any,
  card: {
    ios: "creditcard",
    android: "credit_card",
    web: "credit_card",
  } as any,
  meter: {
    ios: "gauge.with.dots.needle.67percent",
    android: "speed",
    web: "speed",
  } as any,
  calendar: {
    ios: "calendar",
    android: "calendar_month",
    web: "calendar_month",
  } as any,
  info: { ios: "info.circle", android: "info", web: "info" } as any,
  menu: { ios: "line.3.horizontal", android: "menu", web: "menu" } as any,
};

type Page =
  | "overview"
  | "bills"
  | "approvals"
  | "upload"
  | "residents"
  | "settings";

export function DashboardScreen() {
  const { colors, currentUser, signOut } = useApp();
  const { width } = useWindowDimensions();
  const desktop = width >= 900;
  const [page, setPage] = useState<Page>("overview");
  const isAdmin = currentUser?.role === "admin";
  const nav = isAdmin
    ? [
        { id: "overview" as const, label: "Overview", icon: icons.home },
        { id: "approvals" as const, label: "Approvals", icon: icons.approvals },
        { id: "upload" as const, label: "Import bills", icon: icons.upload },
        { id: "residents" as const, label: "Residents", icon: icons.users },
        { id: "settings" as const, label: "Settings", icon: icons.settings },
      ]
    : [
        { id: "overview" as const, label: "Overview", icon: icons.home },
        { id: "bills" as const, label: "Billing history", icon: icons.bills },
        { id: "settings" as const, label: "Settings", icon: icons.settings },
      ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.shell, !desktop && styles.shellMobile]}>
        {desktop ? (
          <View
            style={[
              styles.sidebar,
              {
                backgroundColor: colors.surface,
                borderRightColor: colors.border,
              },
            ]}
          >
            <Brand />
            <View style={styles.nav}>
              {nav.map((item) => (
                <NavItem
                  key={item.id}
                  active={page === item.id}
                  label={item.label}
                  icon={item.icon}
                  onPress={() => setPage(item.id)}
                />
              ))}
            </View>
            <View style={[styles.userBlock, { borderTopColor: colors.border }]}>
              <View
                style={[styles.avatar, { backgroundColor: colors.primarySoft }]}
              >
                <AppText weight="800" style={{ color: colors.primary }}>
                  {currentUser?.firstName[0]}
                  {currentUser?.lastName[0]}
                </AppText>
              </View>
              <View style={styles.userCopy}>
                <AppText size={13} weight="700" numberOfLines={1}>
                  {currentUser?.firstName} {currentUser?.lastName}
                </AppText>
                <AppText size={11} muted>
                  {isAdmin
                    ? "HOA Administrator"
                    : `Block ${currentUser?.block}, Lot ${currentUser?.lot}`}
                </AppText>
              </View>
              <Pressable
                accessibilityLabel="Sign out"
                onPress={signOut}
                style={styles.iconPress}
              >
                <Icon name={icons.logout} size={19} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.mobileHeader,
              {
                backgroundColor: colors.surface,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <Brand compact />
            <Pressable
              accessibilityLabel="Sign out"
              onPress={signOut}
              style={styles.iconPress}
            >
              <Icon name={icons.logout} size={20} color={colors.textMuted} />
            </Pressable>
          </View>
        )}

        <View style={styles.main}>
          {!desktop ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.mobileNav, { borderBottomColor: colors.border }]}
              contentContainerStyle={styles.mobileNavContent}
            >
              {nav.map((item) => (
                <NavItem
                  key={item.id}
                  active={page === item.id}
                  label={item.label}
                  icon={item.icon}
                  onPress={() => setPage(item.id)}
                  compact
                />
              ))}
            </ScrollView>
          ) : null}
          <ScrollView
            contentContainerStyle={[
              styles.content,
              !desktop && styles.contentMobile,
            ]}
            showsVerticalScrollIndicator={false}
          >
            {isAdmin ? (
              <AdminPage page={page} setPage={setPage} />
            ) : (
              <ResidentPage page={page} />
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Brand({ compact }: { compact?: boolean }) {
  const { colors } = useApp();
  return (
    <View style={[styles.brand, compact && styles.brandCompact]}>
      <View style={[styles.logo, { backgroundColor: colors.primary }]}>
        <Icon name={icons.drop} size={compact ? 20 : 23} color={colors.white} />
      </View>
      <View>
        <AppText size={compact ? 17 : 19} weight="800">
          ClearFlow
        </AppText>
        {!compact ? (
          <AppText size={10} muted weight="700">
            COMMUNITY WATER
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

function NavItem({
  active,
  label,
  icon,
  onPress,
  compact,
}: {
  active: boolean;
  label: string;
  icon: any;
  onPress: () => void;
  compact?: boolean;
}) {
  const { colors } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navItem,
        compact && styles.navItemCompact,
        active && { backgroundColor: colors.primarySoft },
        pressed && styles.pressed,
      ]}
    >
      <Icon
        name={icon}
        size={19}
        color={active ? colors.primary : colors.textMuted}
      />
      <AppText
        size={13}
        weight={active ? "700" : "500"}
        style={{ color: active ? colors.primary : colors.textMuted }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.pageHeader}>
      <AppText size={28} weight="800">
        {title}
      </AppText>
      <AppText muted>{subtitle}</AppText>
    </View>
  );
}

function ResidentPage({ page }: { page: Page }) {
  const { currentUser } = useApp();
  if (!currentUser) return null;
  if (page === "bills") return <BillingHistory resident={currentUser} />;
  if (page === "settings") return <Settings />;
  return <ResidentOverview resident={currentUser} />;
}

function ResidentOverview({ resident }: { resident: Resident }) {
  const { bills, colors } = useApp();
  const residentBills = bills.filter((bill) => bill.residentId === resident.id);
  const currentBill = residentBills.find((bill) => bill.status !== "paid");
  const paidTotal = residentBills
    .filter((bill) => bill.status === "paid")
    .reduce((sum, bill) => sum + bill.amount, 0);
  const [payingBill, setPayingBill] = useState<Bill | null>(null);

  return (
    <>
      <PageHeader
        title={`Good day, ${resident.firstName}`}
        subtitle={`${resident.street}, Block ${resident.block}, Lot ${resident.lot}`}
      />
      <View style={styles.statGrid}>
        <StatCard
          label="Current balance"
          value={currentBill ? peso(currentBill.amount) : "₱0.00"}
          icon={icons.card}
          tone="primary"
        />
        <StatCard
          label="Latest consumption"
          value={`${residentBills[0]?.consumption ?? 0} m³`}
          icon={icons.meter}
          tone="neutral"
        />
        <StatCard
          label="Payments this year"
          value={peso(paidTotal)}
          icon={icons.check}
          tone="success"
        />
      </View>

      {currentBill ? (
        <Card style={styles.currentBill}>
          <View style={styles.billHeadline}>
            <View style={styles.billTitle}>
              <Badge label="Payment due" tone="warning" />
              <AppText size={22} weight="800">
                {currentBill.period} statement
              </AppText>
              <AppText muted>Billing ID {currentBill.billingId}</AppText>
            </View>
            <View style={styles.amountBlock}>
              <AppText size={12} muted weight="700">
                AMOUNT DUE
              </AppText>
              <AppText size={30} weight="800">
                {peso(currentBill.amount)}
              </AppText>
              <AppText size={13} style={{ color: colors.warning }}>
                Due {formatDate(currentBill.dueDate)}
              </AppText>
            </View>
          </View>
          <View style={[styles.readings, { borderTopColor: colors.border }]}>
            <Reading
              label="Previous"
              value={`${currentBill.previousReading} m³`}
            />
            <Reading
              label="Current"
              value={`${currentBill.currentReading} m³`}
            />
            <Reading
              label="Used"
              value={`${currentBill.consumption} m³`}
              strong
            />
            <Button
              label="Pay now"
              icon={icons.card}
              onPress={() => setPayingBill(currentBill)}
              style={styles.payButton}
            />
          </View>
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={icons.check}
            title="You are all paid up"
            body="There are no outstanding water bills on this account."
          />
        </Card>
      )}

      <View style={styles.sectionHeading}>
        <AppText size={19} weight="800">
          Recent statements
        </AppText>
        <AppText muted size={13}>
          Your latest billing activity
        </AppText>
      </View>
      <BillTable bills={residentBills.slice(0, 4)} onPay={setPayingBill} />
      <PaymentModal bill={payingBill} onClose={() => setPayingBill(null)} />
    </>
  );
}

function BillingHistory({ resident }: { resident: Resident }) {
  const { bills } = useApp();
  const [payingBill, setPayingBill] = useState<Bill | null>(null);
  const residentBills = bills.filter((bill) => bill.residentId === resident.id);
  return (
    <>
      <PageHeader
        title="Billing history"
        subtitle="Review all statements and payment records."
      />
      <BillTable bills={residentBills} onPay={setPayingBill} />
      <PaymentModal bill={payingBill} onClose={() => setPayingBill(null)} />
    </>
  );
}

function BillTable({
  bills,
  onPay,
}: {
  bills: Bill[];
  onPay: (bill: Bill) => void;
}) {
  const { colors } = useApp();
  return (
    <Card style={styles.tableCard}>
      {bills.length === 0 ? (
        <EmptyState
          icon={icons.bills}
          title="No statements yet"
          body="New bills will appear here."
        />
      ) : (
        bills.map((bill, index) => (
          <View
            key={bill.id}
            style={[
              styles.billRow,
              index < bills.length - 1 && {
                borderBottomColor: colors.border,
                borderBottomWidth: 1,
              },
            ]}
          >
            <View style={styles.billMain}>
              <View
                style={[
                  styles.billIcon,
                  { backgroundColor: colors.surfaceAlt },
                ]}
              >
                <Icon name={icons.bills} size={20} color={colors.primary} />
              </View>
              <View>
                <AppText weight="700">{bill.period}</AppText>
                <AppText size={12} muted>
                  {bill.billingId} · {bill.consumption} m³
                </AppText>
              </View>
            </View>
            <View style={styles.billDue}>
              <AppText size={12} muted>
                Due {formatDate(bill.dueDate)}
              </AppText>
              <AppText weight="700">{peso(bill.amount)}</AppText>
            </View>
            {bill.status === "paid" ? (
              <Badge label="Paid" tone="success" />
            ) : (
              <Button
                label="Pay"
                onPress={() => onPay(bill)}
                style={styles.smallButton}
              />
            )}
          </View>
        ))
      )}
    </Card>
  );
}

function PaymentModal({
  bill,
  onClose,
}: {
  bill: Bill | null;
  onClose: () => void;
}) {
  const { colors, payBill } = useApp();
  const [paid, setPaid] = useState(false);
  if (!bill) return null;
  const complete = () => {
    payBill(bill.id);
    setPaid(true);
  };
  const close = () => {
    setPaid(false);
    onClose();
  };
  return (
    <Modal visible transparent animationType="fade" onRequestClose={close}>
      <View style={styles.modalBackdrop}>
        <Card style={styles.modalCard}>
          {paid ? (
            <EmptyState
              icon={icons.check}
              title="Payment recorded"
              body={`${peso(bill.amount)} was applied to ${bill.billingId}.`}
              action={
                <Button
                  label="Done"
                  onPress={close}
                  style={styles.modalAction}
                />
              }
            />
          ) : (
            <>
              <View style={styles.modalTop}>
                <View>
                  <AppText size={21} weight="800">
                    Confirm payment
                  </AppText>
                  <AppText muted>This is a simulated payment.</AppText>
                </View>
                <Pressable onPress={close} style={styles.iconPress}>
                  <Icon name={icons.close} color={colors.textMuted} />
                </Pressable>
              </View>
              <View
                style={[
                  styles.paymentSummary,
                  { backgroundColor: colors.surfaceAlt },
                ]}
              >
                <AppText muted>{bill.period}</AppText>
                <AppText size={28} weight="800">
                  {peso(bill.amount)}
                </AppText>
                <AppText size={12} muted>
                  {bill.billingId}
                </AppText>
              </View>
              <View
                style={[styles.notice, { backgroundColor: colors.warningSoft }]}
              >
                <Icon name={icons.info} size={18} color={colors.warning} />
                <AppText size={12} style={{ color: colors.warning, flex: 1 }}>
                  No real payment will be processed in this prototype.
                </AppText>
              </View>
              <Button
                label="Complete dummy payment"
                icon={icons.card}
                onPress={complete}
              />
            </>
          )}
        </Card>
      </View>
    </Modal>
  );
}

function AdminPage({
  page,
  setPage,
}: {
  page: Page;
  setPage: (page: Page) => void;
}) {
  if (page === "approvals") return <Approvals />;
  if (page === "upload") return <BillUpload />;
  if (page === "residents") return <Residents />;
  if (page === "settings") return <Settings />;
  return <AdminOverview setPage={setPage} />;
}

function AdminOverview({ setPage }: { setPage: (page: Page) => void }) {
  const { residents, bills } = useApp();
  const pending = residents.filter(
    (resident) => resident.status === "pending",
  ).length;
  const approved = residents.filter(
    (resident) =>
      resident.role === "resident" && resident.status === "approved",
  ).length;
  const outstanding = bills
    .filter((bill) => bill.status !== "paid")
    .reduce((sum, bill) => sum + bill.amount, 0);
  return (
    <>
      <PageHeader
        title="Community overview"
        subtitle="Water billing operations at a glance."
      />
      <View style={styles.statGrid}>
        <StatCard
          label="Approved residents"
          value={String(approved)}
          icon={icons.users}
          tone="primary"
        />
        <StatCard
          label="Pending approvals"
          value={String(pending)}
          icon={icons.approvals}
          tone="warning"
        />
        <StatCard
          label="Outstanding"
          value={peso(outstanding)}
          icon={icons.card}
          tone="neutral"
        />
        <StatCard
          label="Bills issued"
          value={String(bills.length)}
          icon={icons.bills}
          tone="success"
        />
      </View>
      <View style={styles.adminActions}>
        <Card style={styles.actionCard}>
          <View style={styles.actionCopy}>
            <View>
              <Badge
                label={`${pending} pending`}
                tone={pending ? "warning" : "success"}
              />
              <AppText size={19} weight="800" style={styles.actionTitle}>
                Review registrations
              </AppText>
              <AppText muted>
                Verify household information and grant resident access.
              </AppText>
            </View>
            <Button
              label="Open approvals"
              icon={icons.approvals}
              onPress={() => setPage("approvals")}
              variant="secondary"
            />
          </View>
        </Card>
        <Card style={styles.actionCard}>
          <View style={styles.actionCopy}>
            <View>
              <Badge label="Excel .xlsx" tone="primary" />
              <AppText size={19} weight="800" style={styles.actionTitle}>
                Import monthly bills
              </AppText>
              <AppText muted>
                Upload a prepared workbook and issue statements in bulk.
              </AppText>
            </View>
            <Button
              label="Import workbook"
              icon={icons.upload}
              onPress={() => setPage("upload")}
              variant="secondary"
            />
          </View>
        </Card>
      </View>
      <View style={styles.sectionHeading}>
        <AppText size={19} weight="800">
          Latest registrations
        </AppText>
      </View>
      <ResidentList
        residents={residents
          .filter((item) => item.role === "resident")
          .slice(-4)
          .reverse()}
      />
    </>
  );
}

function Approvals() {
  const { residents, updateApproval } = useApp();
  const pending = residents.filter((resident) => resident.status === "pending");
  return (
    <>
      <PageHeader
        title="Registration approvals"
        subtitle="Verify resident details before granting access."
      />
      {pending.length === 0 ? (
        <Card>
          <EmptyState
            icon={icons.check}
            title="Approval queue is clear"
            body="New resident registrations will appear here."
          />
        </Card>
      ) : (
        <View style={styles.approvalGrid}>
          {pending.map((resident) => (
            <Card key={resident.id} style={styles.approvalCard}>
              <View style={styles.residentHeading}>
                <View>
                  <AppText size={18} weight="800">
                    {resident.firstName} {resident.middleName}{" "}
                    {resident.lastName}
                  </AppText>
                  <AppText size={13} muted>
                    Applied {formatDate(resident.joinedAt)}
                  </AppText>
                </View>
                <Badge label="Pending" tone="warning" />
              </View>
              <View style={styles.detailsGrid}>
                <Detail label="Email" value={resident.email} />
                <Detail label="Phone" value={resident.phone} />
                <Detail
                  label="Address"
                  value={`Block ${resident.block}, Lot ${resident.lot}, ${resident.street}`}
                />
                <Detail
                  label="Recent bill ID"
                  value={resident.recentBillingAmount}
                />
              </View>
              <View style={styles.approvalActions}>
                <Button
                  label="Reject"
                  icon={icons.close}
                  variant="danger"
                  onPress={() => updateApproval(resident.id, "rejected")}
                  style={styles.flexButton}
                />
                <Button
                  label="Approve"
                  icon={icons.check}
                  onPress={() => updateApproval(resident.id, "approved")}
                  style={styles.flexButton}
                />
              </View>
            </Card>
          ))}
        </View>
      )}
    </>
  );
}

type SheetRow = Record<string, string | number | undefined>;

function BillUpload() {
  const { colors, importBills } = useApp();
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<BillImport[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function chooseFile() {
    setMessage("");
    setLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      const data = asset.file
        ? await asset.file.arrayBuffer()
        : await new File(asset.uri).arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<SheetRow>(sheet, { defval: "" });
      const parsed = raw
        .map(normalizeBillRow)
        .filter((row): row is BillImport => row !== null);
      setFileName(asset.name);
      setRows(parsed);
      setMessage(
        parsed.length
          ? `${parsed.length} valid bill row${parsed.length === 1 ? "" : "s"} ready to import.`
          : "No valid rows found. Check the column names and values.",
      );
    } catch {
      setMessage(
        "The workbook could not be read. Use a valid .xlsx or .xls file.",
      );
    } finally {
      setLoading(false);
    }
  }

  function commit() {
    const result = importBills(rows);
    setMessage(
      `Imported ${result.added} bill${result.added === 1 ? "" : "s"}. ${result.skipped} row${result.skipped === 1 ? "" : "s"} skipped.`,
    );
    setRows([]);
  }

  return (
    <>
      <PageHeader
        title="Import water bills"
        subtitle="Issue resident statements from an Excel workbook."
      />
      <Card>
        <View style={styles.uploadLayout}>
          <View
            style={[
              styles.uploadZone,
              {
                borderColor: colors.border,
                backgroundColor: colors.surfaceAlt,
              },
            ]}
          >
            <View
              style={[
                styles.uploadIcon,
                { backgroundColor: colors.primarySoft },
              ]}
            >
              <Icon name={icons.upload} size={30} color={colors.primary} />
            </View>
            <AppText size={18} weight="800">
              {fileName || "Select an Excel workbook"}
            </AppText>
            <AppText muted style={styles.uploadHelp}>
              Accepted formats: .xlsx and .xls
            </AppText>
            <Button
              label={fileName ? "Choose another file" : "Choose file"}
              icon={icons.upload}
              onPress={chooseFile}
              loading={loading}
              variant="secondary"
            />
          </View>
          <View style={styles.template}>
            <AppText weight="800">Required columns</AppText>
            <AppText size={13} muted>
              The first worksheet must include these required headers:
            </AppText>
            {[
              "resident_ulid",
              "period",
              "previous_reading",
              "current_reading",
              "amount",
              "due_date",
            ].map((column) => (
              <View key={column} style={styles.columnRow}>
                <Icon name={icons.check} size={15} color={colors.success} />
                <AppText size={13}>{column}</AppText>
              </View>
            ))}
          </View>
        </View>
        {message ? (
          <View
            style={[
              styles.importMessage,
              { backgroundColor: colors.primarySoft },
            ]}
          >
            <AppText size={13} style={{ color: colors.primary }}>
              {message}
            </AppText>
          </View>
        ) : null}
      </Card>
      {rows.length ? (
        <>
          <View style={styles.sectionHeading}>
            <View>
              <AppText size={19} weight="800">
                Import preview
              </AppText>
              <AppText size={13} muted>
                First {Math.min(rows.length, 5)} rows
              </AppText>
            </View>
            <Button
              label={`Import ${rows.length} bills`}
              icon={icons.check}
              onPress={commit}
            />
          </View>
          <Card style={styles.tableCard}>
            {rows.slice(0, 5).map((row, index) => (
              <View
                key={`${row.billingId}-${index}`}
                style={[
                  styles.billRow,
                  index < Math.min(rows.length, 5) - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={styles.billMain}>
                  <View>
                    <AppText weight="700">{row.period}</AppText>
                    <AppText size={12} muted>
                      {row.email}
                    </AppText>
                  </View>
                </View>
                <AppText size={13} muted>
                  {row.billingId}
                </AppText>
                <AppText weight="700">{peso(row.amount)}</AppText>
              </View>
            ))}
          </Card>
        </>
      ) : null}
    </>
  );
}

function Residents() {
  const { residents } = useApp();
  const list = residents.filter((resident) => resident.role === "resident");
  return (
    <>
      <PageHeader
        title="Residents"
        subtitle="All registered households and account statuses."
      />
      <ResidentList residents={list} />
    </>
  );
}

function ResidentList({ residents }: { residents: Resident[] }) {
  const { colors } = useApp();
  return (
    <Card style={styles.tableCard}>
      {residents.map((resident, index) => (
        <View
          key={resident.id}
          style={[
            styles.residentRow,
            index < residents.length - 1 && {
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View
            style={[styles.avatar, { backgroundColor: colors.primarySoft }]}
          >
            <AppText weight="800" style={{ color: colors.primary }}>
              {resident.firstName[0]}
              {resident.lastName[0]}
            </AppText>
          </View>
          <View style={styles.residentMain}>
            <AppText weight="700">
              {resident.firstName} {resident.lastName}
            </AppText>
            <AppText size={12} muted>
              {resident.email}
            </AppText>
          </View>
          <AppText size={13} muted style={styles.residentAddress}>
            Blk {resident.block}, Lot {resident.lot} · {resident.street}
          </AppText>
          <Badge
            label={resident.status}
            tone={
              resident.status === "approved"
                ? "success"
                : resident.status === "pending"
                  ? "warning"
                  : "danger"
            }
          />
        </View>
      ))}
    </Card>
  );
}

function Settings() {
  const { colors, themePreference, setThemePreference, currentUser } = useApp();
  const options: { id: ThemePreference; label: string; icon: any }[] = [
    { id: "light", label: "Light", icon: icons.sun },
    { id: "dark", label: "Dark", icon: icons.moon },
    { id: "system", label: "System", icon: icons.system },
  ];
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage appearance and review account information."
      />
      <Card style={styles.settingsCard}>
        <AppText weight="800">Appearance</AppText>
        <AppText size={13} muted>
          Choose how ClearFlow looks on this device.
        </AppText>
        <View style={styles.themeOptions}>
          {options.map((option) => {
            const active = themePreference === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setThemePreference(option.id)}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: active
                      ? colors.primarySoft
                      : colors.surfaceAlt,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Icon
                  name={option.icon}
                  color={active ? colors.primary : colors.textMuted}
                />
                <AppText
                  weight={active ? "700" : "500"}
                  style={{ color: active ? colors.primary : colors.text }}
                >
                  {option.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Card>
      <Card style={styles.settingsCard}>
        <AppText weight="800">Account</AppText>
        <View style={styles.detailsGrid}>
          <Detail
            label="Name"
            value={`${currentUser?.firstName} ${currentUser?.lastName}`}
          />
          <Detail label="Email" value={currentUser?.email ?? ""} />
          <Detail label="Phone" value={currentUser?.phone ?? ""} />
          <Detail
            label="Access"
            value={
              currentUser?.role === "admin"
                ? "HOA Administrator"
                : "Approved resident"
            }
          />
        </View>
      </Card>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: any;
  tone: "primary" | "success" | "warning" | "neutral";
}) {
  const { colors } = useApp();
  const palette = {
    primary: [colors.primarySoft, colors.primary],
    success: [colors.successSoft, colors.success],
    warning: [colors.warningSoft, colors.warning],
    neutral: [colors.surfaceAlt, colors.textMuted],
  }[tone];
  return (
    <Card style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: palette[0] }]}>
        <Icon name={icon} color={palette[1]} />
      </View>
      <AppText size={13} muted>
        {label}
      </AppText>
      <AppText size={23} weight="800">
        {value}
      </AppText>
    </Card>
  );
}

function Reading({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View>
      <AppText size={12} muted>
        {label}
      </AppText>
      <AppText weight={strong ? "800" : "600"}>{value}</AppText>
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <AppText size={11} muted weight="700">
        {label.toUpperCase()}
      </AppText>
      <AppText size={13}>{value || "—"}</AppText>
    </View>
  );
}

function normalizeBillRow(row: SheetRow): BillImport | null {
  const get = (key: string) => row[key] ?? row[key.toLowerCase()] ?? "";
  const previousReading = Number(get("previousReading"));
  const currentReading = Number(get("currentReading"));
  const amount = Number(get("amount"));
  const email = String(get("email")).trim();
  const billingId = String(get("billingId")).trim();
  const period = String(get("period")).trim();
  const dueValue = get("dueDate");
  let dueDate = String(dueValue).trim();
  if (typeof dueValue === "number") {
    const parsed = XLSX.SSF.parse_date_code(dueValue);
    if (parsed)
      dueDate = `${parsed.y}-${String(parsed.m).padStart(2, "0")}-${String(parsed.d).padStart(2, "0")}`;
  }
  if (
    !email ||
    !billingId ||
    !period ||
    !dueDate ||
    !Number.isFinite(previousReading) ||
    !Number.isFinite(currentReading) ||
    !Number.isFinite(amount)
  ) {
    return null;
  }
  return {
    email,
    billingId,
    period,
    previousReading,
    currentReading,
    consumption: Math.max(0, currentReading - previousReading),
    amount,
    dueDate,
  };
}

function peso(amount: number) {
  return `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  shell: { flex: 1, flexDirection: "row" },
  shellMobile: { flexDirection: "column" },
  sidebar: { width: 244, borderRightWidth: 1, padding: 18 },
  brand: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 4,
  },
  brandCompact: { height: "auto" },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  nav: { flex: 1, gap: 5, paddingTop: 18 },
  navItem: {
    height: 46,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 13,
  },
  navItemCompact: { height: 42, paddingHorizontal: 12 },
  userBlock: {
    borderTopWidth: 1,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  userCopy: { flex: 1, minWidth: 0 },
  iconPress: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
  mobileHeader: {
    minHeight: 64,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  main: { flex: 1 },
  mobileNav: { flexGrow: 0, borderBottomWidth: 1 },
  mobileNavContent: { paddingHorizontal: 10, paddingVertical: 7, gap: 4 },
  content: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    padding: 34,
    gap: 22,
  },
  contentMobile: { padding: 16, gap: 18 },
  pageHeader: { gap: 4, marginBottom: 2 },
  statGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  statCard: { flex: 1, minWidth: 190, gap: 7, padding: 17 },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  currentBill: { gap: 20 },
  billHeadline: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  billTitle: { gap: 5 },
  amountBlock: { alignItems: "flex-end" },
  readings: {
    borderTopWidth: 1,
    paddingTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 34,
  },
  payButton: { marginLeft: "auto", minWidth: 130 },
  sectionHeading: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  tableCard: { paddingVertical: 3, paddingHorizontal: 18 },
  billRow: {
    minHeight: 74,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 18,
    paddingVertical: 12,
  },
  billMain: {
    flex: 1,
    minWidth: 180,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  billIcon: {
    width: 38,
    height: 38,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  billDue: { minWidth: 130, alignItems: "flex-end" },
  smallButton: { height: 36, minWidth: 76 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(3, 12, 14, 0.62)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: { width: "100%", maxWidth: 440, gap: 18, padding: 24 },
  modalTop: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  paymentSummary: {
    borderRadius: 7,
    padding: 20,
    alignItems: "center",
    gap: 3,
  },
  notice: {
    borderRadius: 7,
    padding: 12,
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
  },
  modalAction: { minWidth: 120, marginTop: 10 },
  adminActions: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  actionCard: { flex: 1, minWidth: 280 },
  actionCopy: { minHeight: 190, justifyContent: "space-between", gap: 22 },
  actionTitle: { marginTop: 12, marginBottom: 4 },
  approvalGrid: { gap: 14 },
  approvalCard: { gap: 20 },
  residentHeading: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  detailsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 18 },
  detail: { flex: 1, minWidth: 170, gap: 3 },
  approvalActions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
  flexButton: { minWidth: 120 },
  uploadLayout: { flexDirection: "row", flexWrap: "wrap", gap: 24 },
  uploadZone: {
    flex: 1.5,
    minWidth: 260,
    minHeight: 300,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 9,
  },
  uploadIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  uploadHelp: { textAlign: "center", marginBottom: 7 },
  template: { flex: 1, minWidth: 220, gap: 9, paddingVertical: 10 },
  columnRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  importMessage: { borderRadius: 7, padding: 13, marginTop: 18 },
  residentRow: {
    minHeight: 72,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
  },
  residentMain: { flex: 1, minWidth: 180 },
  residentAddress: { minWidth: 210 },
  settingsCard: { gap: 12 },
  themeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  themeOption: {
    minWidth: 130,
    height: 52,
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pressed: { opacity: 0.72 },
});
