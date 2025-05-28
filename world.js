document.addEventListener('DOMContentLoaded', () => {
    const lookupBtn = document.getElementById('lookup');
    const countryInput = document.getElementById('country');
    const result = document.getElementById('result');

    // Create and add the checkbox for "all countries"
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'form-check ms-2';
    checkboxDiv.innerHTML = `
        <input class="form-check-input" type="checkbox" id="all">
        <label class="form-check-label" for="all">
            Show all countries
        </label>
    `;
    lookupBtn.after(checkboxDiv);

    async function fetchCountryData() {
        try {
            // Show loading state
            result.innerHTML = '<div class="loading">Loading...</div>';
            
            const allChecked = document.getElementById('all').checked;
            const searchValue = countryInput.value.trim();
            
            // Validate input when not searching all
            if (!allChecked && !searchValue) {
                throw new Error('Please enter a country name to search');
            }
            
            const url = `world.php?${allChecked ? 'all=true' : `country=${encodeURIComponent(searchValue)}`}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Server error (${response.status}): ${response.statusText}`);
            }
            
            const data = await response.text();
            if (!data) {
                throw new Error('No data received from server');
            }
            
            result.innerHTML = data;
        } catch (error) {
            console.error('Error:', error);
            result.innerHTML = `<div class="alert alert-danger">
                <strong>Error:</strong> ${error.message}<br>
                <small>Make sure your PHP server is running and the database is properly configured.</small>
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
});
