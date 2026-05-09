import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error"] });

const colleges = [
  {
    name: "IIT Bombay",
    location: "Mumbai",
    state: "Maharashtra",
    fees: 220000,
    rating: 4.9,
    description:
      "Indian Institute of Technology Bombay is one of India's premier engineering institutions, renowned for cutting-edge research, world-class faculty, and exceptional industry connections. Located in the heart of Mumbai, it offers an unparalleled academic environment.",
    placements: "98%",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Chemical", "Aerospace"],
    facilities: [
      "Research Labs",
      "Sports Complex",
      "Library",
      "Hostel",
      "Medical Center",
      "Incubation Center",
    ],
    type: "IIT",
    established: 1958,
    totalStudents: 10000,
  },
  {
    name: "IIT Delhi",
    location: "New Delhi",
    state: "Delhi",
    fees: 210000,
    rating: 4.8,
    description:
      "IIT Delhi stands as a beacon of technical excellence in the national capital. With strong ties to government and industry, it produces graduates who lead India's technology and policy landscape.",
    placements: "97%",
    image:
      "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Mathematics", "Physics"],
    facilities: [
      "Innovation Hub",
      "Olympic Pool",
      "Central Library",
      "Hostel",
      "Health Center",
      "Startup Incubator",
    ],
    type: "IIT",
    established: 1961,
    totalStudents: 8500,
  },
  {
    name: "IIT Madras",
    location: "Chennai",
    state: "Tamil Nadu",
    fees: 215000,
    rating: 4.9,
    description:
      "Nestled in a lush green campus in Chennai, IIT Madras consistently ranks as India's top engineering institution. Its research output and startup ecosystem are among the best in Asia.",
    placements: "96%",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Ocean Engineering", "Biotechnology"],
    facilities: [
      "Research Park",
      "Sports Ground",
      "Library",
      "Hostel",
      "Hospital",
      "Deer Park",
    ],
    type: "IIT",
    established: 1959,
    totalStudents: 9200,
  },
  {
    name: "IIT Kanpur",
    location: "Kanpur",
    state: "Uttar Pradesh",
    fees: 205000,
    rating: 4.8,
    description:
      "IIT Kanpur is celebrated for its academic freedom and pioneering research culture. It was the first institution in India to offer computer science education and continues to lead in innovation.",
    placements: "95%",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    courses: ["CSE", "ECE", "Aerospace", "Chemical", "Materials Science"],
    facilities: [
      "Gliding Club",
      "Swimming Pool",
      "Library",
      "Hostel",
      "Hospital",
      "Airstrip",
    ],
    type: "IIT",
    established: 1959,
    totalStudents: 8000,
  },
  {
    name: "IIT Kharagpur",
    location: "Kharagpur",
    state: "West Bengal",
    fees: 195000,
    rating: 4.7,
    description:
      "The oldest and largest IIT, IIT Kharagpur has a sprawling 2100-acre campus and offers the widest range of programs. Its alumni network spans every major global corporation and research institution.",
    placements: "94%",
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80",
    courses: [
      "CSE",
      "ECE",
      "Mechanical",
      "Architecture",
      "Law",
      "Management",
    ],
    facilities: [
      "Technology Park",
      "Stadium",
      "Library",
      "Hostel",
      "Hospital",
      "Golf Course",
    ],
    type: "IIT",
    established: 1951,
    totalStudents: 22000,
  },
  {
    name: "NIT Trichy",
    location: "Tiruchirappalli",
    state: "Tamil Nadu",
    fees: 145000,
    rating: 4.6,
    description:
      "NIT Trichy is consistently ranked as the top NIT in India. Known for its rigorous academics, strong alumni network, and excellent placement record, it is a dream destination for engineering aspirants.",
    placements: "92%",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Chemical", "Production"],
    facilities: [
      "Central Library",
      "Sports Complex",
      "Hostel",
      "Medical Center",
      "Auditorium",
    ],
    type: "NIT",
    established: 1964,
    totalStudents: 6500,
  },
  {
    name: "NIT Warangal",
    location: "Warangal",
    state: "Telangana",
    fees: 140000,
    rating: 4.5,
    description:
      "NIT Warangal is one of the oldest and most prestigious NITs, with a strong focus on research and industry collaboration. Its placement statistics rival many IITs.",
    placements: "90%",
    image:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Metallurgy", "Biotechnology"],
    facilities: [
      "Library",
      "Sports Ground",
      "Hostel",
      "Health Center",
      "Seminar Hall",
    ],
    type: "NIT",
    established: 1959,
    totalStudents: 5800,
  },
  {
    name: "NIT Surathkal",
    location: "Mangalore",
    state: "Karnataka",
    fees: 138000,
    rating: 4.5,
    description:
      "Situated on the scenic Konkan coast, NIT Surathkal (NITK) combines academic excellence with a beautiful campus environment. It is particularly strong in engineering and technology programs.",
    placements: "89%",
    image:
      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Mining", "Information Technology"],
    facilities: [
      "Beach Campus",
      "Library",
      "Sports Complex",
      "Hostel",
      "Medical Center",
    ],
    type: "NIT",
    established: 1960,
    totalStudents: 5200,
  },
  {
    name: "BITS Pilani",
    location: "Pilani",
    state: "Rajasthan",
    fees: 520000,
    rating: 4.7,
    description:
      "BITS Pilani is India's top private engineering university, famous for its Practice School program that places students in top companies for real-world experience. Its alumni are among the most successful in the tech industry.",
    placements: "93%",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Chemical", "Mathematics", "Physics"],
    facilities: [
      "Innovation Center",
      "Sports Complex",
      "Library",
      "Hostel",
      "Hospital",
      "Auditorium",
    ],
    type: "Deemed",
    established: 1964,
    totalStudents: 7000,
  },
  {
    name: "VIT Vellore",
    location: "Vellore",
    state: "Tamil Nadu",
    fees: 380000,
    rating: 4.3,
    description:
      "VIT Vellore is one of India's largest private universities, known for its international collaborations, modern infrastructure, and strong industry connections. It attracts students from across the globe.",
    placements: "85%",
    image:
      "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Biotechnology", "MBA"],
    facilities: [
      "International Research Center",
      "Olympic Pool",
      "Library",
      "Hostel",
      "Hospital",
      "Shopping Mall",
    ],
    type: "Deemed",
    established: 1984,
    totalStudents: 35000,
  },
  {
    name: "Manipal Institute of Technology",
    location: "Manipal",
    state: "Karnataka",
    fees: 420000,
    rating: 4.2,
    description:
      "MIT Manipal is part of the prestigious Manipal Academy of Higher Education. Known for its cosmopolitan campus, strong alumni network, and excellent infrastructure, it is a top choice for engineering students.",
    placements: "83%",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Aeronautical", "Biomedical"],
    facilities: [
      "Innovation Lab",
      "Sports Complex",
      "Library",
      "Hostel",
      "Hospital",
      "Beach Access",
    ],
    type: "Deemed",
    established: 1957,
    totalStudents: 14000,
  },
  {
    name: "SRM Institute of Science and Technology",
    location: "Chennai",
    state: "Tamil Nadu",
    fees: 350000,
    rating: 4.1,
    description:
      "SRM is one of India's top-ranked private universities with a strong focus on research and industry partnerships. Its modern campus and diverse student community make it a vibrant place to study.",
    placements: "82%",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Biotechnology", "MBA"],
    facilities: [
      "Research Labs",
      "Sports Ground",
      "Library",
      "Hostel",
      "Medical Center",
      "Cafeteria",
    ],
    type: "Deemed",
    established: 1985,
    totalStudents: 52000,
  },
  {
    name: "Amity University",
    location: "Noida",
    state: "Uttar Pradesh",
    fees: 320000,
    rating: 3.9,
    description:
      "Amity University is one of India's largest private universities, offering a wide range of programs across engineering, management, law, and arts. Its modern campus and industry connections provide good career opportunities.",
    placements: "78%",
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "MBA", "Law", "Media"],
    facilities: [
      "Smart Classrooms",
      "Sports Complex",
      "Library",
      "Hostel",
      "Medical Center",
      "Food Court",
    ],
    type: "Private",
    established: 2005,
    totalStudents: 125000,
  },
  {
    name: "Thapar Institute of Engineering",
    location: "Patiala",
    state: "Punjab",
    fees: 480000,
    rating: 4.4,
    description:
      "Thapar Institute is a premier private engineering university known for its strong research culture and excellent industry placements. It has collaborations with top global universities and companies.",
    placements: "88%",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Chemical", "Civil", "Biotechnology"],
    facilities: [
      "Research Center",
      "Sports Complex",
      "Library",
      "Hostel",
      "Medical Center",
      "Auditorium",
    ],
    type: "Deemed",
    established: 1956,
    totalStudents: 13000,
  },
  {
    name: "Delhi Technological University",
    location: "New Delhi",
    state: "Delhi",
    fees: 165000,
    rating: 4.3,
    description:
      "DTU (formerly DCE) is one of Delhi's premier engineering institutions. As a state university, it offers quality education at affordable fees with strong placement support and industry connections.",
    placements: "87%",
    image:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Environmental", "Software"],
    facilities: [
      "Innovation Hub",
      "Sports Ground",
      "Library",
      "Hostel",
      "Medical Center",
      "Cafeteria",
    ],
    type: "State",
    established: 1941,
    totalStudents: 9000,
  },
  {
    name: "IIIT Hyderabad",
    location: "Hyderabad",
    state: "Telangana",
    fees: 310000,
    rating: 4.6,
    description:
      "IIIT Hyderabad is a research-focused institution specializing in information technology and related fields. Its research output and startup ecosystem are world-class, producing graduates who lead global tech companies.",
    placements: "94%",
    image:
      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    courses: ["CSE", "ECE", "Computational Linguistics", "Data Science", "AI/ML"],
    facilities: [
      "Research Labs",
      "Sports Complex",
      "Library",
      "Hostel",
      "Medical Center",
      "Startup Hub",
    ],
    type: "Deemed",
    established: 1998,
    totalStudents: 2500,
  },
  {
    name: "Jadavpur University",
    location: "Kolkata",
    state: "West Bengal",
    fees: 85000,
    rating: 4.4,
    description:
      "Jadavpur University is one of India's most prestigious state universities, known for its academic excellence and strong research tradition. It offers quality education at very affordable fees.",
    placements: "86%",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Chemical", "Architecture"],
    facilities: [
      "Research Center",
      "Sports Ground",
      "Library",
      "Hostel",
      "Medical Center",
      "Cultural Center",
    ],
    type: "State",
    established: 1955,
    totalStudents: 18000,
  },
  {
    name: "PSG College of Technology",
    location: "Coimbatore",
    state: "Tamil Nadu",
    fees: 175000,
    rating: 4.3,
    description:
      "PSG College of Technology is one of South India's most respected engineering institutions. Known for its strong industry connections, particularly with Coimbatore's manufacturing sector, and excellent placement record.",
    placements: "88%",
    image:
      "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Textile", "Production"],
    facilities: [
      "Industry Lab",
      "Sports Complex",
      "Library",
      "Hostel",
      "Medical Center",
      "Auditorium",
    ],
    type: "Private",
    established: 1951,
    totalStudents: 7500,
  },
  {
    name: "Pune Institute of Computer Technology",
    location: "Pune",
    state: "Maharashtra",
    fees: 155000,
    rating: 4.2,
    description:
      "PICT Pune is a highly regarded engineering college in Maharashtra, known for its strong computer science program and excellent placement record. Its location in Pune's IT hub gives students great industry exposure.",
    placements: "85%",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Information Technology"],
    facilities: [
      "Computer Labs",
      "Sports Ground",
      "Library",
      "Hostel",
      "Medical Center",
    ],
    type: "Private",
    established: 1983,
    totalStudents: 3500,
  },
  {
    name: "Netaji Subhas University of Technology",
    location: "New Delhi",
    state: "Delhi",
    fees: 145000,
    rating: 4.1,
    description:
      "NSUT (formerly NSIT) is a premier state engineering university in Delhi. Known for its strong computer science and electronics programs, it offers excellent value for money with strong placement support.",
    placements: "84%",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Information Technology"],
    facilities: [
      "Computer Center",
      "Sports Ground",
      "Library",
      "Hostel",
      "Medical Center",
    ],
    type: "State",
    established: 1983,
    totalStudents: 5000,
  },
  {
    name: "Vellore Institute of Technology Chennai",
    location: "Chennai",
    state: "Tamil Nadu",
    fees: 360000,
    rating: 4.0,
    description:
      "VIT Chennai campus offers the same quality education as the main Vellore campus with the added advantage of being in Chennai, India's Detroit. Strong industry connections and modern infrastructure.",
    placements: "83%",
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Biotechnology"],
    facilities: [
      "Research Labs",
      "Sports Complex",
      "Library",
      "Hostel",
      "Medical Center",
    ],
    type: "Deemed",
    established: 2010,
    totalStudents: 15000,
  },
  {
    name: "Symbiosis Institute of Technology",
    location: "Pune",
    state: "Maharashtra",
    fees: 395000,
    rating: 4.0,
    description:
      "SIT Pune is part of the prestigious Symbiosis International University. Known for its modern pedagogy, international exposure, and strong industry connections in Pune's thriving tech ecosystem.",
    placements: "81%",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "IT"],
    facilities: [
      "Innovation Lab",
      "Sports Complex",
      "Library",
      "Hostel",
      "Medical Center",
      "International Center",
    ],
    type: "Deemed",
    established: 2008,
    totalStudents: 4500,
  },
  {
    name: "Kalinga Institute of Industrial Technology",
    location: "Bhubaneswar",
    state: "Odisha",
    fees: 280000,
    rating: 4.1,
    description:
      "KIIT is a deemed university known for its rapid growth and strong focus on employability. It has excellent infrastructure, diverse programs, and a growing reputation for research and innovation.",
    placements: "82%",
    image:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "Biotechnology", "MBA"],
    facilities: [
      "Research Center",
      "Sports Complex",
      "Library",
      "Hostel",
      "Hospital",
      "Auditorium",
    ],
    type: "Deemed",
    established: 1992,
    totalStudents: 30000,
  },
  {
    name: "Chandigarh University",
    location: "Chandigarh",
    state: "Punjab",
    fees: 290000,
    rating: 3.8,
    description:
      "Chandigarh University is one of India's fastest-growing private universities. It offers a wide range of programs with strong industry partnerships and a focus on practical, employability-oriented education.",
    placements: "79%",
    image:
      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "MBA", "Law"],
    facilities: [
      "Smart Campus",
      "Sports Complex",
      "Library",
      "Hostel",
      "Medical Center",
      "Food Court",
    ],
    type: "Private",
    established: 2012,
    totalStudents: 30000,
  },
  {
    name: "Lovely Professional University",
    location: "Phagwara",
    state: "Punjab",
    fees: 240000,
    rating: 3.7,
    description:
      "LPU is one of India's largest private universities, known for its diverse student community, modern infrastructure, and wide range of programs. It has strong industry connections and a vibrant campus life.",
    placements: "76%",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    courses: ["CSE", "ECE", "Mechanical", "Civil", "MBA", "Design"],
    facilities: [
      "World-class Campus",
      "Olympic Sports",
      "Library",
      "Hostel",
      "Hospital",
      "Shopping Complex",
    ],
    type: "Private",
    established: 2005,
    totalStudents: 30000,
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.savedCollege.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  // Seed colleges
  for (const college of colleges) {
    await prisma.college.create({ data: college });
  }

  console.log(`✅ Seeded ${colleges.length} colleges`);
  console.log("🌱 Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
