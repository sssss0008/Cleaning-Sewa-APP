export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh Thapa',
    role: 'Home Owner, Kathmandu',
    content: 'Cleaning Sewa provided exceptional service. Their team was punctual, professional, and left my home spotless. Highly recommended!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Sumnitra Shrestha',
    role: 'Office Manager, Lalitpur',
    content: 'We use their commercial cleaning services for our office. They use eco-friendly products and are very thorough. Great experience!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Vikas Pandey',
    role: 'Apartment Resident',
    content: 'The deep cleaning service for my kitchen was amazing. They removed stains I thought were permanent. Efficient and reliable.',
    rating: 4,
  },
];
