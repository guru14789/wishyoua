import { AppFeature, FAQItem, Testimonial, Property, Agent } from './types';

export const FEATURES: AppFeature[] = [
  {
    title: "Create",
    description: "Start an event for any occasion in seconds.",
    color: "#000",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    imageClass: "w-[180px] h-[120px] rounded-[40px] rotate-[-2deg]",
    badgeColor: "#ff3b30",
    badgeIcon: "Plus"
  },
  {
    title: "Invite",
    description: "Share one link. Collect hundreds of videos.",
    color: "#000",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    imageClass: "w-[120px] h-[160px] rounded-[60px] rotate-[4deg]",
    badgeColor: "#ff6101",
    badgeIcon: "Share2"
  },
  {
    title: "Compile",
    description: "Auto-magically merge clips into a movie.",
    color: "#000",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    imageClass: "w-[140px] h-[140px] rounded-[30px] rotate-[-5deg]",
    badgeColor: "#ffc300",
    badgeIcon: "Video"
  },
  {
    title: "Gift",
    description: "The perfect sentimental gift they keep forever.",
    color: "#000",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    imageClass: "w-[110px] h-[160px] rounded-[50px] rotate-[3deg]",
    badgeColor: "#cc0000",
    badgeIcon: "Gift"
  },
  {
    title: "Global",
    description: "Friends from anywhere can contribute.",
    color: "#000",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    imageClass: "w-[240px] h-[130px] rounded-[45px] rotate-[-1deg]",
    badgeColor: "#ff3b30",
    badgeIcon: "Globe"
  }
];

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: "0",
    description: "Perfect for small birthday gatherings.",
    features: ["Up to 10 Video Wishes", "720p Video Export", "Standard Email Support", "1 Month Storage"],
    buttonText: "Start for free",
    highlight: false
  },
  {
    name: "Celebration",
    price: "19",
    description: "For weddings, big parties, and retirements.",
    features: ["Unlimited Video Wishes", "4K Video Export", "Remove Watermark", "Forever Storage"],
    buttonText: "Go Premium",
    highlight: true
  },
  {
    name: "Event Pro",
    price: "49",
    description: "For wedding planners and event organizers.",
    features: ["Manage Multiple Events", "Custom Branding", "Priority Processing", "Dedicated Account Manager"],
    buttonText: "Contact Sales",
    highlight: false
  }
];

export const BENTO_ITEMS = [
  {
    title: "Smart Compilation",
    description: "We automatically trim silence, normalize audio, and stitch clips together smoothly.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "No App Required",
    description: "Grandma doesn't need to install anything. Just click the link and record.",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Instant Preview",
    description: "Watch the full movie immediately after closing submissions. No waiting days.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Do guests need an account?",
    answer: "No! Guests simply click your unique link, record or upload their video, and hit send. It's designed to be zero-friction."
  },
  {
    question: "How long can the videos be?",
    answer: "On the free plan, individual guest clips can be upto 1 minute. Premium plans allow for longer heartfelt messages."
  },
  {
    question: "Can I download the final movie?",
    answer: "Yes! You get a high-quality MP4 file that you can share on social media, cast to a TV, or keep on your phone."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    content: "The interface is incredibly fluid. It's the first time I've felt a messaging app actually respects my attention and my privacy.",
    name: "Alex Rivera",
    role: "Digital Nomad",
    stars: 5,
    reviewCount: "2.8K Reviews",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  }
];

export const PROPERTIES: Property[] = [
  {
    id: '1',
    name: "Modern Sunset Villa",
    location: "Malibu, California",
    price: "4,500,000",
    beds: 5,
    baths: 4,
    sqft: 4200,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    category: "Luxury"
  },
  {
    id: '2',
    name: "Eco-Friendly Retreat",
    location: "Aspen, Colorado",
    price: "2,800,000",
    beds: 3,
    baths: 2,
    sqft: 2500,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    category: "Eco Green"
  },
  {
    id: '3',
    name: "Skyline Penthouse",
    location: "New York, NY",
    price: "8,200,000",
    beds: 4,
    baths: 4,
    sqft: 3800,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    category: "Luxury"
  }
];

export const AGENTS: Agent[] = [
  {
    name: "Sarah Johnson",
    role: "Senior Luxury Consultant",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Michael Chen",
    role: "Eco-Investment Expert",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Elena Rodriguez",
    role: "International Sales Director",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "David Smith",
    role: "Property Management Specialist",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
  }
];