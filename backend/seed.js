import fs from 'fs';
import csv from 'csv-parser';
import { supabase } from './supabaseClient.js';

const determineCategory = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('hostel')) return 'hostels';
    if (lowerName.includes('dining') || lowerName.includes('mess') || lowerName.includes('nescafe') || lowerName.includes('food')) return 'dining';
    if (lowerName.includes('library')) return 'library';
    if (lowerName.includes('department') || lowerName.includes('block') || lowerName.includes('lab') || lowerName.includes('academic') || lowerName.includes('lecture') || lowerName.includes('tutorial')) return 'academic';
    
    return 'other'; // default bucket
};

const seedDatabase = async () => {
    const results = [];
    const csvFilePath = '../../capstone project.csv'; // Relative to backend/

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
            // Trim whitespace and validate
            const name = data.location ? data.location.trim() : null;
            const lat = parseFloat(data.latitude);
            const lng = parseFloat(data.longitude);
            
            if (name && !isNaN(lat) && !isNaN(lng)) {
                results.push({
                    name: name,
                    lat: lat,
                    lng: lng,
                    category: determineCategory(name)
                });
            }
        })
        .on('end', async () => {
            console.log(`Parsed ${results.length} valid locations from CSV.`);
            
            // Insert into Supabase
            console.log('Pushing to Supabase...');
            const { data, error } = await supabase
                .from('locations')
                .insert(results);

            if (error) {
                console.error("Error inserting data:", error.message);
            } else {
                console.log("Successfully seeded database!");
            }
        });
};

seedDatabase();
