// Global variables for the JSON data
let companyCodesData, locationCodesData, industryBroadData;

// Define file paths
const files = {
  companyCodes: '../json/company_codes_.json',
  locationCodes: '../json/city_code.json',
  industryBroad: '../json/industry_broad.json'
};

// Fetch company_codes_.json
fetch(files.companyCodes)
  .then(response => response.json())
  .then(data => {
    companyCodesData = data;
    populateCheckboxes();
  })
  .catch(error => console.error('Error reading company_codes_.json:', error));

// Fetch city_code.json
fetch(files.locationCodes)
  .then(response => response.json())
  .then(data => {
    locationCodesData = data;
    populateCheckboxes();
  })
  .catch(error => console.error('Error reading city_code.json:', error));

// Fetch industry_broad.json
fetch(files.industryBroad)
  .then(response => response.json())
  .then(data => {
    industryBroadData = data;
    populateCheckboxes();
  })
  .catch(error => console.error('Error reading industry_broad.json:', error));

/**
 * populateCheckboxes() waits until all required data is loaded before building the checkboxes.
 * A "Select All" checkbox is added under cities that acts solely as a flag.
 */
function populateCheckboxes() {
    if (companyCodesData && locationCodesData && industryBroadData) {
      // --- Build City Checkboxes ---
      const cityCheckboxesDiv = document.getElementById('cityCheckboxes');
      cityCheckboxesDiv.innerHTML = ''; // Clear any existing checkboxes
  
      // Create individual city checkboxes
      const cities = Object.keys(companyCodesData['USA']);
      cities.forEach(city => {
        const wrapper = document.createElement('div');
  
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = city;
        checkbox.id = `city-${city}`;
  
        const label = document.createElement('label');
        label.htmlFor = `city-${city}`;
        label.textContent = city;
  
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        cityCheckboxesDiv.appendChild(wrapper);
      });
  
      // Add the "Select All" checkbox (acts as a flag only)
      const selectAllWrapper = document.createElement('div');
      const selectAllCheckbox = document.createElement('input');
      selectAllCheckbox.type = 'checkbox';
      selectAllCheckbox.id = 'citySelectAll';
  
      const selectAllLabel = document.createElement('label');
      selectAllLabel.htmlFor = 'citySelectAll';
      selectAllLabel.textContent = 'Select All';
  
      selectAllWrapper.appendChild(selectAllCheckbox);
      selectAllWrapper.appendChild(selectAllLabel);
      cityCheckboxesDiv.appendChild(selectAllWrapper);
  
      // --- Build Industry Checkboxes ---
      // Derive the list of industries from companyCodesData
      const industries = [
        ...new Set(
          Object.values(companyCodesData['USA'])
            .flatMap(cityObj => Object.keys(cityObj))
        )
      ];
  
      const industryCheckboxesDiv = document.getElementById('industryCheckboxes');
      industryCheckboxesDiv.innerHTML = '';
  
      // Create container element for three columns
      const columnsContainer = document.createElement('div');
      columnsContainer.className = 'industry-columns';
  
      const col1 = document.createElement('div');
      col1.className = 'industry-column';
      const col2 = document.createElement('div');
      col2.className = 'industry-column';
      const col3 = document.createElement('div');
      col3.className = 'industry-column';
  
      // Define base categories for each column
      const col1Base = ['Business & Finance'];
      const col2Base = ['STEM & Technical Fields'];
      const col3Base = ['Government, Law & Public Service'];
  
      // Get remaining categories not in any base
      const remainingCategories = Object.keys(industryBroadData).filter(cat =>
        !col1Base.includes(cat) && !col2Base.includes(cat) && !col3Base.includes(cat)
      );
  
      // Distribute remaining categories round-robin among the three columns
      const col1Remaining = [];
      const col2Remaining = [];
      const col3Remaining = [];
      remainingCategories.forEach((cat, index) => {
        if (index % 3 === 0) {
          col1Remaining.push(cat);
        } else if (index % 3 === 1) {
          col2Remaining.push(cat);
        } else {
          col3Remaining.push(cat);
        }
      });
  
      const col1Categories = col1Base.concat(col1Remaining);
      const col2Categories = col2Base.concat(col2Remaining);
      const col3Categories = col3Base.concat(col3Remaining);
  
      // Helper function to create a category section with checkboxes for each industry
      const createCategoryDiv = (category) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'industry-category';
  
        const header = document.createElement('h3');
        header.textContent = category;
        categoryDiv.appendChild(header);
  
        industryBroadData[category].forEach(industry => {
          if (industries.includes(industry)) {
            const wrapper = document.createElement('div');
            wrapper.className = 'checkbox-wrapper';
  
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = industry;
            checkbox.id = `industry-${industry}`;
  
            const label = document.createElement('label');
            label.htmlFor = `industry-${industry}`;
            label.textContent = industry;
  
            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            categoryDiv.appendChild(wrapper);
          }
        });
        return categoryDiv;
      };
  
      // Populate the first column (Finance)
      col1Categories.forEach(category => {
        if (industryBroadData[category]) {
          col1.appendChild(createCategoryDiv(category));
        }
      });
  
      // Populate the second column (Tech)
      col2Categories.forEach(category => {
        if (industryBroadData[category]) {
          col2.appendChild(createCategoryDiv(category));
        }
      });
  
      // Populate the third column (Government)
      col3Categories.forEach(category => {
        if (industryBroadData[category]) {
          col3.appendChild(createCategoryDiv(category));
        }
      });
  
      columnsContainer.appendChild(col1);
      columnsContainer.appendChild(col2);
      columnsContainer.appendChild(col3);
      industryCheckboxesDiv.appendChild(columnsContainer);
    }
  }
  
  function showCompanies() {
    // Check if the "Select All" checkbox is checked
    const selectAllChecked = document.getElementById('citySelectAll')?.checked;
  
    let selectedCities = [];
    if (selectAllChecked) {
      // If "Select All" is checked, treat all cities as selected.
      selectedCities = Object.keys(companyCodesData['USA']);
    } else {
      // Otherwise, only consider the individually checked city checkboxes.
      selectedCities = Array.from(document.querySelectorAll('#cityCheckboxes input[type="checkbox"]:not(#citySelectAll):checked'))
                            .map(cb => cb.value);
    }
  
    // Get selected industries from the industry checkboxes
    const selectedIndustries = Array.from(document.querySelectorAll('#industryCheckboxes input:checked'))
                                    .map(cb => cb.value);
  
    console.log("Selected Cities:", selectedCities);
    console.log("Selected Industries:", selectedIndustries);
  
    if (companyCodesData && locationCodesData && selectedCities.length > 0 && selectedIndustries.length > 0) {
      // Clear previous results
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '';
  
      // Create two column containers for the tables
      const leftColumn = document.createElement('div');
      leftColumn.className = 'results-column';
      const rightColumn = document.createElement('div');
      rightColumn.className = 'results-column';
  
      let tableIndex = 0;
  
      // Loop through each city/industry combination and create a separate table for each
      selectedCities.forEach(city => {
        selectedIndustries.forEach(industry => {
          // Create a table for this combination
          const table = document.createElement('table');
          table.style.borderCollapse = 'collapse';
          table.style.width = '100%';
          table.border = "1";
  
          const tbody = document.createElement('tbody');
  
          // Header row for the combination
          const headerRow = document.createElement('tr');
          const headerCell = document.createElement('td');
          headerCell.colSpan = 2;
          headerCell.style.backgroundColor = '#cae0fc';
          headerCell.style.height = '10px';
          headerCell.style.fontWeight = 'bold';
          headerCell.textContent = `${industry}: ${city}`;
          headerRow.appendChild(headerCell);
          tbody.appendChild(headerRow);
  
          // Check if there are companies for this combination
          if (companyCodesData['USA'][city] && companyCodesData['USA'][city][industry]) {
            const companies = companyCodesData['USA'][city][industry];
            const cityCode = locationCodesData['Cities'][city];
  
            companies.forEach(companyObj => {
              const row = document.createElement('tr');
              const cell = document.createElement('td');
              const link = document.createElement('a');
              link.href = `${companyObj.LinkedInURL}/people/?facetGeoRegion=${cityCode}&facetSchool=4298`;
              link.target = '_blank';
              link.textContent = companyObj.Company;
              cell.appendChild(link);
              row.appendChild(cell);
              tbody.appendChild(row);
            });
          } else {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 2;
            cell.textContent = 'No companies found for this combination.';
            row.appendChild(cell);
            tbody.appendChild(row);
          }
  
          // Optional spacing row for visual separation
          const spacingRow = document.createElement('tr');
          const spacingCell = document.createElement('td');
          spacingCell.colSpan = 2;
          spacingCell.style.height = '30px';
          spacingRow.appendChild(spacingCell);
          tbody.appendChild(spacingRow);
  
          table.appendChild(tbody);
  
          // Alternate appending tables to left/right column
          if (tableIndex % 2 === 0) {
            leftColumn.appendChild(table);
          } else {
            rightColumn.appendChild(table);
          }
          tableIndex++;
        });
      });
  
      // Append the two columns to the results container
      resultsDiv.appendChild(leftColumn);
      resultsDiv.appendChild(rightColumn);
    } else {
      alert('Please ensure all JSON files are loaded and select at least one city and one industry.');
    }
  }
  