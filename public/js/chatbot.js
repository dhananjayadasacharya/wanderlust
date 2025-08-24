// Chatbot functionality for listings page
let allListings = []; // Store all listings
let originalListings = []; // Store original listings for reset

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Store all listings on page load
    storeOriginalListings();
    
    // Ensure loading states are hidden on page load
    hideAllLoadingStates();
    
    // Get search form elements
    const mobileSearchForm = document.getElementById('mobileSearchForm');
    const desktopSearchForm = document.getElementById('desktopSearchForm');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const desktopSearchInput = document.getElementById('desktopSearchInput');

    // Add event listeners to both search forms
    if (mobileSearchForm) {
        mobileSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSearch(mobileSearchInput.value, 'mobile');
        });
    }

    if (desktopSearchForm) {
        desktopSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSearch(desktopSearchInput.value, 'desktop');
        });
    }

    // Add Enter key support for search inputs
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(mobileSearchInput.value, 'mobile');
            }
        });
    }

    if (desktopSearchInput) {
        desktopSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(desktopSearchInput.value, 'desktop');
            }
        });
    }
});

function storeOriginalListings() {
    const listingsContainer = document.getElementById('listingsContainer');
    originalListings = listingsContainer.innerHTML;
    
    // Extract listing data for filtering
    const listingCards = document.querySelectorAll('.listing-card');
    allListings = Array.from(listingCards).map(card => {
        const link = card.closest('a');
        return {
            element: card.closest('.col-12'),
            id: link.href.split('/').pop(),
            title: card.querySelector('.card-text b').textContent,
            price: card.querySelector('.price').textContent,
            image: card.querySelector('.card-img-top').src,
            alt: card.querySelector('.card-img-top').alt
        };
    });
}

async function handleSearch(query, source) {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
        showError('Please enter a search term!');
        return;
    }

    console.log('Starting search for:', trimmedQuery, 'from source:', source);

    // Collapse mobile search bar if searching from mobile
    if (source === 'mobile') {
        const searchCollapse = document.getElementById('searchCollapse');
        if (searchCollapse && searchCollapse.classList.contains('show')) {
            // Use Bootstrap collapse to hide
            const bsCollapse = new bootstrap.Collapse(searchCollapse, { toggle: false });
            bsCollapse.hide();
        }
    }

    // Hide all loading states first
    hideAllLoadingStates();
    hideSearchResults();

    // Show loading for the appropriate source
    const loadingElement = source === 'mobile' ? 
        document.getElementById('mobileSearchLoading') : 
        document.getElementById('desktopSearchLoading');
    
    if (loadingElement) {
        console.log('Showing loading for:', source);
        loadingElement.classList.add('show');
        loadingElement.style.display = 'block';
    }

    try {
        console.log('Sending search request...');
        
        const response = await fetch('/chatbot/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: trimmedQuery })
        });

        console.log('Response received, status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Search response data:', data);
        
        if (data.success) {
            displayFilteredListings(data.listings, data.analysis);
            showSearchResults(data.totalFound, data.analysis.description);
        } else {
            showError(data.error || 'Search failed. Please try again.');
        }
    } catch (error) {
        console.error('Search error:', error);
        showError('Sorry, something went wrong. Please try again.');
    } finally {
        // Always hide loading states
        hideAllLoadingStates();
        console.log('Search completed, loading states hidden');
    }
}

function hideAllLoadingStates() {
    console.log('Hiding all loading states');
    
    const mobileLoading = document.getElementById('mobileSearchLoading');
    const desktopLoading = document.getElementById('desktopSearchLoading');
    
    if (mobileLoading) {
        mobileLoading.classList.remove('show');
        mobileLoading.style.display = 'none';
        console.log('Mobile loading hidden');
    }
    if (desktopLoading) {
        desktopLoading.classList.remove('show');
        desktopLoading.style.display = 'none';
        console.log('Desktop loading hidden');
    }
}

function hideSearchResults() {
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    if (searchResultsContainer) {
        searchResultsContainer.style.display = 'none';
    }
}

function displayFilteredListings(filteredListings, analysis) {
    const listingsContainer = document.getElementById('listingsContainer');
    
    if (filteredListings.length === 0) {
        listingsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No listings found</h4>
                <p class="text-muted">Try describing your vacation differently or browse all listings.</p>
                <button class="btn btn-primary" onclick="resetListings()">Show All Listings</button>
            </div>
        `;
        return;
    }

    // Create HTML for filtered listings
    let html = '';
    filteredListings.forEach(listing => {
        html += `
            <div class="col-12 col-sm-6 col-lg-4">
                <a href="/listings/${listing._id}" class="listing-link text-decoration-none">
                    <div class="listing-card card h-100">
                        <img class="card-img-top" src="${listing.image.url}" alt="${listing.title}" loading="lazy">
                        <div class="card-body">
                            <p class="card-text mb-2"><b>${listing.title}</b></p>
                            <div class="d-flex align-items-center">
                                <span class="currency">₹</span>
                                <div class="price mx-1">
                                    ${listing.price.toLocaleString("en-IN")}
                                </div>
                                <span>/night</span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });
    
    listingsContainer.innerHTML = html;
    
    // Re-apply tax toggle functionality to new listings
    if (document.getElementById('flexSwitchCheckDefault').checked) {
        applyTaxToggle();
    }
}

function showSearchResults(count, description) {
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const searchResultsContent = document.getElementById('searchResultsContent');
    
    if (searchResultsContainer && searchResultsContent) {
        searchResultsContent.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>Found ${count} perfect matches!</strong> ${description}
        `;
        searchResultsContainer.style.display = 'block';
    }
}

function showError(message) {
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const searchResultsContent = document.getElementById('searchResultsContent');
    
    if (searchResultsContainer && searchResultsContent) {
        searchResultsContent.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
        `;
        searchResultsContainer.style.display = 'block';
        // Change alert class to danger
        const alertElement = searchResultsContainer.querySelector('.alert');
        if (alertElement) {
            alertElement.className = 'alert alert-danger alert-dismissible fade show';
        }
    }
}

function resetListings() {
    const listingsContainer = document.getElementById('listingsContainer');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const desktopSearchInput = document.getElementById('desktopSearchInput');
    
    // Reset listings display
    listingsContainer.innerHTML = originalListings;
    
    // Hide search results and loading states
    hideSearchResults();
    hideAllLoadingStates();
    
    // Reset alert class to info
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    if (searchResultsContainer) {
        const alertElement = searchResultsContainer.querySelector('.alert');
        if (alertElement) {
            alertElement.className = 'alert alert-info alert-dismissible fade show';
        }
    }
    
    // Clear search inputs
    if (mobileSearchInput) mobileSearchInput.value = '';
    if (desktopSearchInput) desktopSearchInput.value = '';
    
    // Re-apply tax toggle if it was checked
    const taxToggle = document.getElementById('flexSwitchCheckDefault');
    if (taxToggle && taxToggle.checked) {
        applyTaxToggle();
    }
}

function applyTaxToggle() {
    // Tax toggle functionality (existing code)
    const priceElements = document.getElementsByClassName("price");
    const originalPrices = Array.from(priceElements).map(el => {
        return parseFloat(el.innerText.replace(/,/g, ''));
    });

    for(let i = 0; i < priceElements.length; i++) {
        const withTax = originalPrices[i] * 1.18;
        priceElements[i].innerText = Math.round(withTax).toLocaleString("en-IN");
    }
}
