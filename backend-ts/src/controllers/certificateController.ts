import { Response } from "express";
import puppeteer from "puppeteer";
import { pool } from "../config/db";
import { certificateTemplate } from "../templates/certificateTemplate";

export const generateCertificate = async (req: any, res: Response) => {
  try {
    const { courseId, course } = req.body;
    const userId = req.user?.id || req.body.userId;
    const name = req.user?.name || req.body.name;

    console.log("🛠️ Certificate Request Data:", { userId, courseId, name, course, userFromToken: req.user });

    if (!userId || !courseId || !name || !course) {
      const missing = [];
      if (!userId) missing.push("userId");
      if (!courseId) missing.push("courseId");
      if (!name) missing.push("name");
      if (!course) missing.push("course");
      
      console.error("❌ Missing Fields:", missing);
      res.status(400).json({ 
        success: false, 
        message: "Missing required fields", 
        missing 
      });
      return;
    }

    const certificateId = "EDU-" + Date.now();

    await pool.query(
      "INSERT INTO certificates (user_id, course_id, certificate_id) VALUES ($1,$2,$3)",
      [userId, courseId, certificateId]
    );

    const html = certificateTemplate(name, course, certificateId);

    console.log("🚀 Launching Browser...");
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-gpu",
          "--disable-dev-shm-usage"
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      });
    } catch (launchError: any) {
      console.error("❌ Failed to launch Puppeteer:", launchError);
      throw new Error(`Failed to launch PDF engine: ${launchError.message}`);
    }

    console.log("📄 Opening New Page...");
    const page = await browser.newPage();
    
    console.log("📝 Setting Content (networkidle2)...");
    await page.setContent(html, { 
      waitUntil: "networkidle2",
      timeout: 30000 
    });

    console.log("🖨️ Generating PDF Buffer...");
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    console.log("🧹 Closing Browser...");
    if (browser) await browser.close();
    console.log("✅ PDF Generation Complete. Size:", pdf.length);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Certificate_${course.replace(/\s+/g, '_')}.pdf"`
    );

    res.send(Buffer.from(pdf));
  } catch (error: any) {
    console.error("❌ Certificate Generation Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate certificate", 
      error: error.message || "Internal Server Error",
      stack: error.stack
    });
  }
};