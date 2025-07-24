document.addEventListener("DOMContentLoaded", function () {
  const itemLookup = {
    1: "Sprouts",
    2: "Tea",
    3: "Buttermilk",
    4: "Fruity"
    // Add more as needed
  };

  // 🚀 Handle form submission
  document.getElementById("infoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const teamName = document.getElementById("teamName").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const groundName = document.getElementById("groundName").value.trim();
    const slot = document.getElementById("slot").value;
    const orderTime = document.getElementById("orderTime").value;
    const orderDate = document.getElementById("orderDate").value;

    // 📞 Basic phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("Please enter a valid 10-digit phone number starting with 6-9.");
      return;
    }

    let cartObj = {};
    try {
      const storedCart = localStorage.getItem("cart");
      cartObj = JSON.parse(storedCart) || {};
    } catch (e) {
      cartObj = {};
    }

    const entries = Object.entries(cartObj).filter(([_, qty]) => qty > 0);

    const cartDetails = entries
      .map(([id, qty]) => {
        const name = itemLookup[id] || `Item ${id}`;
        return `${name}: ${qty}`;
      })
      .join(", ");

    const formData = {
      fullName,
      teamName,
      phoneNumber,
      groundName,
      slot,
      orderTime,
      orderDate,
      cartDetails
    };

    try {
      const response = await fetch("https://api.sheetbest.com/sheets/bdbcdc63-5be1-4aa4-ba77-842d3c44038d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        localStorage.removeItem("cart");
        window.location.href = "checkout.html";
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting form.");
    }
  });

  // 🛒 Show cart summary
  const cartSummaryDiv = document.getElementById("cartSummary");
  if (cartSummaryDiv) {
    let cartObj = {};
    try {
      cartObj = JSON.parse(localStorage.getItem("cart")) || {};
    } catch (e) {
      cartObj = {};
    }

    const entries = Object.entries(cartObj).filter(([_, qty]) => qty > 0);

    const cartDetails = entries
      .map(([id, qty]) => {
        const name = itemLookup[id] || `Item ${id}`;
        return `${name}: ${qty}`;
      })
      .join(", ");

    cartSummaryDiv.textContent =
      entries.length === 0
        ? "🛒 Cart is empty."
        : `🛒 Cart Summary: ${cartDetails}`;
  }
});
