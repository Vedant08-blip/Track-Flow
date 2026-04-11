// Avatar metadata — names & descriptions matched exactly to rendered avatar images
export const avatarMetadata = [
  {
    id: 1,
    file: '/Avatar /Avatar-1.avif.jpeg',
    name: 'Cherry Blossom',
    description: 'Sweet, blushy & always glowing 🌸',
    emoji: '🌸',
    color: 'from-pink-300 to-rose-400'
  },
  {
    id: 2,
    file: '/Avatar /Avatar-2.avif.jpeg',
    name: 'Grumpchief',
    description: 'Unbothered. Built different 😤',
    emoji: '😤',
    color: 'from-neutral-200 to-stone-500'
  },
  {
    id: 3,
    file: '/Avatar /Avatar-3.avif.jpeg',
    name: 'Voltskull',
    description: 'Silver hair, blue lightning, untouchable ⚡',
    emoji: '⚡',
    color: 'from-cyan-400 to-blue-700'
  },
  {
    id: 4,
    file: '/Avatar /Avatar-4.avif.jpeg',
    name: 'Mellow',
    description: 'Calm vibes, soft power 🍃',
    emoji: '🍃',
    color: 'from-stone-300 to-slate-400'
  },
  {
    id: 5,
    file: '/Avatar /Avatar-5.avif.jpeg',
    name: 'Voidette',
    description: 'No face. Pure mystery 🌑',
    emoji: '🌑',
    color: 'from-slate-300 to-indigo-300'
  },
  {
    id: 6,
    file: '/Avatar /Avatar-6.avif.jpeg',
    name: 'DeathBeats',
    description: 'Skull + red cans, vibing eternally 💀',
    emoji: '🎧',
    color: 'from-purple-500 to-violet-800'
  },
  {
    id: 7,
    file: '/Avatar /Avatar-7.avif.jpeg',
    name: 'NightRift',
    description: 'Cracked, glowing, on fire 🔥',
    emoji: '🔮',
    color: 'from-purple-700 to-violet-950'
  }
];

// Get avatar by id
export const getAvatarById = (id) => {
  return avatarMetadata.find(avatar => avatar.id === id);
};

// Get all avatars
export const getAllAvatars = () => {
  return avatarMetadata;
};

// Get avatar index for grid display
export const getAvatarIndex = (id) => {
  return avatarMetadata.findIndex(avatar => avatar.id === id);
};

// Total avatar count
export const getTotalAvatars = () => {
  return avatarMetadata.length;
};