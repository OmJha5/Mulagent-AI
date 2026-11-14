import PDFDocument from "pdfkit";
import { pdfConfig } from "../constants/constants.ts";

export interface IPdfSection {
  heading: string;
  points: string[];
}

export interface IPdfDocumentData {
  title: string;
  subtitle?: string;
  sections: IPdfSection[];
}

const normalizeSections = (sections: unknown): IPdfSection[] => {
  if (!Array.isArray(sections)) return [];

  return sections
    .filter(
      (sec): sec is { heading?: unknown; points?: unknown } =>
        Boolean(sec) && typeof sec === "object",
    )
    .map((sec) => {
      const heading = typeof sec.heading === "string" ? sec.heading.trim() : "";
      const rawPoints = Array.isArray(sec.points) ? sec.points : [];
      const points = rawPoints
        .map((p) => (typeof p === "string" ? p.trim() : String(p ?? "").trim()))
        .filter((p) => p.length > 0);

      return { heading, points };
    })
    .filter((sec) => sec.heading.length > 0 || sec.points.length > 0);
};

export const parsePdfData = (rawContent: string): IPdfDocumentData => {
  const cleaned = rawContent
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const sliced = cleaned.slice(firstBrace, lastBrace + 1);
      parsed = JSON.parse(sliced);
    } else {
      throw new Error("Invalid JSON output from PDF generation model");
    }
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Parsed PDF response is not a valid object");
  }

  const record = parsed as Record<string, unknown>;

  const title =
    typeof record.title === "string" && record.title.trim().length > 0
      ? record.title.trim()
      : pdfConfig.defaultTitle;

  const subtitle =
    typeof record.subtitle === "string" && record.subtitle.trim().length > 0
      ? record.subtitle.trim()
      : undefined;

  const sections = normalizeSections(record.sections);

  if (sections.length === 0) {
    throw new Error("No valid sections found in generated PDF data");
  }

  return {
    title,
    subtitle,
    sections,
  };
};

export const generatePdf = async (data: IPdfDocumentData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: pdfConfig.pageSize,
        margin: pdfConfig.margin,
        info: {
          Author: pdfConfig.author,
          Title: data.title,
          Creator: pdfConfig.creator,
        },
      });

      const chunks: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err: Error) => reject(err));

      // Title
      doc
        .fontSize(pdfConfig.fontSizes.title)
        .fillColor(pdfConfig.colors.primaryText)
        .text(data.title, {
          align: "center",
        });

      if (data.subtitle) {
        doc.moveDown(0.5);
        doc
          .fontSize(pdfConfig.fontSizes.body)
          .fillColor(pdfConfig.colors.subtitleText)
          .text(data.subtitle, {
            align: "center",
          });
      }

      doc.moveDown(2);

      // Sections
      data.sections.forEach((section) => {
        doc
          .fontSize(pdfConfig.fontSizes.heading)
          .fillColor(pdfConfig.colors.primaryText)
          .text(section.heading);

        doc.moveDown(0.5);

        section.points.forEach((point) => {
          doc
            .fontSize(pdfConfig.fontSizes.body)
            .fillColor(pdfConfig.colors.secondaryText)
            .text(`• ${point}`, {
              lineGap: 5,
            });
        });

        doc.moveDown();
      });

      // Footer
      doc.moveDown();
      doc
        .fontSize(pdfConfig.fontSizes.footer)
        .fillColor(pdfConfig.colors.footerText)
        .text(pdfConfig.footerText, {
          align: "center",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
