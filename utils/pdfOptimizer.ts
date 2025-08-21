import { PDFDocument } from "pdf-lib";
import PDFParser from "pdf2json";

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

/**
 * Optimize PDF pages by scaling down large pages
 */
export async function optimizePDF(buffer: Buffer): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.load(buffer);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      if (width > 1000 || height > 1000) {
        const scale = Math.min(1000 / width, 1000 / height);
        page.scale(scale, scale);
      }
    }

    const optimizedPdf = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });
    return Buffer.from(optimizedPdf);
  } catch (error) {
    console.error("PDF optimization error:", error);
    return buffer;
  }
}

/**
 * Extract text from PDF using pdf2json (Node.js friendly)
 */
export async function extractPDFTextInChunks(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // Suppress console warnings from pdf2json temporarily
    const originalConsoleWarn = console.warn;
    console.warn = (...args: any[]) => {
      const message = args.join(" ");
      // Only suppress specific pdf2json warnings
      if (
        message.includes("Setting up fake worker") ||
        message.includes("Unsupported: field.type") ||
        message.includes("NOT valid form element")
      ) {
        return; // Suppress these warnings
      }
      originalConsoleWarn.apply(console, args);
    };

    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.warn = originalConsoleWarn; // Restore console.warn
      console.error("PDF parsing error:", errData);
      reject(
        new Error(
          `PDF parsing failed: ${errData.parserError || "Unknown error"}`
        )
      );
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      console.warn = originalConsoleWarn; // Restore console.warn
      try {
        console.log("PDF parsing completed successfully");
        let text = "";
        let totalLength = 0;

        if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
          for (const page of pdfData.Pages) {
            if (page.Texts && Array.isArray(page.Texts)) {
              for (const textItem of page.Texts) {
                if (textItem.R && Array.isArray(textItem.R)) {
                  for (const run of textItem.R) {
                    if (run.T) {
                      try {
                        const decodedText = decodeURIComponent(run.T);
                        text += decodedText + " ";
                        totalLength += decodedText.length;

                        // Check if we've exceeded the chunk size
                        if (totalLength > CHUNK_SIZE) {
                          text = text.slice(0, CHUNK_SIZE);
                          resolve(text.trim());
                          return;
                        }
                      } catch (decodeError) {
                        // If decoding fails, try to use the raw text
                        text += (run.T || "") + " ";
                      }
                    }
                  }
                }
              }
            }
            text += "\n"; // Add line break between pages
          }
        }

        // Clean up the text
        const cleanedText = text
          .replace(/\s+/g, " ") // Replace multiple spaces with single space
          .replace(/\n\s+/g, "\n") // Clean up line breaks
          .trim();

        if (cleanedText.length === 0) {
          reject(new Error("No text content found in PDF"));
          return;
        }

        resolve(cleanedText);
      } catch (error) {
        console.error("Error processing PDF data:", error);
        reject(
          new Error(
            `Failed to process PDF content: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          )
        );
      }
    });

    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.warn = originalConsoleWarn; // Restore console.warn
      reject(new Error("PDF parsing timed out after 30 seconds"));
    }, 30000);

    pdfParser.on("pdfParser_dataReady", () => {
      clearTimeout(timeout);
    });

    pdfParser.on("pdfParser_dataError", () => {
      clearTimeout(timeout);
    });

    try {
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.warn = originalConsoleWarn; // Restore console.warn
      clearTimeout(timeout);
      reject(
        new Error(
          `Failed to parse PDF buffer: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        )
      );
    }
  });
}
