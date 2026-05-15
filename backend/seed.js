import fs from 'fs';
import csv from 'csv-parser';
import { supabase } from './supabaseClient.js';


const seedDatabase = async () => {
    const results = [];
    const csvFilePath = '../locations.csv'; // Relative to backend/

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
            // Trim whitespace and validate
            const name = data.location ? data.location.trim() : null;
            const lat = parseFloat(data.latitude);
            const lng = parseFloat(data.longitude);
            const category = data.category ? data.category.trim().toLowerCase() : 'other';
            
            if (name && !isNaN(lat) && !isNaN(lng)) {
                results.push({
                    name: name,
                    lat: lat,
                    lng: lng,
                    category: category
                });
            }
        })
        .on('end', async () => {
            console.log(`Parsed ${results.length} valid locations from CSV.`);
            
            // Delete all previous data
            console.log('Wiping existing data from locations table...');
            const { error: deleteError } = await supabase
                .from('locations')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows

            if (deleteError) {
                console.error("Error wiping data:", deleteError.message);
                return;
            }
            
            // Insert into Supabase
            console.log('Pushing new data to Supabase...');
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
