export type Alumni = {
  id: string;
  name: string;
  gradYear: number;
  department: string;
  company: string;
  role: string;
  skills: string[];
  imageUrl: string;
  bio: string;
};

export const MOCK_ALUMNI: Alumni[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    gradYear: 2019,
    department: 'Computer Science',
    company: 'Google',
    role: 'Senior Software Engineer',
    skills: ['React', 'Next.js', 'System Design'],
    imageUrl: 'https://i.pravatar.cc/150?u=sarah',
    bio: 'Passionate about frontend architecture and mentoring junior developers.',
  },
  {
    id: '2',
    name: 'David Chen',
    gradYear: 2021,
    department: 'Electrical Engineering',
    company: 'Tesla',
    role: 'Hardware Engineer',
    skills: ['Circuit Design', 'IoT', 'Embedded C'],
    imageUrl: 'https://i.pravatar.cc/150?u=david',
    bio: 'Working on next-gen power systems. Happy to chat about hardware careers.',
  },
  {
    id: '3',
    name: 'Aisha Fofana',
    gradYear: 2018,
    department: 'Business Administration',
    company: 'McKinsey & Company',
    role: 'Management Consultant',
    skills: ['Strategy', 'Data Analysis', 'Leadership'],
    imageUrl: 'https://i.pravatar.cc/150?u=aisha',
    bio: 'Helping companies scale. I can help with consulting case prep.',
  },
  {
    id: '4',
    name: 'James Wilson',
    gradYear: 2022,
    department: 'Information Technology',
    company: 'Stripe',
    role: 'Security Analyst',
    skills: ['Cybersecurity', 'Python', 'AWS'],
    imageUrl: 'https://i.pravatar.cc/150?u=james',
    bio: 'Securing the internet economy. Always open for a coffee chat.',
  },
  {
    id: '5',
    name: 'Emily Davis',
    gradYear: 2020,
    department: 'Design',
    company: 'Airbnb',
    role: 'Product Designer',
    skills: ['UX/UI', 'Figma', 'User Research'],
    imageUrl: 'https://i.pravatar.cc/150?u=emily',
    bio: 'Designing user-centric experiences. Happy to review portfolios.',
  }
];
