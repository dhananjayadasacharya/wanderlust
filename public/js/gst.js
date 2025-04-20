const tax_toggle = document.getElementById("flexSwitchCheckDefault");
    const priceElements = document.getElementsByClassName("price");
    // Store original prices when page loads
    const originalPrices = Array.from(priceElements).map(el => {
        // Remove commas and convert to number
        return parseFloat(el.innerText.replace(/,/g, ''));
    });

    tax_toggle.addEventListener("change", () => {
        for(let i = 0; i < priceElements.length; i++) {
            if (tax_toggle.checked) {
                // Add 18% tax
                const withTax = originalPrices[i] * 1.18;
                priceElements[i].innerText = Math.round(withTax).toLocaleString("en-IN");
            } else {
                // Restore original price
                priceElements[i].innerText = originalPrices[i].toLocaleString("en-IN");
            }
        }
    });