import json
import os
import sys

def get_input(prompt, options=None):
    """Get user input with exit/back functionality."""
    while True:
        print("\nType 'exit' or 'q' to quit the program")
        print("Type 'back' or 'b' to go back to previous menu")
        if options:
            print(f"Or select a number between 1 and {len(options)}")
        
        choice = input(prompt).lower().strip()
        
        if choice in ['exit', 'q']:
            print("\nExiting program...")
            sys.exit(0)
        elif choice in ['back', 'b']:
            return 'back'
        elif options and choice.isdigit():
            choice = int(choice)
            if 1 <= choice <= len(options):
                return choice
            else:
                print(f"\nPlease enter a number between 1 and {len(options)}")
        elif not options:
            return choice
        else:
            print("\nInvalid input, please try again")

def load_json_files():
    """Load all JSON files."""
    with open('json/city_industry_company.json', 'r') as f:
        city_industry_data = json.load(f)
    with open('json/company_codes_.json', 'r') as f:
        company_codes_data = json.load(f)
    with open('json/city_code.json', 'r') as f:
        city_code_data = json.load(f)
    return city_industry_data, company_codes_data, city_code_data

def save_json_files(city_industry_data, company_codes_data, city_code_data):
    """Save all JSON files."""
    with open('json/city_industry_company.json', 'w') as f:
        json.dump(city_industry_data, f, indent=3)
    with open('json/company_codes_.json', 'w') as f:
        json.dump(company_codes_data, f, indent=3)
    with open('json/city_code.json', 'w') as f:
        json.dump(city_code_data, f, indent=3)

def add_company():
    """Add a new company to a city/industry pair."""
    while True:
        city_industry_data, company_codes_data, city_code_data = load_json_files()
        
        # Get available regions
        print("\nAvailable regions:")
        regions = list(city_industry_data.keys())
        for i, region in enumerate(regions, 1):
            print(f"{i}. {region}")
        
        region_choice = get_input("\nSelect region number: ", regions)
        if region_choice == 'back':
            return
        region = regions[region_choice - 1]
        
        # Get available cities
        print("\nAvailable cities:")
        cities = list(city_industry_data[region].keys())
        for i, city in enumerate(cities, 1):
            print(f"{i}. {city}")
        
        city_choice = get_input("\nSelect city number: ", cities)
        if city_choice == 'back':
            continue
        city = cities[city_choice - 1]
        
        # Get available industries
        print("\nAvailable industries:")
        industries = list(city_industry_data[region][city].keys())
        for i, industry in enumerate(industries, 1):
            print(f"{i}. {industry}")
        
        industry_choice = get_input("\nSelect industry number: ", industries)
        if industry_choice == 'back':
            continue
        industry = industries[industry_choice - 1]
        
        # Get company details
        company_name = get_input("\nEnter company name: ").title()
        if company_name == 'back':
            continue
        
        linkedin_url = get_input("Enter company LinkedIn URL: ")
        if linkedin_url == 'back':
            continue
        
        # Add to city_industry_company.json
        city_industry_data[region][city][industry].append(company_name)
        
        # Add to company_codes_.json
        if region not in company_codes_data:
            company_codes_data[region] = {}
        if city not in company_codes_data[region]:
            company_codes_data[region][city] = {}
        if industry not in company_codes_data[region][city]:
            company_codes_data[region][city][industry] = []
        
        company_codes_data[region][city][industry].append({
            "Company": company_name,
            "LinkedInURL": linkedin_url
        })
        
        # Save changes
        save_json_files(city_industry_data, company_codes_data, city_code_data)
        print(f"\nSuccessfully added {company_name} to {city}/{industry}")
        return

def add_industry():
    """Add a new industry to a city."""
    while True:
        city_industry_data, company_codes_data, city_code_data = load_json_files()
        
        # Get available regions
        print("\nAvailable regions:")
        regions = list(city_industry_data.keys())
        for i, region in enumerate(regions, 1):
            print(f"{i}. {region}")
        
        region_choice = get_input("\nSelect region number: ", regions)
        if region_choice == 'back':
            return
        region = regions[region_choice - 1]
        
        # Get available cities
        print("\nAvailable cities:")
        cities = list(city_industry_data[region].keys())
        for i, city in enumerate(cities, 1):
            print(f"{i}. {city}")
        
        city_choice = get_input("\nSelect city number: ", cities)
        if city_choice == 'back':
            continue
        city = cities[city_choice - 1]
        
        # Get new industry name
        industry = get_input("\nEnter new industry name: ").title()
        if industry == 'back':
            continue
        
        # Add to city_industry_company.json
        city_industry_data[region][city][industry] = []
        
        # Add to company_codes_.json
        if region not in company_codes_data:
            company_codes_data[region] = {}
        if city not in company_codes_data[region]:
            company_codes_data[region][city] = {}
        company_codes_data[region][city][industry] = []
        
        # Save changes
        save_json_files(city_industry_data, company_codes_data, city_code_data)
        print(f"\nSuccessfully added industry {industry} to {city}")
        return

