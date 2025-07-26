document.addEventListener("DOMContentLoaded", function () {
  const itemLookup = {
    1: "Sprouts",
    2: "Tea",
    3: "Buttermilk",
    4: "Fruity",
    5: "Fruit Chat",
    6: "Peanut chat"
    // Add more as needed
  };

  // 🛒 Update cart count
  //document.addEventListener("DOMContentLoaded", function () {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const countSpan = document.getElementById("cartCount");

  if (countSpan && cart && typeof cart === "object") {
    let totalItems = 0;

    // If cart is stored as { "4": 2, "5": 1 } (itemId: quantity)
    for (let itemId in cart) {
      totalItems += cart[itemId];
    }

    if (totalItems > 0) {
      countSpan.textContent = totalItems;
      countSpan.classList.remove("hidden");
    } else {
      countSpan.classList.add("hidden");
    }
  }


  // 🚀 Handle form submission
  document.getElementById("infoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const teamName = document.getElementById("teamName").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const groundName = document.getElementById("groundName").value.trim();
    const slot = document.getElementById("slot").value;
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
      teamName,
      phoneNumber,
      groundName,
      slot,
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
