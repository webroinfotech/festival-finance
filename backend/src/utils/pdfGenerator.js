import PDFDocument from "pdfkit";

const GOLD = "#b8860b";
const DARK = "#1a1a2e";
const GREY = "#6b7280";
const LIGHT_ROW = "#f8f5ee";
const BORDER = "#e5e0d5";

function formatCurrency(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Builds and streams a report PDF for either collections or expenses.
 * kind: "collections" | "expenses"
 */
export function buildLedgerPdf({ kind, items }) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  const isCollections = kind === "collections";
  const reportTitle = isCollections ? "Total Collections Report" : "Total Expenses Report";
  const nameHeader = isCollections ? "Name" : "Expense For";

  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const columns = [
    { key: "name", label: nameHeader, width: pageWidth * 0.24 },
    { key: "amount", label: "Amount", width: pageWidth * 0.16 },
    { key: "paymentType", label: "Payment", width: pageWidth * 0.14 },
    { key: "description", label: "Description", width: pageWidth * 0.28 },
    { key: "date", label: "Date", width: pageWidth * 0.18 },
  ];

  // ---- Header ----
  doc
    .rect(0, 0, doc.page.width, 90)
    .fill(DARK);

  doc
    .fillColor(GOLD)
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("Festival Amount Maintenance", 40, 28);

  doc
    .fillColor("#ffffff")
    .font("Helvetica")
    .fontSize(12)
    .text(reportTitle, 40, 56);

  doc
    .fillColor("#cbd5e1")
    .fontSize(9)
    .text(`Generated on ${formatDate(new Date().toISOString())}`, 40, 72);

  doc.moveDown();
  doc.y = 110;

  // ---- Table header ----
  const drawTableHeader = () => {
    const headerY = doc.y;
    doc.rect(40, headerY, pageWidth, 24).fill(GOLD);
    let x = 40;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#ffffff");
    columns.forEach((col) => {
      doc.text(col.label, x + 6, headerY + 7, { width: col.width - 10 });
      x += col.width;
    });
    doc.y = headerY + 24;
  };

  drawTableHeader();

  // ---- Table rows ----
  doc.font("Helvetica").fontSize(9.5);
  let total = 0;
  let rowIndex = 0;

  items.forEach((item) => {
    total += Number(item.amount);
    const rowHeight = 22;

    if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom - 60) {
      doc.addPage();
      doc.y = 40;
      drawTableHeader();
    }

    const rowY = doc.y;
    if (rowIndex % 2 === 0) {
      doc.rect(40, rowY, pageWidth, rowHeight).fill(LIGHT_ROW);
    }
    doc
      .strokeColor(BORDER)
      .lineWidth(0.5)
      .rect(40, rowY, pageWidth, rowHeight)
      .stroke();

    let x = 40;
    doc.fillColor(DARK);
    doc.text(item.name || "-", x + 6, rowY + 6, { width: columns[0].width - 10, ellipsis: true });
    x += columns[0].width;
    doc.text(formatCurrency(item.amount), x + 6, rowY + 6, { width: columns[1].width - 10 });
    x += columns[1].width;
    doc
      .fillColor(item.paymentType === "gpay" ? "#0369a1" : "#15803d")
      .text(item.paymentType === "gpay" ? "GPay" : "Cash", x + 6, rowY + 6, {
        width: columns[2].width - 10,
      });
    x += columns[2].width;
    doc.fillColor(GREY).text(item.description || "-", x + 6, rowY + 6, {
      width: columns[3].width - 10,
      ellipsis: true,
    });
    x += columns[3].width;
    doc.fillColor(GREY).fontSize(8.5).text(formatDate(item.createdAt), x + 6, rowY + 6, {
      width: columns[4].width - 10,
    });
    doc.fontSize(9.5);

    doc.y = rowY + rowHeight;
    rowIndex += 1;
  });

  if (items.length === 0) {
    doc
      .fillColor(GREY)
      .font("Helvetica-Oblique")
      .fontSize(11)
      .text("No records found.", 40, doc.y + 16, { width: pageWidth, align: "center" });
  }

  // ---- Total ----
  doc.moveDown(1);
  const totalY = doc.y + 10;
  doc.rect(40, totalY, pageWidth, 30).fill(DARK);
  doc
    .fillColor(GOLD)
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(
      `${isCollections ? "Total Collections" : "Total Expenses"}: ${formatCurrency(total)}`,
      40 + 12,
      totalY + 9
    );

  return doc;
}
