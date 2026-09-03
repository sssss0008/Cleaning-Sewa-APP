export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: any;
}

export const blogs: Blog[] = [
  {
    id: '1',
    title: '5 DIY Tips for a Cleaner Bathroom',
    excerpt: 'Keep your bathroom fresh and sparkling with these simple, eco-friendly cleaning hacks you can do at home.',
    date: 'Aug 25, 2026',
    image: require('../../assets/images/icon.png'), // Fallback to icon if blog image not available
  },
  {
    id: '2',
    title: 'Why Professional AC Cleaning Matters',
    excerpt: 'Regular AC maintenance not only improves air quality but also extends the life of your appliance. Learn why.',
    date: 'Aug 18, 2026',
    image: require('../../assets/images/icon.png'),
  },
  {
    id: '3',
    title: 'Eco-Friendly Cleaning: Good for You and Nepal',
    excerpt: 'Discover the benefits of using non-toxic cleaning products for your family and the environment.',
    date: 'Aug 10, 2026',
    image: require('../../assets/images/icon.png'),
  },
];
