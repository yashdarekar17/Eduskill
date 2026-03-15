export const certificateTemplate = (name: string, course: string, certificateId: string) => {
  const date = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
            
            body {
                margin: 0;
                padding: 0;
                font-family: 'Montserrat', sans-serif;
                background: white;
            }
            
            .certificate-container {
                width: 297mm;
                height: 210mm;
                padding: 20px;
                box-sizing: border-box;
                position: relative;
                background: white;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .border-outer {
                width: 100%;
                height: 100%;
                border: 15px solid #FF6643;
                box-sizing: border-box;
                position: relative;
                padding: 40px;
            }
            
            .border-inner {
                width: 100%;
                height: 100%;
                border: 2px solid #FF6643;
                box-sizing: border-box;
                padding: 40px;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                position: relative;
            }

            .logo {
                font-size: 32px;
                font-weight: 900;
                color: #FF6643;
                letter-spacing: -1px;
                margin-bottom: 20px;
            }
            
            .title {
                font-size: 60px;
                font-weight: 900;
                color: #333;
                text-transform: uppercase;
                margin: 0;
                margin-top: 20px;
            }
            
            .subtitle {
                font-size: 24px;
                color: #666;
                margin-top: 5px;
                letter-spacing: 5px;
                text-transform: uppercase;
            }
            
            .text-top {
                font-size: 20px;
                color: #555;
                margin-top: 50px;
            }
            
            .recipient-name {
                font-family: 'Playfair Display', serif;
                font-size: 64px;
                font-weight: 700;
                color: #FF6643;
                margin: 20px 0;
                font-style: italic;
                border-bottom: 2px solid #eee;
                padding-bottom: 10px;
                min-width: 600px;
            }
            
            .text-bottom {
                font-size: 20px;
                color: #555;
                max-width: 700px;
                line-height: 1.5;
            }
            
            .course-name {
                font-weight: 700;
                color: #333;
            }
            
            .footer {
                display: flex;
                justify-content: space-between;
                width: 100%;
                margin-top: auto;
                padding-bottom: 20px;
            }
            
            .footer-item {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .footer-text {
                font-size: 14px;
                color: #888;
                margin-top: 5px;
            }
            
            .signature {
                font-family: 'Playfair Display', serif;
                font-size: 24px;
                border-bottom: 1px solid #333;
                padding: 0 40px;
                margin-bottom: 5px;
            }
            
            .certificate-id {
                position: absolute;
                bottom: 20px;
                right: 20px;
                font-size: 10px;
                color: #ccc;
                font-family: monospace;
            }

            .decoration-top-left {
                position: absolute;
                top: 0;
                left: 0;
                width: 150px;
                height: 150px;
                background: #FF6643;
                clip-path: polygon(0 0, 100% 0, 0 100%);
            }

            .decoration-bottom-right {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 150px;
                height: 150px;
                background: #FF6643;
                clip-path: polygon(100% 100%, 100% 0, 0 100%);
            }
        </style>
    </head>
    <body>
        <div class="certificate-container">
            <div class="border-outer">
                <div class="decoration-top-left"></div>
                <div class="decoration-bottom-right"></div>
                <div class="border-inner">
                    <div class="logo">EDUSKILL</div>
                    <h1 class="title">Certificate</h1>
                    <div class="subtitle">of completion</div>
                    
                    <p class="text-top">This is to certify that</p>
                    <div class="recipient-name">${name}</div>
                    
                    <p class="text-bottom">
                        has successfully completed the intensive digital course<br>
                        <span class="course-name">${course}</span><br>
                        demonstrating exceptional mastery of all theoretical and practical dimensions of the curriculum.
                    </p>
                    
                    <div class="footer">
                        <div class="footer-item">
                            <div class="signature">Eduskill AI</div>
                            <div class="footer-text">Official AI Mentor</div>
                        </div>
                        <div class="footer-item">
                            <div class="signature" style="font-weight: 700;">${date}</div>
                            <div class="footer-text">Date of Issuance</div>
                        </div>
                    </div>
                    
                    <div class="certificate-id">ID: ${certificateId}</div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};
