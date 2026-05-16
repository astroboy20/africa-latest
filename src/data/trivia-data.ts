export interface TriviaQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface TriviaSet {
  id: string;
  label: string;
  questions: TriviaQuestion[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  imageTheme: string;
  sets: TriviaSet[];
}

export interface GeopoliticalZone {
  id: string;
  name: string;
  active: boolean;
}

export interface Era {
  id: string;
  name: string;
  locked: boolean;
}

export interface Country {
  id: string;
  name: string;
  active: boolean;
  zones: GeopoliticalZone[];
  eras: Era[];
}

export const countries: Country[] = [
  {
    id: "nigeria",
    name: "Nigeria",
    active: true,
    zones: [
      { id: "south-west", name: "South-West", active: true },
      { id: "south-east", name: "South-East", active: false },
      { id: "south-south", name: "South-South", active: false },
      { id: "north-central", name: "North-Central", active: false },
      { id: "north-east", name: "North-East", active: false },
      { id: "north-west", name: "North-West", active: false },
    ],
    eras: [
      { id: "pre-colonial", name: "Pre-Colonial", locked: false },
      { id: "colonial", name: "Colonial", locked: true },
      { id: "post-colonial", name: "Post-Colonial", locked: true },
    ],
  },
  { id: "ghana", name: "Ghana", active: false, zones: [], eras: [] },
  { id: "kenya", name: "Kenya", active: false, zones: [], eras: [] },
  { id: "rwanda", name: "Rwanda", active: false, zones: [], eras: [] },
  { id: "south-africa", name: "South Africa", active: false, zones: [], eras: [] },
];

// MODULE 1: THE DAWN OF HUMANITY
const module1SetA: TriviaQuestion[] = [
  { id: "m1a1", text: "Where were the oldest known human remains in Southwestern Nigeria found?", options: ["Olduvai Gorge, Tanzania", "Nok Village, Kaduna State", "Iwo Eleru rock shelter, Ondo State", "Benin City, Edo State"], correctIndex: 2 },
  { id: "m1a2", text: 'What does "Iho Eleru" translate to in English?', options: ['"Mountain of Kings"', '"River of Ancestors"', '"Cave of Ashes"', '"Valley of Stone"'], correctIndex: 2 },
  { id: "m1a3", text: "The first phase at Iwo Eleru (10,000–5000 BCE) lacked pottery. What is this phase called?", options: ["Neolithic Revolution", "Aceramic phase", "Iron Age phase", "Ceramic phase"], correctIndex: 1 },
  { id: "m1a4", text: "What environmental event pushed humans south from the savanna into forest zones?", options: ["Massive flooding", "Rapid desertification of the Sahara", "Volcanic eruption", "Earthquake"], correctIndex: 1 },
  { id: "m1a5", text: "What type of stone tools appeared during the Late Stone Age?", options: ["Hand axes only", "Microliths (arrowheads, stone axes)", "Bronze daggers", "Iron ploughs"], correctIndex: 1 },
  { id: "m1a6", text: "By what year BCE had pottery generally developed in the greater Nigerian area?", options: ["10,000 BCE", "8000 BCE", "3000 BCE", "1000 BCE"], correctIndex: 2 },
  { id: "m1a7", text: "The Iwo Eleru skull is approximately how many years old?", options: ["5,000 years", "13,000 years", "25,000 years", "50,000 years"], correctIndex: 1 },
  { id: "m1a8", text: "What innovation allowed permanent settlements to replace hunting and gathering?", options: ["Bronze casting", "Wheel invention", "Agriculture", "Writing systems"], correctIndex: 2 },
  { id: "m1a9", text: "Who discovered the Iwo Eleru site in 1961?", options: ["Thurstan Shaw", "Leo Frobenius", "Chief Officer J. Akeredolu", "Samuel Johnson"], correctIndex: 2 },
  { id: "m1a10", text: "The second phase at Iwo Eleru (5000–1500 BCE) introduced pottery and what tools?", options: ["Iron hoes", "Stone axes", "Bronze knives", "Bone harpoons"], correctIndex: 1 },
];

const module1SetB: TriviaQuestion[] = [
  { id: "m1b1", text: 'What is the correct, original name of the site formerly known as "Iwo Eleru"?', options: ["Iwo Orisa", "Iwo Ogun", "Ihò Eléérú (Iho Eleru)", "Iwo Olokun"], correctIndex: 2 },
  { id: "m1b2", text: "Between what dates did the Aceramic phase at Iwo Eleru last?", options: ["10,000 – 5000 BCE", "5000 – 1500 BCE", "1500 – 500 BCE", "500 BCE – 500 CE"], correctIndex: 0 },
  { id: "m1b3", text: "What did the development of microliths eventually lead to?", options: ["Iron smelting", "Pottery and agriculture", "Urban planning", "Writing"], correctIndex: 1 },
  { id: "m1b4", text: "Which crop became a cultural symbol in early Southwestern Nigeria?", options: ["Maize", "Cassava", "Yams", "Rice"], correctIndex: 2 },
  { id: "m1b5", text: "The migration south during the Late Stone Age was mainly from which ecological zone?", options: ["Forest zone", "Savanna", "Coastal zone", "Mangrove swamp"], correctIndex: 1 },
  { id: "m1b6", text: "The Iwo Eleru skull suggests possible admixture with which type of humans?", options: ["Neanderthals", "Denisovans", "Archaic humans", "Homo erectus"], correctIndex: 2 },
  { id: "m1b7", text: "What marked the transition from the Aceramic to the Ceramic phase?", options: ["Invention of writing", "Domestication of horses", "Appearance of pottery", "Construction of walls"], correctIndex: 2 },
  { id: "m1b8", text: "Agriculture developed in the greater Nigerian area between which years?", options: ["10,000 – 8000 BCE", "8000 – 6000 BCE", "4000 – 1000 BCE", "1000 BCE – 500 CE"], correctIndex: 2 },
  { id: "m1b9", text: "What type of shelter is Iwo Eleru classified as?", options: ["Cave dwelling", "Rock shelter", "Mudbrick house", "Treehouse"], correctIndex: 1 },
  { id: "m1b10", text: "The Late Stone Age in Nigeria roughly spans which years?", options: ["50,000 – 20,000 BCE", "10,000 – 2000 BCE", "2000 BCE – 500 CE", "500 – 1500 CE"], correctIndex: 1 },
];

const module1SetC: TriviaQuestion[] = [
  { id: "m1c1", text: "What was found at Iwo Eleru that dates to approximately 13,000 years ago?", options: ["Iron tools", "A human skull", "Bronze sculpture", "Glass beads"], correctIndex: 1 },
  { id: "m1c2", text: 'The term "microliths" refers to:', options: ["Large stone monuments", "Metal weapons", "Small stone tools like arrowheads", "Clay pottery shards"], correctIndex: 2 },
  { id: "m1c3", text: "Which state in Nigeria is the Iwo Eleru site located in?", options: ["Osun State", "Ogun State", "Ondo State", "Ekiti State"], correctIndex: 2 },
  { id: "m1c4", text: 'What does the "Ceramic phase" indicate about the society?', options: ["They became nomadic", "They invented writing", "They developed pottery and settled life", "They discovered iron"], correctIndex: 2 },
  { id: "m1c5", text: "The forest–savanna village near Iwo Eleru is called:", options: ["Akure", "Owo", "Isarun", "Idanre"], correctIndex: 2 },
  { id: "m1c6", text: "Stone tools from Iwo Eleru are from which archaeological period?", options: ["Early Stone Age", "Middle Stone Age", "Later Stone Age", "Iron Age"], correctIndex: 2 },
  { id: "m1c7", text: "What did the discovery of Iwo Eleru challenge about African history?", options: ["That Africa had no cities", "That complex developments came only from external influence", "That Africa had no writing", "That Africa was uninhabited"], correctIndex: 1 },
  { id: "m1c8", text: "The shift from hunting-gathering to agriculture allowed people to:", options: ["Move more frequently", "Reduce population", "Congregate in larger permanent settlements", "Abandon tools"], correctIndex: 2 },
  { id: "m1c9", text: "Which crop was NOT mentioned as a staple of early agriculture in the region?", options: ["Oil palm", "Kolanut", "Wheat", "Yams"], correctIndex: 2 },
  { id: "m1c10", text: 'The "Cave of Ashes" name suggests what about the site?', options: ["Volcanic activity", "Long-term human habitation with hearth fires", "A meteor impact", "Forest fires"], correctIndex: 1 },
];

// MODULE 2: THE CRADLE OF YORUBA
const module2SetA: TriviaQuestion[] = [
  { id: "m2a1", text: "Which deity descended from the heavens to create land at Ile-Ife?", options: ["Obatala", "Orunmila", "Oduduwa", "Sango"], correctIndex: 2 },
  { id: "m2a2", text: 'Why is Ile-Ife called the "navel of the world"?', options: ["It was the largest trading city", "It is the sacred spiritual and cultural heart of the Yoruba", "It had the tallest buildings", "It was the military capital"], correctIndex: 1 },
  { id: "m2a3", text: "Who is the mythical father or progenitor of Oduduwa?", options: ["Oranyan", "Sango", "Lamurudu", "Olu Iwa"], correctIndex: 2 },
  { id: "m2a4", text: "By what century CE had Ile-Ife become a highly organised urban centre?", options: ["8th century CE", "10th century CE", "12th century CE", "14th century CE"], correctIndex: 2 },
  { id: "m2a5", text: "How did the Ooni of Ife primarily exercise authority?", options: ["Through a large standing army", "Through control of trade routes", "Through ritual and divine authority", "Through written laws"], correctIndex: 2 },
  { id: "m2a6", text: "Which Yoruba deity is associated with wisdom and divination?", options: ["Ogun", "Sango", "Orunmila", "Oya"], correctIndex: 2 },
  { id: "m2a7", text: "What crop was regarded as both a staple food and a cultural symbol?", options: ["Cassava", "Maize", "Yams", "Plantains"], correctIndex: 2 },
  { id: "m2a8", text: "What divination system is central to Yoruba spiritual life?", options: ["Obi (coconut)", "Cowrie shell throwing", "Ifa", "Opele"], correctIndex: 2 },
  { id: "m2a9", text: "The political system where other Obas trace lineage to Ife but rule independently is called:", options: ["Centralized empire", "Decentralized governance with ideological unity", "Military dictatorship", "Colonial administration"], correctIndex: 1 },
  { id: "m2a10", text: "Oduduwa is traditionally regarded as the founder of:", options: ["The Oyo Empire", "Yoruba kingship", "The Benin Kingdom", "The Nupe Kingdom"], correctIndex: 1 },
];

const module2SetB: TriviaQuestion[] = [
  { id: "m2b1", text: "Which deity is associated with creation and purity in Ife religion?", options: ["Sango", "Eshu", "Obatala", "Oshun"], correctIndex: 2 },
  { id: "m2b2", text: "According to tradition, where did Oduduwa migrate from before arriving at Ile-Ife?", options: ["Ghana", "Benin Republic", "A distant eastern land (often associated with Mecca or Egypt)", "The Sahara Desert"], correctIndex: 2 },
  { id: "m2b3", text: "What does the figure of Lamurudu represent in modern scholarship?", options: ["A literal king of Mecca", "A symbolic figure embodying cultural connections and historical imagination", "A Portuguese explorer", "A British colonial agent"], correctIndex: 1 },
  { id: "m2b4", text: "The Ooni's rituals were believed to sustain what?", options: ["Military victory", "Cosmic order and fertile harvests", "Trade monopolies", "Colonial peace"], correctIndex: 1 },
  { id: "m2b5", text: "All Yoruba states traced their lineage to which figure?", options: ["Sango", "Obatala", "Oduduwa", "Oranmiyan"], correctIndex: 2 },
  { id: "m2b6", text: "What gave Ile-Ife its spiritual authority over other Yoruba city-states?", options: ["Its large army", "Its wealth from trade", "Its role as the source of divine kingship", "Its coastal access"], correctIndex: 2 },
  { id: "m2b7", text: "Which body of water is Nigeria located along?", options: ["Atlantic Ocean", "Gulf of Guinea", "Mediterranean Sea", "Red Sea"], correctIndex: 1 },
  { id: "m2b8", text: "The forest–savanna ecological zone of Southwestern Nigeria was ideal for:", options: ["Desert farming", "Permanent agriculture and stable habitation", "Horse breeding", "Ice fishing"], correctIndex: 1 },
  { id: "m2b9", text: "Which early iron-working culture predates Ile-Ife in Nigeria?", options: ["Benin culture", "Igbo Ukwu", "Nok Culture", "Sao culture"], correctIndex: 2 },
  { id: "m2b10", text: "The Ooni served as an intermediary between:", options: ["Traders and farmers", "Warriors and slaves", "The gods, ancestors, and the people", "The British and the Obas"], correctIndex: 2 },
];

const module2SetC: TriviaQuestion[] = [
  { id: "m2c1", text: 'What made Ile-Ife the "ultimate source of legitimacy" for Yoruba rulers?', options: ["Its military power", "Its control of gold mines", "All Yoruba states traced their lineage to Oduduwa of Ife", "Its alliance with the British"], correctIndex: 2 },
  { id: "m2c2", text: "The Ooni's authority is best described as:", options: ["Coercive and military", "Economic and commercial", "Ritual and symbolic", "Democratic and elected"], correctIndex: 2 },
  { id: "m2c3", text: "Which colonial-era misinterpretation did the Lamurudu story face?", options: ["That he was a woman", "That he was literal evidence of migration from Mecca or Egypt", "That he never existed", "That he was a British spy"], correctIndex: 1 },
  { id: "m2c4", text: "What does Lamurudu's story hint at regarding Yoruba civilisation?", options: ["Isolation from the world", "Trans-regional interactions and external influences", "Dependence on Europe", "Rejection of all foreign ideas"], correctIndex: 1 },
  { id: "m2c5", text: "What type of political system existed among the Yoruba city-states?", options: ["Single centralized empire", "Communist collective", "Network of autonomous states with shared culture", "Direct British rule"], correctIndex: 2 },
  { id: "m2c6", text: "The Ifa divination system guides individuals to live in harmony with:", options: ["British law", "Military commands", "Spiritual laws", "Economic markets"], correctIndex: 2 },
  { id: "m2c7", text: "Which modern country shares a border with Nigeria to the west?", options: ["Cameroon", "Benin Republic", "Niger", "Chad"], correctIndex: 1 },
  { id: "m2c8", text: 'What does the name "Ile-Ife" metaphorically mean?', options: ["House of War", "The navel of the world (place of origin)", "City of Iron", "River of Kings"], correctIndex: 1 },
  { id: "m2c9", text: "The early societies of Southwestern Nigeria were initially organised around:", options: ["Military ranks", "Trade guilds", "Kinship and lineage systems", "Religious cults only"], correctIndex: 2 },
  { id: "m2c10", text: "Who governed the early Yoruba settlements before the rise of Obas?", options: ["Elected councils", "Elders and lineage heads", "Foreign kings", "Military generals"], correctIndex: 1 },
];

// MODULE 3: THE GOLDEN AGE
const module3SetA: TriviaQuestion[] = [
  { id: "m3a1", text: "What unique walkways were constructed from broken pottery fragments in Ile-Ife?", options: ["Cobblestone roads", "Marble pathways", "Potsherd pavements", "Wooden boardwalks"], correctIndex: 2 },
  { id: "m3a2", text: "What pattern were the potsherd pavements arranged in?", options: ["Circular spirals", "Fishbone or herringbone patterns", "Straight parallel lines", "Random scatter"], correctIndex: 1 },
  { id: "m3a3", text: "Which metalworking technique did Ife artisans use for bronze sculpture?", options: ["Hammering", "Casting in sand", "Lost-wax method", "Welding"], correctIndex: 2 },
  { id: "m3a4", text: "What material did Ife artists use alongside bronze to create realistic sculptures?", options: ["Wood", "Gold", "Terracotta", "Ivory"], correctIndex: 2 },
  { id: "m3a5", text: "What local materials were used to make high-lime, high-alumina glass beads?", options: ["Sand and clay", "Pegmatite and snail shells", "Iron ore and charcoal", "Gold dust and copper"], correctIndex: 1 },
  { id: "m3a6", text: "The realistic facial features of Ife art challenged which false assumption?", options: ["That Africans couldn't sculpt", "That African art was purely abstract", "That bronze was not used in Africa", "That Ife had no art"], correctIndex: 1 },
  { id: "m3a7", text: "What practical purpose did the potsherd pavements serve in the rainforest environment?", options: ["Heating buildings", "Drainage during heavy rains", "Defence against enemies", "Storing food"], correctIndex: 1 },
  { id: "m3a8", text: "Which deity is associated with creation and purity?", options: ["Sango", "Eshu", "Obatala", "Ogun"], correctIndex: 2 },
  { id: "m3a9", text: "What did the production of glass beads demonstrate about Ife?", options: ["Dependence on Europe", "Independent technological innovation", "Lack of trade", "Stone Age technology"], correctIndex: 1 },
  { id: "m3a10", text: "The lost-wax method requires precision, creativity, and understanding of:", options: ["Wood carving", "Weaving", "Metallurgy and materials", "Architecture"], correctIndex: 2 },
];

const module3SetB: TriviaQuestion[] = [
  { id: "m3b1", text: "What type of sculptures did Ife produce that depicted kings and important figures?", options: ["Abstract masks", "Royal portraiture", "Animal totems", "Landscape scenes"], correctIndex: 1 },
  { id: "m3b2", text: "The potsherd pavements demanded technical skill, labour coordination, and what else?", options: ["Foreign expertise", "Civic cooperation and centralised planning", "Slave labour", "European tools"], correctIndex: 1 },
  { id: "m3b3", text: "Ife's economy moved beyond subsistence farming into:", options: ["Only hunting", "Craft production, trade, and metallurgy", "Nomadic pastoralism", "Fishing"], correctIndex: 1 },
  { id: "m3b4", text: "What did the bronze and terracotta sculptures reinforce?", options: ["Military power", "The link between political authority and spiritual continuity", "Trade monopolies", "Colonial loyalty"], correctIndex: 1 },
  { id: "m3b5", text: "Shrines, sacred groves, and temples in Ife were dedicated to deities such as:", options: ["Only Ogun", "Only Sango", "Obatala and Orunmila", "Only Oduduwa"], correctIndex: 2 },
  { id: "m3b6", text: "The Ifa divination system uses ritual objects and what else?", options: ["Written scriptures", "Oral poetry", "Musical instruments only", "Animal sacrifices only"], correctIndex: 1 },
  { id: "m3b7", text: "What did the production of bronze and terracotta art require from Ife society?", options: ["Poverty", "Stability, hierarchy, and elite patronage", "Isolation", "Nomadic lifestyle"], correctIndex: 1 },
  { id: "m3b8", text: "Ife's glass beads were made from locally sourced pegmatite and:", options: ["River sand", "Clay", "Snail shells", "Cow bones"], correctIndex: 2 },
  { id: "m3b9", text: "The potsherd pavements were a visible expression of:", options: ["Royal wealth only", "Communal identity and civic pride", "Foreign influence", "Military conquest"], correctIndex: 1 },
  { id: "m3b10", text: "Ife's bronze sculptures often depicted which features with remarkable detail?", options: ["Abstract symbols", "Realistic facial features and scarification patterns", "Geometric shapes only", "Animals only"], correctIndex: 1 },
];

const module3SetC: TriviaQuestion[] = [
  { id: "m3c1", text: "What type of goods were the glass beads produced in Ife?", options: ["Religious offerings only", "Weapon materials", "Trade items and symbols of social status/wealth", "Building materials"], correctIndex: 2 },
  { id: "m3c2", text: "The Ooni's role included performing seasonal rituals for:", options: ["Military victory", "Agricultural fertility and communal prosperity", "British approval", "Trade expansion"], correctIndex: 1 },
  { id: "m3c3", text: "Ife's urban planning included neighbourhoods, markets, and what else?", options: ["Prisons", "Slave quarters", "Ritual spaces and shrines", "Colonial offices"], correctIndex: 2 },
  { id: "m3c4", text: "What does the existence of full-time artisans in Ife demonstrate?", options: ["Lack of farming", "Division of labour and specialisation", "Foreign occupation", "Decline of agriculture"], correctIndex: 1 },
  { id: "m3c5", text: "Ife's trade networks connected the city to:", options: ["Only Europe", "Only North Africa", "Regional and trans-Saharan networks", "Only the Atlantic coast"], correctIndex: 2 },
  { id: "m3c6", text: "The art of Ife is among the most celebrated in African history for its:", options: ["Size", "Quantity", "Naturalism and realism", "Religious exclusivity"], correctIndex: 2 },
  { id: "m3c7", text: "What did the construction of potsherd pavements require from the civic authority?", options: ["Foreign engineers", "Ability to mobilise resources for public works", "Slave labour from Europe", "British approval"], correctIndex: 1 },
  { id: "m3c8", text: "The Orisha pantheon in Ife represents:", options: ["Only human ancestors", "Elements of nature, human endeavours, and cosmic forces", "Only foreign gods", "Only kings"], correctIndex: 1 },
  { id: "m3c9", text: "Ifa diviners acted as mediators between:", options: ["Traders and farmers", "Humans and Orishas", "The Ooni and the British", "Men and women"], correctIndex: 1 },
  { id: "m3c10", text: "The sacred groves of Ife served as:", options: ["Military training grounds", "Living classrooms of tradition and cultural memory", "Slave markets", "European trading posts"], correctIndex: 1 },
];

// MODULE 4: THE EMPIRE BUILDERS
const module4SetA: TriviaQuestion[] = [
  { id: "m4a1", text: "What geographical advantage allowed Oyo to develop a cavalry-based military?", options: ["Dense rainforest", "Coastal access", "Northern savanna plains", "Mountain ranges"], correctIndex: 2 },
  { id: "m4a2", text: "What was the title of the Oyo emperor?", options: ["Ooni", "Obi", "Alaafin", "Eze"], correctIndex: 2 },
  { id: "m4a3", text: "Which council of seven kingmakers could force the Alaafin to abdicate?", options: ["Ogboni", "Oyo Mesi", "Iwarefa", "Ologun"], correctIndex: 1 },
  { id: "m4a4", text: "Which secret society served as guardians of law and morality in Oyo?", options: ["Oyo Mesi", "Ogboni", "Egbe Omo Oduduwa", "Oro cult"], correctIndex: 1 },
  { id: "m4a5", text: "Which powerful general rebelled against the Alaafin and invited Fulani forces?", options: ["Bashorun Gaha", "Orompoto", "Afonja", "Abiodun"], correctIndex: 2 },
  { id: "m4a6", text: "In what year did the capital Oyo-Ile fall?", options: ["1700 CE", "1800 CE", "1833 CE", "1900 CE"], correctIndex: 2 },
  { id: "m4a7", text: "Which Alaafin's reign saw internal instability and failed campaigns (c. 1770–1789)?", options: ["Ajaka I", "Oluewu", "Abiodun", "Ajagbo"], correctIndex: 2 },
  { id: "m4a8", text: "Which coastal kingdom did Oyo subjugate between 1726–1730?", options: ["Benin", "Asante", "Dahomey", "Nupe"], correctIndex: 2 },
  { id: "m4a9", text: "If the Alaafin was deemed tyrannical, what was the ultimate sanction?", options: ["Exile", "Imprisonment", "Ritual suicide", "Public flogging"], correctIndex: 2 },
  { id: "m4a10", text: "What vital resource did Oyo secure through northern campaigns against the Nupe?", options: ["Gold", "Salt", "Horses", "Ivory"], correctIndex: 2 },
];

const module4SetB: TriviaQuestion[] = [
  { id: "m4b1", text: "Who was the last independent Alaafin before the collapse of Old Oyo?", options: ["Abiodun", "Ajaka I", "Oluewu", "Orompoto"], correctIndex: 2 },
  { id: "m4b2", text: "The Oyo Empire reached its golden age between which centuries?", options: ["14th–15th centuries", "15th–16th centuries", "17th–18th centuries", "19th–20th centuries"], correctIndex: 2 },
  { id: "m4b3", text: "What did the Oyo Mesi and Ogboni councils provide for the empire?", options: ["Military conscription", "Checks and balances on the Alaafin's power", "Trade regulations", "Religious uniformity"], correctIndex: 1 },
  { id: "m4b4", text: "Oyo's economy was supported by tribute from subordinate states and control of:", options: ["Gold mines", "Trade routes", "Salt pans", "Diamond fields"], correctIndex: 1 },
  { id: "m4b5", text: "Which Alaafin is associated with early military reforms and cavalry consolidation?", options: ["Ajaka I", "Orompoto", "Abiodun", "Oluewu"], correctIndex: 1 },
  { id: "m4b6", text: "The Nupe were located in which direction from Oyo?", options: ["South", "East", "North", "West"], correctIndex: 2 },
  { id: "m4b7", text: "What did Oyo's tributary system allow the empire to do?", options: ["Control every village directly", "Manage a vast area without overstretching administration", "Avoid all warfare", "Trade only with Europe"], correctIndex: 1 },
  { id: "m4b8", text: "The Bashorun Gaha crisis in the mid-18th century involved:", options: ["A successful invasion", "Coups and forced suicides of Alaafins", "A peaceful transition of power", "An alliance with the British"], correctIndex: 1 },
  { id: "m4b9", text: "What happened to Ilorin after Afonja's rebellion?", options: ["It remained loyal to Oyo", "It became an Islamic emirate integrated with the Sokoto Caliphate", "It was destroyed completely", "It became a Portuguese colony"], correctIndex: 1 },
  { id: "m4b10", text: "The Kiriji War (1877–1893) was fought between Ibadan and which coalition?", options: ["Oyo and Nupe", "Benin and Dahomey", "Ekiti-Parapo Confederacy", "British and French"], correctIndex: 2 },
];

const module4SetC: TriviaQuestion[] = [
  { id: "m4c1", text: "What distinguished Ibadan's political structure from traditional Yoruba kingdoms?", options: ["It had no Oba; it was a military republic", "It was ruled by women", "It was a military republic built by war leaders", "It had no leadership"], correctIndex: 2 },
  { id: "m4c2", text: "What was the Aare-Ona-Kakanfo?", options: ["The chief priest", "The generalissimo of the Oyo army", "The treasurer", "The foreign minister"], correctIndex: 1 },
  { id: "m4c3", text: "Oyo's cavalry was effective because horses could be raised in the:", options: ["Rainforest zone", "Northern savanna", "Coastal swamps", "Mountain highlands"], correctIndex: 1 },
  { id: "m4c4", text: "What role did the Ogboni society play in Oyo?", options: ["Military recruitment", "Tax collection", "Enforcing societal norms and adjudicating disputes", "Managing trade"], correctIndex: 2 },
  { id: "m4c5", text: "Oyo's influence over distant regions was maintained through:", options: ["Direct military occupation of every town", "Tributary arrangements and ritualised tribute", "Permanent British garrisons", "Forced migration of all people"], correctIndex: 1 },
  { id: "m4c6", text: "Which factor contributed to Oyo's decline in the late 18th century?", options: ["Abundant resources", "Palace intrigue, succession disputes, and factionalism", "British invasion", "Earthquake"], correctIndex: 1 },
  { id: "m4c7", text: "The fall of Oyo-Ile in 1833 led to:", options: ["Immediate British rule", "Mass migrations to Ibadan, Abeokuta, and Ilesa", "The end of Yoruba culture", "A unified Yoruba empire"], correctIndex: 1 },
  { id: "m4c8", text: "What did Oyo demand from Dahomey after defeating it?", options: ["Conversion to Christianity", "Tribute including palm oil, enslaved people, and taxes", "Surrender of all weapons", "Marriage alliance with the Alaafin"], correctIndex: 1 },
  { id: "m4c9", text: "The decline of Oyo's central authority made it vulnerable to:", options: ["European tourism", "Internal rebellion and external invasion", "Climate change only", "Population decline"], correctIndex: 1 },
  { id: "m4c10", text: "What was the strategic importance of Ilorin to Oyo?", options: ["It was the religious capital", "It was a key frontier military outpost and defensive point", "It was the main port", "It was the agricultural centre"], correctIndex: 1 },
];

// MODULE 5: THE FRAGMENTATION
const module5SetA: TriviaQuestion[] = [
  { id: "m5a1", text: "What was the name of the devastating 16-year war (1877–1893) that exhausted Yorubaland?", options: ["Oyo-Nupe War", "Kiriji War (Ekiti-Parapo War)", "Anglo-Ashanti War", "Fulani Jihad"], correctIndex: 1 },
  { id: "m5a2", text: 'Which city emerged as a "military republic" with no traditional Oba?', options: ["Abeokuta", "Ibadan", "Lagos", "Ijebu-Ode"], correctIndex: 1 },
  { id: "m5a3", text: "What weapon did the British use decisively in the 1892 Anglo-Ijebu War?", options: ["Cannon", "Rifle", "Maxim gun", "Bayonet"], correctIndex: 2 },
  { id: "m5a4", text: "The Egba Uprising of 1918 was primarily a protest against:", options: ["Missionary schools", "Direct taxation", "Forced military service", "Prohibition of traditional religion"], correctIndex: 1 },
  { id: "m5a5", text: "Who ceded Lagos to the British Crown in 1861?", options: ["Oba Akintoye", "Oba Oyekan", "Oba Dosunmu", "Oba Eshugbayi"], correctIndex: 2 },
  { id: "m5a6", text: "What strategy did the British use to rule through local traditional powers?", options: ["Direct military rule", "Assimilation", "Indirect rule", "Apartheid"], correctIndex: 2 },
  { id: "m5a7", text: 'What replaced the slave trade as the foundation of "legitimate commerce"?', options: ["Gold mining", "Diamond trading", "Palm oil (and later cocoa)", "Rubber collection"], correctIndex: 2 },
  { id: "m5a8", text: "The Saro (freed slaves from Sierra Leone) acted as:", options: ["British soldiers", "Cultural intermediaries", "Slave traders", "Traditional rulers"], correctIndex: 1 },
  { id: "m5a9", text: "Which city was founded as a refuge for the Egba people?", options: ["Ibadan", "Oyo", "Abeokuta", "Ilorin"], correctIndex: 2 },
  { id: "m5a10", text: 'The sound of which new weapon gave the Kiriji War its name ("kiri-ji")?', options: ["Cannon fire", "Spears clashing", "Gunfire (firearms)", "War drums"], correctIndex: 2 },
];

const module5SetB: TriviaQuestion[] = [
  { id: "m5b1", text: "What did the Treaty of Cession (1861) force Oba Dosunmu to surrender?", options: ["His palace", "His army", "Sovereignty over Lagos to the British Crown", "All Yoruba land"], correctIndex: 2 },
  { id: "m5b2", text: "Why did the Ijebu Kingdom resist British influence?", options: ["They hated all foreigners", "They maintained strict control over trade routes to protect their monopoly", "They were allied with France", "They had no contact with Europeans"], correctIndex: 1 },
  { id: "m5b3", text: "What happened to Afonja after he invited Fulani forces to Ilorin?", options: ["He became the first Fulani emir", "He fled to England", "He was killed by the Fulani forces he welcomed", "He ruled Ilorin peacefully"], correctIndex: 2 },
  { id: "m5b4", text: "After the Kiriji War, who mediated the peace settlement in 1893?", options: ["The French", "The Ooni of Ife", "British authorities", "The Fulani Caliphate"], correctIndex: 2 },
  { id: "m5b5", text: "What was the effect of British indirect rule on Ibadan's political structure?", options: ["It preserved it exactly as it was", "It reshaped it to conform to a centralised, bureaucratised system", "It abolished all leadership", "It made women the rulers"], correctIndex: 1 },
  { id: "m5b6", text: "What did colonial taxation represent to many Yoruba communities?", options: ["A fair exchange for services", "A traditional practice", "A fundamental redefinition of political authority", "A religious requirement"], correctIndex: 2 },
  { id: "m5b7", text: "Which returnee population came from Brazil?", options: ["Saro", "Afro-Brazilians", "Anglo-Africans", "French-Africans"], correctIndex: 1 },
  { id: "m5b8", text: "What did the British claim to be restoring when they intervened in Yoruba affairs?", options: ["The Oyo Empire", "Islamic law", "Peace and order", "Democratic rule"], correctIndex: 2 },
  { id: "m5b9", text: "The Egba Uprising of 1918 forced the colonial administration to:", options: ["Leave Nigeria forever", "Reassess its approach to taxation and local legitimacy", "Grant immediate independence", "Abolish the Oba system"], correctIndex: 1 },
  { id: "m5b10", text: "What did the Kiriji War ensure about Yoruba political unity?", options: ["That Oyo would be restored", "That Ibadan would rule all", "That no single Yoruba state could reestablish centralised authority", "That the British would leave"], correctIndex: 2 },
];

const module5SetC: TriviaQuestion[] = [
  { id: "m5c1", text: "What made Abeokuta's geography advantageous for defence?", options: ["Dense forest", "Rocky outcrops providing natural defence", "High mountains", "Swampy marshes"], correctIndex: 1 },
  { id: "m5c2", text: "How did the British justify the annexation of Lagos?", options: ["Cultural superiority", "Religious conversion", "As a necessity for trade and suppression of the slave trade", "As a response to an invasion"], correctIndex: 2 },
  { id: "m5c3", text: "What happened to the Ajeles (Oyo agents) in subordinate towns as the empire declined?", options: ["They gained more power", "They were perceived as exploiters, deepening resistance", "They were welcomed as heroes", "They became British officials"], correctIndex: 1 },
  { id: "m5c4", text: "The Kiriji War involved the use of trench warfare, which turned the conflict into:", options: ["A quick victory", "A naval battle", "A contest of endurance rather than rapid conquest", "A peaceful negotiation"], correctIndex: 2 },
  { id: "m5c5", text: "What did the British do to Ijebu after defeating it in 1892?", options: ["Destroyed the entire kingdom", "Made the Oba a British noble", "Crushed military resistance, collapsed its economic monopoly, and opened trade routes", "Granted it independence"], correctIndex: 2 },
  { id: "m5c6", text: "How did traditional rulers' roles change under colonial rule?", options: ["They gained more power than ever", "They remained but were redefined within a colonial framework", "They were all executed", "They became British governors"], correctIndex: 1 },
  { id: "m5c7", text: "What was the primary trigger of the 1918 Egba Uprising?", options: ["Forced labour", "Missionary schools", "Direct taxation", "Land seizure"], correctIndex: 2 },
  { id: "m5c8", text: 'What does the term "legitimate commerce" refer to in 19th-century West Africa?', options: ["The slave trade", "Trade in palm oil, palm kernels, and cocoa", "Illegal smuggling", "Weapons trading"], correctIndex: 1 },
  { id: "m5c9", text: "How did the Kiriji War affect civilians in Yorubaland?", options: ["They were completely safe", "Entire communities were displaced, and agricultural production declined sharply", "They all became wealthy", "They migrated to Europe"], correctIndex: 1 },
  { id: "m5c10", text: "What is the lasting legacy of the Oyo Empire despite its collapse?", options: ["Nothing; it was forgotten", "Only its military tactics", "Its cultural, military, and administrative legacies endured, influencing successor states", "Its conversion to Christianity"], correctIndex: 2 },
];

export const modules: Module[] = [
  {
    id: "NG-SW-PRE-M1",
    number: 1,
    title: "The Dawn of Humanity",
    subtitle: "Iwo Eleru & Late Stone Age",
    description: "Explore the oldest known human remains in Southwestern Nigeria and the Late Stone Age innovations that laid the foundation for civilization.",
    imageTheme: "cave-rock-shelter",
    sets: [
      { id: "M1-A", label: "Set A", questions: module1SetA },
      { id: "M1-B", label: "Set B", questions: module1SetB },
      { id: "M1-C", label: "Set C", questions: module1SetC },
    ],
  },
  {
    id: "NG-SW-PRE-M2",
    number: 2,
    title: "The Cradle of Yoruba",
    subtitle: "Rise of Ile-Ife & Oduduwa",
    description: "Discover the origins of Yoruba civilization, the divine kingship of Oduduwa, and the sacred city of Ile-Ife.",
    imageTheme: "oduduwa-ile-ife",
    sets: [
      { id: "M2-A", label: "Set A", questions: module2SetA },
      { id: "M2-B", label: "Set B", questions: module2SetB },
      { id: "M2-C", label: "Set C", questions: module2SetC },
    ],
  },
  {
    id: "NG-SW-PRE-M3",
    number: 3,
    title: "The Golden Age",
    subtitle: "Art, Urban Planning & Religion of Ife",
    description: "Marvel at the bronze sculptures, potsherd pavements, and sophisticated urban planning of Ile-Ife's golden era.",
    imageTheme: "bronze-head-ife",
    sets: [
      { id: "M3-A", label: "Set A", questions: module3SetA },
      { id: "M3-B", label: "Set B", questions: module3SetB },
      { id: "M3-C", label: "Set C", questions: module3SetC },
    ],
  },
  {
    id: "NG-SW-PRE-M4",
    number: 4,
    title: "The Empire Builders",
    subtitle: "The Oyo Empire & Cavalry",
    description: "Witness the rise of the Oyo Empire, its powerful cavalry, complex governance, and eventual decline.",
    imageTheme: "oyo-cavalry",
    sets: [
      { id: "M4-A", label: "Set A", questions: module4SetA },
      { id: "M4-B", label: "Set B", questions: module4SetB },
      { id: "M4-C", label: "Set C", questions: module4SetC },
    ],
  },
  {
    id: "NG-SW-PRE-M5",
    number: 5,
    title: "The Fragmentation",
    subtitle: "Colonial Penetration & Resistance",
    description: "Understand the wars, treaties, and resistance that shaped the transition from pre-colonial sovereignty to colonial rule.",
    imageTheme: "kiriji-war",
    sets: [
      { id: "M5-A", label: "Set A", questions: module5SetA },
      { id: "M5-B", label: "Set B", questions: module5SetB },
      { id: "M5-C", label: "Set C", questions: module5SetC },
    ],
  },
];
