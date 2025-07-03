const fs = require('fs');
const path = require('path');

// Your JSON data goes here - I'll process it to remove Amazon links
const rawData = [
    {
        "_id": "670e783860e144b44079f5ff",
        "name": "AGM M8",
        "link": "",
        "price": 90,
        "support_and_updates": ["Not reliable"],
        "category": ["Dumbphone (Lifestyle Change)"],
        "network": ["T-mobile"],
        "5G/4G/3G/2G": ["4G"],
        "VoLTE": ["Yes"],
        "rideshare": ["No"],
        "gps_navigation": ["No"],
        "shape": ["Flip"],
        "group_text_MMS": ["Workaround"],
        "removable_battery": ["Yes"],
        "operating_system": ["ThreadX"],
        "hotspot_tethering": ["No"],
        "browser": ["Yes"],
        "wifi_calling": ["No"],
        "whatsapp": ["No"],
        "sd_cards": ["Yes"],
        "2FA": ["SMS"],
        "spotify": ["No"],
        "email": ["No"],
        "voice_to_text": ["No", ""],
        "t9_keyboard": ["No"],
        "usb_type": ["USB-C"],
        "headphone_jack": ["Yes"],
        "signal_app": ["No"],
        "camera": ["Yes"],
        "calendar": ["Yes"],
        "screen_size_inches": {
            "$numberDecimal": "2.4"
        },
        "screen_type": ["LCD"],
        "sim_type": ["Micro"],
        "sold_unlocked": ["Yes"],
        "dual_sim": ["Yes"],
        "podcasts_music": ["MP3 Only"],
        "rugged": ["Yes"],
        "bluetooth": ["Yes"],
        "rating": "⭐️⭐️⭐️",
        "image": "https://images.squarespace-cdn.com/content/64d509b6fc7327768c9807a2/06421bb5-1704-4787-9dbe-c72509b60075/Design+5+%281%29.png?content-type=image%2Fpng",
        "europe_network": ["O2", "Giff Gaff", "Vodafone UK", "Three", "EE", "United Kingdom 🇬🇧", "Spain 🇪🇸", "France 🇫🇷", "Portugal 🇵🇹", "Netherlands 🇳🇱", "Germany 🇩🇪", "Italy 🇮🇹", "Poland 🇵🇱"],
        "Touchscreen": "No",
        "android_auto": ["no"],
        "region": ["Europe", "Asia/Oceania", "North America"],
        "asia_network": ["Optus"],
        "NFC_support": "No",
        "eSIM": ["enabled", "dual"]
    }
    // Add the rest of your data here with links cleaned
];

function cleanAmazonLinks(data) {
    return data.map(phone => {
        const cleaned = { ...phone };
        
        // Remove Amazon links
        if (cleaned.link && cleaned.link.includes('amzn.to')) {
            cleaned.link = '';
        }
        
        // Rename jose_ratings to rating
        if (cleaned.jose_ratings) {
            cleaned.rating = cleaned.jose_ratings;
            delete cleaned.jose_ratings;
        }
        
        return cleaned;
    });
}

const processedData = cleanAmazonLinks(rawData);

// Write to file
const outputPath = path.join(__dirname, '../data/dumbphones-processed.json');
fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));

console.log(`Processed ${processedData.length} phones and saved to ${outputPath}`);
console.log('Amazon links removed and jose_ratings renamed to rating');