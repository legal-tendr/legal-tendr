export const lawyers = [
  {
    id: 1,
    name: "Jessica Pearson, Esq.",
    specialties: ["Corporate Law", "Mergers & Acquisitions"],
    location: "New York, NY",
    rating: 4.8,
    image: "https://images.pexels.com/photos/8528852/pexels-photo-8528852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    bio: "Former managing partner at Pearson Specter Litt with over 20 years of experience in high-stakes corporate litigation and negotiation."
  },
  {
    id: 2,
    name: "Harvey Specter, Esq.",
    specialties: ["Corporate Law", "Securities Fraud"],
    location: "New York, NY",
    rating: 4.9,
    image: "https://images.pexels.com/photos/8729731/pexels-photo-8729731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    bio: "Top closer in the city with unparalleled negotiation skills. Specializes in getting clients out of impossible situations."
  },
  {
    id: 3,
    name: "Annalise Keating, Esq.",
    specialties: ["Criminal Defense", "Constitutional Law"],
    location: "Philadelphia, PA",
    rating: 4.7,
    image: "https://images.pexels.com/photos/7468084/pexels-photo-7468084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    bio: "Award-winning criminal defense attorney and former law professor with a track record of taking on and winning impossible cases."
  },
  {
    id: 4,
    name: "Michael Ross, Esq.",
    specialties: ["Corporate Law", "Patent Law"],
    location: "New York, NY",
    rating: 4.6,
    image: "https://images.pexels.com/photos/8112137/pexels-photo-8112137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    bio: "Associate with a photographic memory and innovative approach to complex legal problems. Specializes in creative solutions to corporate challenges."
  },
  {
    id: 5,
    name: "Alicia Florrick, Esq.",
    specialties: ["Family Law", "Civil Litigation"],
    location: "Chicago, IL",
    rating: 4.7,
    image: "https://images.pexels.com/photos/16846869/pexels-photo-16846869/free-photo-of-studio-shot-of-a-young-woman-in-a-fashionable-outfit.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    bio: "Former state's attorney with extensive experience in family law and civil litigation. Known for her meticulous preparation and ethical advocacy."
  },
  {
    id: 6,
    name: "Benjamin Chang, Esq.",
    specialties: ["Immigration Law", "International Business"],
    location: "San Francisco, CA",
    rating: 4.5,
    image: "https://images.pexels.com/photos/4427620/pexels-photo-4427620.jpeg",
    bio: "Specializing in immigration matters for tech startups and international business law. Fluent in Mandarin, Cantonese, and Spanish."
  },
  {
    id: 7,
    name: "Olivia Pope, Esq.",
    specialties: ["Crisis Management", "Political Law"],
    location: "Washington D.C.",
    rating: 4.9,
    image: "https://images.pexels.com/photos/785667/pexels-photo-785667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    bio: "Former White House communications director turned crisis management expert. Specializes in high-profile reputation management and political law."
  },
  {
    id: 8,
    name: "Daniel Hardman, Esq.",
    specialties: ["Tax Law", "Estate Planning"],
    location: "Los Angeles, CA",
    rating: 4.4,
    image: "https://images.pexels.com/photos/8112137/pexels-photo-8112137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    bio: "Tax law specialist with expertise in estate planning for high net worth individuals and family businesses. Board certified in Tax Law."
  },
  {
    id: 9,
    name: "Diane Lockhart, Esq.",
    specialties: ["Civil Rights Law", "Political Law"],
    location: "Chicago, IL",
    rating: 4.8,
    image: "https://images.pexels.com/photos/16846869/pexels-photo-16846869/free-photo-of-studio-shot-of-a-young-woman-in-a-fashionable-outfit.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    bio: "Founding partner specializing in civil rights cases and political law. Known for her passion for justice and mentorship of young attorneys."
  },
  {
    id: 10,
    name: "Louis Litt, Esq.",
    specialties: ["Financial Law", "Real Estate Law"],
    location: "New York, NY",
    rating: 4.3,
    image: "https://images.pexels.com/photos/4427620/pexels-photo-4427620.jpeg",
    bio: "Financial law expert with specialization in real estate transactions. Known for his attention to detail and fierce client advocacy."
  }
];

export const cases = [
  {
    id: 1,
    title: "Wrongful Termination Lawsuit",
    status: "Active",
    lawyerId: 5,
    lastUpdate: "2023-07-03"
  },
  {
    id: 2,
    title: "Intellectual Property Dispute",
    status: "Pending Consultation",
    lawyerId: 4,
    lastUpdate: "2023-06-28"
  },
  {
    id: 3,
    title: "Divorce Settlement",
    status: "Completed",
    lawyerId: 5,
    lastUpdate: "2023-05-15"
  }
];

export const messages = [
  {
    id: 1,
    lawyerId: 1,
    lastMessage: "I've reviewed the contract and have some concerns about clause 3.2. Can we discuss tomorrow?",
    timestamp: "2023-07-05T14:30:00Z",
    unread: true
  },
  {
    id: 2,
    lawyerId: 3,
    lastMessage: "Your case has been scheduled for a hearing on August 15th at 10:00 AM.",
    timestamp: "2023-07-04T09:15:00Z",
    unread: false
  },
  {
    id: 3,
    lawyerId: 7,
    lastMessage: "I've prepared a statement for the press. Please review it before our call at 4 PM.",
    timestamp: "2023-07-02T16:45:00Z",
    unread: false
  }
];
