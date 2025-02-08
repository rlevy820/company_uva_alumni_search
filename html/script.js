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

    // Add the "Select All" checkbox (it acts as a flag only and does not affect the visual state of individual boxes)
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

    // Create container elements for two columns
    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'industry-columns';

    const leftColumn = document.createElement('div');
    leftColumn.className = 'industry-column';
    const rightColumn = document.createElement('div');
    rightColumn.className = 'industry-column';

    // Define the order of categories for the columns
    const leftColumnCategories = ['STEM & Technical Fields', 'Government, Law & Public Service'];
    const rightColumnCategories = ['Business & Finance', 'Healthcare & Life Sciences', 'Creative & Cultural Industries'];
    const remainingCategories = Object.keys(industryBroadData)
      .filter(cat => !leftColumnCategories.includes(cat) && !rightColumnCategories.includes(cat));

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

    // Populate the left column
    leftColumnCategories.forEach(category => {
      if (industryBroadData[category]) {
        leftColumn.appendChild(createCategoryDiv(category));
      }
    });
    const midpoint = Math.ceil(remainingCategories.length / 2);
    remainingCategories.slice(0, midpoint).forEach(category => {
      leftColumn.appendChild(createCategoryDiv(category));
    });

    // Populate the right column
    rightColumnCategories.forEach(category => {
      if (industryBroadData[category]) {
        rightColumn.appendChild(createCategoryDiv(category));
      }
    });
    remainingCategories.slice(midpoint).forEach(category => {
      rightColumn.appendChild(createCategoryDiv(category));
    });

    columnsContainer.appendChild(leftColumn);
    columnsContainer.appendChild(rightColumn);
    industryCheckboxesDiv.appendChild(columnsContainer);
  }
}

/**
 * showCompanies() reads the selected cities and industries, then builds an HTML table of companies.
 * If the "Select All" checkbox (citySelectAll) is checked, it treats all cities as selected.
 */
function showCompanies() {
  // Check if the "Select All" checkbox is checked
  const selectAllChecked = document.getElementById('citySelectAll')?.checked;

  let selectedCities = [];
  if (selectAllChecked) {
    // If "Select All" is checked, override selection with all cities
    selectedCities = Object.keys(companyCodesData['USA']);
  } else {
    // Otherwise, use only the individually checked city checkboxes.
    selectedCities = Array.from(document.querySelectorAll('#cityCheckboxes input[type="checkbox"]:not(#citySelectAll):checked'))
                          .map(cb => cb.value);
  }

  // Get selected industries from the industry checkboxes
  const selectedIndustries = Array.from(document.querySelectorAll('#industryCheckboxes input:checked'))
                                  .map(cb => cb.value);

  console.log("Selected Cities:", selectedCities);
  console.log("Selected Industries:", selectedIndustries);

  if (companyCodesData && locationCodesData && selectedCities.length > 0 && selectedIndustries.length > 0) {
    let resultHTML = '<table border="1" style="border-collapse: collapse; width: 50%;">';
    resultHTML += '<tbody>';

    selectedCities.forEach(city => {
      selectedIndustries.forEach(industry => {
        resultHTML += `<tr><td colspan="2" style="background-color: #cae0fc; height: 10px; font-weight: bold;">${industry}: ${city}</td></tr>`;
        console.log(`Fetching data for City: ${city}, Industry: ${industry}`);

        if (companyCodesData['USA'][city] && companyCodesData['USA'][city][industry]) {
          const companies = companyCodesData['USA'][city][industry];
          const cityCode = locationCodesData['Cities'][city];

          console.log("Companies:", companies);
          console.log("City Code:", cityCode);

          companies.forEach(companyObj => {
            resultHTML += `
              <tr>
                <td>
                  <a href="${companyObj.LinkedInURL}/people/?facetGeoRegion=${cityCode}&facetSchool=4298" target="_blank">
                    ${companyObj.Company}
                  </a>
                </td>
              </tr>`;
          });
        } else {
          resultHTML += `<tr><td colspan="2">No companies found for this combination.</td></tr>`;
        }
        resultHTML += '<tr><td colspan="2" style="height: 30px;"></td></tr>';
      });
    });

    resultHTML += '</tbody></table>';
    document.getElementById('results').innerHTML = resultHTML;
  } else {
    alert('Please ensure all JSON files are loaded and select at least one city and one industry.');
  }
}
