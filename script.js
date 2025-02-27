// Full2SMS API credentials
const mid = "IMqfKWLNz0R4r7X3vsaHpwobu";
const mkey = "ZFY80mrVCa73IvSopM591AWEd";
const guid = "1pjlY0oUKe3FNziGAwIqXfLV2";

// Start live QR scanner
function startQRScanner() {
  const qrReader = new Html5Qrcode("qr-reader");

  qrReader.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      qrReader.stop();
      extractUPI(decodedText);
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
      extractUPI(decodedText);
    })
    .catch((error) => {
      console.error("Image scan error:", error);
      alert("Failed to read QR code from image.");
    });
}

// Extract UPI ID from QR data
function extractUPI(qrData) {
  const upiMatch = qrData.match(/pa=([\w.\-]+@[a-zA-Z]+)/);

  if (upiMatch) {
    document.getElementById("upi-id").value = upiMatch[1];
    alert("UPI ID extracted successfully!");
  } else {
    alert("No valid UPI ID found in QR code!");
  }
}

// Pay Now function
function payNow() {
  const upiId = document.getElementById("upi-id").value;
  const amount = document.getElementById("amount").value;
  const info = "Payment via QR";

  if (!upiId) {
    alert("Please enter a valid UPI ID!");
    return;
  }

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount!");
    return;
  }

  const url = `https://full2sms.in/api/v2/payout?mid=${mid}&mkey=${mkey}&guid=${guid}&type=upi&amount=${amount}&mobile=${encodeURIComponent(upiId)}&info=${encodeURIComponent(info)}`;

  fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert(data.message || "Payment successful!");
        addTransaction(upiId, amount, "Success");
      } else {
        alert(data.message || "Payment failed!");
        addTransaction(upiId, amount, "Failed");
      }
    })
    .catch(error => {
      console.error("Payment error:", error);
      alert("Payment request failed!");
      addTransaction(upiId, amount, "Failed");
    });
}

// Add transaction to session-only history
function addTransaction(upiId, amount, status) {
  const transactionList = document.getElementById("transaction-list");
  const listItem = document.createElement("li");
  listItem.textContent = `UPI: ${upiId}, Amount: ₹${amount}, Status: ${status}`;
  transactionList.appendChild(listItem);
}

// Auto-start live scanner on load
window.onload = startQRScanner;
