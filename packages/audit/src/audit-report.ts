export interface AuditReportRow {
  family: string;
  fixture: string;
  axis: "language" | "logic" | "visual";
  ok: boolean;
  code?: string;
  ratio?: number;
}

export interface AuditReport {
  ok: boolean;
  rows: AuditReportRow[];
}

export function formatAuditReport(report: AuditReport): string {
  const failed = report.rows.filter((r) => !r.ok);
  const lines = [
    `Cronus Audit: ${report.ok ? "pass" : "fail"} (${report.rows.length - failed.length}/${report.rows.length})`,
  ];
  for (const row of failed) {
    lines.push(`  [${row.axis}] ${row.family}/${row.fixture} ${row.code ?? "FAIL"}`);
  }
  return lines.join("\n");
}
