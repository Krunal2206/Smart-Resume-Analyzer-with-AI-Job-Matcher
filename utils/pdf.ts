import PDFParser from "pdf2json";

export default async function extractPDFText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();

    parser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfData?.Pages?.map((page) =>
        page.Texts.map((t) => decodeURIComponent(t.R[0].T)).join(" ")
      ).join("\n");
      resolve(text);
    });

    parser.on("pdfParser_dataError", (errData) => {
      reject(new Error("Failed to parse PDF"));
    });

    parser.parseBuffer(buffer);
  });
}
