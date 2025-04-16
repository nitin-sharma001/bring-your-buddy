
export default function AdmissionLetterTemplate(name: string, program: string, university: string) {
    return `
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;700&display=swap');

            body {
                font-family: 'Poppins', sans-serif;
                background: linear-gradient(to right, #004080, #00274d);
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
                color: #FFD700;
            }

            .content {
                font-size: 20px;
                line-height: 1.8;
                margin-top: 20px;
            }

            .highlight {
                font-weight: bold;
                color: #FFD700;
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
                background: #FFD700;
                position: absolute;
                top: -30px;
                left: -30px;
                border-radius: 50%;
                opacity: 0.4;
            }

            .shape2 {
                width: 80px;
                height: 80px;
                background: #FFD700;
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
            <div class="header">Admission Letter</div>
            <p class="content">
                Dear <span class="highlight">${name}</span>,
            </p>
            <p class="content">
                🎉 Congratulations! You have been admitted to the <span class="highlight">${program}</span> program at 
                <span class="highlight">${university}</span>. We are excited to welcome you to our prestigious institution.
            </p>
            <p class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel lacus eget justo 
                efficitur euismod id nec purus. Suspendisse potenti. Nam tincidunt ex non ex suscipit, ut 
                interdum metus mattis.
            </p>
            <p class="content">
                Please ensure you complete all necessary formalities before the commencement of the program.
            </p>
            <p class="footer">
                Best Regards, <br> Admissions Office
            </p>
        </div>
    </body>
    </html>
    `;
}
