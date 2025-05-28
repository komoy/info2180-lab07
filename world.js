document.addEventListener('DOMContentLoaded', () => {
    const lookupBtn = document.getElementById('lookup');
    const countryInput = document.getElementById('country');
    const result = document.getElementById('result');

    // Create and add the checkbox for "all countries"
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'form-check ms-2 mt-2';
    checkboxDiv.innerHTML = `
        <input class="form-check-input" type="checkbox" id="all">
        <label class="form-check-label" for="all">
            Show all countries
        </label>
    `;
    document.querySelector('.input-group').after(checkboxDiv);

    async function fetchCountryData() {
        try {
            // Show loading state
            result.innerHTML = '<div class="text-center my-4"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Loading...</div></div>';
            
            const allChecked = document.getElementById('all').checked;
            const searchValue = countryInput.value.trim();
            
            // Validate input when not searching all
            if (!allChecked && !searchValue) {
                throw new Error('Please enter a country name to search');
            }
            
            const url = `world.php?${allChecked ? 'all=true' : `country=${encodeURIComponent(searchValue)}`}`;
            
            const response = await fetch(url);
            const contentType = response.headers.get('content-type');
            
            if (!response.ok) {
                throw new Error(`Server error (${response.status}): ${response.statusText}`);
            }
            
            // Handle both JSON and HTML responses
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
                if (data.status === 'error') {
                    throw new Error(data.message);
                }
                result.innerHTML = data.message || 'No results found';
            } else {
                data = await response.text();
                if (!data.trim()) {
                    result.innerHTML = '<div class="alert alert-info">No countries found.</div>';
                } else {
                    result.innerHTML = data;
                }
            }
            
        } catch (error) {
            console.error('Error:', error);
            result.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${error.message}<br>
                    <small>Please ensure your PHP server is running and the database is configured correctly.</small>
                </div>`;
        }
    }

    // Event Listeners
    lookupBtn.addEventListener('click', fetchCountryData);
    
    // Allow Enter key to trigger search
    countryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchCountryData();
        }
    });
    
    // Trigger search on checkbox change if a country is entered
    document.getElementById('all').addEventListener('change', (e) => {
        if (e.target.checked || countryInput.value.trim()) {
            fetchCountryData();
        }
    });
});