def add_city():
    """Add a new city with its code."""
    while True:
        city_industry_data, company_codes_data, city_code_data = load_json_files()
        
        # Get available regions
        print("\nAvailable regions:")
        regions = list(city_industry_data.keys())
        for i, region in enumerate(regions, 1):
            print(f"{i}. {region}")
        
        region_choice = get_input("\nSelect region number: ", regions)
        if region_choice == 'back':
            return
        region = regions[region_choice - 1]
        
        # Get new city details
        city = get_input("\nEnter new city name: ").title()
        if city == 'back':
            continue
        
        city_code = get_input("Enter LinkedIn geo location code for the city: ")
        if city_code == 'back':
            continue
        
        # Add to city_code.json
        city_code_data["Cities"][city] = city_code
        
        # Add to city_industry_company.json
        city_industry_data[region][city] = {}
        
        # Add to company_codes_.json
        if region not in company_codes_data:
            company_codes_data[region] = {}
        company_codes_data[region][city] = {}
        
        # Save changes
        save_json_files(city_industry_data, company_codes_data, city_code_data)
        print(f"\nSuccessfully added city {city} with code {city_code}")
        return

def delete_company():
    """Delete a company from all files."""
    while True:
        city_industry_data, company_codes_data, city_code_data = load_json_files()
        
        # Get available regions
        print("\nAvailable regions:")
        regions = list(city_industry_data.keys())
        for i, region in enumerate(regions, 1):
            print(f"{i}. {region}")
        
        region_choice = get_input("\nSelect region number: ", regions)
        if region_choice == 'back':
            return
        region = regions[region_choice - 1]
        
        # Get available cities
        print("\nAvailable cities:")
        cities = list(city_industry_data[region].keys())
        for i, city in enumerate(cities, 1):
            print(f"{i}. {city}")
        
        city_choice = get_input("\nSelect city number: ", cities)
        if city_choice == 'back':
            continue
        city = cities[city_choice - 1]
        
        # Get available industries
        print("\nAvailable industries:")
        industries = list(city_industry_data[region][city].keys())
        for i, industry in enumerate(industries, 1):
            print(f"{i}. {industry}")
        
        industry_choice = get_input("\nSelect industry number: ", industries)
        if industry_choice == 'back':
            continue
        industry = industries[industry_choice - 1]
        
        # Get available companies
        print("\nAvailable companies:")
        companies = city_industry_data[region][city][industry]
        for i, company in enumerate(companies, 1):
            print(f"{i}. {company}")
        
        company_choice = get_input("\nSelect company number to delete: ", companies)
        if company_choice == 'back':
            continue
        company_name = companies[company_choice - 1]
        
        # Remove from city_industry_company.json
        city_industry_data[region][city][industry].remove(company_name)
        
        # Remove from company_codes_.json
        company_codes_data[region][city][industry] = [
            company for company in company_codes_data[region][city][industry]
            if company["Company"] != company_name
        ]
        
        # Save changes
        save_json_files(city_industry_data, company_codes_data, city_code_data)
        print(f"\nSuccessfully deleted {company_name}")
        return

def delete_industry():
    """Delete an industry from all files."""
    while True:
        city_industry_data, company_codes_data, city_code_data = load_json_files()
        
        # Get available regions
        print("\nAvailable regions:")
        regions = list(city_industry_data.keys())
        for i, region in enumerate(regions, 1):
            print(f"{i}. {region}")
        
        region_choice = get_input("\nSelect region number: ", regions)
        if region_choice == 'back':
            return
        region = regions[region_choice - 1]
        
        # Get available cities
        print("\nAvailable cities:")
        cities = list(city_industry_data[region].keys())
        for i, city in enumerate(cities, 1):
            print(f"{i}. {city}")
        
        city_choice = get_input("\nSelect city number: ", cities)
        if city_choice == 'back':
            continue
        city = cities[city_choice - 1]
        
        # Get available industries
        print("\nAvailable industries:")
        industries = list(city_industry_data[region][city].keys())
        for i, industry in enumerate(industries, 1):
            print(f"{i}. {industry}")
        
        industry_choice = get_input("\nSelect industry number to delete: ", industries)
        if industry_choice == 'back':
            continue
        industry = industries[industry_choice - 1]
        
        # Remove from city_industry_company.json
        del city_industry_data[region][city][industry]
        
        # Remove from company_codes_.json
        if industry in company_codes_data[region][city]:
            del company_codes_data[region][city][industry]
        
        # Save changes
        save_json_files(city_industry_data, company_codes_data, city_code_data)
        print(f"\nSuccessfully deleted industry {industry} from {city}")
        return

