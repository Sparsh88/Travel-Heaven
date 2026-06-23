const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Contact = require('../models/Contact');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travel-heaven');
    console.log('Connected to database for seeding...');

    // Wipe collections
    await Admin.deleteMany();
    await Destination.deleteMany();
    await Package.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();
    await Review.deleteMany();
    await Contact.deleteMany();
    await User.deleteMany();
    console.log('Cleared existing database records.');

    // 1. Create Default Admin Profile
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@travelheaven.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`Created default Admin account: ${admin.username} (password: admin123)`);

    // 2. Create Destinations
    const destinationsData = [
      {
        name: 'Bali',
        country: 'Indonesia',
        description: 'Discover the tropical paradise of Bali, famous for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs.',
        category: 'International',
        budgetCategory: 'Mid-Range',
        featured: true,
        images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Paris',
        country: 'France',
        description: 'Paris, France’s capital, is a major European city and a global center for art, fashion, gastronomy, and culture.',
        category: 'International',
        budgetCategory: 'Luxury',
        featured: true,
        images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Manali',
        country: 'India',
        description: 'Manali is a high-altitude Himalayan resort town in India’s northern Himachal Pradesh state. It has a reputation as a backpacking center and honeymoon destination.',
        category: 'Domestic',
        budgetCategory: 'Budget',
        featured: true,
        images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Kerala',
        country: 'India',
        description: 'Kerala, a state on India\'s tropical Malabar Coast, has nearly 600km of Arabian Sea shoreline. It\'s known for its palm-lined beaches and backwaters.',
        category: 'Domestic',
        budgetCategory: 'Mid-Range',
        featured: false,
        images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        description: 'Tokyo, Japan’s busy capital, mixes ultramodern and traditional neon-lit skyscrapers and historic temples.',
        category: 'International',
        budgetCategory: 'Luxury',
        featured: false,
        images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Goa',
        description: 'Goa is a state in western India with coastlines stretching along the Arabian Sea. It’s famed for its beaches, places of worship, and world heritage architecture.',
        category: 'Domestic',
        budgetCategory: 'Budget',
        featured: true,
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Delhi',
        country: 'India',
        description: "Delhi, India's capital, is a historic city offering a blend of ancient heritage and modern life. Explore grand monuments like Qutub Minar, Red Fort, India Gate, and Humayun's Tomb.",
        category: 'Domestic',
        budgetCategory: 'Mid-Range',
        featured: false,
        rating: 4.4,
        reviewsCount: 124,
        images: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Triund Trek',
        country: 'India',
        description: "Triund is a serene trekking destination near Dharamshala, Himachal Pradesh. Situated at the foot of the Dhauladhar range, it offers spectacular views of snow-capped peaks and the Kangra Valley.",
        category: 'Domestic',
        budgetCategory: 'Budget',
        featured: false,
        rating: 4.6,
        reviewsCount: 95,
        images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Hampta Pass',
        country: 'India',
        description: "Hampta Pass in Himachal Pradesh is a breathtaking crossover trek from the lush green valleys of Kullu to the stark, semi-arid mountains of Lahaul and Spiti.",
        category: 'Domestic',
        budgetCategory: 'Mid-Range',
        featured: false,
        rating: 4.7,
        reviewsCount: 78,
        images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Chandrashila Trek',
        country: 'India',
        description: "Chandrashila is the summit of the Tungnath ridge in Uttarakhand, housing the highest Shiva temple in the world. It offers a majestic 360-degree view of Himalayan peaks like Nanda Devi and Trishul.",
        category: 'Domestic',
        budgetCategory: 'Budget',
        featured: false,
        rating: 4.6,
        reviewsCount: 82,
        images: ['https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Munich',
        country: 'Germany',
        description: "Munich, the capital of Bavaria, is famous for its beautiful architecture, vibrant cultural festivals, royal parks, and close proximity to the stunning Bavarian Alps and Neuschwanstein Castle.",
        category: 'International',
        budgetCategory: 'Mid-Range',
        featured: false,
        rating: 4.7,
        reviewsCount: 154,
        images: ['https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Vancouver',
        country: 'Canada',
        description: "Vancouver is a bustling west coast seaport in British Columbia, renowned for its majestic mountain backdrops, pristine coastlines, and outdoor adventures in the Canadian Rockies.",
        category: 'International',
        budgetCategory: 'Luxury',
        featured: true,
        rating: 4.9,
        reviewsCount: 212,
        images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Sydney',
        country: 'Australia',
        description: "Sydney, capital of New South Wales and one of Australia's largest cities, is best known for its Sydney Opera House, Harbour Bridge, sandy beaches, and spectacular coastal walks.",
        category: 'International',
        budgetCategory: 'Luxury',
        featured: true,
        rating: 4.8,
        reviewsCount: 310,
        images: ['https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Kashmir',
        country: 'India',
        description: 'Known as the "Paradise on Earth", Kashmir is famous for its snow-capped mountains, serene lakes, houseboats in Dal Lake, and lush meadows like Gulmarg and Pahalgam.',
        category: 'Domestic',
        budgetCategory: 'Mid-Range',
        featured: true,
        images: ['https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Shimla',
        country: 'India',
        description: 'The former summer capital of British India, Shimla is a beautiful hill station renowned for its colonial architecture, Mall Road, Ridge, and scenic toy train ride.',
        category: 'Domestic',
        budgetCategory: 'Budget',
        featured: false,
        images: ['https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Kasol',
        country: 'India',
        description: 'A charming hamlet in the Parvati Valley, Kasol is a haven for trekkers, backpackers, and nature lovers, famous for its scenic beauty, Israeli cafes, and proximity to Kheerganga.',
        category: 'Domestic',
        budgetCategory: 'Budget',
        featured: false,
        images: ['https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Mumbai',
        country: 'India',
        description: 'The City of Dreams, Mumbai is India\'s financial powerhouse and home to Bollywood. Explore the Gateway of India, Marine Drive, and the vibrant local culture and street food.',
        category: 'Domestic',
        budgetCategory: 'Mid-Range',
        featured: false,
        images: ['https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Vietnam',
        country: 'Vietnam',
        description: 'Discover the rich culture, historic temples, and stunning natural beauty of Vietnam. Famous for its breathtaking Halong Bay cruises, ancient cities, and delicious street food.',
        category: 'International',
        budgetCategory: 'Budget',
        featured: true,
        images: ['https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'Thailand',
        country: 'Thailand',
        description: 'Experience the Land of Smiles! Thailand is a vibrant mix of bustling cities like Bangkok, historic temples, wild nightlife, and beautiful tropical beaches in Phuket and Krabi.',
        category: 'International',
        budgetCategory: 'Mid-Range',
        featured: true,
        images: ['https://images.unsplash.com/photo-1528181304800-2f1258bb9cf7?auto=format&fit=crop&w=800&q=80'],
      },
      {
        name: 'USA',
        country: 'United States',
        description: 'Explore the iconic sights of the USA. From the glittering skyscrapers of New York City and historical monuments in Washington DC to the natural wonders of the Grand Canyon.',
        category: 'International',
        budgetCategory: 'Luxury',
        featured: true,
        images: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'],
      },
    ];

    const seededDestinations = await Destination.create(destinationsData);
    console.log(`Seeded ${seededDestinations.length} Destinations.`);

    // Map Destinations by name for Package associations
    const destMap = {};
    seededDestinations.forEach((d) => {
      destMap[d.name] = d._id;
    });

    // 3. Create Packages
    const packagesData = [
      {
        title: '7 Days Bali Romantic Getaway',
        destination: destMap['Bali'],
        description: 'Experience Bali like never before. Stays in premium oceanfront private villa, couples massage, private catamaran cruise, and tour around iconic temples.',
        price: 63920,
        durationDays: 7,
        durationNights: 6,
        inclusions: ['5-Star Luxury Resort Stay', 'All Daily Breakfasts & Private Dinners', 'Private Chauffeur Tour Guides', 'Traditional Balinese Spa Treatments'],
        exclusions: ['International Flights', 'Visa & Entry Fees', 'Personal Souvenirs', 'Tips & Gratuities'],
        images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        itinerary: [
          { day: 1, title: 'Arrival & Welcome Dinner', description: 'Arrive at Ngurah Rai International Airport. Transfer to your oceanfront resort in Seminyak. Indulge in a romantic candlelit dinner at the beach.' },
          { day: 2, title: 'Uluwatu Temple & Kecak Dance', description: 'Visit the magnificent Uluwatu temple perched on a cliff edge. In the evening, watch the traditional Kecak Fire Dance performance against the sunset.' },
          { day: 3, title: 'Ubud Rice Paddies & Swing Tour', description: 'Travel to Ubud. Walk through the Tegallalang Rice Terraces, take pictures on the famous Bali Swing, and explore the Monkey Forest.' },
          { day: 4, title: 'Volcano Hiking & Hot Springs', description: 'Early morning hike up Mount Batur to witness the majestic sunrise. Followed by a relaxing bath in Toya Devasya natural hot springs.' },
          { day: 5, title: 'Nusa Penida Day Trip', description: 'Board a speedboat to Nusa Penida island. Visit Kelingking Beach, Angel’s Billabong, and snorkel at Crystal Bay.' },
          { day: 6, title: 'Couples Spa & Sunset Cruise', description: 'Spend a relaxing morning with an Ayurvedic couples massage. In the afternoon, board a luxury catamaran for a sunset dinner cruise.' },
          { day: 7, title: 'Departure', description: 'Free morning for shopping. Transfer to airport for your flight back home.' },
        ],
      },
      {
        title: 'Luxury Paris Honeymoon & City Tour',
        destination: destMap['Paris'],
        description: 'Spend 5 glorious days in Paris. Includes Eiffel Tower skip-the-line access, private Seine River dinner cruise, Louvre private guide, and gourmet pastries testing.',
        price: 119920,
        durationDays: 5,
        durationNights: 4,
        inclusions: ['4-Star City-Center Hotel Stay', 'Daily Continental Breakfasts', 'Eiffel Tower Access & Seine Cruise', 'Louvre Museum Fast-Track Entry'],
        exclusions: ['Flight tickets', 'Lunch & optional snacks', 'Hotel tourist tax', 'Travel insurance'],
        images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        itinerary: [
          { day: 1, title: 'Arrival & Hotel Check-in', description: 'Arrive in Paris. Transfer to your boutique hotel near the Champs-Élysées. Spend the evening exploring the city of lights at your own pace.' },
          { day: 2, title: 'Eiffel Tower & Seine Cruise', description: 'Skip-the-line entry to the summit of the Eiffel Tower for panoramic views. In the evening, enjoy a 3-course dinner cruise on the Seine River.' },
          { day: 3, title: 'Louvre & Notre Dame Walk', description: 'Take a private guided tour of the Louvre Museum. Walk through the Latin Quarter and view the majestic Notre-Dame Cathedral.' },
          { day: 4, title: 'Versailles Palace Trip', description: 'Take a short train ride to the magnificent Palace of Versailles. Explore the Hall of Mirrors and the beautiful royal gardens.' },
          { day: 5, title: 'Montmartre Walk & Departure', description: 'Explore the artistic streets of Montmartre, visit the Sacré-Cœur, and pick up souvenirs before transfer to Paris Charles de Gaulle Airport.' },
        ],
      },
      {
        title: 'Thrill Seekers Manali Adventure',
        destination: destMap['Manali'],
        description: 'An action-packed adventure in the snow-capped mountains of Himachal Pradesh. Includes trekking, river rafting, paragliding, and camping under the stars.',
        price: 23920,
        durationDays: 4,
        durationNights: 3,
        inclusions: ['Riverside Camping Tents', 'All Meals during Camp', 'Adventure Gear & Safety Equipment', 'Qualified Trekking Guides'],
        exclusions: ['Transit to/from Manali', 'Equipment rentals for personal use', 'Beverages', 'Medical expenses'],
        images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        itinerary: [
          { day: 1, title: 'Camp Check-in & Acclimatization', description: 'Arrive in Manali. Transfer to the riverside campsite in Solang Valley. Enjoy a short acclimatization trek and bond over bonfire and live music.' },
          { day: 2, title: 'Paragliding & Zorbing Solang Valley', description: 'Soar like a bird with high-altitude paragliding in Solang Valley. Try zorbing, ATV rides, and adventure activities.' },
          { day: 3, title: 'White Water Rafting & Jogini Waterfalls', description: 'Experience the rush of white water rafting in the Beas River. Hike to the scenic Jogini Waterfalls and visit Vashisht Hot Springs.' },
          { day: 4, title: 'Hadimba Temple & Departure', description: 'Explore the historic Hadimba Temple and shopping on Mall Road. Depart for your return journey.' },
        ],
      },
      {
        title: 'Kerala Backwaters & Houseboat Experience',
        destination: destMap['Kerala'],
        description: 'Immerse yourself in nature\'s greenery. Cruise the serene backwaters on a private houseboat and relax with professional Ayurvedic spa therapies.',
        price: 39920,
        durationDays: 6,
        durationNights: 5,
        inclusions: ['Premium Houseboat Stay in Alleppey', 'Resort stays in Munnar & Thekkady', 'Traditional Keralan Cuisine Meals', 'Ayurvedic Massage Session'],
        exclusions: ['Airfare/Trainfare', 'Entry tickets for national parks', 'Camera charges', 'Personal laundry'],
        images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        itinerary: [
          { day: 1, title: 'Kochi Arrival & Transfer to Munnar', description: 'Arrive in Kochi, drive to Munnar passing lush tea gardens and Valara waterfalls. Check-in to your resort.' },
          { day: 2, title: 'Munnar Tea Gardens Tour', description: 'Explore Eravikulam National Park, Mattupetty Dam, and walk through Munnar\'s sprawling tea estates.' },
          { day: 3, title: 'Thekkady Wildlife Reserve', description: 'Drive to Thekkady. Take a boat safari on Periyar Lake to spot wild elephants, deer, and exotic birds.' },
          { day: 4, title: 'Houseboat Boarding Alleppey', description: 'Arrive in Alleppey. Board your traditional houseboat. Glide along calm canals, witness local village life, and watch the sunset.' },
          { day: 5, title: 'Ayurvedic Spa & Kochi Sightseeing', description: 'Enjoy an authentic Ayurvedic massage. Return to Kochi for sightseeing of Fort Kochi, Chinese Fishing nets, and Jewish synagogue.' },
          { day: 6, title: 'Departure', description: 'Free morning for shopping. Transfer to Kochi airport.' },
        ],
      },
      {
        title: 'Goa Beach Party & Heritage Tour',
        destination: destMap['Goa'],
        description: 'Relax on sandy beaches, enjoy thrilling water sports, explore Portuguese-era heritage churches, and experience Goa\'s famous nightlife.',
        price: 15920,
        durationDays: 3,
        durationNights: 2,
        inclusions: ['Beachside Resort Stay', 'Complimentary Breakfasts', 'Scuba Diving & Jet Ski Package', 'Guided heritage church tour'],
        exclusions: ['Flights or trains', 'Dinner meals', 'Alcoholic drinks', 'Water activities insurance'],
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        itinerary: [
          { day: 1, title: 'Goa Arrival & Calangute Beach Sunset', description: 'Arrive in Goa. Check in to your beach resort in North Goa. Relax at Calangute beach and experience beach shacks nightlife.' },
          { day: 2, title: 'Scuba Diving & North Goa Water Sports', description: 'Early morning boat trip for dolphin sighting and scuba diving. Enjoy jet ski, parasailing, and banana boat rides at Baga Beach.' },
          { day: 3, title: 'Old Goa Churches & Spice Plantation Tour', description: 'Visit Basilica of Bom Jesus and Se Cathedral. Enjoy a traditional lunch at a tropical Spice Plantation. Transfer to airport.' },
        ],
      },
      {
        title: 'Delhi Historical Heritage Tour',
        destination: destMap['Delhi'],
        description: 'Explore the spectacular historical monuments of Old and New Delhi. Includes guided visits to Qutub Minar, Red Fort, India Gate, and Humayun\'s Tomb.',
        price: 11920,
        durationDays: 3,
        durationNights: 2,
        inclusions: ['Boutique Hotel Stay', 'Daily Breakfasts', 'Private Chauffeur Tour', 'All Monument Entry Tickets'],
        exclusions: ['Airfare/Trainfare to Delhi', 'Personal expenses', 'Tips and Gratuities'],
        images: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        itinerary: [
          { day: 1, title: 'Arrival & Old Delhi Heritage', description: 'Arrive in Delhi. Check-in at hotel. Visit the grand Red Fort, Jama Masjid, and take a heritage rickshaw ride in Chandni Chowk.' },
          { day: 2, title: 'New Delhi & Historical Monuments', description: 'Visit the towering Qutub Minar, the beautiful Humayun\'s Tomb, India Gate, and drive past Rashtrapati Bhavan.' },
          { day: 3, title: 'Lotus Temple & Departure', description: 'Explore the architectural marvel of Lotus Temple and Akshardham Temple before transfer to airport/station.' }
        ]
      },
      {
        title: 'Triund Peak Camping & Trekking',
        destination: destMap['Triund Trek'],
        description: 'Trek to the pristine ridge of Triund near McLeod Ganj. Enjoy panoramic views of the majestic Dhauladhar ranges, camp under a star-filled sky, and sit around a warm bonfire.',
        price: 6320,
        durationDays: 2,
        durationNights: 1,
        inclusions: ['Premium Camping Tents', 'Dinner, Breakfast & Trekking Snacks', 'Professional Trekking Guide & Permits', 'Sleeping Bags & Camping Gear'],
        exclusions: ['Travel to/from McLeod Ganj', 'Porters for personal luggage', 'Bottled water', 'Tips'],
        images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        itinerary: [
          { day: 1, title: 'Trek from Dharamkot to Triund Peak', description: 'Assemble at McLeod Ganj. Start your 9km trek to Triund, passing through rhododendron and oak forests. Check-in to campsite on the ridge, followed by bonfire and dinner.' },
          { day: 2, title: 'Sunrise Views & Descent', description: 'Witness a breathtaking sunrise over the snow-clad Dhauladhar mountains. Have breakfast and trek back to McLeod Ganj for departure.' }
        ]
      },
      {
        title: 'Hampta Pass Crossover Adventure',
        destination: destMap['Hampta Pass'],
        description: 'Experience one of the most stunning crossover treks in Himachal. Crossover from the lush green valleys of Manali to the stark, lunar-like landscapes of Spiti Valley via Hampta Pass.',
        price: 19920,
        durationDays: 5,
        durationNights: 4,
        inclusions: ['High Altitude Trekking Tents & Gear', 'All Veg Meals during Trek', 'Qualified Alpine Trek Leaders & Helpers', 'Forest Permissions & Permits'],
        exclusions: ['Transportation to Manali', 'Offloading of personal backpack', 'Any emergency evacuation charges'],
        images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        itinerary: [
          { day: 1, title: 'Drive to Jobra & Trek to Chika', description: 'Drive from Manali to Jobra. Start a gentle 2-hour trek along the Rani Nallah stream to the beautiful campsite of Chika.' },
          { day: 2, title: 'Trek from Chika to Balu ka Gera', description: 'Trek through alpine wildflower meadows, crossing boulder sections and streams to reach the Balu ka Gera campsite at 11,900 ft.' },
          { day: 3, title: 'Pass Crossover to Shea Goru via Hampta Pass', description: 'Steep climb to the summit of Hampta Pass (14,100 ft). Soak in views of the majestic peaks and slide down snowy slopes to reach Shea Goru.' },
          { day: 4, title: 'Trek to Chatru & Drive to Chandra Taal', description: 'Descend through the barren mountains of Lahaul to Chatru. Drive to the crescent-shaped sacred Chandra Taal lake (Moon Lake) and camp.' },
          { day: 5, title: 'Drive from Chatru to Manali', description: 'Drive back to Manali via the famous Atal Tunnel. Disband at Manali in the afternoon.' }
        ]
      },
      {
        title: 'Chopta Chandrashila & Tungnath Trek',
        destination: destMap['Chandrashila Trek'],
        description: 'Trek to the highest Shiva temple in the world at Tungnath, and ascend to the majestic Chandrashila Peak. Witness a 360-degree panoramic view of the massive Garhwal Himalayas.',
        price: 10320,
        durationDays: 3,
        durationNights: 2,
        inclusions: ['Hotel/Guesthouse Stay in Chopta', 'All Meals (Veg)', 'Trek Guide, Support Staff & Entry Fees', 'Traditional Bonfire evenings'],
        exclusions: ['Transit to/from Rishikesh', 'Mules for personal bags', 'Tips or personal expenses'],
        images: ['https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        itinerary: [
          { day: 1, title: 'Rishikesh to Chopta Scenic Drive', description: 'Drive along the sacred Ganga and Alaknanda rivers, passing Devprayag. Arrive at the scenic meadows of Chopta (Mini Switzerland of Uttarakhand).' },
          { day: 2, title: 'Summit Day: Tungnath & Chandrashila', description: 'Trek 4km to the historic Tungnath Temple. Ascend another steep 1.5km to Chandrashila Peak (12,100 ft) for a 360-degree view of Chaukhamba and Nanda Devi peaks. Return to Chopta.' },
          { day: 3, title: 'Sari Village, Deoriatal Hike & Return', description: 'Trek 2.3km to the beautiful Deoriatal lake, reflecting the Chaukhamba peaks. Drive back to Rishikesh.' }
        ]
      },
      {
        title: 'Bavarian Castles & Munich Tour',
        destination: destMap['Munich'],
        description: 'Explore the rich culture of Bavaria! Tour Munich\'s historic Marienplatz, and take day trips to the fairytale Neuschwanstein Castle and the pristine Alps.',
        price: 51920,
        durationDays: 4,
        durationNights: 3,
        inclusions: ['4-Star Munich Hotel Stay', 'Daily Bavarian Buffet Breakfasts', 'Neuschwanstein Castle Guided Tour & Bus', 'Bavarian Alps Rail Day Trip'],
        exclusions: ['International Flights', 'Luncheon & Dinner meals', 'Schengen Visa fee'],
        images: ['https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        itinerary: [
          { day: 1, title: 'Arrival in Munich & Old Town Walk', description: 'Arrive in Munich, check-in to hotel. Enjoy a guided walking tour of Marienplatz, the Glockenspiel, and the English Garden.' },
          { day: 2, title: 'Fairytale Neuschwanstein Castle Tour', description: 'Take a scenic coach journey through the Bavarian countryside to visit King Ludwig II\'s stunning Neuschwanstein Castle.' },
          { day: 3, title: 'Bavarian Alps & Lake Starnberg', description: 'Train trip to the edge of the Alps. Cruise beautiful Lake Starnberg and explore local alpine villages.' },
          { day: 4, title: 'Museums & Departure', description: 'Visit the Deutsches Museum or BMW Welt before departure.' }
        ]
      },
      {
        title: 'Canadian Rockies & Vancouver Scenic Tour',
        destination: destMap['Vancouver'],
        description: 'Discover the gorgeous Pacific Northwest and the majestic Canadian Rockies. Travel from coastal Vancouver to the glacier lakes of Banff National Park.',
        price: 95920,
        durationDays: 6,
        durationNights: 5,
        inclusions: ['Premium Resort & Lodge Stays', 'Daily Breakfasts', 'Rocky Mountaineer Train Ticket', 'Banff & Lake Louise National Park Tours'],
        exclusions: ['Airfare to/from Canada', 'Canadian ETA/Visa fees', 'National park camera permits'],
        images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        itinerary: [
          { day: 1, title: 'Arrival in Vancouver & City Highlights', description: 'Arrive in Vancouver. Explore Stanley Park, Gastown historic steam clock, and Granville Island Public Market.' },
          { day: 2, title: 'Capilano Suspension Bridge & Whistler Drive', description: 'Walk across the thrilling Capilano Suspension Bridge. Drive the Sea-to-Sky Highway to Whistler alpine resort.' },
          { day: 3, title: 'Rocky Mountaineer Train: Vancouver to Kamloops', description: 'Board the luxury Rocky Mountaineer train. Experience spectacular vistas of the Fraser River Canyon and river rapids.' },
          { day: 4, title: 'Rocky Mountaineer Train: Kamloops to Banff', description: 'Continue train journey into the Canadian Rockies. Arrive in the beautiful mountain town of Banff.' },
          { day: 5, title: 'Lake Louise & Columbia Icefield Glacier Tour', description: 'Visit the turquoise waters of Lake Louise. Take an ice-explorer tour onto the massive Athabasca Glacier.' },
          { day: 6, title: 'Banff Gondola & Calgary Departure', description: 'Ride the Banff Gondola for a 360-degree view. Transfer to Calgary airport for departure.' }
        ]
      },
      {
        title: 'Sydney Harbour & Coastal Wonders Tour',
        destination: destMap['Sydney'],
        description: 'Experience the absolute best of Australia\'s iconic city. Tour the Sydney Opera House, take a private harbor yacht cruise, and walk along Bondi beach.',
        price: 79920,
        durationDays: 5,
        durationNights: 4,
        inclusions: ['5-Star Luxury Harbourfront Hotel', 'Daily Breakfasts', 'Sydney Opera House Private Behind-the-scenes Tour', 'Harbor Sunset Catamaran Dinner Cruise'],
        exclusions: ['International Flights', 'Australian Visa & Entry Fees', 'Personal expenses'],
        images: ['https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        itinerary: [
          { day: 1, title: 'Arrival in Sydney & Harbour Walk', description: 'Arrive in Sydney. Transfer to your luxury hotel. Take a walking tour of Circular Quay, Sydney Harbour Bridge, and historical Rocks district.' },
          { day: 2, title: 'Sydney Opera House & Sunset Yacht Cruise', description: 'Private tour of the legendary Sydney Opera House. Relax on a sunset catamaran dinner cruise around the harbor.' },
          { day: 3, title: 'Bondi Beach & Spectacular Coastal Walk', description: 'Visit famous Bondi Beach. Walk the scenic Bondi to Coogee coastal trail, enjoying ocean vistas and rocky cliffs.' },
          { day: 4, title: 'Blue Mountains Day Trip', description: 'Take a day tour to the World Heritage-listed Blue Mountains. Witness the Three Sisters rock formation and ride the Scenic World cableway.' },
          { day: 5, title: 'Royal Botanic Gardens & Departure', description: 'Free morning to stroll the Royal Botanic Gardens and shop in Pitt Street Mall before your flight home.' }
        ]
      },
      {
        title: '5 Days Kashmir Paradise Tour',
        destination: destMap['Kashmir'],
        description: 'Enjoy the stunning valleys of Kashmir. Includes a houseboat stay on Dal Lake, Shikara ride, and sightseeing in Gulmarg, Pahalgam, and Srinagar.',
        price: 24999,
        durationDays: 5,
        durationNights: 4,
        inclusions: ['Deluxe Houseboat & Hotel Stay', 'Daily Breakfast & Dinner', 'Private Cab for Sightseeing', 'Shikara Ride on Dal Lake'],
        exclusions: ['Flight/Train Tickets', 'Gondola Ride in Gulmarg', 'Lunch and personal expenses'],
        images: ['https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        itinerary: [
          { day: 1, title: 'Arrival in Srinagar & Houseboat Stay', description: 'Arrive at Srinagar airport. Check-in to a luxury houseboat. Enjoy a 1-hour Shikara ride on the serene Dal Lake during sunset.' },
          { day: 2, title: 'Srinagar Local Sightseeing', description: 'Visit the world-famous Shalimar Bagh, Nishat Bagh, and Chashme Shahi Mughal Gardens, followed by the Shankaracharya Temple.' },
          { day: 3, title: 'Excursion to Gulmarg (Meadow of Flowers)', description: 'Drive to Gulmarg. Take the famous Gondola cable car ride (highest in Asia) and enjoy snow activities on the slopes.' },
          { day: 4, title: 'Gulmarg to Pahalgam (Valley of Shepherds)', description: 'Transfer to Pahalgam. En route visit saffron fields and Avantipura ruins. Enjoy a walk along the Lidder river.' },
          { day: 5, title: 'Pahalgam to Srinagar Departure', description: 'Drive back to Srinagar airport for your flight back home.' },
        ],
      },
      {
        title: '4 Days Scenic Shimla & Kufri Getaway',
        destination: destMap['Shimla'],
        description: 'Breathe in the fresh mountain air of Himachal capital. Explore Shimla Mall Road, Kufri adventure park, and historic temples.',
        price: 12999,
        durationDays: 4,
        durationNights: 3,
        inclusions: ['3-Star Hotel Stay', 'Breakfast & Dinner', 'Private Cab', 'Sightseeing to Jakhoo Temple & Ridge'],
        exclusions: ['Adventure activities in Kufri', 'Personal guide', 'Entry fees'],
        images: ['https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        itinerary: [
          { day: 1, title: 'Arrive in Shimla', description: 'Drive from Delhi/Chandigarh to Shimla. Check-in to your hotel. Evening walk on the Mall Road and the Ridge.' },
          { day: 2, title: 'Excursion to Kufri', description: 'Visit Kufri. Enjoy horse riding, visit the Himalayan Nature Park, and try adventure activities in Fun World.' },
          { day: 3, title: 'Shimla Local Sightseeing', description: 'Visit the Viceregal Lodge, Jakhoo Temple (highest point in Shimla), and Tara Devi Temple.' },
          { day: 4, title: 'Departure', description: 'Check out after breakfast and drive back to Chandigarh/Delhi.' },
        ],
      },
      {
        title: '3 Days Kasol & Kheerganga Trekking Camp',
        destination: destMap['Kasol'],
        description: 'Trek the mystical Parvati Valley. Experience the magic of Kasol, Tosh, and camp under the stars at Kheerganga with hot springs.',
        price: 5499,
        durationDays: 3,
        durationNights: 2,
        inclusions: ['Kasol Guesthouse & Kheerganga Tents', 'All Meals during Trek', 'Professional Trek Guide', 'Hot Springs access'],
        exclusions: ['Travel to Kasol', 'Porter charges', 'Personal items'],
        images: ['https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        itinerary: [
          { day: 1, title: 'Kasol Arrival & Chalal Walk', description: 'Arrive in Kasol. Check-in at guesthouse. Stroll along the Parvati River to Chalal village and explore the cafes.' },
          { day: 2, title: 'Trek to Kheerganga', description: 'Drive to Barshaini. Start the 12km trek to Kheerganga. Soak in the natural hot springs and camp under the starry sky.' },
          { day: 3, title: 'Descent & Tosh Visit', description: 'Trek down to Barshaini. Visit the scenic cliffside village of Tosh before departing in the evening.' },
        ],
      },
      {
        title: '3 Days Mumbai City Lights Tour',
        destination: destMap['Mumbai'],
        description: 'Experience the financial hub of India. Visit the Gateway of India, Marine Drive, Haji Ali Dargah, and Bollywood studios.',
        price: 9999,
        durationDays: 3,
        durationNights: 2,
        inclusions: ['City-Center Hotel Stay', 'Daily Breakfast', 'Guided City Tour', 'Elephanta Caves Ferry Tickets'],
        exclusions: ['Air/Train fare', 'Elephanta Caves entry fees', 'Bollywood studio tour ticket'],
        images: ['https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'],
        featured: false,
        itinerary: [
          { day: 1, title: 'Arrival & Marine Drive Sunset', description: 'Arrive in Mumbai. Check in to your hotel. Visit Marine Drive, Chowpatty Beach, and view the Bandra-Worli Sea Link.' },
          { day: 2, title: 'Elephanta Caves & South Mumbai Heritage', description: 'Take a ferry from Gateway of India to Elephanta Caves. Return and explore Taj Mahal Palace Hotel, Chhatrapati Shivaji Terminus (CST), and Colaba Causeway.' },
          { day: 3, title: 'Haji Ali & Departure', description: 'Visit Haji Ali Dargah and Siddhivinayak Temple. Shop at Linking Road before airport transfer.' },
        ],
      },
      {
        title: '6 Days Vietnam Cultural Expedition & Cruise',
        destination: destMap['Vietnam'],
        description: 'Immerse in Vietnam\'s ancient cities and culture. Includes a premium 2-day Halong Bay cruise and a tour of historical Hanoi.',
        price: 49999,
        durationDays: 6,
        durationNights: 5,
        inclusions: ['4-Star Hanoi Hotel', 'Luxury Halong Bay Cruise Cabin', 'All Meals on Cruise', 'Guided Culture Tour & Kayaking'],
        exclusions: ['International Flights', 'Vietnam Visa fee', 'Personal insurance'],
        images: ['https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        itinerary: [
          { day: 1, title: 'Hanoi Arrival & Old Quarter Walk', description: 'Arrive in Hanoi. Check in to hotel. Discover the historic Old Quarter on a cyclo (rickshaw) ride.' },
          { day: 2, title: 'Hanoi City Highlights', description: 'Visit Ho Chi Minh Mausoleum, Temple of Literature, and watch a traditional water puppet show.' },
          { day: 3, title: 'Hanoi to Halong Bay Cruise', description: 'Drive to Halong Bay. Board your boutique luxury cruise. Sail past limestone karsts, enjoy a seafood lunch, and visit Sung Sot (Surprise) Cave.' },
          { day: 4, title: 'Kayaking & Cruise Return', description: 'Morning Tai Chi session. Kayak through Luon Cave. Cruise back to port and transfer back to Hanoi.' },
          { day: 5, title: 'Ninh Binh Day Excursion', description: 'Visit Ninh Binh. Take a sampan boat ride in Trang An and climb Lying Dragon Mountain in Hang Mua.' },
          { day: 6, title: 'Departure', description: 'Free morning for coffee and shopping. Transfer to Noi Bai airport.' },
        ],
      },
      {
        title: '5 Days Bangkok & Phuket Highlights',
        destination: destMap['Thailand'],
        description: 'Get the best of Thailand. Explore the grand temples of Bangkok and the sandy beaches, islands, and water sports of Phuket.',
        price: 34999,
        durationDays: 5,
        durationNights: 4,
        inclusions: ['3-Star Hotels', 'Daily Breakfasts', 'Bangkok Temple Tour', 'Phi Phi Islands Speedboat Tour with Lunch'],
        exclusions: ['International Flights', 'National Park entry fees', 'Personal water sports rentals'],
        images: ['https://images.unsplash.com/photo-1528181304800-2f1258bb9cf7?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        itinerary: [
          { day: 1, title: 'Bangkok Arrival & Chao Phraya Cruise', description: 'Arrive in Bangkok. Check in to hotel. Dinner cruise along the Chao Phraya River.' },
          { day: 2, title: 'Grand Palace & Bangkok Temples', description: 'Visit the breathtaking Grand Palace, Temple of the Emerald Buddha, Wat Pho (Reclining Buddha), and Wat Arun.' },
          { day: 3, title: 'Flight to Phuket', description: 'Fly to Phuket. Check in to beachside resort. Free evening to enjoy Patong Beach and Bangla Road nightlife.' },
          { day: 4, title: 'Phi Phi & Maya Bay Island Hopping', description: 'Full day speedboat tour to Phi Phi Islands, Maya Bay (where \'The Beach\' was filmed), and Snorkel at Khai Island.' },
          { day: 5, title: 'Phuket City Tour & Departure', description: 'Visit the Big Buddha and Wat Chalong. Transfer to Phuket International Airport.' },
        ],
      },
      {
        title: '7 Days USA East Coast Explorer',
        destination: destMap['USA'],
        description: 'Witness the iconic cities of the United States East Coast. Explore New York City, Philadelphia, and the national monuments in Washington DC.',
        price: 149999,
        durationDays: 7,
        durationNights: 6,
        inclusions: ['4-Star Hotels', 'Daily Breakfast', 'Empire State Building & Statue of Liberty Tickets', 'Washington DC guided tour'],
        exclusions: ['Flights & ESTA/Visa', 'Lunches & dinners', 'Tips and Porterage'],
        images: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'],
        featured: true,
        itinerary: [
          { day: 1, title: 'New York City Arrival', description: 'Arrive in NYC (JFK/Newark). Transfer to Times Square hotel. Walk around Times Square at night.' },
          { day: 2, title: 'Statue of Liberty & Lower Manhattan', description: 'Ferry to Liberty Island and Ellis Island. Walk Wall Street, visit the 9/11 Memorial, and walk across Brooklyn Bridge.' },
          { day: 3, title: 'Empire State Building & Central Park', description: 'Fast track to Empire State Building 86th floor observatory. Rent a bike and cycle through Central Park in the afternoon.' },
          { day: 4, title: 'NYC to Philadelphia to Washington DC', description: 'Drive/train to Philadelphia. Visit Independence Hall and Liberty Bell. Proceed to Washington DC.' },
          { day: 5, title: 'Washington DC National Monuments', description: 'Full day tour: White House (exterior), US Capitol, Lincoln Memorial, Washington Monument, and Smithsonian Museums.' },
          { day: 6, title: 'Georgetown & Potomac Cruise', description: 'Walk through historic Georgetown. Enjoy a sunset sightseeing cruise along the Potomac River.' },
          { day: 7, title: 'Departure', description: 'Free morning for shopping. Transfer to Dulles/Reagan airport for departure.' },
        ],
      },
    ];

    const seededPackages = await Package.create(packagesData);
    console.log(`Seeded ${seededPackages.length} Packages.`);

    console.log('Seeding completed successfully!');
    mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(`Seeding error: ${err.message}`);
    mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
