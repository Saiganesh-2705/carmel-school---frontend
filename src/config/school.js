// Edit this file to update the public website. Empty fields are hidden automatically.
export const school = {
  name: 'Carmel International School',
  short: 'CIS',
  motto: 'Learn to Lead',
  board: 'CBSE',
  // Taken from the school's own Independence Day banner. Please check it and add the PIN code.
  address: 'Vimalagam, Koonampattarai Village, Meleripakkam Post, Chengalpattu',
  phone: '',
  email: '',
  hours: '',       // e.g. 'Mon–Fri 9:00 am – 4:00 pm'
  mapEmbedUrl: '', // Google Maps → Share → Embed a map → copy the src URL
  announcement: '', // e.g. 'Admissions open for 2027–28'. Shows a bar above the header. Empty = hidden.
  social: { facebook: '', instagram: '', youtube: '' }, // full page URLs. Empty ones are hidden.
};
export const img = (n) => `/images/${n}`;

export const heroSlides = [
  { src: 'campus-entrance.jpg', alt: 'The painted entrance of Carmel International School' },
  { src: 'graduation.jpg', alt: 'Graduating children in caps and gowns with their certificates' },
  { src: 'pongal-celebration.jpg', alt: 'Pongal celebration in front of the school' },
  { src: 'sports-flags.jpg', alt: 'Students carrying flags on Sports Day' },
  { src: 'green-day.jpg', alt: 'Children holding saplings on Green Day' },
  { src: 'annual-day-hoop-dance.jpg', alt: 'Girls in pale yellow gowns holding flower hoops on the Annual Day stage' },
  { src: 'annual-day-bharatanatyam.jpg', alt: 'Five girls in red and teal costumes performing Bharatanatyam' },
];

// Celebrations shown in the scrolling strip, the Events page and the gallery.
export const events = [
  { title: 'Summer Class', img: 'summer-class-crafts.jpg', text: 'Paper flowers, woven mats, newspaper models and cup toys, all made by the children.' },
  { title: 'Blue Day', img: 'blue-day.jpg', text: 'Everyone wears blue, and the classroom fills with blue whales, planets and charts.' },
  { title: 'Orange Day', img: 'orange-day.jpg', text: 'Orange outfits, orange balloons and a welcome stage for the youngest learners.' },
  { title: 'Green Day', img: 'green-day.jpg', text: 'Children and sisters hold saplings together in a day about plants and nature.' },
  { title: 'Pongal', img: 'pongal-celebration.jpg', text: 'Traditional dress, sugarcane, a pot boiling over a wood fire and a kolam at the entrance.' },
  { title: 'Independence Day', img: 'independence-day-parade.jpg', text: 'Little soldiers salute on stage and a choir sings in tricolour t-shirts.' },
  { title: 'Children’s Day', img: 'childrens-day.jpg', text: 'Saplings are handed to children and the stage is decorated for the celebration.' },
  { title: 'Christmas', img: 'christmas.jpg', text: 'Dozens of Santas dance together in front of a festive backdrop.' },
  { title: 'Sports Day', img: 'sports-race.jpg', text: 'Flag parade, races from the starting line and balance games with coloured balls.' },
  { title: 'Annual Day', img: 'annual-day-hoop-dance.jpg', text: 'Flower-hoop dances, Bharatanatyam, prizes and guests on stage under the school banner.' },
  { title: 'Graduation Day', img: 'graduation-certificates.jpg', text: 'Our youngest graduates wear caps and gowns and carry framed certificates, with the sisters and teachers beside them.' },
  { title: 'Fancy Dress', img: 'fancy-dress-group.jpg', text: 'Doctors, soldiers, leaders, kings and queens line up for a group photo.' },
];

// Classes shown on the Classes page and the home page. Add a `photo` (file in public/images) to show a picture.
// Descriptions are general; edit them to match your syllabus.
export const programmes = [
  { id: 'jkg-skg', level: 'Pre-Primary', name: 'JKG & SKG', short: 'JKG · SKG', tag: 'Junior and Senior KG', text: 'A gentle start with letters, numbers, rhymes, colours, stories and play. Children learn to listen, share and speak up with confidence.', points: ['Letters, numbers and rhymes', 'Craft, colour and play activities', 'Prayer, manners and routines'], photo: '' },
  { id: 'grade-1', level: 'Primary', name: 'Grade I', short: 'Grade I', tag: 'First steps in reading and writing', text: 'Reading, writing and early mathematics, taught through activities, songs and group work.', points: ['Reading and handwriting', 'Number sense and simple sums', 'Music, art and games'], photo: '' },
  { id: 'grade-2', level: 'Primary', name: 'Grade II', short: 'Grade II', tag: 'Building fluency', text: 'Children grow more fluent readers and writers and begin to explain what they know in their own words.', points: ['Stories and short writing', 'Addition, subtraction and shapes', 'Environment and nature study'], photo: '' },
  { id: 'grade-3', level: 'Primary', name: 'Grade III', short: 'Grade III', tag: 'Curious, confident learners', text: 'Longer reading, problem solving and projects prepare children for the upper primary years.', points: ['Reading comprehension', 'Multiplication and measurement', 'Projects, exhibitions and sport'], photo: '' },
];

