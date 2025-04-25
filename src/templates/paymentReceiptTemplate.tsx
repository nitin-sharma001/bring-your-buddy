
export default function PaymentReceiptTemplate(name: string, amount: number, transactionId: string) {
    return `
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Merriweather:wght@700&display=swap');

            body {
                font-family: 'Roboto', sans-serif;
                background: linear-gradient(to right, #1e3c72, #2a5298);
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
            }

            .header {
                font-family: 'Merriweather', serif;
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
                color: #FFAA00;
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
                background: #FFAA00;
                position: absolute;
                top: -30px;
                left: -30px;
                border-radius: 50%;
                opacity: 0.4;
            }

            .shape2 {
                width: 80px;
                height: 80px;
                background: #FFAA00;
                position: absolute;
                bottom: -20px;
                right: -20px;
                border-radius: 50%;
                opacity: 0.4;
            }

            .receipt-wrapper {
                position: relative;
            }
        </style>
    </head>
    <body>
        <div class="container receipt-wrapper">
            <div class="shape"></div>
            <div class="shape2"></div>
            <div class="header">Payment Receipt</div>
            <p class="content">
                Dear <span class="highlight">${name}</span>,
            </p>
            <p class="content">
                Thank you for your payment of <span class="highlight">₹${amount}</span>. Your transaction ID is 
                <span class="highlight">${transactionId}</span>.
            </p>
            <p class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. 
                Praesent libero. Sed cursus ante dapibus diam. Nam consectetur convallis turpis, ut efficitur purus.
            </p>
            <p class="content">
                This receipt serves as official proof of your payment.
            </p>
            <p class="footer">
                Best Regards, <br> Finance Department
            </p>
        </div>
    </body>
    </html>
    `;
}
