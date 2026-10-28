import advTest1 from '@/data/advanced_english_test_1.json';
import advTest2 from '@/data/advanced_english_test_2.json';
import advTest3 from '@/data/advanced_english_test_3.json';
import advTest4 from '@/data/advanced_english_test_4.json';
import advTest5 from '@/data/advanced_english_test_5.json';
import advTest6 from '@/data/advanced_english_test_6.json';
import advTest7 from '@/data/advanced_english_test_7.json';
import advTest8 from '@/data/advanced_english_test_8.json';
import advTest9 from '@/data/advanced_english_test_9.json';
import advTest10 from '@/data/advanced_english_test_10.json';

export const ADV_TEST_MAP: Record<string, any[]> = {
  '1': advTest1,
  '2': advTest2,
  '3': advTest3,
  '4': advTest4,
  '5': advTest5,
  '6': advTest6,
  '7': advTest7,
  '8': advTest8,
  '9': advTest9,
  '10': advTest10,
};


export const ADVANCED_TEST_CATALOG = Object.entries(ADV_TEST_MAP).map(([id, questions]) => ({
  id,
  questionCount: questions.length,
  duration: 45,
}));

const counts = ADVANCED_TEST_CATALOG.map((test) => test.questionCount);
export const ADVANCED_QUESTION_RANGE = `${Math.min(...counts)}–${Math.max(...counts)}`;
