

export default function VisaTemplate(name: string, passportNumber: string) {
    return `
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap');

            body {
                font-family: 'Poppins', sans-serif;
                background: linear-gradient(to right, #4b0082, #9400d3);
                color: #ffffff;
                padding: 50px;
                text-align: center;
            }

            .container {
                max-width: 800px;
                background: rgba(255, 255, 255, 0.2);
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
                margin: auto;
                position: relative;
                overflow: hidden;
            }

            .header {
                font-size: 42px;
                font-weight: 700;
                margin-bottom: 20px;
                color: #FFD700;
            }

            .content {
                font-size: 20px;
                line-height: 1.8;
                margin-top: 20px;
            }

            .highlight {
                font-weight: bold;
                color: #FFDD44;
                font-size: 24px;
            }

            .footer {
                margin-top: 30px;
                font-size: 18px;
                color: #FFD700;
            }

            .shape {
                width: 120px;
                height: 120px;
                background: rgba(255, 255, 255, 0.2);
                position: absolute;
                top: -30px;
                left: -30px;
                border-radius: 50%;
            }

            .shape2 {
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.2);
                position: absolute;
                bottom: -20px;
                right: -20px;
                border-radius: 50%;
            }

            .stamp {
                width: 120px;
                height: 120px;
                background: #FFD700;
                border-radius: 50%;
                text-align: center;
                line-height: 120px;
                font-size: 18px;
                font-weight: bold;
                color: #4b0082;
                position: absolute;
                top: 20px;
                right: 20px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
                transform: rotate(-10deg);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="shape"></div>
            <div class="shape2"></div>
            <div class="stamp">VISA APPROVED</div>
            <div class="header">Visa Confirmation Letter</div>
            <p class="content">
                Dear <span class="highlight">${name}</span>,
            </p>
            <p class="content">
                This letter confirms your eligibility for a student visa application. Your passport number is 
                <span class="highlight">${passportNumber}</span>.
            </p>
            <p class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. 
                Praesent libero. Sed cursus ante dapibus diam. Nam consectetur convallis turpis, ut efficitur purus.
            </p>
            <p class="content">
                Please use this document while submitting your visa application.
            </p>
            <p class="footer">
                Best Regards, <br> Visa Office
            </p>
        </div>
    </body>
    </html>
    `;
}
