// Avatar metadata with creative names and descriptions matching each avatar's vibe
export const avatarMetadata = [
  {
    id: 1,
    file: '/Avatar /Avatar-1.avif',
    name: 'Rosebud',
    description: 'Sweet, cheerful & always glowing ✨',
    emoji: '🌸',
    color: 'from-pink-300 to-rose-500'
  },
  {
    id: 2,
    file: '/Avatar /avatar-2.avif',
    name: 'Sage',
    description: 'Calm energy, soft power, quiet storms 🍃',
    emoji: '🌿',
    color: 'from-green-300 to-stone-400'
  },
  {
    id: 3,
    file: '/Avatar /Avatar-3.avif.jpeg',
    name: 'Phantom',
    description: 'No face. No limits. Pure mystery 🖤',
    emoji: '🌑',
    color: 'from-slate-400 to-indigo-300'
  },
  {
    id: 5,
    file: '/Avatar /Avatar-5.avif.jpeg',
    name: 'Rift',
    description: 'Cracked open, glowing from within ⚡',
    emoji: '💥',
    color: 'from-purple-600 to-violet-900'
  },
  {
    id: 6,
    file: '/Avatar /Avatar-6.avif.jpeg',
    name: 'Deadbeats',
    description: 'Too cool to care. Built different 💀',
    emoji: '🎧',
    color: 'from-neutral-200 to-stone-400'
  },
  {
    id: 7,
    file: '/Avatar /Avatar-7.avif.jpeg',
    name: 'Reaper',
    description: 'Skull face, red cans, zero apologies 🔴',
    emoji: '💀',
    color: 'from-purple-500 to-violet-800'
  },
  {
    id: 8,
    file: '/Avatar /Avatar-8.avif.jpeg',
    name: 'Gojo',
    description: 'Lightning fast. Blindfolded and still winning ⚡',
    emoji: '🥶',
    color: 'from-cyan-400 to-blue-700'
  },
  {
    id: 9,
    file: '/Avatar /Avatar-9.avif.jpeg',
    name: 'Avatar Nine',
    description: 'Patient and thorough',
    emoji: '👤',
    color: 'from-teal-400 to-teal-600'
  },
  {
    id: 10,
    file: '/Avatar /Avatar-10.avif.jpeg',
    name: 'Avatar Ten',
    description: 'Wise and insightful',
    emoji: '👤',
    color: 'from-purple-400 to-purple-600'
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