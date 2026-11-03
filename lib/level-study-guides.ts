import { a1Guides } from '@/data/levels/a1_guides';
import { a2Guides } from '@/data/levels/a2_guides';
import { b1Guides } from '@/data/levels/b1_guides';
import { b2Guides } from '@/data/levels/b2_guides';
import { c1Guides } from '@/data/levels/c1_guides';
import { c2Guides } from '@/data/levels/c2_guides';
import type { TopicStudyGuide } from '@/data/levels/study-guide';
import type { LevelKey } from '@/lib/level-catalog';

const guides: Record<LevelKey, Record<string, TopicStudyGuide>> = {
  a1: a1Guides, a2: a2Guides, b1: b1Guides,
  b2: b2Guides, c1: c1Guides, c2: c2Guides,
};

export function getTopicStudyGuide(level: LevelKey, topic: string): TopicStudyGuide | undefined {
  return guides[level][topic];
}
