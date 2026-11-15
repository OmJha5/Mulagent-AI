// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - pptxgenjs types export class as namespace in NodeNext
import PptxGenJS from "pptxgenjs";
import { pptConfig } from "../constants/constants.ts";

export interface IPptSlide {
  title: string;
  points: string[];
}

export interface IPptDocumentData {
  title: string;
  subtitle?: string;
  slides: IPptSlide[];
}

interface IPptSlideBuilder {
  background: { color: string };
  addShape: (shape: unknown, options: Record<string, unknown>) => void;
  addText: (text: string, options: Record<string, unknown>) => void;
}

interface IPptPresentation {
  layout: string;
  author: string;
  title: string;
  subject: string;
  company: string;
  theme: { headFontFace: string; bodyFontFace: string };
  ShapeType: {
    rect: unknown;
    line: unknown;
    roundRect: unknown;
    ellipse: unknown;
  };
  addSlide: () => IPptSlideBuilder;
  write: (options: { outputType: string }) => Promise<unknown>;
}

const PptxGen = PptxGenJS as unknown as new () => IPptPresentation;

const normalizeSlides = (slides: unknown): IPptSlide[] => {
  if (!Array.isArray(slides)) return [];

  return slides
    .filter(
      (slide): slide is { title?: unknown; points?: unknown } =>
        Boolean(slide) && typeof slide === "object",
    )
    .map((slide) => {
      const title = typeof slide.title === "string" ? slide.title.trim() : "";
      const rawPoints = Array.isArray(slide.points) ? slide.points : [];
      const points = rawPoints
        .map((p) => (typeof p === "string" ? p.trim() : String(p ?? "").trim()))
        .filter((p) => p.length > 0);

      return { title, points };
    })
    .filter((slide) => slide.title.length > 0 || slide.points.length > 0);
};

export const parsePptData = (rawContent: string): IPptDocumentData => {
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
      try {
        const sliced = cleaned.slice(firstBrace, lastBrace + 1);
        parsed = JSON.parse(sliced);
      } catch {
        throw new Error("Invalid JSON output from presentation model");
      }
    } else {
      throw new Error("Invalid JSON output from presentation model");
    }
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Parsed presentation response is not a valid object");
  }

  const record = parsed as Record<string, unknown>;

  const title =
    typeof record.title === "string" && record.title.trim().length > 0
      ? record.title.trim()
      : pptConfig.defaultTitle;

  const subtitle =
    typeof record.subtitle === "string" && record.subtitle.trim().length > 0
      ? record.subtitle.trim()
      : undefined;

  const slides = normalizeSlides(record.slides);

  if (slides.length === 0) {
    throw new Error("No valid slides found in generated presentation data");
  }

  return {
    title,
    subtitle,
    slides,
  };
};

const addCoverSlide = (ppt: IPptPresentation, data: IPptDocumentData) => {
  const slide = ppt.addSlide();
  slide.background = {
    color: pptConfig.colors.primary,
  };

  slide.addShape(ppt.ShapeType.rect, {
    x: 0,
    y: 0,
    w: pptConfig.dimensions.slideWidth,
    h: 0.18,
    fill: {
      color: pptConfig.colors.accentLight,
    },
    line: {
      color: pptConfig.colors.accentLight,
    },
  });

  slide.addText(data.title, {
    x: 0.7,
    y: 1.7,
    w: 12,
    h: 0.8,
    align: "center",
    color: pptConfig.colors.white,
    bold: true,
    fontSize: 28,
  });

  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 1,
      y: 2.8,
      w: 11.5,
      h: 0.4,
      align: "center",
      color: pptConfig.colors.subtleBlue,
      fontSize: 15,
    });
  }

  slide.addText(pptConfig.footerText, {
    x: 0,
    y: 6.9,
    w: pptConfig.dimensions.slideWidth,
    h: 0.2,
    align: "center",
    color: pptConfig.colors.footerBlue,
    fontSize: 10,
  });
};

const addContentSlide = (
  ppt: IPptPresentation,
  slideData: IPptSlide,
  page: number,
  total: number,
) => {
  const slide = ppt.addSlide();

  slide.background = {
    color: pptConfig.colors.white,
  };

  slide.addText(slideData.title, {
    x: 0.6,
    y: 0.35,
    w: 10,
    h: 0.4,
    fontSize: 24,
    bold: true,
    color: pptConfig.colors.primary,
  });

  slide.addShape(ppt.ShapeType.line, {
    x: 0.6,
    y: 0.85,
    w: 12,
    h: 0,
    line: {
      color: pptConfig.colors.border,
      width: 1.2,
    },
  });

  const visiblePoints = slideData.points.slice(0, pptConfig.maxPointsPerSlide);

  visiblePoints.forEach((point, i) => {
    const y = 1.2 + i * 0.75;

    slide.addShape(ppt.ShapeType.roundRect, {
      x: 0.7,
      y,
      w: 12,
      h: 0.58,
      fill: {
        color: i % 2 ? pptConfig.colors.light : pptConfig.colors.cardLight,
      },
      line: {
        color: pptConfig.colors.border,
      },
      radius: 0.08,
    });

    slide.addShape(ppt.ShapeType.ellipse, {
      x: 0.92,
      y: y + 0.18,
      w: 0.12,
      h: 0.12,
      fill: {
        color: pptConfig.colors.primary,
      },
      line: {
        color: pptConfig.colors.primary,
      },
    });

    slide.addText(point, {
      x: 1.2,
      y: y + 0.08,
      w: 11,
      h: 0.35,
      fontSize: 15,
      color: pptConfig.colors.text,
      fit: "shrink",
    });
  });

  slide.addText(`${page}/${total}`, {
    x: 12.1,
    y: 6.9,
    w: 0.8,
    h: 0.2,
    align: "right",
    fontSize: 10,
    color: pptConfig.colors.muted,
  });

  slide.addText(pptConfig.brandText, {
    x: 0.6,
    y: 6.9,
    w: 2,
    h: 0.2,
    fontSize: 10,
    color: pptConfig.colors.muted,
  });
};

const addThankYouSlide = (ppt: IPptPresentation) => {
  const slide = ppt.addSlide();

  slide.background = {
    color: pptConfig.colors.secondary,
  };

  slide.addText(pptConfig.thankYouText, {
    x: 0,
    y: 2.2,
    w: pptConfig.dimensions.slideWidth,
    h: 0.8,
    align: "center",
    color: pptConfig.colors.white,
    fontSize: 34,
    bold: true,
  });

  slide.addText(pptConfig.footerText, {
    x: 0,
    y: 6.9,
    w: pptConfig.dimensions.slideWidth,
    h: 0.2,
    align: "center",
    color: pptConfig.colors.footerSlate,
    fontSize: 10,
  });
};

export const generatePpt = async (data: IPptDocumentData): Promise<Buffer> => {
  const ppt = new PptxGen();
  ppt.layout = pptConfig.layout;
  ppt.author = pptConfig.author;
  ppt.title = data.title;
  ppt.subject = data.title;
  ppt.company = pptConfig.company;
  ppt.theme = {
    headFontFace: pptConfig.fontFace,
    bodyFontFace: pptConfig.fontFace,
  };

  addCoverSlide(ppt, data);

  data.slides.forEach((slide, i) => {
    addContentSlide(ppt, slide, i + 1, data.slides.length);
  });

  addThankYouSlide(ppt);

  const output = await ppt.write({ outputType: "nodebuffer" }); // Don't save to disk. Generate the .pptx file directly in memory (RAM) and return the raw binary bytes to me
  return output as Buffer;
};