def delete_city():
    """Delete a city from all files."""
    while True:
        city_industry_data, company_codes_data, city_code_data = load_json_files()
        
        # Get available regions
        print("\nAvailable regions:")
        regions = list(city_industry_data.keys())
        for i, region in enumerate(regions, 1):
            print(f"{i}. {region}")
        
        region_choice = get_input("\nSelect region number: ", regions)
        if region_choice == 'back':
            return
        region = regions[region_choice - 1]
        
        # Get available cities
        print("\nAvailable cities:")
        cities = list(city_industry_data[region].keys())
        for i, city in enumerate(cities, 1):
            print(f"{i}. {city}")
        
        city_choice = get_input("\nSelect city number to delete: ", cities)
        if city_choice == 'back':
            continue
        city = cities[city_choice - 1]
        
        # Remove from city_code.json
        if city in city_code_data["Cities"]:
            del city_code_data["Cities"][city]
        
        # Remove from city_industry_company.json
        del city_industry_data[region][city]
        
        # Remove from company_codes_.json
        if city in company_codes_data[region]:
            del company_codes_data[region][city]
        
        # Save changes
        save_json_files(city_industry_data, company_codes_data, city_code_data)
        print(f"\nSuccessfully deleted city {city}")
        return

def update_company():
    """Update an existing company."""
    while True:
        city_industry_data, company_codes_data, city_code_data = load_json_files()
        
        # Get available regions
        print("\nAvailable regions:")
        regions = list(city_industry_data.keys())
        for i, region in enumerate(regions, 1):
            print(f"{i}. {region}")
        
        region_choice = get_input("\nSelect region number: ", regions)
        if region_choice == 'back':
            return
        region = regions[region_choice - 1]
        
        # Get available cities
        print("\nAvailable cities:")
        cities = list(city_industry_data[region].keys())
        for i, city in enumerate(cities, 1):
            print(f"{i}. {city}")
        
        city_choice = get_input("\nSelect city number: ", cities)
        if city_choice == 'back':
            continue
        city = cities[city_choice - 1]
        
        # Get available industries
        print("\nAvailable industries:")
        industries = list(city_industry_data[region][city].keys())
        for i, industry in enumerate(industries, 1):
            print(f"{i}. {industry}")
        
        industry_choice = get_input("\nSelect industry number: ", industries)
        if industry_choice == 'back':
            continue
        industry = industries[industry_choice - 1]
        
        # Get available companies
        print("\nAvailable companies:")
        companies = city_industry_data[region][city][industry]
        for i, company in enumerate(companies, 1):
            print(f"{i}. {company}")
        
        company_choice = get_input("\nSelect company number: ", companies)
        if company_choice == 'back':
            continue
        old_name = companies[company_choice - 1]
        
        # Get new details
        print("\nPress Enter to keep current value")
        new_name = get_input("Enter new company name: ").title()
        if new_name == 'back':
            continue
        
        new_url = get_input("Enter new LinkedIn URL: ")
        if new_url == 'back':
            continue
        
        # Update in city_industry_company.json
        if new_name and new_name != "":
            city_industry_data[region][city][industry][company_choice - 1] = new_name
        
        # Update in company_codes_.json
        company_data = next(
            (company for company in company_codes_data[region][city][industry] 
             if company["Company"] == old_name),
            None
        )
        if company_data:
            if new_name and new_name != "":
                company_data["Company"] = new_name
            if new_url and new_url != "":
                company_data["LinkedInURL"] = new_url
        
        # Save changes
        save_json_files(city_industry_data, company_codes_data, city_code_data)
        print("\nCompany updated successfully")
        return

def main():
    while True:
        print("\n=== Company Management Tool ===")
        print("1. Add new company")
        print("2. Add new industry")
        print("3. Add new city")
        print("4. Delete company")
        print("5. Delete industry")
        print("6. Delete city")
        print("7. Update existing company")
        print("8. Exit")
        
        choice = get_input("\nSelect an option: ", range(1, 9))
        if choice == 'back':
            continue
        
        if choice == 1:
            add_company()
        elif choice == 2:
            add_industry()
        elif choice == 3:
            add_city()
        elif choice == 4:
            delete_company()
        elif choice == 5:
            delete_industry()
        elif choice == 6:
            delete_city()
        elif choice == 7:
            update_company()
        elif choice == 8:
            print("\nExiting program...")
            break

if __name__ == "__main__":
    main()