// Annual Day photos: used by the home page carousel and the Events page.
export const annualDay = [
  { src: 'annual-day-hoop-dance.jpg', title: 'Flower hoop dance', alt: 'Girls in pale yellow gowns holding yellow flower hoops on stage' },
  { src: 'annual-day-bharatanatyam.jpg', title: 'Bharatanatyam', alt: 'Five girls in red and teal costumes performing Bharatanatyam' },
  { src: 'annual-day-purple-blazers.jpg', title: 'Grand finale', alt: 'Six boys in purple and white jackets holding hands and raising their arms' },
  { src: 'graduation-certificates.jpg', title: 'Graduation', alt: 'Graduates in pink gowns and black caps holding framed certificates with the sisters and staff' },
  { src: 'annual-day-boys-vests.jpg', title: 'Ready for the show', alt: 'Ten boys in patterned vests and denim shorts posing in two rows' },
  { src: 'welcome-balloons.jpg', title: 'Welcome with hearts', alt: 'Children in pink and purple holding heart-shaped balloons beside the sisters and a priest' },
  { src: 'annual-day-felicitation.jpg', title: 'Honouring a guest', alt: 'A man in a white shawl being honoured on stage while guests applaud' },
  { src: 'annual-day-gift.jpg', title: 'A gift on stage', alt: 'A sister handing a floral gift bag to a smiling teacher on stage' },
  { src: 'annual-day-guests.jpg', title: 'On the dais', alt: 'Sisters, priests and guests seated on stage in front of the Annual Day banner' },
  { src: 'annual-day-staff-group.jpg', title: 'Teachers and guests', alt: 'Teachers in matching yellow and pink saris with the sisters and guests' },
];

// Sisters, prayer and everyday school life. Add names under each photo once you have them.
export const community = [
  { src: 'morning-prayer.jpg', title: 'Morning prayer', alt: 'Rows of children in blue and bright clothes praying with folded hands outdoors' },
  { src: 'sisters-chapel.jpg', title: 'In the chapel', alt: 'Three sisters standing beside a statue decorated with marigolds and roses' },
  { src: 'study-outdoors.jpg', title: 'Learning under the sky', alt: 'Children sitting on the paved courtyard writing in notebooks while a sister watches' },
  { src: 'sisters-group.jpg', title: 'Our sisters', alt: 'Seven sisters standing together for a group photo' },
  { src: 'sisters-registers.jpg', title: 'In the school office', alt: 'Two teachers and a sister going through registers at a desk' },
];

