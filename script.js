// Full2SMS credentials
const mid = "IMqfKWLNz0R4r7X3vsaHpwobu";
const mkey = "ZFY80mrVCa73IvSopM591AWEd";
const guid = "1pjlY0oUKe3FNziGAwIqXfLV2";

// Function to upload and process QR code
async function uploadQrCode() {
  const fileInput = document.getElementById("uploadQr");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload a valid QR code image!");
    return;
  }

  const reader = new FileReader();
  reader.onload = async (event) => {
    const imageData = event.target.result;
    const upiId = await extractUpiFromQr(imageData);

    if (upiId) {
      document.getElementById("upiId").value = upiId;
    } else {
      alert("Failed to extract UPI ID from QR code!");
    }
  };

  reader.readAsDataURL(file);
}

// Dummy function to simulate UPI extraction (replace with real QR parsing logic)
async function extractUpiFromQr(imageData) {
  console.log("Simulating UPI extraction...");
  return "Q235387729@ybl"; // Simulated UPI ID
}

// Function to make payment
async function makePayment() {
  const upiId = document.getElementById("upiId").value;
  const amount = document.getElementById("amount").value;

  if (!upiId || !amount) {
    alert("Please enter UPI ID and amount!");
    return;
  }

  const mobile = upiId.split("@")[0]; // Extract mobile part from UPI ID
  const info = "Payment via Full2SMS";

  const url = `https://full2sms.in/api/v2/payout?mid=${mid}&mkey=${mkey}&guid=${guid}&type=upi&amount=${amount}&mobile=${mobile}&info=${info}`;

  try {
    const response = await fetch(url, { method: "GET" });
    const result = await response.json();

    if (result.status === "success") {
      alert(`Payment successful!\nUPI: ${upiId}, Amount: ₹${amount}`);
    } else {
      alert(`Payment failed!\nReason: ${result.message}`);
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("Payment request failed!");
  }
}

// Function to check Full2SMS balance
async function checkBalance() {
  const url = `https://full2sms.in/api/v2/balance?mid=${mid}&mkey=${mkey}&guid=${guid}`;

  try {
    const response = await fetch(url, { method: "GET" });
    const result = await response.json();

    if (result.status === "success") {
      document.getElementById("balance").innerText = `Your balance: ₹${result.balance}`;
    } else {
      alert(`Failed to fetch balance: ${result.message}`);
    }
  } catch (error) {
    console.error("Balance check error:", error);
    alert("Failed to check balance!");
  }
}
