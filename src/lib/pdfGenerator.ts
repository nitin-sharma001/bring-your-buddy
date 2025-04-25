import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export async function generateOfferLetter(
  user: any,
  programName: string,
  universityName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, `Offer_Letter_${user.id}.pdf`);

      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, left: 50, right: 50, bottom: 50 },
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const fontPath = path.join(
        process.cwd(),
        "public",
        "fonts",
        "Times-Roman.ttf"
      );
      if (!fs.existsSync(fontPath)) {
        reject(
          new Error("Font file not found. Please ensure the font file exists.")
        );
        return;
      }
      doc.font(fontPath);

      // Title
      doc
        .fontSize(24)
        .text("Offer Letter", { align: "center", underline: true });
      doc.moveDown(2);

      // Salutation
      doc.fontSize(16).text(`Dear ${user.name},`, { align: "left" });
      doc.moveDown();

      // Offer Content
      doc
        .fontSize(14)
        .text(
          `We are pleased to offer you admission to the ${programName} program at ${universityName}.`
        );
      doc.moveDown(2);

      doc.text("Best regards,");
      doc.text("BringUrBuddy Team");

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", (err) => {
        console.error("Error writing PDF file:", err);
        reject(err);
      });
    } catch (err) {
      console.error("Error generating offer letter:", err);
      reject(err);
    }
  });
}
