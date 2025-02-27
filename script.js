// Full2SMS API credentials
const mid = "IMqfKWLNz0R4r7X3vsaHpwobu";
const mkey = "ZFY80mrVCa73IvSopM591AWEd;
const guid = "1pjlY0oUKe3FNziGAwIqXfLV2";

let mobile = "";
let type = "";

// Start live QR scanner
function startQRScanner() {
  const qrReader = new Html5Qrcode("qr-reader");

  qrReader.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      qrReader.stop();
      processQRData(decodedText);
    },
    (error) => console.log("QR scan error:", error)
  );
}

// Scan QR from uploaded image
function scanFromImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const qrReader = new Html5Qrcode("qr-reader");

  qrReader.scanFile(file, true)
    .then((decodedText) => {
      processQRData(decodedText);
    })
    .catch((error) => {
      console.error("Image scan error:", error);
      alert("Failed to read QR code from image.");
    });
}

// Extract and set mobile/UPI data
function processQRData(qrData) {
  document.getElementById("scanned-data").value = qrData;

  const upiMatch = qrData.match(/pa=([\w.\-]+@[a-zA-Z]+)/);
  const mobileMatch = qrData.match(/\d{10}/);

  if (mobileMatch) {
    mobile = mobileMatch[0];
    type = "mobile";
  } else if (upiMatch) {
    mobile = upiMatch[1];
    type = "upi";
  } else {
    alert("No valid mobile number or UPI ID found in QR code!");
    return;
  }

  alert("QR code scanned successfully!");
}

// Pay Now function
function payNow() {
  const amount = document.getElementById("amount").value;
  const info = "Payment via QR";

  if (!mobile || !type) {
    alert("Please scan a valid QR code first!");
    return;
  }

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount!");
    return;
  }

  const url = `https://full2sms.in/api/v2/payout?mid=${mid}&mkey=${mkey}&guid=${guid}&type=${type}&amount=${amount}&mobile=${mobile}&info=${encodeURIComponent(info)}`;

  fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert(data.message || "Payment successful!");
      } else {
        alert(data.message || "Payment failed!");
      }
    })
    .catch(error => {
      console.error("Payment error:", error);
      alert("Payment request failed!");
    });
}

// Auto-start live scanner on load
window.onload = startQRScanner;
