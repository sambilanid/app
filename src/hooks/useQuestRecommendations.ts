/**
 * Hook kustom untuk memberikan rekomendasi quest berbasis AI (AI Quest Suggestion Engine).
 * Digunakan saat: Halaman utama (HomePage) untuk menyaring dan mengurutkan quest yang relevan berdasarkan bio pengguna.
 */
import { useMemo } from "react";
import type { Quest, User } from "../types";

// Define character mapping for AI Suggestions
const CHARACTER_MAP = [
  {
    keywords: ['tech savvy', 'tekno', 'gadget', 'komputer', 'laptop', 'teknik'],
    category: 'Jasa reparasi',
    affirmation: 'Buat kamu yang tech savvy, ini quest-quest yang mungkin kamu suka:'
  },
  {
    keywords: ['pecinta kuliner', 'makan-makan', 'foodie', 'kuliner', 'makan'],
    category: 'Jasa titip',
    affirmation: 'Buat kamu yang pecinta kuliner, ini quest-quest yang mungkin kamu suka:'
  },
  {
    keywords: ['sat set', 'gercep', 'logistik', 'pengantaran', 'cepat', 'kurir'],
    category: 'Jasa antar ambil barang',
    affirmation: 'Buat kamu yang sat set, ini quest-quest yang mungkin kamu suka:'
  },
  {
    keywords: ['tukang bersih', 'rapi', 'resik', 'bersih-bersih', 'kebersihan'],
    category: 'Jasa bersih-bersih',
    affirmation: 'Buat kamu yang tukang bersih, ini quest-quest yang mungkin kamu suka:'
  },
  {
    keywords: ['tenaga kuat', 'pindahan', 'angkat-angkat', 'angkut', 'pindah'],
    category: 'Jasa pindahan',
    affirmation: 'Buat kamu yang punya tenaga kuat, ini quest-quest yang mungkin kamu suka:'
  }
];

interface ScoredQuest extends Quest {
  aiScore: number;
}

export function useQuestRecommendations(availableQuests: Quest[], user: User | null) {
  const aiSuggestedQuests = useMemo(() => {
    if (!user || !user.bio) return availableQuests;

    const bio = user.bio.toLowerCase();
    
    // Check for special character keyword
    const characterMatch = CHARACTER_MAP.find(char => 
      char.keywords.some(keyword => bio.includes(keyword.toLowerCase()))
    );

    // Hard filter by character category if match found
    let filteredQuests = availableQuests;
    if (characterMatch) {
      filteredQuests = availableQuests.filter(quest => quest.category === characterMatch.category);
    }

    // Scoring system
    const scoredQuests: ScoredQuest[] = filteredQuests.map(quest => {
      let score = 0;
      const title = quest.title.toLowerCase();
      const desc = quest.description.toLowerCase();
      const cat = quest.category.toLowerCase();

      // Keywords matching (secondary sorting within hard-filtered results or fallback)
      if (bio.includes('kuliner') || bio.includes('makan')) {
        if (cat.includes('titip') || title.includes('mie') || title.includes('makan') || desc.includes('makan')) score += 10;
      }
      if (bio.includes('teknik') || bio.includes('gadget') || bio.includes('ngulik')) {
        if (cat.includes('reparasi') || title.includes('laptop') || title.includes('hp') || desc.includes('laptop') || desc.includes('komputer')) score += 10;
      }
      if (bio.includes('bersih') || bio.includes('rapi')) {
        if (cat.includes('bersih') || title.includes('cuci') || desc.includes('bersih') || desc.includes('rapi')) score += 10;
      }
      if (bio.includes('bantu') || bio.includes('senang membantu')) {
        score += 2;
      }

      // Distance factor (smaller is better)
      const distMatch = quest.distance.match(/(\d+(\.\d+)?)/);
      if (distMatch) {
        const dist = parseFloat(distMatch[0]);
        score += Math.max(0, 5 - dist); // Add up to 5 points for close quests
      }

      return { ...quest, aiScore: score };
    });

    return scoredQuests.sort((a, b) => b.aiScore - a.aiScore);
  }, [availableQuests, user]);

  const aiAffirmation = useMemo(() => {
    if (!user || !user.bio) return "Ini beberapa quest yang mungkin kamu suka:";
    
    const bio = user.bio.toLowerCase();
    const name = user.name.split(" ")[0];

    // Check for special character keyword
    const characterMatch = CHARACTER_MAP.find(char => 
      char.keywords.some(keyword => bio.includes(keyword.toLowerCase()))
    );

    if (characterMatch) {
      return characterMatch.affirmation;
    }

    if (bio.includes('kuliner') || bio.includes('makan')) {
      return `Hai ${name}, sebagai pecinta kuliner, kamu pasti suka membantu orang mendapatkan makanan favorit mereka!`;
    }
    if (bio.includes('teknik') || bio.includes('gadget') || bio.includes('elektronik')) {
      return `Halo ${name}! Skill teknismu sangat dibutuhkan di sini. Cek quest yang menantang keahlianmu:`;
    }
    if (bio.includes('bersih') || bio.includes('rapi') || bio.includes('administratif')) {
      return `Spesial buat kamu yang teliti, ${name}. Bantu mereka yang butuh kerapihan dan keteraturan:`;
    }
    if (bio.includes('logistik') || bio.includes('pengantaran')) {
      return `Ayo ${name}, tunjukkan kecepatanmu! Quest ini pas banget buat kamu yang jago urusan antar-jemput barang:`;
    }
    if (bio.includes('serba bisa') || bio.includes('bantuan umum')) {
      return `Halo ${name}, sebagai orang yang serba bisa, bantuanmu akan sangat berarti di berbagai tugas unik ini:`;
    }
    
    return `Berdasarkan karakter unikmu ${name}, AI kami menyarankan quest-quest berikut ini:`;
  }, [user]);

  return {
    aiSuggestedQuests,
    aiAffirmation
  };
}