export const gallery = [
  { src: 'campus-entrance.jpg', cat: 'Campus', alt: 'The school entrance, painted with a mural of children, letters and numbers' },
  { src: 'campus-gate.jpg', cat: 'Campus', alt: 'Entrance porch with alphabet pillars on either side' },
  { src: 'students-checked-uniform.jpg', cat: 'Students', alt: 'Young students in checked uniforms at the school entrance' },
  { src: 'students-pink-uniform.jpg', cat: 'Students', alt: 'Girls in pink and navy uniform lined up on the porch' },
  { src: 'students-yellow-uniform.jpg', cat: 'Students', alt: 'Boys in yellow and navy uniform with their ID cards' },
  { src: 'music-class.jpg', cat: 'Classroom', alt: 'Students gathered around a keyboard in a music class' },
  { src: 'table-manners.jpg', cat: 'Classroom', alt: 'Students holding table manners signs for a classroom activity' },
  { src: 'science-exhibition.jpg', cat: 'Classroom', alt: 'Students beside a solar system model at a science exhibition' },
  { src: 'speech-event.jpg', cat: 'Classroom', alt: 'A student giving a speech into a microphone while teachers watch' },
  { src: 'summer-class-crafts.jpg', cat: 'Classroom', alt: 'Paper crafts and a welcome board for summer class' },
  { src: 'annual-day-award.jpg', cat: 'Annual Day', alt: 'A young student receiving a sports certificate on Annual Day' },
  { src: 'annual-day-family.jpg', cat: 'Annual Day', alt: 'A student with family receiving a trophy and certificate' },
  { src: 'annual-day-medals.jpg', cat: 'Annual Day', alt: 'A student with medals, a trophy and an academic achievement certificate' },
  { src: 'trophies.jpg', cat: 'Annual Day', alt: 'Trophies, medals and certificates laid out for the awards ceremony' },
  { src: 'graduation.jpg', cat: 'Annual Day', alt: 'Graduating children in caps and gowns holding framed certificates' },
  { src: 'bharatanatyam.jpg', cat: 'Annual Day', alt: 'Three girls performing Bharatanatyam on stage' },
  { src: 'annual-day-yoga.jpg', cat: 'Annual Day', alt: 'Children in red and silver costumes performing a stage dance' },
  { src: 'sports-flags.jpg', cat: 'Sports Day', alt: 'Two students carrying flags at the start of Sports Day' },
  { src: 'sports-race.jpg', cat: 'Sports Day', alt: 'Children crouched at the starting line of a race' },
  { src: 'sports-ball-race.jpg', cat: 'Sports Day', alt: 'Children carrying coloured balls on paper in a balance race' },
  { src: 'sports-lineup.jpg', cat: 'Sports Day', alt: 'Students lined up on the field with chairs and school bags' },
  { src: 'sports-day-decor.jpg', cat: 'Sports Day', alt: 'Balloon arch and activity tables for Sports Day celebration' },
  { src: 'blue-day.jpg', cat: 'Festivals', alt: 'Children in blue hats and clothes for Blue Day' },
  { src: 'orange-day.jpg', cat: 'Festivals', alt: 'Children in orange listening to a teacher on Orange Day' },
  { src: 'green-day.jpg', cat: 'Festivals', alt: 'Children and sisters holding saplings on Green Day' },
  { src: 'pongal-celebration.jpg', cat: 'Festivals', alt: 'Pongal pot and kolam in front of the school with children and teachers' },
  { src: 'pongal-group.jpg', cat: 'Festivals', alt: 'Group photo under bunting for the Pongal celebration' },
  { src: 'pongal-dhoti.jpg', cat: 'Festivals', alt: 'Boys and a girl in colourful shirts and dhotis among sugarcane' },
  { src: 'independence-day-parade.jpg', cat: 'Festivals', alt: 'Children in army costumes saluting on Independence Day' },
  { src: 'independence-day-song.jpg', cat: 'Festivals', alt: 'Children in tricolour t-shirts singing with teachers' },
  { src: 'childrens-day.jpg', cat: 'Festivals', alt: 'A sister handing a sapling to a child on Children’s Day' },
  { src: 'christmas.jpg', cat: 'Festivals', alt: 'Children in Santa costumes dancing at the Christmas programme' },
  { src: 'fancy-dress-group.jpg', cat: 'Festivals', alt: 'Children in fancy dress costumes standing together' },
  { src: 'fancy-doctor.jpg', cat: 'Festivals', alt: 'A boy dressed as a doctor with a stethoscope' },
  { src: 'fancy-constitution.jpg', cat: 'Festivals', alt: 'A boy in a suit holding a copy of the Constitution of India' },
  { src: 'fancy-king.jpg', cat: 'Festivals', alt: 'A boy dressed as a king in an embroidered coat and turban' },
  { src: 'annual-day-hoop-dance.jpg', cat: 'Annual Day', alt: 'Girls in pale yellow gowns holding yellow flower hoops on stage' },
  { src: 'annual-day-bharatanatyam.jpg', cat: 'Annual Day', alt: 'Five girls in red and teal costumes performing Bharatanatyam' },
  { src: 'annual-day-purple-blazers.jpg', cat: 'Annual Day', alt: 'Six boys in purple and white jackets holding hands and raising their arms' },
  { src: 'annual-day-boys-vests.jpg', cat: 'Annual Day', alt: 'Ten boys in patterned vests and denim shorts posing in two rows' },
  { src: 'graduation-certificates.jpg', cat: 'Annual Day', alt: 'Graduates in pink gowns holding framed certificates with the sisters and staff' },
  { src: 'welcome-balloons.jpg', cat: 'Annual Day', alt: 'Children holding heart-shaped balloons beside the sisters and a priest' },
  { src: 'annual-day-felicitation.jpg', cat: 'Annual Day', alt: 'A man in a white shawl being honoured on stage while guests applaud' },
  { src: 'annual-day-gift.jpg', cat: 'Annual Day', alt: 'A sister handing a floral gift bag to a smiling teacher on stage' },
  { src: 'annual-day-guests.jpg', cat: 'Annual Day', alt: 'Sisters, priests and guests seated on stage in front of the Annual Day banner' },
  { src: 'annual-day-staff-group.jpg', cat: 'Annual Day', alt: 'Teachers in matching saris with the sisters and guests' },
  { src: 'morning-prayer.jpg', cat: 'Community', alt: 'Rows of children praying with folded hands outdoors' },
  { src: 'sisters-chapel.jpg', cat: 'Community', alt: 'Three sisters beside a flower-decked statue in the chapel' },
  { src: 'sisters-group.jpg', cat: 'Community', alt: 'Seven sisters standing together for a group photo' },
  { src: 'sisters-registers.jpg', cat: 'Community', alt: 'Two teachers and a sister going through registers in the school office' },
  { src: 'study-outdoors.jpg', cat: 'Community', alt: 'Children writing in notebooks on the courtyard while a sister watches' },
  { src: 'audience-chairs.jpg', cat: 'Community', alt: 'Children seated on bright plastic chairs, watching a programme' },
];
