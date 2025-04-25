export default function BonafideLetterTemplate(
  name: string,
  university: string
) {
  return `
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;700&display=swap');

            body {
                font-family: 'Poppins', sans-serif;
                background: linear-gradient(to right, #3b3b3b, #1f1f1f);
                color: #ffffff;
                padding: 50px;
                text-align: center;
            }

            .container {
                max-width: 800px;
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
                margin: auto;
            }

            .header {
                font-family: 'Playfair Display', serif;
                font-size: 42px;
                font-weight: 700;
                margin-bottom: 20px;
                color: #90EE90;
            }

            .content {
                font-size: 20px;
                line-height: 1.8;
                margin-top: 20px;
            }

            .highlight {
                font-weight: bold;
                color: #ADFF2F;
                font-size: 24px;
            }

            .footer {
                margin-top: 30px;
                font-size: 18px;
                color: #90EE90;
            }

            .shape {
                width: 120px;
                height: 120px;
                background: #ADFF2F;
                position: absolute;
                top: -30px;
                left: -30px;
                border-radius: 50%;
                opacity: 0.4;
            }

            .shape2 {
                width: 80px;
                height: 80px;
                background: #ADFF2F;
                position: absolute;
                bottom: -20px;
                right: -20px;
                border-radius: 50%;
                opacity: 0.4;
            }

            .letter-wrapper {
                position: relative;
            }
        </style>
    </head>
    <body>
        <div class="container letter-wrapper">
            <div class="shape"></div>
            <div class="shape2"></div>
            <div class="header">Bonafide Certificate</div>
            <p class="content">
                To Whom It May Concern,
            </p>
            <p class="content">
                This is to certify that <span class="highlight">${name}</span> is a bonafide student of 
                <span class="highlight">${university}</span>. They are enrolled as a full-time student.
            </p>
            <p class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. 
                Praesent libero. Sed cursus ante dapibus diam. Nam consectetur convallis turpis, ut efficitur purus.
            </p>
            <p class="content">
                This certificate is issued upon request for official purposes.
            </p>
            <p class="footer">
                Best Regards, <br> University Administration
            </p>
        </div>
    </body>
    </html>
    `;
}
